import React, { useState, useEffect } from "react";
import Tesseract from "tesseract.js";
import { jsPDF } from "jspdf";
import { FaFilePdf, FaFileImage, FaFileWord, FaFileAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Conversion.css";

// ------------------ Helper Functions ------------------

const base64ToBlob = (base64, mime) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mime });
};

const getExtension = (conversionType) => {
  switch (conversionType) {
    case "docx-to-pdf":
      return "pdf";
    case "pdf-to-docx":
      return "docx";
    case "docx-to-jpg":
      return "jpg";
    case "pdf-to-jpg":
      return "zip";
    case "jpg-to-pdf":
      return "pdf";
    default:
      return "file";
  }
};

const getAcceptForConversion = (conversionType) => {
  switch (conversionType) {
    case "docx-to-pdf":
    case "docx-to-jpg":
      return ".docx";
    case "pdf-to-docx":
    case "pdf-to-jpg":
      return ".pdf";
    case "jpg-to-pdf":
      return ".jpg,.jpeg";
    default:
      return "";
  }
};

const getConvertedFilename = (originalName, conversionType) => {
  const dotIndex = originalName.lastIndexOf(".");
  const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  return `${baseName}.${getExtension(conversionType)}`;
};

const getFileUrlFromResponse = (fileObj, conversionType) => {
  console.log("Processing file object:", fileObj);
  if (fileObj.File) return fileObj.File;
  if (fileObj.Url) return fileObj.Url;
  if (fileObj.FileData) {
    let mimeType = "application/octet-stream";
    if (conversionType === "docx-to-pdf" || conversionType === "jpg-to-pdf")
      mimeType = "application/pdf";
    else if (conversionType === "pdf-to-docx")
      mimeType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (conversionType === "docx-to-jpg" || conversionType === "pdf-to-jpg")
      mimeType = "image/jpeg";
    const blob = base64ToBlob(fileObj.FileData, mimeType);
    return URL.createObjectURL(blob);
  }
  return "";
};

// ------------------ Conversion Functions ------------------

const convertDocxToPdf = async (file) => {
  const formData = new FormData();
  formData.append("File", file);
  const response = await fetch("https://v2.convertapi.com/convert/docx/to/pdf", {
    method: "POST",
    headers: { Authorization: `Bearer ${"secret_e8H2rPx2EGZ3KMhG"}` },
    body: formData,
  });
  console.log("DOCX to PDF - Raw response:", response);
  const data = await response.json();
  console.log("DOCX to PDF - JSON response:", data);
  if (data.Files && data.Files.length > 0) {
    const fileObj = data.Files[0];
    const url = getFileUrlFromResponse(fileObj, "docx-to-pdf");
    if (url) return url;
  }
  throw new Error("DOCX to PDF conversion failed");
};

const convertPdfToDocx = async (file) => {
  const formData = new FormData();
  formData.append("File", file);
  const response = await fetch("https://v2.convertapi.com/convert/pdf/to/docx", {
    method: "POST",
    headers: { Authorization: `Bearer ${"secret_e8H2rPx2EGZ3KMhG"}` },
    body: formData,
  });
  console.log("PDF to DOCX - Raw response:", response);
  const data = await response.json();
  console.log("PDF to DOCX - JSON response:", data);
  if (data.Files && data.Files.length > 0) {
    const fileObj = data.Files[0];
    const url = getFileUrlFromResponse(fileObj, "pdf-to-docx");
    if (url) return url;
  }
  throw new Error("PDF to DOCX conversion failed");
};

