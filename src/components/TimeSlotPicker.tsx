import type { TimeSlot } from "../types";

interface TimeSlotPickerProps {
  slots: TimeSlot[];
  selectedTime: string | null;
  onSelect: (time: string) => void;
}

export function TimeSlotPicker({ slots, selectedTime, onSelect }: TimeSlotPickerProps) {
  return (
    <div className="time-slots" role="listbox" aria-label="Выберите время посещения">
      {slots.map((slot) => {
        const free = slot.capacity - slot.booked;
        const soldOut = free <= 0;
        const low = !soldOut && free <= 5;
        return (
          <button
            key={slot.time}
            type="button"
            role="option"
            aria-selected={slot.time === selectedTime}
            disabled={soldOut}
            className={`time-slot${slot.time === selectedTime ? " time-slot--selected" : ""}${
              soldOut ? " time-slot--soldout" : ""
            }`}
            onClick={() => onSelect(slot.time)}
          >
            <span className="time-slot__time">{slot.time}</span>
            <span className="time-slot__status">
              {soldOut ? "нет мест" : low ? `осталось ${free}` : "есть места"}
            </span>
          </button>
        );
      })}
    </div>
  );
}
