"use client";

import React, { use, useEffect, useState } from "react";
import ChatSummary from "./analytics/ChatSummary";
import ChatTimeline from "./analytics/ChatTimeline";
import ChatInsightDayWise from "./analytics/ChatInsightDayWise";
import ChatTimeRadar from "./analytics/ChatTimeRadar";
import ChatEmojiInsights from "./analytics/ChatEmojiInsights";
import ChatPersonalStats from "./analytics/ChatPersonalStats";
import ChatInsightWordCloud from "./analytics/ChatInsightWordCloud";
import ChatInsightUserSpecific from "./analytics/ChatInsightUserSpecific";

const ChatAnalytics = () => {
  // This is to trigger the suspense, if not used then the below charts heavy components will block ui updates initially which makes user feel the UI is stuck for a moment
  const data = use(
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("");
      }, 1500);
    }),
  );

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
  );
};

export default ChatAnalytics;
