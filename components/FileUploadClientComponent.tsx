'use client'

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GetWhatsappChatInsights from "@/lib/utils/whatsapp-insight/insight";
import * as whatsapp from "@/lib/utils/whatsapp-parser";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import { ChatInsightState } from "@/stores/ChatInsightsStore";


const FileUploadClientComponent: React.FC = () => {
  const router = useRouter();
  const uploadChatInsightData = useChatInsightStore((state) => state.uploadChatInsightData);

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
      if (!file) {
        throw new Error("Select a file");
      }

      setLoading(true);
      const parsedText = whatsapp.parseString((await file?.text()) as string);
      const insights = new GetWhatsappChatInsights(parsedText, file?.name);
      const new_insights = insights.analysis();

      console.log(new_insights);

      uploadChatInsightData(new_insights as unknown as ChatInsightState);

      router.push("/dashboard");

    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 flex flex-col space-y-3">
      <p className="md:text-start text-center">Please upload a Whatsapp chat export .txt file for analysis.</p>
      <div className="flex items-center justify-center flex-wrap">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".txt"
          className="mb-4"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className={`rounded bg-blue-500 px-4 py-2 text-white ${loading || !file ? "cursor-not-allowed opacity-50" : ""
            }`}
        >
          {loading ? "Uploading..." : "Upload File"}
        </button>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default FileUploadClientComponent;