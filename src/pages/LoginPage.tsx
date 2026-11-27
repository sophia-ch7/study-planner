import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate, useLocation } from "react-router";
import { loginSchema, type LoginFormData } from "../schemas/authSchema";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [apiError, setApiError] = useState<string | null>(null);

  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/tasks";

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setApiError(null);
      await login(data.username, data.password);
      navigate(from, { replace: true });
    } catch (err) {
      setApiError(
        "Невірний юзернейм або пароль (Тестові дані: emilys / emilyspass)",
      );
    }
  };

  return (
    <div className="row justify-content-center mt-5">
      <div className="col-md-5">
        <div className="card shadow-sm p-4">
          <h3 className="card-title text-center mb-4">Вхід у систему 🔑</h3>

          {apiError && <div className="alert alert-danger">{apiError}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-3">
              <label className="form-label">Юзернейм</label>
              <input
                type="text"
                className={`form-control ${errors.username ? "is-invalid" : ""}`}
                placeholder="наприклад, emilys"
                {...register("username")}
              />
              {errors.username && (
                <div className="invalid-feedback">
                  {errors.username.message}
                </div>
              )}
            </div>

            <div className="mb-3">
              <label className="form-label">Пароль</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                placeholder="щонайменше 6 символів"
                {...register("password")}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password.message}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 mt-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Авторизація..." : "Увійти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
