import React, { useState, useEffect } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import { jsPDF } from "jspdf";
import { FaFilePdf, FaFileImage, FaFileWord, FaFileAlt } from "react-icons/fa";
import AOS from "aos";
import "aos/dist/aos.css";
import "./Conversion.css";

const SECRET_KEY = "secret_e8H2rPx2EGZ3KMhG";

// Helper: Convert base64 string to Blob
const base64ToBlob = (base64, mime) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  return new Blob([new Uint8Array(byteNumbers)], { type: mime });
};

// Dummy JPG base64 (for testing purposes)
const dummyJpgBase64 =
  "/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxISEhUTEhIVFhUXFRUVFhUVFRUVFRUWFxUXFhUVFRUYHSggGBolGxUVITEhJSkrLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGi0lHyUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIAJ8BPgMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAAAQIDBAUGBwj/xABCEAACAQMCAwYDBgUEBgIDAAABAgMABBESIQUTMQZBUWEHInGBkRRCscHR8BQjM1Lh8SNSY3KCksLS4f/EABkBAAMBAQEAAAAAAAAAAAAAAAABAgMEBf/EACMRAAICAgICAgMAAAAAAAAAAAABAhEDIRIxQVFhExQi/2oADAMBAAIRAxEAPwD9AN//2Q==";

// File Extension Mapper
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

// Determine accepted file types for conversion
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

// Preserve original file name (change extension)
const getConvertedFilename = (originalName, conversionType) => {
  const dotIndex = originalName.lastIndexOf(".");
  const baseName =
    dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
  return `${baseName}.${getExtension(conversionType)}`;
};

// Extract file URL from API response
const getFileUrlFromResponse = (fileObj, conversionType) => {
  if (fileObj.File) return fileObj.File;
  if (fileObj.Url) return fileObj.Url;
  if (fileObj.FileData) {
    let mimeType = "application/octet-stream";
    if (conversionType === "docx-to-pdf" || conversionType === "jpg-to-pdf")
      mimeType = "application/pdf";
    else if (conversionType === "pdf-to-docx")
      mimeType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    else if (
      conversionType === "docx-to-jpg" ||
      conversionType === "pdf-to-jpg"
    )
      mimeType = "image/jpeg";
    const blob = base64ToBlob(fileObj.FileData, mimeType);
    return URL.createObjectURL(blob);
  }
  return "";
};

// Conversion Functions

const convertDocxToPdf = async (file) => {
  const formData = new FormData();
  formData.append("File", file);
  const response = await fetch("https://v2.convertapi.com/convert/docx/to/pdf", {
    method: "POST",
    headers: { Authorization: `Bearer ${SECRET_KEY}` },
    body: formData,
  });
  const data = await response.json();
  console.log("DOCX to PDF response:", data);
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
    headers: { Authorization: `Bearer ${SECRET_KEY}` },
    body: formData,
  });
  const data = await response.json();
  console.log("PDF to DOCX response:", data);
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
    headers: { Authorization: `Bearer ${SECRET_KEY}` },
    body: formData,
  });
  const data = await response.json();
  console.log("DOCX to JPG response:", data);
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
    headers: { Authorization: `Bearer ${SECRET_KEY}` },
    body: formData,
  });
  const data = await response.json();
  console.log("PDF to JPG response:", data);
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
    headers: { Authorization: `Bearer ${SECRET_KEY}` },
    body: formData,
  });
  const data = await response.json();
  console.log("JPG to PDF response:", data);
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

const imageToTextOCR = async (file) => {
  try {
    const result = await Tesseract.recognize(file, "eng+hin", {
      logger: (m) => console.log(m),
    });
    return result.data.text;
  } catch (error) {
    console.error("Tesseract OCR error:", error);
    throw error;
  }
};

