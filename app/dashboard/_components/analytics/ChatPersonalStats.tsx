"use client";

import React from "react";
import Section from "@/components/dashboard/Section";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";

// TODO: fix All ts type
// TODO: Refactor component to move select inside layout
const ChatPersonalStats = () => {
  const { summary: chatSummary, userspecific: userSpecificChatSummary } = useChatInsightStore((store) => store.stats);

  const userWithMaxLinks = React.useMemo(() => {
    let maxLinks = 0;
    let userName = '';

    for (let user in userSpecificChatSummary) {
      if (userSpecificChatSummary[user as keyof typeof userSpecificChatSummary].totalLinks > maxLinks) {
        maxLinks = userSpecificChatSummary[user as keyof typeof userSpecificChatSummary].totalLinks;
        userName = user;
      }
    }

    return { userName, totalNoOfLinks: maxLinks };
  }, [userSpecificChatSummary]);

  const userWithMaxMedia = React.useMemo(() => {
    let maxMedia = 0;
    let userName = '';

    for (let user in userSpecificChatSummary) {
      if (userSpecificChatSummary[user as keyof typeof userSpecificChatSummary].totalMedia > maxMedia) {
        maxMedia = userSpecificChatSummary[user as keyof typeof userSpecificChatSummary].totalMedia;
        userName = user;
      }
    }

    return { userName, totalNoOfMedia: maxMedia };
  }, [userSpecificChatSummary]);

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
      <ChatStatsBox
        title={`${userWithMaxLinks.userName} Sends More Links to the group`}
        stats={`Total ${userWithMaxLinks.totalNoOfLinks} links. 🦀`}
        iconName="land-plot"
      />
      <ChatStatsBox
        title={`${userWithMaxMedia.userName} Sends Most Photos and Videos to the group`}
        subTitle={`He sends ${userWithMaxMedia.totalNoOfMedia} media out of ${chatSummary.totalMedia}`}
        stats={`Total ${userWithMaxMedia.totalNoOfMedia} Media. 🙌`}
        iconName="videotape"
      />
      {/* TODO: Count Instagram, Youtube, Facebook links */}
    </Section>
  );
};

export default ChatPersonalStats;
