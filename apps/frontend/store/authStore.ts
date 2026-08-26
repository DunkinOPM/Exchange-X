import { create } from "zustand";

export interface AuthUser {
  id: string;
  email: string;
  username: string;
}

interface AuthStore {
  token: string | null;
  user: AuthUser | null;

  login: (token: string, user: AuthUser) => void;
  logout: () => void;

  initialize: () => void;

  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  token: null,
  user: null,

  login: (token, user) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    set({
      token,
      user,
    });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    set({
      token: null,
      user: null,
    });
  },

  initialize: () => {
    if (typeof window === "undefined") return;

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    set({
      token,
      user: user ? JSON.parse(user) : null,
    });
  },

  isAuthenticated: () => {
    return get().token !== null;
  },
}));