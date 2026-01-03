"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { api } from "../api/axios";
import { notify } from "@/utils/notify";
import axios from "axios";
import { User } from "@/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<Boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);
  async function checkAuth(): Promise<boolean> {
    try {
      const res = await api.get("/users/me");
      setUser(res.data.user || res.data);
      return true;
    } catch (err) {
      setUser(null);
      return false;
    } finally {
      setLoading(false);
    }
  }
  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      notify("Email and password are required");
      return false;
    }

    try {
      setLoading(true);
      const response = await api.post(
        "/auth/signin",
        {
          email: email.trim().toLowerCase(),
          password,
        },
        { withCredentials: true }
      );
      const userData = response.data.userData || response.data;
      setUser(userData);


      return true;
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      if (axios.isAxiosError(error)) {
        message = error.response?.data?.message || error.message || message;
      }

      notify(message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  // AuthContext.tsx
  const logout = async () => {
    try {
      setLoading(true);
      await api.post("/auth/signout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
