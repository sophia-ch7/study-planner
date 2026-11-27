import { NavLink, Outlet, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

export function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4 shadow-sm">
        <div className="container">
          <NavLink className="navbar-brand fw-bold" to="/tasks">
            Study Planner 📚
          </NavLink>

          <div className="navbar-nav me-auto">
            <NavLink className="nav-link" to="/tasks">
              Завдання
            </NavLink>
            <NavLink className="nav-link" to="/profile">
              Профіль
            </NavLink>
          </div>

          <div className="d-flex align-items-center gap-3">
            {isAuthenticated ? (
              <>
                <span className="text-white small">
                  Привіт, <strong>{user?.username}</strong>!
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  onClick={handleLogout}
                >
                  Вийти 🚪
                </button>
              </>
            ) : (
              <NavLink className="btn btn-light btn-sm fw-semibold" to="/login">
                Увійти 🔑
              </NavLink>
            )}
          </div>
        </div>
      </nav>

      <main className="container pb-5">
        <Outlet />
      </main>
    </div>
  );
}
