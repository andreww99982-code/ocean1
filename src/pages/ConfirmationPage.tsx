import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrder } from "../api/localApi";
import { Loader } from "../components/Loader";
import type { Order } from "../types";

export function ConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    if (!orderId) {
      setLoading(false);
      return;
    }
    fetchOrder(orderId).then((data) => {
      if (!cancelled) {
        setOrder(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [orderId]);

  if (loading) {
    return (
      <div className="container page">
        <Loader label="Загружаем заказ…" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container page">
        <h1>Заказ не найден</h1>
        <p>Возможно, вы открыли эту ссылку на другом устройстве или очистили данные браузера.</p>
        <Link to="/tickets" className="button button--primary">
          Купить билеты
        </Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>Спасибо! Заказ подтверждён 🎉</h1>
      <p>
        Номер заказа: <strong>{order.id}</strong>
      </p>
      <p>
        Дата и время посещения: <strong>{order.date}</strong>, <strong>{order.time}</strong>
      </p>
      <p>
        Билеты отправлены на email: <strong>{order.guest.email}</strong> (эмуляция — письмо не отправляется в
        действительности).
      </p>

      <h2>Ваши билеты</h2>
      <ul className="ticket-codes">
        {order.tickets.map((t) => (
          <li key={t.code}>
            <span>{t.ticketTypeName}</span>
            <code>{t.code}</code>
          </li>
        ))}
      </ul>

      <p className="page__total">
        Итого оплачено: <strong>{order.total} €</strong>
      </p>

      <Link to="/" className="button button--secondary">
        На главную
      </Link>
    </div>
  );
}
