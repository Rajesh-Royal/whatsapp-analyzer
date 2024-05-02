import { createStore } from "zustand/vanilla";
import { exampleChatInsightData } from "@/lib/utils/whatsapp-insight/exampleChatInsightData";

export type ChatInsightState = typeof exampleChatInsightData;

export type CounterActions = {
  // decrementCount: () => void
  // incrementCount: () => void
};

export type ChatInsightStore = ChatInsightState & CounterActions;

export const defaultInitState: ChatInsightState = exampleChatInsightData;

export const createChatInsightStore = (
  initState: ChatInsightState = defaultInitState,
) => {
  return createStore<ChatInsightStore>()((set) => ({
    ...initState,
    // decrementCount: () => set((state) => ({ count: state.count - 1 })),
    // incrementCount: () => set((state) => ({ count: state.count + 1 })),
  }));
};
