import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./ProjectDetail.css";
import {
  FaExternalLinkAlt, FaGithub, FaArrowLeft, FaArrowRight,
  FaChevronLeft, FaChevronRight, FaLightbulb, FaCheckCircle,
} from "react-icons/fa";

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  const [project,  setProject]  = useState(null);
  const [allProjects, setAllProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [imgIndex, setImgIndex] = useState(0);

  useEffect(() => {
    fetchProject();
    fetchAllProjects();
    window.scrollTo(0, 0);
  }, [id]);

  const fetchProject = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/projects/${id}`);
      setProject(res.data);
      setImgIndex(0);
    } catch (err) {
      console.error("Error fetching project:", err);
      setProject(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`);
      setAllProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching projects list:", err);
    }
  };

  const images = project?.images?.length ? project.images : [];
  const nextImg = () => setImgIndex((i) => (i + 1) % images.length);
  const prevImg = () => setImgIndex((i) => (i - 1 + images.length) % images.length);

  const currentIndex = allProjects.findIndex((p) => p._id === id);
  const prevProject = currentIndex > 0 ? allProjects[currentIndex - 1] : null;
  const nextProject = currentIndex >= 0 && currentIndex < allProjects.length - 1
    ? allProjects[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="pd-loading">
        <span className="pd-spinner" />
        Loading project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="pd-notfound">
        <p className="pd-notfound__eyebrow">// 404</p>
        <h2>Project not found</h2>
        <Link to="/project" className="pd-btn pd-btn--primary">
          <FaArrowLeft /> Back to Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="pd-page">
      <div className="pd-noise" aria-hidden="true" />

      {/* ── BACK LINK ── */}
      <div className="pd-container pd-top">
        <Link to="/project" className="pd-back">
          <FaArrowLeft /> All Projects
        </Link>
      </div>

      {/* ══════════ HERO ══════════ */}
      <section className="pd-hero pd-container">

        <div className="pd-hero__carousel">
          {images.length > 0 ? (
            <>
              <div className="pd-carousel">
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${project.title} screenshot ${i + 1}`}
                    className={`pd-carousel__img ${i === imgIndex ? "pd-carousel__img--active" : ""}`}
                  />
                ))}
                {images.length > 1 && (
                  <>
                    <button className="pd-carousel__nav pd-carousel__nav--prev" onClick={prevImg} aria-label="Previous">
                      <FaChevronLeft />
                    </button>
                    <button className="pd-carousel__nav pd-carousel__nav--next" onClick={nextImg} aria-label="Next">
                      <FaChevronRight />
                    </button>
                    <div className="pd-carousel__dots">
                      {images.map((_, i) => (
                        <span
                          key={i}
                          className={`pd-carousel__dot ${i === imgIndex ? "pd-carousel__dot--active" : ""}`}
                          onClick={() => setImgIndex(i)}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </>
          ) : (
            <div className="pd-carousel pd-carousel--empty">
              <span>// no images</span>
            </div>
          )}
        </div>

        <div className="pd-hero__info">
          {project.featured && <span className="pd-featured-tag">★ Featured Project</span>}
          {project.category && <span className="pd-category">{project.category}</span>}

          <h1 className="pd-title">{project.title}</h1>

          {project.description && (
            <p className="pd-subtitle">{project.description}</p>
          )}

          <div className="pd-meta-row">
            {project.role && (
              <div className="pd-meta-item">
                <span className="pd-meta-item__label">Role</span>
                <span className="pd-meta-item__val">{project.role}</span>
              </div>
            )}
            {project.duration && (
              <div className="pd-meta-item">
                <span className="pd-meta-item__label">Duration</span>
                <span className="pd-meta-item__val">{project.duration}</span>
              </div>
            )}
          </div>

          <div className="pd-actions">
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="pd-btn pd-btn--primary">
                <FaExternalLinkAlt /> Live Demo
              </a>
            )}
            {project.github && (
              <a href={project.github} target="_blank" rel="noreferrer" className="pd-btn pd-btn--ghost">
                <FaGithub /> View Code
              </a>
            )}
          </div>
        </div>

      </section>

      {/* ══════════ OVERVIEW ══════════ */}
      {project.longDescription && (
        <section className="pd-section pd-container">
          <div className="pd-section__head">
            <span className="pd-section__eyebrow">// overview</span>
            <h2>Project Overview</h2>
          </div>
          <p className="pd-longdesc">{project.longDescription}</p>
        </section>
      )}

      {/* ══════════ TECH STACK ══════════ */}
      {project.techStack?.length > 0 && (
        <section className="pd-section pd-container">
          <div className="pd-section__head">
            <span className="pd-section__eyebrow">// stack</span>
            <h2>Tech Stack</h2>
          </div>
          <div className="pd-tech-grid">
            {project.techStack.map((t, i) => (
              <span key={i} className="pd-tech-chip">{t}</span>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ KEY FEATURES ══════════ */}
      {project.keyFeatures?.length > 0 && (
        <section className="pd-section pd-container">
          <div className="pd-section__head">
            <span className="pd-section__eyebrow">// capabilities</span>
            <h2>Key Features</h2>
          </div>
          <div className="pd-features-grid">
            {project.keyFeatures.map((f, i) => (
              <div key={i} className="pd-feature-card">
                <FaCheckCircle className="pd-feature-card__icon" />
                <span>{f}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ CHALLENGES ══════════ */}
      {project.challenges?.length > 0 && (
        <section className="pd-section pd-container">
          <div className="pd-section__head">
            <span className="pd-section__eyebrow">// problem solving</span>
            <h2>Challenges &amp; Solutions</h2>
          </div>
          <div className="pd-challenges">
            {project.challenges.map((c, i) => (
              <div key={i} className="pd-challenge">
                <div className="pd-challenge__num">{String(i + 1).padStart(2, "0")}</div>
                <div className="pd-challenge__body">
                  <div className="pd-challenge__block">
                    <span className="pd-challenge__label pd-challenge__label--problem">
                      <FaLightbulb /> Problem
                    </span>
                    <p>{c.problem}</p>
                  </div>
                  <div className="pd-challenge__block">
                    <span className="pd-challenge__label pd-challenge__label--solution">
                      <FaCheckCircle /> Solution
                    </span>
                    <p>{c.solution}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ══════════ NEXT / PREV NAV ══════════ */}
      {(prevProject || nextProject) && (
        <section className="pd-nav-section pd-container">
          {prevProject ? (
            <Link to={`/project/${prevProject._id}`} className="pd-nav-card pd-nav-card--prev">
              <span className="pd-nav-card__dir"><FaArrowLeft /> Previous</span>
              <span className="pd-nav-card__title">{prevProject.title}</span>
            </Link>
          ) : <div />}

          {nextProject ? (
            <Link to={`/project/${nextProject._id}`} className="pd-nav-card pd-nav-card--next">
              <span className="pd-nav-card__dir">Next <FaArrowRight /></span>
              <span className="pd-nav-card__title">{nextProject.title}</span>
            </Link>
          ) : <div />}
        </section>
      )}

      {/* ══════════ CTA ══════════ */}
      <section className="pd-cta pd-container">
        <div className="pd-cta__box">
          <span className="pd-cta__eyebrow">// let's build something</span>
          <h2>Interested in a project like this?</h2>
          <p>Let's talk about how I can help bring your idea to life.</p>
          <button className="pd-btn pd-btn--primary pd-btn--lg" onClick={() => navigate("/contact")}>
            Get In Touch <FaArrowRight />
          </button>
        </div>
      </section>

    </div>
  );
}