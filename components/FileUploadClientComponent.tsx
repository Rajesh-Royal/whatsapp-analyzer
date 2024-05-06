'use client'

import React, { useState } from "react";
import GetWhatsappChatInsights from "@/lib/utils/whatsapp-insight/insight";
import * as whatsapp from "@/lib/utils/whatsapp-parser";


const FileUploadClientComponent: React.FC = () => {
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

    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-8 flex flex-col items-center">
      <p>Upload a Whatsapp chat export file for analysis.</p>
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

export default FileUploadClientComponent;