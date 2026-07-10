import { create } from "zustand";
import { Message } from "@/types/chat";

interface ChatState {
  messages: Message[];
  isStreaming: boolean;
  activeConversationId: string | null;
  addMessage: (message: Message) => void;
  setStreaming: (isStreaming: boolean) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isStreaming: false,
  activeConversationId: null,
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  setStreaming: (isStreaming) => set({ isStreaming }),
  clearMessages: () => set({ messages: [] }),
}));
