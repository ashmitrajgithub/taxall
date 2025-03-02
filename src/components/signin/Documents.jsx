import { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, CircularProgress, IconButton } from "@mui/material";
import { Delete, CloudDownload } from "@mui/icons-material";
import axios from "axios";

export default function Documents() {
    const [documents, setDocuments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = () => {
        axios.get("http://localhost:9090/documents/list", { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                setDocuments(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to fetch documents.");
                setLoading(false);
            });
    };

    const handleDelete = (documentId) => {
        axios.delete(`http://localhost:9090/documents/delete?userId=${userId}&type=DOCUMENT`, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                alert("Document deleted successfully!");
                fetchDocuments();
            })
            .catch(() => alert("Failed to delete document."));
    };

    const handleDownload = (documentId, documentName) => {
        axios.get(`http://localhost:9090/documents/download/${documentId}`, { headers: { Authorization: `Bearer ${token}` }, responseType: "blob" })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const a = document.createElement("a");
                a.href = url;
                a.download = documentName;
                document.body.appendChild(a);
                a.click();
                window.URL.revokeObjectURL(url);
            })
            .catch(() => alert("Failed to download document."));
    };

    const handleUpload = () => {
        if (!file) return;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("userId", userId);
        formData.append("documentName", file.name);
        formData.append("type", "DOCUMENT");
        axios.post("http://localhost:9090/documents/upload", formData, { headers: { Authorization: `Bearer ${token}` } })
            .then(() => {
                alert("File uploaded successfully!");
                fetchDocuments();
            })
            .catch(() => alert("Failed to upload file."));
    };

    if (loading) return <CircularProgress style={{ display: "block", margin: "auto" }} />;
    if (error) return <Typography color="error" align="center">{error}</Typography>;

    return (
        <Card style={{ maxWidth: "800px", margin: "auto", padding: "16px", borderRadius: "8px" }}>
            <CardContent>
                <Typography variant="h5" gutterBottom>Documents</Typography>
                <input type="file" onChange={(e) => setFile(e.target.files[0])} />
                <Button variant="contained" color="primary" onClick={handleUpload} style={{ marginTop: "10px" }}>Upload Document</Button>
                <TableContainer component={Paper} style={{ marginTop: "20px" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Size</strong></TableCell>
                                <TableCell><strong>Type</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow key={doc.id}>
                                    <TableCell>{doc.documentName}</TableCell>
                                    <TableCell>{(doc.size / 1024).toFixed(2)} KB</TableCell>
                                    <TableCell>{doc.documentType}</TableCell>
                                    <TableCell>
                                        <IconButton onClick={() => handleDownload(doc.id, doc.documentName)} color="primary">
                                            <CloudDownload />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(doc.id)} color="secondary">
                                            <Delete />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    );
}