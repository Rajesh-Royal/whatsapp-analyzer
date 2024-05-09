"use client";

import React, { useState } from "react";
import randomColor from "randomcolor";
import Section from "@/components/dashboard/Section";
import { Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";

// TODO: Refactor component to move select inside layout
const ChatEmojiInsights = () => {
  const chatUsers = useChatInsightStore((store) => store.usernames);
  const chatEmojis = useChatInsightStore((store) => store.stats.emoji);
  const [selectedUser, setSelectedUser] = useState("All");

  const handleUserChange = (userName: string) => setSelectedUser(userName);
  return (
    <Section title="Emoji analysis">
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
          title="Most Used Emojis"
          stats={chatEmojis[selectedUser].emojiUsage.map((item, index) => {
            return index >= 5 ? null : `${item.emoji}`;
          })}
          iconName="smile-plus"
        />
        <ChatStatsBox
          title="Number of Emoji Used"
          stats={chatEmojis[selectedUser].emojiStat.totalEmojis}
          iconName="square-sigma"
        />
        <ChatStatsBox
          title="Number of Unqiue Emojis"
          stats={chatEmojis[selectedUser].emojiStat.totalUniqueEmojis}
          iconName="shield-check"
        />
      </div>
      <TimeRadarChart selectedOption={selectedUser} />
    </Section>
  );
};

export default ChatEmojiInsights;

export const TimeRadarChart: React.FC<{ selectedOption: string }> = ({
  selectedOption = "All",
}) => {
  const chatEmojis = useChatInsightStore((store) => store.stats.emoji);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <PieChart>
        <Pie
          isAnimationActive={false}
          data={chatEmojis[selectedOption].emojiUsage}
          labelLine={false}
          label={renderCustomizedLabel}
          outerRadius={150}
          fill="#8884d8"
          dataKey="value"
        >
          {chatEmojis[selectedOption].emojiUsage.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={randomColor()} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
};

const CustomTooltip = ({ payload }: any) => {
  return (
    <div className={"rounded-sm border bg-white p-6 py-4 text-2xl text-black"}>
      <p>
        <small>
          {payload?.[0]?.payload?.emoji} was used <br />
          {payload?.[0]?.payload?.value} times
        </small>
      </p>
    </div>
  );
};

const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
  emoji,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  emoji: string;
}) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180);
  const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
    >
      {percent * 100 >= 3 ? `${emoji}  ${(percent * 100).toFixed(0)}%` : ""}
    </text>
  );
};
