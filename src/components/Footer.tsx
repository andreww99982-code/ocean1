import { VENUE } from "../data/venue";
import { IconCheckCircle, IconMail, IconMapPin, IconRefresh, IconShield, IconWave } from "./icons";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <strong className="site-footer__brand-name">
            <IconWave className="site-footer__brand-icon" />
            {VENUE.name}
          </strong>
          <p>
            <IconMapPin className="site-footer__inline-icon" />
            {VENUE.address}
          </p>
          <p>{VENUE.openingHours}</p>
        </div>
        <ul className="site-footer__badges">
          <li>
            <IconShield />
            Secure checkout
          </li>
          <li>
            <IconMail />
            Instant e-ticket delivery
          </li>
          <li>
            <IconRefresh />
            Free cancellation up to 24h before your visit
          </li>
          <li>
            <IconCheckCircle />
            Trusted by thousands of visitors
          </li>
        </ul>
      </div>
    </footer>
  );
}
