import { create } from "zustand";

interface DemoUser {
  id: string;
  username: string;
}

interface UserStore {
  currentUser: DemoUser;

  setCurrentUser: (user: DemoUser) => void;
}

export const useUserStore = create<UserStore>((set) => ({
  currentUser: {
    id: "cmr962oji0000qohcbkzvige6",
    username: "buyer",
  },

  setCurrentUser: (user) =>
    set({
      currentUser: user,
    }),
}));