const convertDocxToJpg = async (file) => {
  const formData = new FormData();
  formData.append("File", file);
  const response = await fetch("https://v2.convertapi.com/convert/docx/to/jpg", {
    method: "POST",
    headers: { Authorization: `Bearer ${"secret_e8H2rPx2EGZ3KMhG"}` },
    body: formData,
  });
  console.log("DOCX to JPG - Raw response:", response);
  const data = await response.json();
  console.log("DOCX to JPG - JSON response:", data);
  if (data.Files && data.Files.length > 0) {
    const fileObj = data.Files[0];
    const url = getFileUrlFromResponse(fileObj, "docx-to-jpg");
    if (url) return url;
  }
  throw new Error("DOCX to JPG conversion failed");
};

const convertPdfToJpg = async (file) => {
  const formData = new FormData();
  formData.append("File", file);
  formData.append("ZipFiles", "true");
  const response = await fetch("https://v2.convertapi.com/convert/pdf/to/jpg", {
    method: "POST",
    headers: { Authorization: `Bearer ${"secret_e8H2rPx2EGZ3KMhG"}` },
    body: formData,
  });
  console.log("PDF to JPG - Raw response:", response);
  const data = await response.json();
  console.log("PDF to JPG - JSON response:", data);
  if (data.Files && data.Files.length > 0) {
    const fileObj = data.Files[0];
    const url = getFileUrlFromResponse(fileObj, "pdf-to-jpg");
    if (url) return url;
  }
  throw new Error("PDF to JPG conversion failed");
};

const convertJpgToPdf = async (file) => {
  const formData = new FormData();
  formData.append("File", file);
  formData.append("StoreFile", "true");
  const response = await fetch("https://v2.convertapi.com/convert/jpg/to/pdf", {
    method: "POST",
    headers: { Authorization: `Bearer ${"secret_e8H2rPx2EGZ3KMhG"}` },
    body: formData,
  });
  console.log("JPG to PDF - Raw response:", response);
  const data = await response.json();
  console.log("JPG to PDF - JSON response:", data);
  if (data.Files && data.Files.length > 0) {
    const fileObj = data.Files[0];
    const url = getFileUrlFromResponse(fileObj, "jpg-to-pdf");
    if (url) return url;
  }
  throw new Error("JPG to PDF conversion failed");
};

const convertFile = async (file, conversionType) => {
  switch (conversionType) {
    case "docx-to-pdf":
      return await convertDocxToPdf(file);
    case "pdf-to-docx":
      return await convertPdfToDocx(file);
    case "docx-to-jpg":
      return await convertDocxToJpg(file);
    case "pdf-to-jpg":
      return await convertPdfToJpg(file);
    case "jpg-to-pdf":
      return await convertJpgToPdf(file);
    default:
      throw new Error("Invalid conversion type");
  }
};

// ------------------ OCR Functions ------------------

const imageToTextOCR = async (file) => {
  try {
    const result = await Tesseract.recognize(file, "eng+hin", {
      logger: (m) => console.log("OCR:", m),
    });
    return result.data.text;
  } catch (error) {
    throw error;
  }
};

const convertFileToText = async (file) => {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".pdf")) {
    try {
      const jpgUrl = await convertPdfToJpg(file);
      const result = await Tesseract.recognize(jpgUrl, "eng+hin", {
        logger: (m) => console.log("OCR:", m),
      });
      return result.data.text;
    } catch (error) {
      throw new Error("PDF to text conversion failed: " + error.message);
    }
  } else {
    return await imageToTextOCR(file);
  }
};

const downloadBlobFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.style.display = "none";
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);
};

const downloadTextFile = (text, filename) => {
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  downloadBlobFile(blob, filename);
};

// ------------------ Reusable Components ------------------

