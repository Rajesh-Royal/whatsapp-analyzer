import React from 'react';
import {
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
  Card,
} from "@/components/ui/card";
import { Skeleton } from '@/components/ui/skeleton';

const TopUsersListSkeleton = () => {
  return (
    <Card className="col-span-3" >
      <CardHeader>
        <CardTitle>
          <Skeleton className='h-4 w-16' />
        </CardTitle>
        <CardDescription>
          <Skeleton className='h-4 w-72' />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {Array(8).fill(0).map((_, index) => {
          return <div className="flex items-center mt-3" key={index}>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">
                <Skeleton className='w-32 h-3' />
              </p>
              <p className="text-sm text-muted-foreground">
                <Skeleton className='w-60 h-3' />
              </p>
            </div>
            <div className="ml-auto font-medium"><Skeleton className='w-12 h-4 rounded-sm' /></div>
          </div>
        })}
      </CardContent>
    </Card>
  )
}

export default TopUsersListSkeleton