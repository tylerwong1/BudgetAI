import { useState } from "react";
import Dropzone, { DropzoneState } from "react-dropzone";
import "@/styles/Upload.css";
import { Button } from "../ui/button";
import { useCheckLoggedIn } from "./HandleUser";
import { apiRequest } from "@/api";

function CsvUploadPage() {
  useCheckLoggedIn();
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([]);

  const handleDrop = (accepted: File[]) => {
    setAcceptedFiles(accepted);
  };

  const handleUpload = async () => {
    if (acceptedFiles.length === 0) return;

    // Create a FormData object and append files
    const formData = new FormData();
    acceptedFiles.forEach((file) => {
      formData.append("file", file); // The key "files" should match your backend's expected form field
    });

    try {
      console.log("Sending request to backend with files...");
      const response = await apiRequest("/upload/csv", "POST", formData);
      const data = await response;
      console.log("Response:", data.message);
      alert(data.message);
      // TODO: Add alerts to notify user about status of upload
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="content-holder">
      <h1>Upload CSV File</h1>
      <Dropzone accept={{ "text/csv": [".csv"] }} onDrop={handleDrop}>
        {({ getRootProps, getInputProps }: DropzoneState) => (
          <div {...getRootProps()} className="dropoff">
            <input {...getInputProps()} type="file" />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
        )}
      </Dropzone>

      {acceptedFiles.length > 0 && (
        <div className="flex flex-col items-center">
          <div className="files-holder">
            <h2 className="text-center">Accepted Files</h2>
            <ul className="list-dot">
              {acceptedFiles.map((file, index) => (
                <li key={index}>{file.name}</li>
              ))}
            </ul>
          </div>
          <Button className="max-w-sm" onClick={handleUpload}>
            Upload Chosen CSV files
          </Button>
        </div>
      )}
    </div>
  );
}

export default CsvUploadPage;
