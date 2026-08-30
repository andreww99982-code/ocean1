import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container page">
      <h1>Страница не найдена</h1>
      <Link to="/" className="button button--primary">
        На главную
      </Link>
    </div>
  );
}
