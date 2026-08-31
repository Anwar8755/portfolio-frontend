import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./project.css";
import { FaExternalLinkAlt, FaGithub, FaChevronLeft, FaChevronRight } from "react-icons/fa";

function ImageCarousel({ images, title }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);
  const slides = images?.length ? images : [];

  useEffect(() => {
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length);
    }, 3200);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const goTo = (i, e) => {
    e?.stopPropagation();
    clearInterval(timerRef.current);
    setIndex(i);
  };

  const prev = (e) => goTo((index - 1 + slides.length) % slides.length, e);
  const next = (e) => goTo((index + 1) % slides.length, e);

  if (slides.length === 0) {
    return (
      <div className="proj-carousel proj-carousel--empty">
        <span>// no image</span>
      </div>
    );
  }

  return (
    <div className="proj-carousel">
      {slides.map((src, i) => (
        <img
          key={i}
          src={src}
          alt={`${title} screenshot ${i + 1}`}
          className={`proj-carousel__img ${i === index ? "proj-carousel__img--active" : ""}`}
        />
      ))}

      {slides.length > 1 && (
        <>
          <button className="proj-carousel__nav proj-carousel__nav--prev" onClick={prev} aria-label="Previous image">
            <FaChevronLeft />
          </button>
          <button className="proj-carousel__nav proj-carousel__nav--next" onClick={next} aria-label="Next image">
            <FaChevronRight />
          </button>
          <div className="proj-carousel__dots">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`proj-carousel__dot ${i === index ? "proj-carousel__dot--active" : ""}`}
                onClick={(e) => goTo(i, e)}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function Project() {
  const [projects, setProjects] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`);
      setProjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projects-container">

      <div className="projects-header">
        <h2 className="projects-title">My Projects</h2>
        {!loading && projects.length > 0 && (
          <span className="projects-count">{projects.length} projects built</span>
        )}
      </div>

      {loading ? (
        <div className="projects-loading">
          <span className="projects-spinner" />
          Loading projects...
        </div>
      ) : (
        <div className="projects-grid">
          {projects.map((project, index) => (
            <motion.div
              className="project-card1"
              key={project._id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: index * 0.1, duration: 0.55, ease: "easeOut" }}
              whileHover={{ y: -8 }}
              onClick={() => navigate(`/project/${project._id}`)}
            >
              {project.featured && <span className="proj-featured-tag">★ Featured</span>}

              <ImageCarousel images={project.images} title={project.title} />

              <div className="proj-body">
                <h3 className="project-title">{project.title}</h3>

                {project.description && (
                  <p className="proj-desc">{project.description}</p>
                )}

                {project.techStack?.length > 0 && (
                  <div className="proj-tech-pills">
                    {project.techStack.slice(0, 5).map((t, i) => (
                      <span key={i}>{t}</span>
                    ))}
                    {project.techStack.length > 5 && (
                      <span className="proj-tech-more">+{project.techStack.length - 5}</span>
                    )}
                  </div>
                )}

                <div className="proj-actions">
                  {project.link && (
                    
                      <a href={project.link}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Live Demo <FaExternalLinkAlt />
                    </a>
                  )}
                  {project.github && (
                    
                      <a href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="project-link project-link--github"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <FaGithub /> Code
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

    </div>
  );
}