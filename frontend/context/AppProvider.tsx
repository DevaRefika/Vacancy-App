"use client";

import Loader from "@/components/Loader";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useRouter, usePathname } from "next/navigation";

// 1. Definisi tipe data
interface UserType {
  name: string;
  email: string;
}

interface AppProviderType {
  isLoading: boolean;
  authToken: string | null;
  user: UserType | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, confirmpassword: string) => Promise<void>;
  logout: () => void;
}

const AppContext = createContext<AppProviderType | undefined>(undefined);
const API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const savedToken = Cookies.get("authToken");
      const savedUser = Cookies.get("user");

      if (savedToken) {
        setAuthToken(savedToken);
        if (savedUser) {
          try {
            setUser(JSON.parse(savedUser));
          } catch (e) {
            console.error("Error parsing user data");
          }
        }
      } else {
        if (pathname !== "/auth") {
          router.push("/auth");
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [pathname, router]);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });

      if (response.data.status) {
        const token = response.data.token;
        const userData = response.data.user;

        Cookies.set("authToken", token, { expires: 7 });
        Cookies.set("user", JSON.stringify(userData), { expires: 7 });

        setAuthToken(token);
        setUser(userData);

        toast.success("Login Berhasil");
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Login Gagal");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, confirmpassword: string) => {
    setIsLoading(true);
    try {
      const response = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        password_confirmation: confirmpassword
      });

      if (response.data.status) {
        toast.success("Registrasi Berhasil! Silakan Login.");
        router.push("/auth");
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal mendaftar");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Fungsi Logout
  const logout = () => {
    Cookies.remove("authToken");
    Cookies.remove("user");
    setIsLoading(false);
    setAuthToken(null);
    setUser(null);
    toast.success("Berhasil Logout");
    router.push("/auth");
  };

  return (
    <AppContext.Provider value={{ login, register, logout, isLoading, authToken, user }}>
      {isLoading ? <Loader /> : children}
    </AppContext.Provider>
  );
};

export const myAppHook = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("myAppHook must be used within AppProvider");
  }
  return context;
};