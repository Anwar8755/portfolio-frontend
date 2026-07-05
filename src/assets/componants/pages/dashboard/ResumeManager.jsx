import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import "./resumeManager.css";
import { DashboardContext } from "../dashboard/Dashboard";

const API_BASE_URL = import.meta.env.VITE_API_URL;

export default function ResumeManager() {
  const [resume, setResume] = useState(null);
  const [file, setFile] = useState(null);
  const token = localStorage.getItem("token");
  const { refetchCounts } = useContext(DashboardContext);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/resume`);
      setResume(res.data); 
    } catch (err) {
      console.error("Error fetching resume:", err);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await axios.post(`${API_BASE_URL}/resume`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setFile(null);
      await fetchResume();      
      await refetchCounts();      
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/resume`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setResume(null);
      await refetchCounts();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const getFileName = (url) => {
    if (!url) return "resume.pdf";
    const parts = url.split("/");
    return parts[parts.length - 1] || "resume.pdf";
  };

  return (
    <div className="resume-manager">
      <div className="rm-header">
        <p className="rm-eyebrow">// resume</p>
        <div className="rm-header-row">
          <h2 className="rm-title">Resume Manager</h2>
          <span className={`rm-status-pill ${resume?.fileUrl ? "rm-status-pill--live" : "rm-status-pill--empty"}`}>
            <span className="rm-status-dot" />
            {resume?.fileUrl ? "Live" : "Not uploaded"}
          </span>
        </div>
        <p className="rm-subtitle">Upload the PDF shown on your portfolio's resume page.</p>
      </div>

      <div className="terminal-card rm-upload-card">
        <div className="terminal-titlebar">
          <div className="terminal-dots">
            <span className="dot dot--red" />
            <span className="dot dot--yellow" />
            <span className="dot dot--green" />
          </div>
          <span className="terminal-filename">resume.upload.sh</span>
          <span className="terminal-lang">bash</span>
        </div>

        <div className="rm-upload-body">
          <label className="rm-file-label" htmlFor="resume-file">
            <span className="rm-prompt">$</span> select-file
          </label>

          <div className="rm-file-row">
            <label className="rm-file-picker" htmlFor="resume-file">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 16V4M12 4 7 9M12 4l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              Choose PDF
            </label>
            <input
              id="resume-file"
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="rm-file-input"
            />
            <span className="rm-file-name">
              {file ? file.name : "no file selected"}
            </span>
          </div>

          <button className="rm-upload-btn" onClick={handleUpload} disabled={!file}>
            Upload Resume
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {resume && resume.fileUrl ? (
        <div className="terminal-card rm-preview-card">
          <div className="terminal-titlebar">
            <div className="terminal-dots">
              <span className="dot dot--red" />
              <span className="dot dot--yellow" />
              <span className="dot dot--green" />
            </div>
            <span className="terminal-filename">{getFileName(resume.fileUrl)}</span>
            <span className="terminal-lang">.PDF</span>
          </div>

          <div className="rm-preview-meta">
            <span className="rm-prompt">$</span>
            <span className="rm-wget">wget</span>
            <a href={resume.fileUrl} target="_blank" rel="noreferrer" className="rm-wget-link">
              {getFileName(resume.fileUrl)}
            </a>
            <a href={resume.fileUrl} target="_blank" rel="noreferrer" className="rm-download-btn">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 4v12M12 16l-5-5M12 16l5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M5 20h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
              Download
            </a>
          </div>

          <div className="rm-preview-frame-wrap">
            <iframe
              src={resume.fileUrl}
              title="Resume Preview"
              className="rm-preview-frame"
            />
          </div>

          <div className="rm-preview-footer">
            <span className="rm-footer-status">
              <span className="status-pulse" /> Synced
            </span>
            <button className="rm-delete-btn" onClick={handleDelete}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7h14M10 7V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v2M7 7l1 13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1l1-13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Delete Resume
            </button>
          </div>
        </div>
      ) : (
        <div className="rm-empty">
          <p className="rm-eyebrow">// no resume</p>
          <p>No resume uploaded yet.</p>
        </div>
      )}
    </div>
  );
}