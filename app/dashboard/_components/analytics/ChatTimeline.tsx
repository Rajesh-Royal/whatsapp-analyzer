'use client'

import React, { useState } from 'react';
import Section from '@/components/dashboard/Section';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useChatInsightStore } from '@/providers/chatInsightStoreProvider';


const ChatTimeline = () => {
  const chatUsers = useChatInsightStore((store) => store.usernames);
  const [selectedUser, setSelectedUser] = useState("All");

  const handleUserChange = (userName: string) => setSelectedUser(userName);
  return (
    <Section title='Chat Timeline'>
      <select className='min-h-6 min-w-40 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
      onChange={(event) => {
        handleUserChange(event.target.value)
      }}>
      <option value={"All"} key={"All"}>All</option>
        {
          chatUsers.map((user) => {
           return <option value={user} key={user}>{user}</option>
          })
        }
      </select>
      <TimelineBarChart selectedOption={selectedUser}/>
    </Section>
  )
}

export default ChatTimeline


export const TimelineBarChart: React.FC<{selectedOption: string}> = ({ selectedOption = "All"}) => {
 const chatInsightTimeline = useChatInsightStore((store) => store.stats.timeline)
 
  const dateFormat = (date: any)=>new Date(date.date).toLocaleDateString('en-GB')
  return (
    <ResponsiveContainer width="100%" height={400} >
      <BarChart  height={400} data={chatInsightTimeline[selectedOption as "All"].timelineUsage}>
        <Bar dataKey="count" fill="#25d366" legendType={"line"} isAnimationActive={false}/>
        <XAxis dataKey={dateFormat} />
        <Tooltip labelClassName='text-foreground'/>
      </BarChart>
    </ResponsiveContainer>
  );
}
