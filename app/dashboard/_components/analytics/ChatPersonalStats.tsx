"use client";

import React from "react";
import Section from "@/components/dashboard/Section";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";

// TODO: fix All ts type
// TODO: Refactor component to move select inside layout
const ChatPersonalStats = () => {
  const chatSummary = useChatInsightStore((store) => store.stats.summary);

  return (
    <Section title="Personal Stats">
      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        <ChatStatsBox
          title="Total Users in Chat"
          stats={chatSummary.totalUsers}
          iconName="user-check"
        />
        <ChatStatsBox
          title="Most Texts Sent"
          stats={chatSummary.mostTexts}
          iconName="square-sigma"
        />
        <ChatStatsBox
          title="Least Texts Sent"
          stats={chatSummary.leastTexts}
          iconName="shield-check"
        />
        <ChatStatsBox
          title="Total Links Sent"
          stats={chatSummary.noOfLinks}
          iconName="link"
        />
      </div>
    </Section>
  );
};

export default ChatPersonalStats;
