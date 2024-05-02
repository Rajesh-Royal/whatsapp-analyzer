import React from "react";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const TopUsersListSkeleton = () => {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-16" />
        </CardTitle>
        <CardDescription>
          <Skeleton className="h-4 w-72" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Array(8)
          .fill(0)
          .map((_, index) => {
            return (
              <div className="mt-3 flex items-center" key={index}>
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    <Skeleton className="h-3 w-32" />
                  </p>
                  <p className="text-sm text-muted-foreground">
                    <Skeleton className="h-3 w-60" />
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  <Skeleton className="h-4 w-12 rounded-sm" />
                </div>
              </div>
            );
          })}
      </CardContent>
    </Card>
  );
};

export default TopUsersListSkeleton;
