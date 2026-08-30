/**
 * Payment gateway configuration.
 *
 * Change PAYMENT_URL below (or set the VITE_PAYMENT_URL environment variable
 * at build time) to point "Place Order" / "Pay" at your real payment provider.
 * The final checkout amount is always appended as the `amount` GET parameter.
 */
export const PAYMENT_URL: string = import.meta.env.VITE_PAYMENT_URL ?? "https://pay.example.com/checkout";

/** Builds the payment provider URL with the order amount as an `amount` query parameter. */
export function buildPaymentUrl(amount: number, extraParams: Record<string, string> = {}): string {
  let url: URL;
  try {
    url = new URL(PAYMENT_URL);
  } catch {
    throw new Error(
      `Invalid payment gateway URL "${PAYMENT_URL}". Set VITE_PAYMENT_URL to a full absolute URL (e.g. https://provider.example.com/pay).`,
    );
  }
  url.searchParams.set("amount", String(amount));
  for (const [key, value] of Object.entries(extraParams)) {
    url.searchParams.set(key, value);
  }
  return url.toString();
}
