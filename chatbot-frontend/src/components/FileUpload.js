import React, { useState } from 'react';
import axios from 'axios';
import './FileUpload.css'; // Styling for the component

const FileUpload = ({ onUploadSuccess }) => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState("");
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await axios.post('http://localhost:5000/api/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setUploadStatus("File uploaded successfully!");
            onUploadSuccess(); // Activate the chatbot
        } catch (error) {
            setUploadStatus("Error uploading file. Please try again.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        setSelectedFile(file);
    };

    return (
        <div className="file-upload">
            <div 
                className="upload-area" 
                onDrop={handleDrop} 
                onDragOver={(e) => e.preventDefault()}
            >
                <p>Drag & drop your document here, or</p>
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleFileUpload} disabled={!selectedFile || isUploading}>
                    {isUploading ? "Uploading..." : "Upload Document"}
                </button>
            </div>
            {uploadStatus && <p className="upload-status">{uploadStatus}</p>}
        </div>
    );
};

export default FileUpload;
