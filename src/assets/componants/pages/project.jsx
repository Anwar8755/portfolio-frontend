import React, { useEffect, useState } from "react";
import "./project.css";
import axios from "axios";
import { motion } from "framer-motion";

export default function Project() {
  const [projects, setProjects] = useState([]);

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
    }
  };

  return (
    <div className="projects-container">
      <h2 className="projects-title">My Projects</h2>
      <div className="projects-grid">
        {projects.map((project, index) => (
          <motion.div
            className="project-card1"
            key={project._id}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
            whileHover={{ scale: 1.05 }}
          >
            <img src={project.image} alt={project.title} className="project-image" />
            <h3 className="project-title">{project.title}</h3>
            <motion.a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="project-link"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Visit Project
            </motion.a>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
