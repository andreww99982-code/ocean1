import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { CartSummary } from "../components/CartSummary";
import { createOrder } from "../api/localApi";
import { Loader } from "../components/Loader";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function CheckoutPage() {
  const { cart, totalPrice, clear } = useCart();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  if (cart.items.length === 0 || !cart.date || !cart.time) {
    return (
      <div className="container page">
        <h1>Оформление заказа</h1>
        <p>Ваша корзина пуста. Сначала выберите билеты.</p>
      </div>
    );
  }

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!fullName.trim()) next.fullName = "Укажите имя и фамилию";
    if (!EMAIL_RE.test(email.trim())) next.email = "Укажите корректный email";
    if (!phone.trim()) next.phone = "Укажите телефон";
    if (cardNumber.replace(/\s/g, "").length < 12) next.cardNumber = "Введите номер карты (демо, не проверяется)";
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
      navigate(`/confirmation/${order.id}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container page page--split">
      <div>
        <h1>Оформление заказа</h1>
        <form className="form" onSubmit={onSubmit} noValidate>
          <fieldset>
            <legend>Контактные данные</legend>
            <label>
              Имя и фамилия
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
              Телефон
              <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" />
              {errors.phone && <span className="form__error">{errors.phone}</span>}
            </label>
          </fieldset>

          <fieldset>
            <legend>Оплата (демо)</legend>
            <p className="form__hint">
              Это локальная демо-касса — реальные платежи не выполняются, данные карты никуда не отправляются.
            </p>
            <label>
              Номер карты
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
            {submitting ? "Оформляем…" : `Оплатить ${totalPrice} €`}
          </button>
          {submitting && <Loader label="Обрабатываем заказ…" />}
        </form>
      </div>

      <aside>
        <h2>Ваш заказ</h2>
        <CartSummary cart={cart} total={totalPrice} />
      </aside>
    </div>
  );
}
