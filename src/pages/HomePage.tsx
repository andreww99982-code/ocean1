import { Link } from "react-router-dom";
import { VENUE } from "../data/venue";
import { IconCalendar, IconFish, IconMapPin, IconTicket, IconUsers, IconWave } from "../components/icons";

const HIGHLIGHT_ICONS = {
  fish: IconFish,
  wave: IconWave,
  users: IconUsers,
};

export function HomePage() {
  return (
    <div>
      <section className="hero" style={{ background: VENUE.heroImage }}>
        <div className="container hero__inner">
          <span className="hero__badge">
            <IconFish className="hero__badge-icon" /> Official online tickets
          </span>
          <h1>{VENUE.name}</h1>
          <p className="hero__tagline">{VENUE.tagline}</p>
          <p className="hero__description">{VENUE.description}</p>
          <Link to="/tickets" className="button button--cta">
            <IconTicket /> Buy Tickets
          </Link>
        </div>
      </section>

      <section className="container highlights">
        {VENUE.highlights.map((h) => {
          const Icon = HIGHLIGHT_ICONS[h.icon as keyof typeof HIGHLIGHT_ICONS];
          return (
            <div key={h.title} className="highlight-card">
              {Icon && (
                <span className="highlight-card__icon">
                  <Icon />
                </span>
              )}
              <h2>{h.title}</h2>
              <p>{h.text}</p>
            </div>
          );
        })}
      </section>

      <section className="container info-block">
        <div>
          <h2>
            <IconCalendar className="info-block__icon" />
            Opening Hours
          </h2>
          <p>{VENUE.openingHours}</p>
        </div>
        <div>
          <h2>
            <IconMapPin className="info-block__icon" />
            Address
          </h2>
          <p>{VENUE.address}</p>
        </div>
      </section>
    </div>
  );
}
