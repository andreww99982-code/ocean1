import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartSummary } from "../components/CartSummary";
import { IconCart } from "../components/icons";

export function CartPage() {
  const { cart, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container page">
      <h1>
        <IconCart className="page__title-icon" /> Cart
      </h1>
      <CartSummary cart={cart} total={totalPrice} />

      <div className="page__footer-bar">
        <Link to="/tickets" className="button button--secondary">
          Change Tickets
        </Link>
        <button
          type="button"
          className="button button--primary"
          disabled={totalItems === 0 || !cart.time}
          onClick={() => navigate("/checkout")}
        >
          Place Order
        </button>
      </div>
    </div>
  );
}