const DropZone = ({ onFileSelect, accept, file, placeholder }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFileSelect(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div
      className={`dropzone ${isDragging ? "dragging" : ""}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept={accept}
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            onFileSelect(e.target.files[0]);
          }
        }}
      />
      {file ? <p>File: {file.name}</p> : <p>{placeholder}</p>}
    </div>
  );
};

const ModalPopup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-cont">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <div className="modal-header">
          <h2>{title}</h2>
        </div>
        {children}
      </div>
    </div>
  );
};

const ProgressBar = ({ progress }) => (
  <div className="progress-container">
    <div className="progress-bar" style={{ width: `${progress}%` }}>
      {progress}%
    </div>
  </div>
);

const ConversionCard = ({ conversionType, label, description, icon, onClick }) => (
  <div className="conversion-card" onClick={onClick}>
    <div className="card-icon">{icon}</div>
    <h3 className="card-title">{label}</h3>
    <p className="card-description">{description}</p>
  </div>
);

// ------------------ Main Conversion Component ------------------

const Conversion = () => {
  useEffect(() => {
    if (window.innerWidth >= 768) {
      AOS.init({ duration: 800, once: true });
    }
  }, []);

  // --- File Converter States ---
  const [selectedConversion, setSelectedConversion] = useState("docx-to-pdf");
  const [isFileModalOpen, setIsFileModalOpen] = useState(false);
  const [fileInput, setFileInput] = useState(null);
  const [convertedFileUrl, setConvertedFileUrl] = useState("");
  const [fileProgress, setFileProgress] = useState(0);
  const [fileConverting, setFileConverting] = useState(false);

  // --- Text Converter States ---
  const [textFile, setTextFile] = useState(null);
  const [convertedText, setConvertedText] = useState("");
  const [textProgress, setTextProgress] = useState(0);
  const [textConverting, setTextConverting] = useState(false);

  // ------------------ Progress Simulation ------------------
  const simulateProgress = (duration, setProgress) => {
    return new Promise((resolve) => {
      const start = Date.now();
      const timer = setInterval(() => {
        const elapsed = Date.now() - start;
        const percent = Math.min(Math.round((elapsed / duration) * 100), 100);
        setProgress(percent);
        if (percent === 100) {
          clearInterval(timer);
          resolve();
        }
      }, 30);
    });
  };

  // ------------------ Conversion Handlers ------------------

  const handleFileConversion = async () => {
    if (!fileInput) {
      alert("Please select a file.");
      return;
    }
    setFileConverting(true);
    setFileProgress(0);
    const minDuration = 3000; // 3 seconds minimum
    try {
      const conversionPromise = convertFile(fileInput, selectedConversion);
      // Wait for both the conversion and simulated progress
      const [resultUrl] = await Promise.all([
        conversionPromise,
        simulateProgress(minDuration, setFileProgress),
      ]);
      setFileProgress(100);
      setConvertedFileUrl(resultUrl);
      const filename = getConvertedFilename(fileInput.name, selectedConversion);
      // Trigger download
      const a = document.createElement("a");
      a.href = resultUrl;
      a.download = filename;
      a.style.display = "none";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error("Conversion error:", err);
      alert("Conversion failed: " + err.message);
    }
    setFileConverting(false);
  };

  const handleConvertToText = async () => {
    if (!textFile) {
      alert("Please select a file for text conversion.");
      return;
    }
    setTextConverting(true);
    setTextProgress(0);
    const minDuration = 3000;
    try {
      const conversionPromise = convertFileToText(textFile);
      const [text] = await Promise.all([
        conversionPromise,
        simulateProgress(minDuration, setTextProgress),
      ]);
      setTextProgress(100);
      setConvertedText(text);
    } catch (error) {
      console.error("Text conversion failed:", error);
      alert("Conversion to text failed: " + error.message);
    }
    setTextConverting(false);
  };

  const handleDownloadText = () => {
    downloadTextFile(convertedText, "extracted_text.txt");
  };

  const handleDownloadTextAsPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(convertedText, 180);
    doc.text(lines, 10, 10);
    doc.save("extracted_text.pdf");
  };

  const conversionCards = [
    {
      type: "docx-to-pdf",
      label: "DOCX to PDF",
      description: "Convert DOCX files into polished, print-ready PDFs.",
      icon: <FaFilePdf size={40} />,
    },
    {
      type: "pdf-to-docx",
      label: "PDF to DOCX",
      description: "Transform your PDFs into editable DOCX documents.",
      icon: <FaFileWord size={40} />,
    },
    {
      type: "docx-to-jpg",
      label: "DOCX to JPG",
      description: "Generate crisp JPG images from DOCX files.",
      icon: <FaFileImage size={40} />,
    },
    {
      type: "pdf-to-jpg",
      label: "PDF to JPG",
      description: "Extract high-quality images from your PDFs.",
      icon: <FaFileAlt size={40} />,
    },
    {
      type: "jpg-to-pdf",
      label: "JPG to PDF",
      description: "Merge JPGs into a single streamlined PDF.",
      icon: <FaFilePdf size={40} />,
    },
  ];

  const openConversionModal = (convType) => {
    setSelectedConversion(convType);
    setFileInput(null);
    setConvertedFileUrl("");
    setFileProgress(0);
    setIsFileModalOpen(true);
  };

  return (
    <div className="conversion-container">
      {/* Conversion Tools Section */}
      <div className="conversion-tools">
        <h1 className="section-header">Conversion Tools</h1>
        <div className="cards-container">
          {conversionCards.map((card, index) => (
            <ConversionCard
              key={index}
              conversionType={card.type}
              label={card.label}
              description={card.description}
              icon={card.icon}
              onClick={() => openConversionModal(card.type)}
            />
          ))}
        </div>
      </div>

      {/* File Converter Modal Popup */}
      <ModalPopup
        isOpen={isFileModalOpen}
        onClose={() => setIsFileModalOpen(false)}
        title={
          conversionCards.find((c) => c.type === selectedConversion)?.label ||
          "File Converter"
        }
      >
        <p className="modal-instruction">
          Choose a file that matches the format requirements below.
        </p>
        <DropZone
          onFileSelect={setFileInput}
          accept={getAcceptForConversion(selectedConversion)}
          file={fileInput}
          placeholder={`Click to upload or drag and drop a ${getAcceptForConversion(
            selectedConversion
          )
            .replace(".", "")
            .toUpperCase()} file`}
        />
        {fileInput && <p className="selected-file">File: {fileInput.name}</p>}
        <button onClick={handleFileConversion} disabled={fileConverting}>
          Convert Now
        </button>
        {fileConverting && <ProgressBar progress={fileProgress} />}
        {convertedFileUrl && (
          <div className="download-container">
            <a
              href={convertedFileUrl}
              download={getConvertedFilename(fileInput.name, selectedConversion)}
            >
              Download Converted File
            </a>
          </div>
        )}
      </ModalPopup>

      {/* Text Converter Section */}
      <div className="text-converter-section">
        <h1 className="section-header">Text Converter</h1>
        <h3>Upload Your File</h3>
        <p className="text-converter-description">
          Our advanced OCR tool quickly converts images, PDFs, and DOC/DOCX files
          into editable text. Upload your file and let our technology extract the
          content for you.
        </p>
        <section className="text-converter">
          <div className="text-converter-inner">
            <DropZone
              onFileSelect={setTextFile}
              accept=".svg,.png,.jpg,.jpeg,.gif"
              file={textFile}
              placeholder="Click to upload or drag and drop SVG, PNG, JPG or GIF (MAX. 800x400px)"
            />
            {textFile && <p className="selected-file">File: {textFile.name}</p>}
            <button onClick={handleConvertToText} disabled={textConverting}>
              Convert Now
            </button>
            {textConverting && <ProgressBar progress={textProgress} />}
            {convertedText && (
              <div className="text-result">
                <h3>Extracted Text</h3>
                <textarea value={convertedText} readOnly rows="8" />
                <div className="download-options">
                  <button onClick={handleDownloadText}>Download as TXT</button>
                  <button onClick={handleDownloadTextAsPDF}>Download as PDF</button>
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Conversion;
