import React, { useState, useEffect } from "react";
import { gsap } from "gsap";
import { NavLink, useNavigate } from "react-router-dom";
import "./portfolio.css";
import logo from "./images/logo.png";

export default function Portfolio() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    gsap.from(".list li", {
      opacity: 0.5,
      y: -20,
      duration: 0.1,
      ease: "power3.out",
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // check login state
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <>
      <nav className={`ide-nav ${scrolled ? "scrolled" : ""}`}>
        <div className="ide-titlebar">
          <span className="dot dot-red"></span>
          <span className="dot dot-yellow"></span>
          <span className="dot dot-green"></span>
          <div className="logo">
            <img src={logo} alt="Logo" />
          </div>
        </div>

        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        <div className={`list ${menuOpen ? "active" : ""}`}>
  <ul>
    <li><NavLink to="/" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>Home</NavLink></li>
    <li><NavLink to="/project" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>Projects</NavLink></li>
    <li><NavLink to="/skills" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>Technologies</NavLink></li>
    <li><NavLink to="/resume" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>Resume</NavLink></li>
    <li><NavLink to="/contact" className={({ isActive }) => (isActive ? "active" : "")} onClick={() => setMenuOpen(false)}>Hire Me</NavLink></li>
  </ul>
</div>
      </nav>
      <hr className="ide-divider" />
    </>
  );
}