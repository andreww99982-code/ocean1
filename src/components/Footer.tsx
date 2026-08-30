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
          This demo checkout runs completely locally in your browser: no server, no real payments, and no data
          transmission. All orders are stored only on this device.
        </p>
      </div>
    </footer>
  );
}
