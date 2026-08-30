import { useMemo } from "react";

interface CalendarProps {
  selectedDate: string | null;
  onSelect: (dateISO: string) => void;
  daysAhead?: number;
}

function toISODate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const WEEKDAY_FORMAT = new Intl.DateTimeFormat("en-US", { weekday: "short" });
const DAY_FORMAT = new Intl.DateTimeFormat("en-US", { day: "numeric", month: "short" });

export function Calendar({ selectedDate, onSelect, daysAhead = 21 }: CalendarProps) {
  const days = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: daysAhead }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() + i);
      return d;
    });
  }, [daysAhead]);

  return (
    <div className="calendar" role="listbox" aria-label="Select a visit date">
      {days.map((d) => {
        const iso = toISODate(d);
        const isSelected = iso === selectedDate;
        return (
          <button
            key={iso}
            type="button"
            role="option"
            aria-selected={isSelected}
            className={`calendar__day${isSelected ? " calendar__day--selected" : ""}`}
            onClick={() => onSelect(iso)}
          >
            <span className="calendar__weekday">{WEEKDAY_FORMAT.format(d)}</span>
            <span className="calendar__date">{DAY_FORMAT.format(d)}</span>
          </button>
        );
      })}
    </div>
  );
}
