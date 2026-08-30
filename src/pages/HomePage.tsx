import { Link } from "react-router-dom";
import { VENUE } from "../data/venue";

export function HomePage() {
  return (
    <div>
      <section className="hero" style={{ background: VENUE.heroImage }}>
        <div className="container hero__inner">
          <h1>{VENUE.name}</h1>
          <p className="hero__tagline">{VENUE.tagline}</p>
          <p className="hero__description">{VENUE.description}</p>
          <Link to="/tickets" className="button button--primary">
            Купить билеты
          </Link>
        </div>
      </section>

      <section className="container highlights">
        {VENUE.highlights.map((h) => (
          <div key={h.title} className="highlight-card">
            <h2>{h.title}</h2>
            <p>{h.text}</p>
          </div>
        ))}
      </section>

      <section className="container info-block">
        <div>
          <h2>Часы работы</h2>
          <p>{VENUE.openingHours}</p>
        </div>
        <div>
          <h2>Адрес</h2>
          <p>{VENUE.address}</p>
        </div>
      </section>
    </div>
  );
}
