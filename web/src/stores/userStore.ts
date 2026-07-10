import { create } from "zustand";
import { User, Role } from "@/types/user";

interface UserState {
  user: User | null;
  role: Role | null;
  isAuthenticated: boolean;
  setUser: (user: User, role: Role) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  setUser: (user, role) => set({ user, role, isAuthenticated: true }),
  logout: () => set({ user: null, role: null, isAuthenticated: false }),
}));
