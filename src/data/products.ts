import type { TicketType } from "../types";

export const TICKET_TYPES: TicketType[] = [
  {
    id: "adult",
    name: "Взрослый билет",
    description: "Для посетителей от 13 лет и старше.",
    price: 22,
    minAge: 13,
  },
  {
    id: "child",
    name: "Детский билет",
    description: "Для детей от 4 до 12 лет включительно.",
    price: 14,
    minAge: 4,
    maxAge: 12,
  },
  {
    id: "senior",
    name: "Билет для пенсионеров",
    description: "Для посетителей от 65 лет.",
    price: 16,
    minAge: 65,
  },
  {
    id: "family",
    name: "Семейный билет",
    description: "2 взрослых + 2 детей — выгоднее, чем по отдельности.",
    price: 58,
  },
];

export function getTicketType(id: string): TicketType | undefined {
  return TICKET_TYPES.find((t) => t.id === id);
}
