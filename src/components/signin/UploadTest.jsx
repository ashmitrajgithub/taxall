import React, { useState } from 'react';

const UploadTest = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentName, setDocumentName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDocumentNameChange = (event) => {
    setDocumentName(event.target.value);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadStatus("Please select a file to upload.");
      return;
    }

    // Retrieve the userId and token from localStorage (ensure they're set)
    const userId = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    
    if (!userId) {
      setUploadStatus("User ID not found in localStorage.");
      return;
    }
    if (!token) {
      setUploadStatus("Authentication token not found in localStorage.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("userId", userId);
    // Use the provided documentName, or fall back to the file's name
    formData.append("documentName", documentName || selectedFile.name);

    try {
      const response = await fetch("http://localhost:9090/documents/upload", {
        method: "POST",
        headers: {
          // Include the Bearer token for authentication
          "Authorization": `Bearer ${token}`
        },
        body: formData,
      });
      const responseText = await response.text();
      if (response.ok) {
        setUploadStatus("Upload successful: " + responseText);
      } else {
        setUploadStatus("Upload failed: " + responseText);
      }
    } catch (error) {
      setUploadStatus("Error during upload: " + error.message);
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <h2>Test AWS S3 File Upload</h2>
      <div style={{ marginBottom: "10px" }}>
        <input type="file" onChange={handleFileChange} />
      </div>
      <div style={{ marginBottom: "10px" }}>
        <input
          type="text"
          placeholder="Enter document name (optional)"
          value={documentName}
          onChange={handleDocumentNameChange}
          style={{ width: "100%", padding: "8px" }}
        />
      </div>
      <div>
        <button onClick={handleUpload} style={{ padding: "10px 20px" }}>
          Upload
        </button>
      </div>
      {uploadStatus && (
        <div style={{ marginTop: "15px" }}>
          <p>{uploadStatus}</p>
        </div>
      )}
    </div>
  );
};

export default UploadTest;
