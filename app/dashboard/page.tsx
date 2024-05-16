import React, { Suspense } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import OverviewCards from "./_components/OverviewCards";
import TopUsersList from "./_components/TopUsersList";
import MessagesPerMonth from "./_components/MessagesPerMonth";
import OverviewCardsSkeleton from "./_components/OverviewCardsSkeleton";
import MessagesPerMonthSkeleton from "./_components/MessagesPerMonthSkeleton";
import TopUsersListSkeleton from "./_components/TopUsersListSkeleton";
import ChatAnalytics from "./_components/ChatAnalytics";
import { ChatSummarySkeleton } from "./_components/analytics/ChatSummary";
import { ChatTimelineSkeleton } from "./_components/analytics/ChatTimeline";

const Home = () => {
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
        <Tabs defaultValue="analytics" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          <TabsContent value="overview" className="space-y-4">
            <h4 className="space-y-2 text-sm text-muted-foreground">
              You are seeing an example overview data of an different group:
            </h4>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
              <Suspense fallback={<OverviewCardsSkeleton />}>
                <OverviewCards />
              </Suspense>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Suspense fallback={<MessagesPerMonthSkeleton />}>
                <MessagesPerMonth />
              </Suspense>
              <Suspense fallback={<TopUsersListSkeleton />}>
                <TopUsersList />
              </Suspense>
            </div>
          </TabsContent>
          <TabsContent value="analytics">
          <Suspense fallback={<><ChatSummarySkeleton /> <ChatTimelineSkeleton /></>}>
            <ChatAnalytics />
            </Suspense>
          </TabsContent>
          <TabsContent value="reports" className="p-8">
            <p className="text-2xl">Coming Soon</p>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Home;
