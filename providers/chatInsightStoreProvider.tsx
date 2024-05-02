"use client";

import { type ReactNode, createContext, useRef, useContext } from "react";
import { type StoreApi, useStore } from "zustand";

import {
  type ChatInsightStore,
  createChatInsightStore,
} from "@/stores/ChatInsightsStore";

export const ChatInsightStoreContext =
  createContext<StoreApi<ChatInsightStore> | null>(null);

export interface ChatInsightStoreProviderProps {
  children: ReactNode;
}

export const ChatInsightStoreProvider = ({
  children,
}: ChatInsightStoreProviderProps) => {
  const storeRef = useRef<StoreApi<ChatInsightStore>>();
  if (!storeRef.current) {
    storeRef.current = createChatInsightStore();
  }

  return (
    <ChatInsightStoreContext.Provider value={storeRef.current}>
      {children}
    </ChatInsightStoreContext.Provider>
  );
};

export const useChatInsightStore = <T,>(
  selector: (store: ChatInsightStore) => T,
): T => {
  const chatInsightStoreContext = useContext(ChatInsightStoreContext);

  if (!chatInsightStoreContext) {
    throw new Error(`useCounterStore must be use within CounterStoreProvider`);
  }

  return useStore(chatInsightStoreContext, selector);
};
