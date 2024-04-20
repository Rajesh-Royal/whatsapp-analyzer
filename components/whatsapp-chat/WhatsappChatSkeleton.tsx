import React from 'react'
import { Skeleton } from '../ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Heading } from '../common/heading';

const WhatsappChatSkeleton = () => {
  return (
    <>
      <div className="flex flex-col items-start justify-between">
      <Heading
          title="Whatsapp Chats"
          description="See all"
        />
      </div>
      <Skeleton className='h-1 w-[100%]' />
      <div className="space-y-5 pt-10">
        <div className="flex items-center justify-between">
          <div className="flex flex-1 items-center space-x-2">
            <Skeleton className='h-8 rounded-sm w-72' />
          </div>
          <Skeleton className='h-8 rounded-sm w-28' />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className='flex items-center justify-between'>
                  <Skeleton className='h-4 w-4' />
                  <Skeleton className='h-4 w-28' />
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-4 w-48' />
                  <Skeleton className='h-4 w-28' />
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            <TableRow>
                {
                  Array(8).fill(0).map((_, index) => {
                    return <TableCell className='flex items-center justify-between' key={index}>
                    <Skeleton className='h-4 w-4' />
                    <Skeleton className='h-3 w-28' />
                    <Skeleton className='h-3 w-48' />
                    <Skeleton className='h-3 w-48' />
                    <Skeleton className='h-3 w-28' />
                  </TableCell>
                  })
                }
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between px-2">
          <Skeleton className='h-4 w-1/6' />
          <div className='flex gap-4'>
          <Skeleton className='h-4 w-28' />
          <Skeleton className='h-4 w-10 rounded-sm' />
          <Skeleton className='h-4 w-28 ' />
          <Skeleton className='h-4 w-10 rounded-sm' />
          <Skeleton className='h-4 w-10 rounded-sm' />
          </div>
        </div>
      </div>
    </>
  )
}

export default WhatsappChatSkeleton