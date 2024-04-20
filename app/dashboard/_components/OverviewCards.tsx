'use server'
import React from 'react';
import { format } from "date-fns";
import {
  CardHeader,
  CardTitle,
  CardContent,
  Card,
} from "@/components/ui/card";
import { CalendarDaysIcon, CalendarRangeIcon, MessageSquareIcon } from "lucide-react";
import { getChatSummary } from "@/data/whatsapp-chat/chat-summary";
import { Skeleton } from '@/components/ui/skeleton';


const OverviewCards = async () => {
  const result = await getChatSummary();

  return (
    <React.Fragment>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            First Message
          </CardTitle>
          <CalendarRangeIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{
            format(result.firstMessage as Date, 'MMM dd yyyy h:mm aa')
          }</div>
          <p className="text-xs text-muted-foreground">
            Day: {format(result.firstMessage as Date, 'EEEE')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Days</CardTitle>
          <CalendarDaysIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.totalDays}</div>
          <p className="text-xs text-muted-foreground">
            From {result.firstMessage?.getFullYear()} to {result.lastMessage?.getFullYear()}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Last Message
          </CardTitle>
          <CalendarRangeIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{
            format(result.lastMessage as Date, 'EEE dd yyyy h:mm aa')
          }</div>
          <p className="text-xs text-muted-foreground">
            Day: {format(result.lastMessage as Date, 'EEEE')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Messages
          </CardTitle>
          <MessageSquareIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.totalMessages}</div>
          <p className="text-xs text-muted-foreground">
            Since {result.firstMessage?.getFullYear()}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Users
          </CardTitle>
          <MessageSquareIcon className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{result.authors.length}</div>
          <p className="text-xs text-muted-foreground">
            Since {result.firstMessage?.getFullYear()}
          </p>
        </CardContent>
      </Card>
    </React.Fragment>
  )
}

export default OverviewCards
