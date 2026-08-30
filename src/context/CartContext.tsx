import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { CartItem, CartState } from "../types";
import { readJSON, writeJSON } from "../api/storage";
import { getTicketType } from "../data/products";

interface CartContextValue {
  cart: CartState;
  setDateTime: (date: string, time: string) => void;
  setQuantity: (ticketTypeId: string, quantity: number) => void;
  clear: () => void;
  totalItems: number;
  totalPrice: number;
}

const EMPTY_CART: CartState = { date: null, time: null, items: [] };

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>(() => readJSON<CartState>("cart", EMPTY_CART));

  const persist = useCallback((next: CartState) => {
    setCart(next);
    writeJSON("cart", next);
  }, []);

  const setDateTime = useCallback(
    (date: string, time: string) => {
      persist({ ...cart, date, time });
    },
    [cart, persist],
  );

  const setQuantity = useCallback(
    (ticketTypeId: string, quantity: number) => {
      const items: CartItem[] = cart.items.filter((i) => i.ticketTypeId !== ticketTypeId);
      if (quantity > 0) {
        items.push({ ticketTypeId, quantity });
      }
      persist({ ...cart, items });
    },
    [cart, persist],
  );

  const clear = useCallback(() => {
    persist(EMPTY_CART);
  }, [persist]);

  const totalItems = useMemo(() => cart.items.reduce((sum, i) => sum + i.quantity, 0), [cart.items]);

  const totalPrice = useMemo(
    () =>
      cart.items.reduce((sum, i) => {
        const type = getTicketType(i.ticketTypeId);
        return sum + (type ? type.price * i.quantity : 0);
      }, 0),
    [cart.items],
  );

  const value = useMemo(
    () => ({ cart, setDateTime, setQuantity, clear, totalItems, totalPrice }),
    [cart, setDateTime, setQuantity, clear, totalItems, totalPrice],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
