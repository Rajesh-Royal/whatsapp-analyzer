'use client';

import React from "react";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";
import Section from "@/components/dashboard/Section";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";

const ChatSummary: React.FC = () => {
  const { totalDays, totalMessageExchanged, totalWords, totalMedia } = useChatInsightStore((state) => state.stats.summary);
  const { groupName, isDummyData } = useChatInsightStore((state) => state)

  return (
    <Section title={
      isDummyData
        ? "We respect your decision. Here's how we'd show your stats."
        : `Showing chat between ${groupName}`
    }
      subTitle={isDummyData ? `Showing example chat between ${groupName}` : ''}
    >

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ChatStatsBox
          title={"Total Days"}
          stats={totalDays.toLocaleString()}
          iconName="calendar"
        />
        <ChatStatsBox
          title="Total Message Exchanged"
          stats={totalMessageExchanged.toLocaleString()}
          iconName="message-square"
        />
        <ChatStatsBox
          title={"Total Words Sent"}
          stats={totalWords.toLocaleString()}
          iconName="send"
        />
        <ChatStatsBox
          title={"Total Media Sent"}
          stats={totalMedia.toLocaleString()}
          iconName="clapperboard"
        />
      </div>
    </Section>
  );
}

export default ChatSummary;
