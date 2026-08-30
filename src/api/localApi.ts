import type { DayAvailability, GuestInfo, CartItem, Order, OrderTicket, TimeSlot } from "../types";
import { TICKET_TYPES, getTicketType } from "../data/products";
import { readJSON, writeJSON } from "./storage";

/**
 * Полная локальная эмуляция бэкенда билетной кассы.
 * Никаких реальных сетевых запросов не выполняется — только localStorage
 * и небольшая, ГАРАНТИРОВАННО ограниченная по времени имитация задержки сети,
 * чтобы UI не "зависал" в бесконечной загрузке.
 */

const SLOT_TIMES = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
const SLOT_CAPACITY = 40;
const MAX_DELAY_MS = 500;

/** Имитирует сетевой вызов с небольшой случайной задержкой (не более MAX_DELAY_MS). */
function withDelay<T>(value: T): Promise<T> {
  const delay = 150 + Math.random() * (MAX_DELAY_MS - 150);
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), delay);
  });
}

function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/** Число "уже забронированных другими посетителями" мест — детерминированное, для реалистичности. */
function baselineBooked(dateISO: string, time: string): number {
  return hashString(`${dateISO}|${time}`) % Math.floor(SLOT_CAPACITY * 0.6);
}

function getExtraBookings(): Record<string, number> {
  return readJSON<Record<string, number>>("bookings", {});
}

function addExtraBooking(dateISO: string, time: string, count: number): void {
  const bookings = getExtraBookings();
  const key = `${dateISO}|${time}`;
  bookings[key] = (bookings[key] ?? 0) + count;
  writeJSON("bookings", bookings);
}

export async function fetchTicketTypes() {
  return withDelay(TICKET_TYPES);
}

export async function fetchAvailability(dateISO: string): Promise<DayAvailability> {
  const extra = getExtraBookings();
  const slots: TimeSlot[] = SLOT_TIMES.map((time) => {
    const booked = baselineBooked(dateISO, time) + (extra[`${dateISO}|${time}`] ?? 0);
    return {
      time,
      capacity: SLOT_CAPACITY,
      booked: Math.min(booked, SLOT_CAPACITY),
    };
  });
  return withDelay({ date: dateISO, closed: false, slots });
}

function generateTicketCode(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

export interface CreateOrderPayload {
  date: string;
  time: string;
  items: CartItem[];
  guest: GuestInfo;
}

function totalTicketsCount(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const tickets: OrderTicket[] = [];
  let total = 0;
  for (const item of payload.items) {
    const type = getTicketType(item.ticketTypeId);
    if (!type) continue;
    total += type.price * item.quantity;
    for (let i = 0; i < item.quantity; i++) {
      tickets.push({ code: generateTicketCode(), ticketTypeId: type.id, ticketTypeName: type.name });
    }
  }

  const order: Order = {
    id: generateTicketCode().replace("-", ""),
    createdAt: new Date().toISOString(),
    date: payload.date,
    time: payload.time,
    guest: payload.guest,
    items: payload.items,
    tickets,
    total,
    status: "confirmed",
  };

  const orders = readJSON<Order[]>("orders", []);
  orders.unshift(order);
  writeJSON("orders", orders);

  addExtraBooking(payload.date, payload.time, totalTicketsCount(payload.items));

  return withDelay(order);
}

export async function fetchOrder(orderId: string): Promise<Order | null> {
  const orders = readJSON<Order[]>("orders", []);
  return withDelay(orders.find((o) => o.id === orderId) ?? null);
}

export async function fetchOrdersByEmail(email: string): Promise<Order[]> {
  const orders = readJSON<Order[]>("orders", []);
  const normalized = email.trim().toLowerCase();
  return withDelay(orders.filter((o) => o.guest.email.trim().toLowerCase() === normalized));
}
