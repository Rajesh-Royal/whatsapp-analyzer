import React, { Suspense, useEffect, useState } from "react";
import { WhatsappChat } from "@/components/whatsapp-chat/WhatsappChat";
import WhatsappChatSkeleton from "@/components/whatsapp-chat/WhatsappChatSkeleton";

const Chats = () => {
  return (
    <div className="flex flex-col">
      <div className="flex-1 space-y-4 md:p-8">
        <Suspense fallback={<WhatsappChatSkeleton />}>
          <WhatsappChat />
        </Suspense>
      </div>
    </div>
  );
};

export default Chats;
