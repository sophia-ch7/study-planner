import { useAuth } from "../context/AuthContext";

export function ProfilePage() {
  const { user, logout } = useAuth();

  return (
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="card shadow-sm p-4">
          <h3 className="card-title mb-3">Особистий кабінет 👤</h3>
          <hr />
          <div className="mb-3">
            <strong>Юзернейм:</strong> {user?.username}
          </div>
          <div className="mb-3">
            <strong>Email:</strong> {user?.email}
          </div>
          <div className="mb-3">
            <strong>Статус авторизації:</strong>{" "}
            <span className="badge bg-success">Авторизовано ✅</span>
          </div>

          <button className="btn btn-outline-danger mt-3" onClick={logout}>
            Вийти з акаунту 🚪
          </button>
        </div>
      </div>
    </div>
  );
}
