import { Link } from "react-router-dom";

export function NotFoundPage() {
  return (
    <div className="container page">
      <h1>Page Not Found</h1>
      <Link to="/" className="button button--primary">
        Back to Home
      </Link>
    </div>
  );
}
