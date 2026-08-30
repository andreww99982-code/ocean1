import { useState, type FormEvent } from "react";
import { useCart } from "../context/CartContext";
import { CartSummary } from "../components/CartSummary";
import { createOrder } from "../api/localApi";
import { Loader } from "../components/Loader";
import { buildPaymentUrl } from "../config/payment";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutPage() {
  const { cart, totalPrice, clear } = useCart();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (cart.items.length === 0 || !cart.date || !cart.time) {
    return (
      <div className="container page">
        <h1>Checkout</h1>
        <p>Your cart is empty. Please select tickets first.</p>
      </div>
    );
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Please enter your full name";
    if (!EMAIL_RE.test(email.trim())) next.email = "Please enter a valid email";
    if (!phone.trim()) next.phone = "Please enter a phone number";
    if (cardNumber.replace(/\s/g, "").length < 12) next.cardNumber = "Please enter a valid card number";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const order = await createOrder({
        date: cart.date!,
        time: cart.time!,
        items: cart.items,
        guest: { fullName: fullName.trim(), email: email.trim(), phone: phone.trim() },
      });
      clear();
      window.location.href = buildPaymentUrl(order.total, { orderId: order.id });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page page--split">
      <div>
        <h1>Checkout</h1>
        <form className="form" onSubmit={onSubmit} noValidate>
          <fieldset>
            <legend>Contact Information</legend>
            <label>
              Full Name
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} autoComplete="name" />
              {errors.fullName && <span className="form__error">{errors.fullName}</span>}
            </label>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
              {errors.email && <span className="form__error">{errors.email}</span>}
            </label>
            <label>
              Phone
              <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              {errors.phone && <span className="form__error">{errors.phone}</span>}
            </label>
          </fieldset>

          <fieldset>
            <legend>Payment</legend>
            <p className="form__hint">
              Your payment is processed securely. Card details are encrypted and never stored on our servers.
            </p>
            <label>
              Card Number
              <input
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4111 1111 1111 1111"
                inputMode="numeric"
              />
              {errors.cardNumber && <span className="form__error">{errors.cardNumber}</span>}
            </label>
          </fieldset>

          <button type="submit" className="button button--primary" disabled={submitting}>
            {submitting ? "Processing…" : `Pay ${totalPrice} €`}
          </button>
          {submitting && <Loader label="Processing order…" />}
        </form>
      </div>

      <aside>
        <h2>Your Order</h2>
        <CartSummary cart={cart} total={totalPrice} />
      </aside>
    </div>
  );
}
