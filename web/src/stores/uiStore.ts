import { create } from "zustand";

interface UiState {
  sidebarOpen: boolean;
  contextRailOpen: boolean;
  activeModal: string | null;
  toggleSidebar: () => void;
  toggleContextRail: () => void;
}

export const useUiStore = create<UiState>((set) => ({
  sidebarOpen: true,
  contextRailOpen: true,
  activeModal: null,
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  toggleContextRail: () => set((state) => ({ contextRailOpen: !state.contextRailOpen })),
}));
