import { TICKET_TYPES } from "../data/products";
import type { CartState } from "../types";

interface CartSummaryProps {
  cart: CartState;
  total: number;
}

export function CartSummary({ cart, total }: CartSummaryProps) {
  if (cart.items.length === 0) {
    return <p className="cart-summary__empty">Cart is empty.</p>;
  }

  return (
    <div className="cart-summary">
      {cart.date && cart.time && (
        <p className="cart-summary__visit">
          Visit date: <strong>{cart.date}</strong>, time: <strong>{cart.time}</strong>
        </p>
      )}
      <ul className="cart-summary__list">
        {cart.items.map((item) => {
          const type = TICKET_TYPES.find((t) => t.id === item.ticketTypeId);
          if (!type) return null;
          return (
            <li key={item.ticketTypeId}>
              <span>
                {type.name} × {item.quantity}
              </span>
              <span>{type.price * item.quantity} €</span>
            </li>
          );
        })}
      </ul>
      <div className="cart-summary__total">
        <span>Total</span>
        <strong>{total} €</strong>
      </div>
    </div>
  );
}
