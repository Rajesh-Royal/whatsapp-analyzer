"use client";

import React, { useState } from "react";
import Header from "../dashboardLayout/header";
import { Button } from "../ui/button";
import { Heading } from "../common/heading";
import { useRouter } from "next/navigation";
import * as whatsapp from "@/lib/utils/whatsapp-parser";
import GetWhatsappChatInsights from "@/lib/utils/whatsapp-insight/insight";

const LandingPage = () => {
  const router = useRouter();

  return (
    <>
      <Header />
      <div className="d-flex flex h-full w-full flex-col items-center justify-center">
        <Heading
          title="Welcome to WhatsappAnalyzer"
          description="Get insights into your chats - Now with more interesting graphs, free statistics and full PDF export, whatsapp chat file upload and more features will be added one by one, please consider to contribute."
          className="my-5 max-w-[800px] text-center"
        />
        <Button
          onClick={() => {
            router.push("/dashboard");
          }}
        >
          Go to dashboard
        </Button>

        <UploadComponent />
      </div>
    </>
  );
};

export default LandingPage;

const UploadComponent: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files && event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const parsedText = whatsapp.parseString((await file?.text()) as string);
      const insights = new GetWhatsappChatInsights(parsedText, file?.name);
      const new_insights = insights.analysis();

      console.log(new_insights);
      if (!file) {
        throw new Error("Select a file");
      }
      const response = { data: [] };
      // console.log(response.data); // Handle response data as needed
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 flex flex-col items-center">
      <input
        type="file"
        onChange={handleFileChange}
        accept=".txt"
        className="mb-4"
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`rounded bg-blue-500 px-4 py-2 text-white ${
          loading ? "cursor-not-allowed opacity-50" : ""
        }`}
      >
        {loading ? "Uploading..." : "Upload File"}
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};
