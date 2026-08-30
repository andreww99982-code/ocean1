import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartSummary } from "../components/CartSummary";

export function CartPage() {
  const { cart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container page">
      <h1>Корзина</h1>
      <CartSummary cart={cart} total={totalPrice} />

      <div className="page__footer-bar">
        <Link to="/tickets" className="button button--secondary">
          Изменить билеты
        </Link>
        <button
          type="button"
          className="button button--primary"
          disabled={totalItems === 0 || !cart.time}
          onClick={() => navigate("/checkout")}
        >
          Оформить заказ
        </button>
      </div>
    </div>
  );
}
