"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";

export const columns: ColumnDef<any>[] = [
  {
    id: "selected",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "author",
    header: "User",
  },
  {
    accessorKey: "message",
    header: "Message",
  },
  {
    accessorKey: "attachmentId",
    header: "Attachment",
  },
  {
    accessorKey: "date",
    header: "Message Date",
    cell({ getValue }) {
      return format(new Date(getValue() as string), "EEE dd yyyy h:mm aa");
    },
  },
  // {
  //   id: "actions",
  //   enableSorting: false,
  //   cell: ({ row }) => <CellAction data={row.original} />,
  // },
];
