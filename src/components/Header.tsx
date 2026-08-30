import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { VENUE } from "../data/venue";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to="/" className="site-header__brand">
          <span className="site-header__logo" aria-hidden="true">
            🐠
          </span>
          {VENUE.name}
        </NavLink>
        <nav className="site-header__nav">
          <NavLink to="/tickets" className={({ isActive }) => (isActive ? "active" : "")}>
            Билеты
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? "active" : "")}>
            Мои заказы
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
            Корзина
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
