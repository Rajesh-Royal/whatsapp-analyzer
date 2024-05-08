import { createStore } from "zustand/vanilla";
import { exampleChatInsightData } from "@/lib/utils/whatsapp-insight/exampleChatInsightData";
import { WhatsAppChatInsightsType } from "@/lib/utils/whatsapp-insight/insight";

export type CounterActions = {
  uploadChatInsightData: (chatInsightData: WhatsAppChatInsightsType) => void
};

export type ChatInsightStore = WhatsAppChatInsightsType & CounterActions;

export const defaultInitState: WhatsAppChatInsightsType = exampleChatInsightData;

export const createChatInsightStore = (
  initState: WhatsAppChatInsightsType = defaultInitState,
) => {
  return createStore<ChatInsightStore>()((set) => ({
    ...initState,
    uploadChatInsightData: (chatInsightData: WhatsAppChatInsightsType) => set(chatInsightData),
  }));
};
