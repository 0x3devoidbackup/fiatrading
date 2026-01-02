"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {api} from "../api/axios";
import { notify } from "@/utils/notify";
import axios from "axios";

// 1️⃣ Define user type (adjust based on your backend)
interface User {
  id: string;
  email: string;
  // add other fields your backend returns
}

// 2️⃣ Define AuthContext type
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<Boolean>;
  //   register: (fullname: string, email: string, password: string, refUID: any) => Promise<void>;
  logout: () => Promise<void>;
}

// 3️⃣ Create context with proper type
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4️⃣ Custom hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// 5️⃣ AuthProvider component
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Persistent login check
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await axios.get("/users/me");
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    if (!email || !password) {
      notify("Email and password are required");
      return false;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/signin", {
        email: email.trim().toLowerCase(),
        password,
      });
      setUser(response.data);
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

  const logout = async () => {
    await axios.post("/auth/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
