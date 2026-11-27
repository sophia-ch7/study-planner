import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { httpClient } from "../api/httpClient";

interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("accessToken"),
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (token) {
      httpClient<User>("/auth/me")
        .then((userData) => setUser(userData))
        .catch(() => logout())
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (username: string, password: string) => {
    const data = await httpClient<{
      accessToken: string;
      id: number;
      username: string;
      email: string;
    }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ username, password }),
    });

    localStorage.setItem("accessToken", data.accessToken);
    setToken(data.accessToken);
    setUser({
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: "",
      lastName: "",
    });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isAuthenticated: !!user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
