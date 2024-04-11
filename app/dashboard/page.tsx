import React from "react";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RecentSales } from "@/components/dashboard/recent-sales";
import { getChatSummary } from "@/data/whatsapp-chat/chat-summary";
import { CalendarDaysIcon, CalendarRangeIcon, MessageSquareIcon } from "lucide-react";
import { format } from "date-fns";
import { getMessagesCountPerAuthor } from "@/data/whatsapp-chat/messages-per-author";
import { MessagesPerDayBarChart } from "@/components/dashboard/MessagesPerDayBarChart";
import { getMessagesPerDay } from "@/data/whatsapp-chat/messages-per-day";

const Home = async () => {
  const result = await getChatSummary();
  const messagesPerAuthor = await getMessagesCountPerAuthor();
  const messagesPerDay = await getMessagesPerDay(result.firstMessage?.toLocaleDateString(), '', '', 0, 50);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          {/* <div className="flex items-center space-x-2">
            <CalendarDateRangePicker />
            <Button size="sm">Download</Button>
          </div> */}
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Messages Per Month</TabsTrigger>
            <TabsTrigger value="analytics">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="reports">
              Reports
            </TabsTrigger>
            <TabsTrigger value="notifications">
              Notifications
            </TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    First Message
                  </CardTitle>
                  <CalendarRangeIcon className="size-4 text-muted-foreground"/>
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
                 <CalendarDaysIcon className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+12,234</div>
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
                  <CalendarRangeIcon className="size-4 text-muted-foreground"/>
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
                 <MessageSquareIcon className="size-4 text-muted-foreground"/>
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
                 <MessageSquareIcon className="size-4 text-muted-foreground"/>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{result.authors.length}</div>
                  <p className="text-xs text-muted-foreground">
                    Since {result.firstMessage?.getFullYear()}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Messages per month</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <MessagesPerDayBarChart data={messagesPerDay}/>
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Top users</CardTitle>
                  <CardDescription>
                    Users who sent most messages of all time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales topMessageCountUsers={messagesPerAuthor}/>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
