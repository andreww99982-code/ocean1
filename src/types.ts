export interface TicketType {
  id: string;
  name: string;
  description: string;
  price: number;
  minAge?: number;
  maxAge?: number;
}

export interface TimeSlot {
  time: string; // "HH:MM"
  capacity: number;
  booked: number;
}

export interface DayAvailability {
  date: string; // ISO yyyy-mm-dd
  closed: boolean;
  slots: TimeSlot[];
}

export interface CartItem {
  ticketTypeId: string;
  quantity: number;
}

export interface CartState {
  date: string | null;
  time: string | null;
  items: CartItem[];
}

export interface GuestInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface OrderTicket {
  code: string;
  ticketTypeId: string;
  ticketTypeName: string;
}

export interface Order {
  id: string;
  createdAt: string;
  date: string;
  time: string;
  guest: GuestInfo;
  items: CartItem[];
  tickets: OrderTicket[];
  total: number;
  status: "confirmed";
}
