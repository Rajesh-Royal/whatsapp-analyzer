"use client";

import React from "react";
import ChatStatsBox from "@/components/dashboard/ChatStatsBox";
import Section, { SectionSkeleton } from "@/components/dashboard/Section";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import {
  CardHeader,
  CardTitle,
  CardContent,
  Card,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const ChatSummary: React.FC = () => {
  const { totalDays, totalMessageExchanged, totalWords, totalMedia } =
    useChatInsightStore((state) => state.stats.summary);
  const { groupName, isDummyData } = useChatInsightStore((state) => state);

  return (
    <Section
      title={
        isDummyData
          ? "We respect your decision. Here's how we'd show your stats."
          : `Showing chat between ${groupName}`
      }
      subTitle={isDummyData ? `Showing example chat between ${groupName}` : ""}
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ChatStatsBox
          title={"Total Days"}
          stats={totalDays.toLocaleString()}
          iconName="calendar"
        />
        <ChatStatsBox
          title="Total Message Exchanged"
          stats={totalMessageExchanged.toLocaleString()}
          iconName="message-square"
        />
        <ChatStatsBox
          title={"Total Words Sent"}
          stats={totalWords.toLocaleString()}
          iconName="send"
        />
        <ChatStatsBox
          title={"Total Media Sent"}
          stats={totalMedia.toLocaleString()}
          iconName="clapperboard"
        />
      </div>
    </Section>
  );
};

export default ChatSummary;

export const ChatSummarySkeleton: React.FC = () => {
  return <SectionSkeleton title="skeleton" subTitle="skeleton">
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {Array(4)
        .fill(0)
        .map((_, index) => {
          return (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="w-[70%] text-sm font-medium">
                  <Skeleton className="h-4 w-full" />
                </CardTitle>
                <Skeleton className="h-12 w-12 rounded-full" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <Skeleton className="h-4 w-[200px]" />
                </div>
                <p className="text-xs text-muted-foreground">
                  <Skeleton className="mt-3 h-2 w-[150px]" />
                </p>
              </CardContent>
            </Card>
          );
        })}
    </div>
  </SectionSkeleton>
}
