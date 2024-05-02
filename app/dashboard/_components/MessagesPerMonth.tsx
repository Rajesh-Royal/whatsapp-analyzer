"use server";

import React from "react";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { MessagesPerDayBarChart } from "@/components/dashboard/MessagesPerDayBarChart";
import { getMessagesPerDay } from "@/data/whatsapp-chat/messages-per-day";

const MessagesPerMonth = async () => {
  const messagesPerDay = await getMessagesPerDay(
    new Date("2023-02-02T14:09:00.001Z").toLocaleDateString(),
    "",
    "",
    0,
    50,
  );
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Messages per month</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <MessagesPerDayBarChart data={messagesPerDay} />
      </CardContent>
    </Card>
  );
};

export default MessagesPerMonth;
