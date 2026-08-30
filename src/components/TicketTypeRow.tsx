import type { TicketType } from "../types";
import { IconTicket } from "./icons";

interface TicketTypeRowProps {
  ticketType: TicketType;
  quantity: number;
  onChange: (quantity: number) => void;
}

export function TicketTypeRow({ ticketType, quantity, onChange }: TicketTypeRowProps) {
  return (
    <div className="ticket-row">
      <div className="ticket-row__info">
        <span className="ticket-row__icon" aria-hidden="true">
          <IconTicket />
        </span>
        <div>
          <h3>{ticketType.name}</h3>
          <p>{ticketType.description}</p>
        </div>
      </div>
      <div className="ticket-row__price">{ticketType.price} €</div>
      <div className="ticket-row__stepper">
        <button
          type="button"
          aria-label={`Decrease quantity: ${ticketType.name}`}
          onClick={() => onChange(Math.max(0, quantity - 1))}
          disabled={quantity <= 0}
        >
          −
        </button>
        <span aria-live="polite">{quantity}</span>
        <button
          type="button"
          aria-label={`Increase quantity: ${ticketType.name}`}
          onClick={() => onChange(Math.min(20, quantity + 1))}
        >
          +
        </button>
      </div>
    </div>
  );
}
