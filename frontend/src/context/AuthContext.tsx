import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getCart } from "../api/cartApi";
import { saveCartAsGuestCart } from "../utils/guestCart";
import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../types/auth";

interface AuthContextValue {
  token: string | null;
  user: JwtPayload | null;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  login: (token: string) => void;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextValue | undefined>(
  undefined
);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("token");
  });

  const [user, setUser] = useState<JwtPayload | null>(null);

  useEffect(() => {
    if (!token) {
      setUser(null);
      setIsAuthReady(true);
      return;
    }

    try {
      const decodedToken = jwtDecode<JwtPayload>(token);

      if (decodedToken.exp * 1000 < Date.now()) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsAuthReady(true);
        return;
      }

      setUser(decodedToken);
      setIsAuthReady(true);
    } catch {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
      setIsAuthReady(true);
    }
  }, [token]);

  const login = (newToken: string) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const logout = async () => {
    try {
      const cart = await getCart();
      saveCartAsGuestCart(cart);
    } catch (error) {
      console.error("Failed to preserve cart before logout:", error);
    } finally {
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    }
  };

  const isAuthenticated = token !== null && user !== null;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated,
        isAuthReady,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context; 
};

export { AuthProvider, useAuth };