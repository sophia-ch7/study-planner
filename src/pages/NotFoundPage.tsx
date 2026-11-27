import { Link } from "react-router";

export function NotFoundPage() {
  return (
    <div className="text-center py-5">
      <h1 className="display-1 text-danger">404</h1>
      <h2>Сторінку не знайдено 🔍</h2>
      <p className="text-muted">
        Запрашувана сторінка не існує або була переміщена.
      </p>
      <Link to="/tasks" className="btn btn-primary mt-3">
        Повернутися до завдань
      </Link>
    </div>
  );
}
