'use client'

import React from 'react';
import ChatSummary from "./analytics/ChatSummary";
import ChatTimeline from "./analytics/ChatTimeline";
import ChatInsightDayWise from "./analytics/ChatInsightDayWise";
import ChatTimeRadar from "./analytics/ChatTimeRadar";
import ChatEmojiInsights from "./analytics/ChatEmojiInsights";
import ChatPersonalStats from "./analytics/ChatPersonalStats";
import ChatInsightWordCloud from "./analytics/ChatInsightWordCloud";
import ChatInsightUserSpecific from "./analytics/ChatInsightUserSpecific";

const ChatAnalytics = () => {
  return (
    <React.Fragment>
      <ChatSummary />
      <ChatTimeline />
      <ChatInsightDayWise />
      <ChatTimeRadar />
      <ChatEmojiInsights />
      <ChatPersonalStats />
      <ChatInsightWordCloud />
      <ChatInsightUserSpecific />
    </React.Fragment>
  )
}

export default ChatAnalytics