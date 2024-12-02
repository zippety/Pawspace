import { create } from 'zustand';
import type { Message, TravelPreferences } from '../types';

interface ChatState {
  messages: Message[];
  isLoading: boolean;
  preferences: TravelPreferences | null;
  addMessage: (message: Message) => void;
  setLoading: (loading: boolean) => void;
  setPreferences: (preferences: TravelPreferences) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isLoading: false,
  preferences: null,
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  setLoading: (loading) => set({ isLoading: loading }),
  setPreferences: (preferences) => set({ preferences })
}));
