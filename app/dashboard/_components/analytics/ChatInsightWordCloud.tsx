"use client";

import React, { useCallback, useState } from "react";
import ReactWordcloud from "react-d3-cloud";
import Section from "@/components/dashboard/Section";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";

// TODO: fix All ts type
// TODO: Refactor component to move select inside layout
const ChatInsightWordCloud = () => {
  const chatUsers = useChatInsightStore((store) => store.usernames);
  const {wordcloud: chatWordCloud, emoji: emojiStats} = useChatInsightStore((store) => store.stats);
  const [selectedUser, setSelectedUser] = useState<"All">("All");

  const handleUserChange = (userName: string) => setSelectedUser(userName as "All");

  const fontSize = useCallback((word: {value: number}) => Math.log2(word.value) * 3, []);

  return (
    <Section title="Most Used Word's Wordcloud">
      <select
        className="block min-h-6 w-full min-w-40 rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
        onChange={(event) => {
          handleUserChange(event.target.value);
        }}
      >
        <option value={"All"} key={"All"}>
          All
        </option>
        {chatUsers.map((user) => {
          return (
            <option value={user} key={user}>
              {user}
            </option>
          );
        })}
      </select>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <ChatStatsBox
          title="Most Used Word"
          stats={
            chatWordCloud[selectedUser] == null
              ? "No Stats"
              : chatWordCloud[selectedUser][
                "wordStat"
              ].mostUsedWord
          }
          iconName="message-circle-more"
        />
        <ChatStatsBox
          title="Least Used Word"
          stats={
            chatWordCloud[selectedUser] == null
              ? "No Stats"
              : chatWordCloud[selectedUser][
                "wordStat"
              ].leastUsedWord
          }
          iconName="message-circle-x"
        />
        <ChatStatsBox
          title="Average No of Emoji Per Text"
          stats={emojiStats[selectedUser].emojiStat.emojiPerText.toFixed(2)}
          iconName="smile-plus"
        />
      </div>
     {chatWordCloud[selectedUser] == null ? (
          <h1 className="text-center text-2xl h-36 flex items-center justify-center">
          Woops! This user has no words!
        </h1>
        ) : <ReactWordcloud fontSize={fontSize} rotate={2} data={chatWordCloud[selectedUser].wordUsage} spiral={"archimedean"}/>}
    </Section>
  );
};

export default ChatInsightWordCloud;




