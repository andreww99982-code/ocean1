import type { TicketType } from "../types";

export const TICKET_TYPES: TicketType[] = [
  {
    id: "adult",
    name: "Adult Ticket",
    description: "For visitors 13 years and older.",
    price: 22,
    minAge: 13,
  },
  {
    id: "child",
    name: "Child Ticket",
    description: "For children ages 4 to 12 inclusive.",
    price: 14,
    minAge: 4,
    maxAge: 12,
  },
  {
    id: "senior",
    name: "Senior Ticket",
    description: "For visitors 65 years and older.",
    price: 16,
    minAge: 65,
  },
  {
    id: "family",
    name: "Family Ticket",
    description: "2 adults + 2 children — better value than individual tickets.",
    price: 58,
  },
];

export function getTicketType(id: string): TicketType | undefined {
  return TICKET_TYPES.find((t) => t.id === id);
}
