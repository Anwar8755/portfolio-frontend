// Skill.jsx (Updated to fetch from backend)

import React, { useEffect, useState } from "react";
import API from "../../../services/api";
import './skill.css';

export default function Technologies() {
  const [skills, setSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await API.get("/skills");
        setSkills(res.data);
      } catch (err) {
        console.error("Error fetching skills:", err);
      }
    };

    fetchSkills();
  }, []);

  return (
    <div className="tech-container">
      <h2 className="tech-title"> Tech Stack & Skills</h2>
      <div className="tech-list">
        {skills.map((tech, index) => (
          <div
            key={index}
            className="tech-badge"
            style={{ backgroundColor: tech.color || '#333', color: tech.textColor || "#fff" }}
          >
            <span className="tech-icon">
              <img className="skill-icon" src={tech.icon} alt={tech.name} />
            </span>
            <span className="tech-name">{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
