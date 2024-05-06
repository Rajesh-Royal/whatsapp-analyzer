"use client";
import { useState } from "react";
import { toast } from "sonner";

const FileUploadServer = () => {
  const [selectedFile, setSelectedFile] = useState();

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    const formData = new FormData();
    formData.append("file", selectedFile as any);

    const response = await fetch("/api/parse-and-save-whatsapp-chat", {
      method: "POST",
      body: formData,
    })
      .then(async (response) => {
        return response.json();
      })
      .then((response) => {
        if (response.status > 299 || response.status < 200) {
          throw new Error(response.message);
        }
        toast.success(response.message);
      })
      .catch((error) => {
        console.log(error);
        toast.error(`Failed to parse file - ${error.message}`);
      });
  };

  return (
    <div>
      <input type="file" accept=".txt" onChange={handleFileChange} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
};

export default FileUploadServer;
