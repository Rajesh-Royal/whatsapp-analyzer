import React from "react";
import { Heading } from "@/components/common/heading";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table/data-table";
import { columns } from "./columns";
import { getAllWhatsappChat } from "@/data/whatsapp-chat/get-all-chat";

export const WhatsappChat = async () => {
  const result = await getAllWhatsappChat();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title="Whatsapp Chats" description="See all" />
      </div>
      <Separator />
      <div>
        <DataTable columns={columns} data={result.paginatedMessages} />
      </div>
    </>
  );
};
