import { create } from "zustand";
import api from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isCheckingAuth: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: localStorage.getItem("token"),
  isAuthenticated: false,
  isCheckingAuth: true,

  login: (token: string, user: User) => {
    localStorage.setItem("token", token);
    set({
      token,
      user,
      isAuthenticated: true,
      isCheckingAuth: false,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    set({
      token: null,
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
      return;
    }

    try {
      // Get current authenticated user
      const response = await api.get("/auth/me");
      set({
        token,
        user: response.data,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
    } catch {
      // If fetching me fails (e.g. token expired), clear storage & state
      localStorage.removeItem("token");
      set({
        token: null,
        user: null,
        isAuthenticated: false,
        isCheckingAuth: false,
      });
    }
  },
}));
