import { NavLink } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { VENUE } from "../data/venue";
import { IconCart, IconTicket, IconWave } from "./icons";

export function Header() {
  const { totalItems } = useCart();

  return (
    <header className="site-header">
      <div className="container site-header__inner">
        <NavLink to="/" className="site-header__brand">
          <span className="site-header__logo" aria-hidden="true">
            <IconWave />
          </span>
          {VENUE.name}
        </NavLink>
        <nav className="site-header__nav">
          <NavLink to="/tickets" className={({ isActive }) => (isActive ? "active" : "")}>
            <IconTicket className="site-header__nav-icon" />
            Tickets
          </NavLink>
          <NavLink to="/orders" className={({ isActive }) => (isActive ? "active" : "")}>
            My Orders
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => (isActive ? "active" : "")}>
            <IconCart className="site-header__nav-icon" />
            Cart
            {totalItems > 0 && <span className="badge">{totalItems}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
