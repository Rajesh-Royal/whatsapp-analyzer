import React from "react";
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const MessagesPerMonthSkeleton = () => {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-4 w-60" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[450px] w-[100%]" />
      </CardContent>
    </Card>
  );
};

export default MessagesPerMonthSkeleton;
