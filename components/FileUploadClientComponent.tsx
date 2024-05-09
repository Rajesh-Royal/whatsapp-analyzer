"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import GetWhatsappChatInsights from "@/lib/utils/whatsapp-insight/insight";
import * as whatsapp from "@/lib/utils/whatsapp-parser";
import { useChatInsightStore } from "@/providers/chatInsightStoreProvider";
import { useModal } from "@/providers/modal-provider";
import { LoaderCircle } from "lucide-react";
import { Modal } from "./common/modal";

const FileUploadClientComponent: React.FC = () => {
  const { toggleModal } = useModal();
  const router = useRouter();
  const uploadChatInsightData = useChatInsightStore(
    (state) => state.uploadChatInsightData,
  );

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

      uploadChatInsightData(new_insights);

      router.push("/dashboard");
      toggleModal();
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
      <p className="text-center md:text-start">
        Please upload a Whatsapp chat export .txt file for analysis.
      </p>
      <div className="flex flex-wrap items-center justify-center">
        <input
          type="file"
          onChange={handleFileChange}
          accept=".txt"
          className="mb-4"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || !file}
          className={`rounded bg-blue-500 px-4 py-2 text-white ${
            loading || !file ? "cursor-not-allowed opacity-50" : ""
          }`}
        >
          {loading ? "Processing..." : "Upload File"}
        </button>
      </div>
      {error && <p className="mt-2 text-red-500">{error}</p>}

      <Modal
        type="dialog"
        title="Preparing the analysis dashboard for your chat"
        description=""
        hideCloseButton
      >
        <div className="my-6 text-center">
          <LoaderCircle className="m-auto size-20 animate-spin" />
        </div>
      </Modal>
    </div>
  );
};

export default FileUploadClientComponent;
