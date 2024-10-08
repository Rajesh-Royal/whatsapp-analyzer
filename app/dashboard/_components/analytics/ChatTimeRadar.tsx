"use client";

import React, { useState } from "react";
import Section from "@/components/dashboard/Section";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";

// TODO: Refactor component to move select inside layout
const ChatTimeRadar = () => {
  const chatUsers = useChatInsightStore((store) => store.usernames);
  const chatRadarMap = useChatInsightStore((store) => store.stats.radarMap);
  const [selectedUser, setSelectedUser] = useState("All");

  const handleUserChange = (userName: string) => setSelectedUser(userName);
  return (
    <Section title="Hour wise breakdown">
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
          title="Average Texts Per Hour"
          stats={chatRadarMap[
            selectedUser
          ].radarmapStat.averageTextsPerHour.toFixed(2)}
          iconName="message-circle-code"
        />
        <ChatStatsBox
          title="Most Active Hour"
          stats={chatRadarMap[selectedUser].radarmapStat.mostActiveHour}
          iconName="alarm-clock-plus"
        />
        <ChatStatsBox
          title="Least Active Hour"
          stats={chatRadarMap[selectedUser].radarmapStat.leastActiveHour}
          iconName="hourglass"
        />
      </div>
      <TimeRadarChart selectedOption={selectedUser} />
    </Section>
  );
};

export default ChatTimeRadar;

export const TimeRadarChart: React.FC<{ selectedOption: string }> = ({
  selectedOption = "All",
}) => {
  const chatRadarMap = useChatInsightStore((store) => store.stats.radarMap);

  const timeFormat = ({ time }: { time: number }) => {
    return time >= 12
      ? `${time - 12 === 0 ? "12" : time - 12} pm`
      : `${time === 0 ? "12" : time} am`;
  };

  return (
    <ResponsiveContainer width="100%" height={500}>
      <RadarChart data={chatRadarMap[selectedOption].radarmapUsage}>
        <PolarGrid />
        <PolarAngleAxis dataKey={timeFormat} />
        <PolarRadiusAxis />
        <Tooltip labelClassName="text-black" />
        <Radar
          name="Texts"
          dataKey="count"
          fill="#25d366"
          fillOpacity={0.6}
          isAnimationActive={false}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};
