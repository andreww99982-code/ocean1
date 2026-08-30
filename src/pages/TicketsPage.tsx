import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar } from "../components/Calendar";
import { TimeSlotPicker } from "../components/TimeSlotPicker";
import { TicketTypeRow } from "../components/TicketTypeRow";
import { Loader } from "../components/Loader";
import { TICKET_TYPES } from "../data/products";
import { fetchAvailability } from "../api/localApi";
import { useCart } from "../context/CartContext";
import type { DayAvailability } from "../types";

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function TicketsPage() {
  const { cart, setDateTime, setQuantity, totalItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string>(cart.date ?? todayISO());
  const [availability, setAvailability] = useState<DayAvailability | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAvailability(selectedDate).then((data) => {
      if (!cancelled) {
        setAvailability(data);
        setLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  const quantityFor = (ticketTypeId: string) =>
    cart.items.find((i) => i.ticketTypeId === ticketTypeId)?.quantity ?? 0;

  const canContinue = Boolean(cart.time) && totalItems > 0 && cart.date === selectedDate;

  return (
    <div className="container page">
      <h1>Выберите дату и время</h1>
      <Calendar selectedDate={selectedDate} onSelect={setSelectedDate} />

      {loading && <Loader label="Загружаем доступные сеансы…" />}

      {!loading && availability && availability.closed && (
        <p className="form__hint">В этот день океанариум закрыт. Выберите другую дату.</p>
      )}

      {!loading && availability && !availability.closed && (
        <TimeSlotPicker
          slots={availability.slots}
          selectedTime={cart.date === selectedDate ? cart.time : null}
          onSelect={(time) => setDateTime(selectedDate, time)}
        />
      )}

      <h2>Выберите билеты</h2>
      <div className="ticket-list">
        {TICKET_TYPES.map((type) => (
          <TicketTypeRow
            key={type.id}
            ticketType={type}
            quantity={quantityFor(type.id)}
            onChange={(q) => setQuantity(type.id, q)}
          />
        ))}
      </div>

      <div className="page__footer-bar">
        <span>
          {totalItems} билет(ов) — <strong>{totalPrice} €</strong>
        </span>
        <button
          type="button"
          className="button button--primary"
          disabled={!canContinue}
          onClick={() => navigate("/cart")}
        >
          В корзину
        </button>
      </div>
    </div>
  );
}
