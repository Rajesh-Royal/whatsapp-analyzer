import React from "react";
import { CardHeader, CardTitle, CardContent, Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const OverviewCardsSkeleton = () => {
  return Array(4)
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
    });
};

export default OverviewCardsSkeleton;
