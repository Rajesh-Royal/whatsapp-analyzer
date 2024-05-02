"use client";

import React, { useCallback, useState } from "react";
import ReactWordcloud from "react-d3-cloud";
import Section from "@/components/dashboard/Section";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// TODO: fix All ts type
// TODO: Refactor component to move select inside layout
const ChatInsightUserSpecific = () => {
  const chatUsers = useChatInsightStore((store) => store.usernames);
  const userSpecificChatInsight = useChatInsightStore((store) => store.stats.userspecific);
  const [selectedUser, setSelectedUser] = useState<"Rajesh">("Rajesh");

  const handleUserChange = (userName: string) => setSelectedUser(userName as "Rajesh");
  return (
    <Section title="Userspecific chat summary">
      <select
        className="block min-h-6 w-full min-w-40 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        onChange={(event) => {
          handleUserChange(event.target.value);
        }}
      >
        {chatUsers.map((user) => {
          return (
            <option value={user} key={user}>
              {user}
            </option>
          );
        })}
      </select>
      <Card className={"bg-whatsappGreenBg-default"}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-2xl font-bold">{selectedUser.charAt(0).toUpperCase() + selectedUser.slice(1)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl">
            <span className="has-text-weight-semibold">
              {userSpecificChatInsight[selectedUser].totalMessages}{" "}
            </span>
            messages over
            <span className="has-text-weight-semibold">
              {" "}
              {userSpecificChatInsight[selectedUser].totalDays}{" "}
            </span>
            days.
          </p>
          <p className="text-lg text-muted-foreground">
            {"That's"}
            <span className="text-blue-300">
              {" "}
              {userSpecificChatInsight[
                selectedUser
              ].averageMessagePerDay.toFixed(0)}{" "}
              texts per day,
            </span>{" "}
            {userSpecificChatInsight[
              selectedUser
            ].averageWordsPerMessage.toFixed(0)}{" "}
            words per message
          </p>
          <p className="text-lg py-6">
            {userSpecificChatInsight[selectedUser].totalEmojis}{" "}
            Emojis,{" "}
            {userSpecificChatInsight[selectedUser].totalLinks}{" "}
            Links,{" "}
            {userSpecificChatInsight[selectedUser].totalMedia} Media
          </p>
          <p className="text-lg">
            <span className="text-blue-400 text-2xl">
              {userSpecificChatInsight[selectedUser].mostActiveDate}
            </span>
            , being the most active date
          </p>
        </CardContent>
      </Card>
    </Section>
  )
};

export default ChatInsightUserSpecific;




