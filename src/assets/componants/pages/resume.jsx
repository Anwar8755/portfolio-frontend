import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import "./resume.css";
import { FaDownload, FaFileAlt, FaSpinner } from "react-icons/fa";

export default function Resume() {
  const [resumeUrl, setResumeUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getResume = async () => {
      try {
        const res = await API.get("/resume");
        setResumeUrl(res.data.fileUrl);
      } catch (err) {
        console.error("Resume fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    getResume();
  }, []);

  return (
    <div className="resume-page">

      <div className="resume-grid-bg" aria-hidden="true" />
      <div className="resume-glow"    aria-hidden="true" />

      <div className="resume-container">

        <div className="resume-eyebrow">
          <span className="eyebrow-dot" />
          <span className="eyebrow-label">resume.pdf</span>
        </div>

        <h2 className="resume-heading">
          My <span className="heading-accent">Resume</span>
        </h2>

        <p className="resume-subtext">
          A full overview of my skills, experience, and projects.
          <br />
          Download the PDF to get started.
        </p>

        <div className="resume-card">

          <div className="card-topbar">
            <span className="dot dot-red"    />
            <span className="dot dot-yellow" />
            <span className="dot dot-green"  />
            <span className="card-filename">anwar-ali-resume.pdf</span>
          </div>

          <div className="card-body">

            <div className="file-icon-wrap" aria-hidden="true">
              <FaFileAlt className="file-icon" />
              <span className="file-ext">.PDF</span>
            </div>

            <div className="card-info">

              <div className="card-meta-row">
                <span className="meta-item">
                  <span className="meta-key">Type</span>
                  <span className="meta-val">PDF Document</span>
                </span>
                <span className="meta-sep" aria-hidden="true">·</span>
                <span className="meta-item">
                  <span className="meta-key">Author</span>
                  <span className="meta-val">Anwar Ali</span>
                </span>
                <span className="meta-sep" aria-hidden="true">·</span>
                <span className="meta-item">
                  <span className="meta-key">Role</span>
                  <span className="meta-val">MERN Stack Developer</span>
                </span>
              </div>

              <div className="card-terminal">
                <span className="terminal-prompt">$</span>
                <span className="terminal-cmd">
                  wget <span className="terminal-arg">anwar-ali-resume.pdf</span>
                </span>
                <span className="terminal-cursor" aria-hidden="true" />
              </div>

            </div>

          </div>

         
          <div className="card-footer">
            {loading ? (
              <span className="resume-loading">
                <FaSpinner className="spin-icon" />
                Fetching resume…
              </span>
            ) : resumeUrl ? (
              <a href={resumeUrl} download className="download-btn">
                <FaDownload className="dl-icon" />
                Download Resume
              </a>
            ) : (
              <p className="resume-unavailable">No resume available</p>
            )}
          </div>

        </div>

        <div className="resume-stats">
          <div className="stat-item">
            <span className="stat-num">2<span className="stat-plus">+</span></span>
            <span className="stat-label">Years Learning</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-num">10<span className="stat-plus">+</span></span>
            <span className="stat-label">Projects Built</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-num">MERN</span>
            <span className="stat-label">Stack Focus</span>
          </div>
          <div className="stat-divider" aria-hidden="true" />
          <div className="stat-item">
            <span className="stat-num">REST</span>
            <span className="stat-label">API Development</span>
          </div>
        </div>

      </div>
    </div>
  );
}