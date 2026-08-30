import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchOrder } from "../api/localApi";
import { Loader } from "../components/Loader";
import { IconCheckCircle, IconMail, IconTicket } from "../components/icons";
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
        <Loader label="Loading order…" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container page">
        <h1>Order Not Found</h1>
        <p>You may have opened this link on a different device or your session has expired.</p>
        <Link to="/tickets" className="button button--primary">
          Buy Tickets
        </Link>
      </div>
    );
  }

  return (
    <div className="container page">
      <h1>
        <IconCheckCircle className="page__title-icon" /> Thank you! Order confirmed
      </h1>
      <p>
        Order number: <strong>{order.id}</strong>
      </p>
      <p>
        Visit date and time: <strong>{order.date}</strong>, <strong>{order.time}</strong>
      </p>
      <p>
        <IconMail className="text-icon" /> Tickets sent to email: <strong>{order.guest.email}</strong>. Please check
        your inbox (and spam folder).
      </p>

      <h2>
        <IconTicket className="page__title-icon" /> Your Tickets
      </h2>
      <ul className="ticket-codes">
        {order.tickets.map((t) => (
          <li key={t.code}>
            <span>{t.ticketTypeName}</span>
            <code>{t.code}</code>
          </li>
        ))}
      </ul>

      <p className="page__total">
        Total paid: <strong>{order.total} €</strong>
      </p>

      <Link to="/" className="button button--secondary">
        Back to Home
      </Link>
    </div>
  );
}
