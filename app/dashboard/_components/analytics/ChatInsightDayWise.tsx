"use client";

import React, { useState } from "react";
import Section from "@/components/dashboard/Section";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
} from "recharts";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";

// TODO: Refactor component to move select inside layout
const ChatInsightDayWise = () => {
  const chatUsers = useChatInsightStore((store) => store.usernames);
  const chatInsightBasedOnDays = useChatInsightStore(
    (store) => store.stats.basedOnDays,
  );
  const [selectedUser, setSelectedUser] = useState("All");

  const handleUserChange = (userName: string) => setSelectedUser(userName);
  return (
    <Section title="Breakdown of your chats, day-wise">
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
          title="Average Texts Per Day"
          stats={(
            chatInsightBasedOnDays[selectedUser][1] as {
              averageTexts: number;
              leastActiveDay: string;
              mostActiveDay: string;
            }
          ).averageTexts.toFixed(0)}
          iconName="message-circle"
        />
        <ChatStatsBox
          title="Most Texted Day"
          stats={
            (
              chatInsightBasedOnDays[selectedUser][1] as {
                averageTexts: number;
                leastActiveDay: string;
                mostActiveDay: string;
              }
            ).mostActiveDay
          }
          iconName="calendar-days"
        />
        <ChatStatsBox
          title="Least Texted Day"
          stats={
            (
              chatInsightBasedOnDays[selectedUser][1] as {
                averageTexts: number;
                leastActiveDay: string;
                mostActiveDay: string;
              }
            ).leastActiveDay
          }
          iconName="message-square-off"
        />
      </div>
      <DayWiseBarChart selectedOption={selectedUser} />
    </Section>
  );
};

export default ChatInsightDayWise;

export const DayWiseBarChart: React.FC<{ selectedOption: string }> = ({
  selectedOption = "All",
}) => {
  const chatInsightBasedOnDays = useChatInsightStore(
    (store) => store.stats.basedOnDays,
  );

  const days = sortedDays(
    chatInsightBasedOnDays[selectedOption][0] as {
      DAY: string;
      MESSAGE: number;
    }[],
  );

  return (
    <ResponsiveContainer height={400}>
      <BarChart
        height={400}
        data={
          chatInsightBasedOnDays[selectedOption][0] as {
            DAY: string;
            MESSAGE: number;
          }[]
        }
        layout="vertical"
      >
        <XAxis type="number" />
        <YAxis dataKey="DAY" width={85} type="category" />
        <Tooltip labelClassName="text-black" />
        <Bar
          name="Texts"
          dataKey="MESSAGE"
          fill="#25d366"
          isAnimationActive={false}
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

const sortedDays = (days: { DAY: string; MESSAGE: number }[]) => {
  const sorter = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  };
  days.sort(function sortByDay(a, b) {
    let day1 = a.DAY.toLowerCase();
    let day2 = b.DAY.toLowerCase();

    return (
      sorter[day1 as keyof typeof sorter] - sorter[day2 as keyof typeof sorter]
    );
  });
};
