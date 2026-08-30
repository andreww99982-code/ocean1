import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { fetchOrdersByEmail } from "../api/localApi";
import { Loader } from "../components/Loader";
import type { Order } from "../types";

export function OrdersPage() {
  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      const found = await fetchOrdersByEmail(email);
      setOrders(found);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container page">
      <h1>Мои заказы</h1>
      <p>Введите email, указанный при заказе, чтобы увидеть свои билеты (данные хранятся только в этом браузере).</p>
      <form className="form form--inline" onSubmit={onSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <button type="submit" className="button button--primary" disabled={loading}>
          Найти
        </button>
      </form>

      {loading && <Loader label="Ищем заказы…" />}

      {!loading && orders && orders.length === 0 && <p>Заказов с таким email не найдено.</p>}

      {!loading && orders && orders.length > 0 && (
        <ul className="order-list">
          {orders.map((o) => (
            <li key={o.id}>
              <Link to={`/confirmation/${o.id}`}>
                Заказ {o.id} — {o.date} {o.time} — {o.total} €
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
