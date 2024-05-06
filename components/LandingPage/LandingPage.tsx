"use client";

import React, { useState } from "react";
import Header from "../dashboardLayout/header";
import { Button } from "../ui/button";
import { Heading } from "../common/heading";
import { useRouter } from "next/navigation";
import FileUploadClientComponent from "../FileUploadClientComponent";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { LoaderCircle } from "lucide-react";
import { ModalProvider } from "@/providers/modal-provider";

const LandingPage = () => {
  const router = useRouter();
  const [isDashboardRouteLoading, setIsDashboardRouteLoading] = useState(false);

  return (
    <>
      <Header />
      <div className="flex h-full w-full flex-col items-center justify-center py-40 mt-24 px-5">
        <Heading
          title="Welcome to WhatsappAnalyzer"
          description="Get insights into your chats - Now with more interesting graphs, free statistics and full PDF export, whatsapp chat file upload and more features will be added one by one, please consider to contribute."
          className="my-5 max-w-[800px] text-center space-y-2"
        />
        <ModalProvider>
          <FileUploadClientComponent />
        </ModalProvider>
        <Button
          onClick={() => {
            setIsDashboardRouteLoading(true);

            router.push("/dashboard");
          }}
          title="If you haven't uploaded a file then you will be seeing only the example data on the dashboard"
          className={`mt-12 ${isDashboardRouteLoading ? 'cursor-not-allowed opacity-50' : ''}`}
          disabled={isDashboardRouteLoading}
        >
          {!isDashboardRouteLoading ? "I want to proceed with dummy data" : "Preparing the analysis dashboard"} {isDashboardRouteLoading && <LoaderCircle className="ml-2 animate-spin" />}
        </Button>
        <WhatsappChatExportHowTo />
      </div>
    </>
  );
};

export default LandingPage;

const WhatsappChatExportHowTo = () => {
  return (
    <Accordion type="single" collapsible className="w-full max-w-[800px] my-12 mt-[100px]">
      <AccordionItem value="item-1">
        <AccordionTrigger className="text-xl">How to export chat history ❓</AccordionTrigger>
        <AccordionContent>
          <h5 className="text-md">
            You can use the export chat feature to export a copy of the chat
            history from an individual or group chat.
          </h5>

          <ul className="list-disc text-md ml-8">
            <li>Open the individual or group chat.</li>
            <li>
              Tap More options `{">"}` More `{">"}` Export chat.
            </li>
            <li>
              <span className="has-text-weight-bold">
                Export without media.
              </span>{" "}
              An popup will be shown to you with your chat history file attached as a
              .txt document.
            </li>
          </ul>
          <br />
          Now save it somewhere, send it via email or any other medium. This file will be used for analysis, before uploading the export file you may need to unzip the exported file to get the .txt file.

          <blockquote className="p-4 my-4 border-s-4 border-gray-300 bg-gray-50 dark:border-gray-500 dark:bg-gray-800">
            If you choose to attach media, the most recent media sent will
            be added as attachments.
            <br /> When exporting with media, you can export up to 10,000
            latest messages from a whatsapp chat.
            <br /> Without media, you can export 40,000 messages.
          </blockquote>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

