import { VENUE } from "../data/venue";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div>
          <strong>{VENUE.name}</strong>
          <p>{VENUE.address}</p>
          <p>{VENUE.openingHours}</p>
        </div>
        <p className="site-footer__note">
          Демо-касса работает полностью локально в вашем браузере: без сервера, без реальной оплаты и без
          передачи данных куда-либо. Все заказы хранятся только на этом устройстве.
        </p>
      </div>
    </footer>
  );
}
