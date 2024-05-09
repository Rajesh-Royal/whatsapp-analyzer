"use client";

import React, { useCallback, useState } from "react";
import ReactWordcloud from "react-d3-cloud";
import Section from "@/components/dashboard/Section";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";
import { cn } from "@/lib/utils";

// TODO: Refactor component to move select inside layout
const ChatInsightWordCloud = () => {
  const [selectedWord, setSelectedWord] = useState<WordCloudWordType>();
  const chatUsers = useChatInsightStore((store) => store.usernames);
  const { wordcloud: chatWordCloud, emoji: emojiStats } = useChatInsightStore(
    (store) => store.stats,
  );
  const [selectedUser, setSelectedUser] = useState("All");

  const handleUserChange = (userName: string) => setSelectedUser(userName);

  const fontSize = useCallback(
    (word: { value: number }) => Math.log2(word.value) * 3,
    [],
  );

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
              : chatWordCloud[selectedUser]["wordStat"].mostUsedWord
          }
          iconName="message-circle-more"
        />
        <ChatStatsBox
          title="Least Used Word"
          stats={
            chatWordCloud[selectedUser] == null
              ? "No Stats"
              : chatWordCloud[selectedUser]["wordStat"].leastUsedWord
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
        <h1 className="flex h-36 items-center justify-center text-center text-2xl">
          Woops! This user has no words!
        </h1>
      ) : (
        <div>
        <ReactWordcloud
          fontSize={fontSize}
          rotate={2}
          data={chatWordCloud[selectedUser].wordUsage}
          spiral={"archimedean"}
          onWordClick={(_, d) => {
            setSelectedWord(d as WordCloudWordType);
          }}
        />
        <span className={cn("border p-3 text-foreground mt-3", {['hidden']: !selectedWord?.text })}>
          The word <span className="font-bold">{selectedWord?.text}</span> is used <span className="font-bold">{selectedWord?.value}</span> times
        </span>
        </div>
      )}
    </Section>
  );
};

export default ChatInsightWordCloud;

type WordCloudWordType = {
  text: string
  value: number
  font: string
  style: string
  weight: string
  rotate: number
  size: number
  padding: number
  width: number
  height: number
  xoff: number
  yoff: number
  x1: number
  y1: number
  x0: number
  y0: number
  hasText: boolean
  x: number
  y: number
}
