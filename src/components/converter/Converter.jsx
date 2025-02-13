import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiCheckCircle, FiXCircle, FiLoader } from 'react-icons/fi';
import './Converter.css';

// Helper: Convert a Base64 string to a Blob
const base64ToBlob = (base64, contentType = '', sliceSize = 512) => {
  const byteCharacters = atob(base64);
  const byteArrays = [];
  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);
    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }
  return new Blob(byteArrays, { type: contentType });
};

// Helper: Return MIME type based on file extension
const getMimeType = (format) => {
  const mimeTypes = {
    pdf: 'application/pdf',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    txt: 'text/plain',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
  };
  return mimeTypes[format] || 'application/octet-stream';
};

// Helper: Automatically compute a scale factor for images so that neither dimension exceeds maxDimension.
const getAutoScale = (file, maxDimension = 1024) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      const { naturalWidth: width, naturalHeight: height } = image;
      if (width <= maxDimension && height <= maxDimension) {
        resolve(1.0);
      } else {
        const factor = Math.min(maxDimension / width, maxDimension / height);
        resolve(factor);
      }
    };
    image.onerror = () => reject(new Error("Failed to load image for scaling."));
    image.src = URL.createObjectURL(file);
  });
};

const Converter = () => {
  const [file, setFile] = useState(null);
  const [outputFormat, setOutputFormat] = useState("pdf");
  const [quality, setQuality] = useState(100);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  // Handle output format change
  const handleOutputFormatChange = (e) => {
    setOutputFormat(e.target.value);
  };

  // Handle quality change
  const handleQualityChange = (e) => {
    setQuality(Number(e.target.value));
  };

  // Main conversion function using ConvertAPI
  const convertFile = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }
    setLoading(true);
    setMessage("Converting file...");
    const inputFormat = file.name.split('.').pop().toLowerCase();

    // Automatically compute a scale factor for image files.
    let autoScale = 1.0;
    if (["jpg", "jpeg", "png"].includes(inputFormat)) {
      try {
        autoScale = await getAutoScale(file);
      } catch (error) {
        console.error("Scale factor error:", error);
        autoScale = 1.0;
      }
    }

    let endpoint = `https://v2.convertapi.com/convert/${inputFormat}/to/${outputFormat}?Secret=secret_DQJU1ujoLpnLPFuP`;
    if (outputFormat === "pdf") {
      endpoint += `&PageSize=A4`;
    }
    if (quality < 100) {
      endpoint += `&Quality=${quality}`;
    }
    if (autoScale !== 1.0) {
      endpoint += `&Scale=${autoScale}`;
    }

    const formData = new FormData();
    formData.append("File", file);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        throw new Error(`Conversion failed: ${response.statusText}`);
      }
      const data = await response.json();
      if (!data.Files || data.Files.length === 0) {
        throw new Error("No converted file returned.");
      }
      const fileObj = data.Files[0];
      let fileUrl = fileObj.Url || fileObj.url || fileObj.FileUrl;
      if (!fileUrl && fileObj.FileData) {
        const mimeType = getMimeType(outputFormat);
        const blob = base64ToBlob(fileObj.FileData, mimeType);
        fileUrl = URL.createObjectURL(blob);
      }
      if (!fileUrl) {
        throw new Error("No file URL or data found.");
      }
      setMessage("Conversion successful!");
      const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
      window.open(fileUrl, "_blank");
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = `${baseName}.${outputFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setMessage("Download initiated.");
    } catch (error) {
      console.error(error);
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const detectedInputFormat = file ? file.name.split('.').pop().toLowerCase() : "";

  return (
    <motion.div
      className="converter-container"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="converter-card">
        <h2 className="converter-title">Taxall File Converter</h2>
        <div className="converter-form">
          <div className="input-group file-group">
            <label htmlFor="file" className="input-label">
              <FiUpload className="upload-icon" /> Select File
            </label>
            <input type="file" id="file" onChange={handleFileChange} className="file-input" />
          </div>
          {file && (
            <p className="file-info">
              Detected Format: <strong>{detectedInputFormat}</strong>
            </p>
          )}
          <div className="input-group">
            <label htmlFor="outputFormat" className="input-label">Output Format</label>
            <select
              id="outputFormat"
              value={outputFormat}
              onChange={handleOutputFormatChange}
              className="conversion-select"
            >
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
              <option value="txt">TXT</option>
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
            </select>
          </div>
          <div className="input-group">
            <label htmlFor="quality" className="input-label">Quality (%)</label>
            <input
              type="number"
              id="quality"
              value={quality}
              onChange={handleQualityChange}
              className="number-input"
              min="10"
              max="100"
            />
          </div>
          <button onClick={convertFile} className="convert-button" disabled={loading}>
            {loading ? <FiLoader className="loading-icon" /> : "Convert"}
          </button>
          {message && (
            <div className="message-container">
              {message.startsWith("Error") ? (
                <span className="error-message">
                  <FiXCircle /> {message}
                </span>
              ) : (
                <span className="success-message">
                  <FiCheckCircle /> {message}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Converter;