const convertFileToText = async (file) => {
  const fileName = file.name.toLowerCase();
  if (fileName.endsWith(".pdf")) {
    try {
      const jpgUrl = await convertPdfToJpg(file);
      const result = await Tesseract.recognize(jpgUrl, "eng+hin", {
        logger: (m) => console.log(m),
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

// -----------------------
// UI Components
// -----------------------

const ModalPopup = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

const ProgressBar = ({ progress }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar" style={{ width: `${progress}%` }}>
        {progress}%
      </div>
    </div>
  );
};

const ConversionCard = ({ conversionType, label, description, icon, onClick }) => {
  return (
    <div className="conversion-card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <h3 className="card-title">{label}</h3>
      <p className="card-description">{description}</p>
    </div>
  );
};

const Conversion = () => {
  useEffect(() => {
    // Initialize AOS only for larger screens
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

  const simulateProgress = (setProgress, callback) => {
    setProgress(0);
    const duration = 3000;
    const interval = 30;
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += interval;
      const percent = Math.min(Math.round((elapsed / duration) * 100), 100);
      setProgress(percent);
      if (percent === 100) {
        clearInterval(timer);
        callback();
      }
    }, interval);
  };

  const openConversionModal = (convType) => {
    setSelectedConversion(convType);
    setFileInput(null);
    setConvertedFileUrl("");
    setFileProgress(0);
    setIsFileModalOpen(true);
  };

  const handleFileConversion = async () => {
    if (!fileInput) {
      alert("Please select a file.");
      return;
    }
    setFileConverting(true);
    simulateProgress(setFileProgress, async () => {
      try {
        const resultUrl = await convertFile(fileInput, selectedConversion);
        setConvertedFileUrl(resultUrl);
        const filename = getConvertedFilename(fileInput.name, selectedConversion);
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
    });
  };

  const handleConvertToText = async () => {
    if (!textFile) {
      alert("Please select a file for text conversion.");
      return;
    }
    setTextConverting(true);
    simulateProgress(setTextProgress, async () => {
      try {
        const text = await convertFileToText(textFile);
        setConvertedText(text);
      } catch (error) {
        console.error("Text conversion failed:", error);
        alert("Conversion to text failed: " + error.message);
      }
      setTextConverting(false);
    });
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
      description: "Convert your DOCX files into professional PDF documents.",
      icon: <FaFilePdf size={40} />,
    },
    {
      type: "pdf-to-docx",
      label: "PDF to DOCX",
      description: "Easily transform PDF files into editable DOCX format.",
      icon: <FaFileWord size={40} />,
    },
    {
      type: "docx-to-jpg",
      label: "DOCX to JPG",
      description: "Generate high-quality JPG images from your DOCX files.",
      icon: <FaFileImage size={40} />,
    },
    {
      type: "pdf-to-jpg",
      label: "PDF to JPG",
      description: "Extract images by converting PDF pages to JPG format.",
      icon: <FaFileAlt size={40} />,
    },
    {
      type: "jpg-to-pdf",
      label: "JPG to PDF",
      description: "Merge your JPG images into a single PDF document.",
      icon: <FaFilePdf size={40} />,
    },
  ];

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
      >
        <h2>
          {conversionCards.find((c) => c.type === selectedConversion)?.label}
        </h2>
        <div className="modal-tab">
          <label className="file-label">
            <span className="file-icon">
              <FaFileAlt size={30} />
            </span>
            <input
              type="file"
              accept={getAcceptForConversion(selectedConversion)}
              onChange={(e) => setFileInput(e.target.files[0])}
              style={{ display: "none" }}
            />
            <span className="choose-file-button">Choose File</span>
          </label>
          {fileInput && <p>Selected File: {fileInput.name}</p>}
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
        </div>
      </ModalPopup>

      {/* Text Converter Section */}
      <div className="text-converter-section">
        <h1 className="section-header">Text Converter</h1>
        <section className="text-converter">
          <div className="text-converter-inner">
            <label className="file-label">
              <span className="file-icon">
                <FaFileAlt size={30} />
              </span>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"
                onChange={(e) => setTextFile(e.target.files[0])}
                style={{ display: "none" }}
              />
              <span className="choose-file-button">Choose File</span>
            </label>
            {textFile && (
              <p className="selected-file">Selected File: {textFile.name}</p>
            )}
            <button onClick={handleConvertToText} disabled={textConverting}>
              Convert Now
            </button>
            {textConverting && <ProgressBar progress={textProgress} />}
            {convertedText && (
              <div className="text-result">
                <h3>Extracted Text:</h3>
                <textarea value={convertedText} readOnly rows="8" />
                <div className="download-options">
                  <button onClick={handleDownloadText}>Download as .txt</button>
                  <button onClick={handleDownloadTextAsPDF}>
                    Download as PDF
                  </button>
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
