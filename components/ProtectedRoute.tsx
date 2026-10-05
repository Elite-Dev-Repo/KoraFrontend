import api from "@/api/api";
import { ACCESS, REFRESH } from "@/api/constants";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

interface JWTPayload {
  exp: number;
}

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    authenticate().catch((err) => {
      return err;
    });
  }, []);

  const refreshToken = async (): Promise<boolean> => {
    const refresh = localStorage.getItem(REFRESH);
    if (!refresh) return false;

    try {
      const res = await api.post("refresh/", { refresh });
      if (res.status === 200) {
        localStorage.setItem(ACCESS, res.data.access);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      return false;
    }
  };

  const authenticate = async () => {
    const token = localStorage.getItem(ACCESS);

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      const decodedToken = jwtDecode<JWTPayload>(token);
      const expiry_time = decodedToken.exp;
      const now = Date.now() / 1000;

      // If token is expired, try refreshing
      if (expiry_time < now) {
        const isRefreshed = await refreshToken();
        setIsAuthenticated(isRefreshed);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Invalid token:", error);
      setIsAuthenticated(false);
    }
  };

  if (isAuthenticated === null) {
    return (
      <>
        <div className="w-screen h-screen flex items-center justify-center">
          <div className="w-10 h-10 rounded-full border-4 border-x-secondary border-y-background animate-spin"></div>
        </div>
      </>
    ); // Or render a loading spinner while checking auth status
  }

  if (isAuthenticated) {
    return <>{children}</>;
  } else {
    <Navigate to="/auth" replace />;
  }
}
