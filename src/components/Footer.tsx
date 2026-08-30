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
          Secure checkout &middot; Instant e-ticket delivery &middot; Free cancellation up to 24 hours before your
          visit.
        </p>
      </div>
    </footer>
  );
}
