'use server'

import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { getMessagesCountPerAuthor } from "@/data/whatsapp-chat/messages-per-author";



const TopUsersList = async () => {
  const messagesPerAuthor = await getMessagesCountPerAuthor();

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Top users</CardTitle>
        <CardDescription>
          Users who sent most messages of all time
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RecentSales topMessageCountUsers={messagesPerAuthor} />
      </CardContent>
    </Card>
  )
}

export default TopUsersList