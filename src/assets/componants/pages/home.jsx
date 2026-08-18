import React, { useEffect, useState } from "react";
import axios from "axios";
import { gsap } from "gsap";
import API from "../../../services/api";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./home.css";
import {
  FaGithub, FaLinkedin, FaArrowRight, FaExternalLinkAlt,
} from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const [projects, setProjects] = useState([]);
  const [skills, setSkills]     = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => { fetchSkills();   }, []);
  useEffect(() => { fetchProjects(); }, []);

  const fetchSkills = async () => {
    try { const res = await API.get("/skills"); setSkills(Array.isArray(res.data) ? res.data : []); }
    catch (err) { console.error("Error fetching skills:", err); }
  };

  const fetchProjects = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/projects`);
      setProjects(Array.isArray(res.data) ? res.data.slice(0, 4) : []);
    } catch (err) { console.error("Error fetching projects:", err); }
  };

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      /* hero entrance */
      gsap.timeline({ defaults: { ease: "power4.out" } })
        .from(".hero-label",    { opacity: 0, y: -12, duration: 0.5 })
        .from(".hero-left h1 .line", { opacity: 0, y: 40, duration: 0.7, stagger: 0.1 }, "-=0.2")
        .from(".hero-sub",      { opacity: 0, y: 16, duration: 0.55 }, "-=0.35")
        .from(".hero-actions > *", { opacity: 0, y: 14, duration: 0.45, stagger: 0.1 }, "-=0.3")
        .from(".hero-socials a", { opacity: 0, scale: 0.7, duration: 0.4, stagger: 0.08 }, "-=0.2")
        .from(".code-card",     { opacity: 0, x: 50, duration: 0.8 }, "-=0.7")
        .from(".code-card .code-row", { opacity: 0, x: -8, duration: 0.3, stagger: 0.07 }, "-=0.35");

      /* scroll reveals */
      gsap.utils.toArray(".sr").forEach((el) => {
        gsap.from(el, {
          opacity: 0, y: 52, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", toggleActions: "play none none none" },
        });
      });

      /* staggered children */
      gsap.utils.toArray(".sr-stagger").forEach((parent) => {
        gsap.from(parent.children, {
          opacity: 0, y: 32, duration: 0.65, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: parent, start: "top 88%", toggleActions: "play none none none" },
        });
      });

      /* count-up */
      gsap.utils.toArray("[data-count]").forEach((el) => {
        const target = parseFloat(el.getAttribute("data-count"));
        const suffix = el.getAttribute("data-suffix") || "";
        const obj = { v: 0 };
        ScrollTrigger.create({
          trigger: el, start: "top 90%", once: true,
          onEnter: () => gsap.to(obj, {
            v: target, duration: 1.4, ease: "power2.out",
            onUpdate: () => { el.textContent = Math.floor(obj.v) + suffix; },
          }),
        });
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="home">

      {/* ── NOISE TEXTURE LAYER ── */}
      <div className="home-noise" aria-hidden="true" />

      {/* ═══════════ HERO ═══════════ */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-grid" aria-hidden="true" />

        <div className="container hero-inner">

          {/* LEFT */}
          <div className="hero-left">

            <div className="hero-label">
              <span className="label-dot" />
              <span className="label-mono">$ whoami</span>
              <span className="label-tag">Open to work</span>
            </div>

            <h1>
              <span className="line">Building</span>
              <span className="line line--accent">scalable</span>
              <span className="line">digital products.</span>
            </h1>

            <p className="hero-sub">
              Full-stack MERN developer crafting high-performance
              web apps with clean architecture and thoughtful UX.
            </p>

            <div className="hero-actions">
              <a href="/project" className="btn-primary">
                View Projects <FaArrowRight className="btn-icon" />
              </a>
              <a href="/contact" className="btn-ghost">
                Hire Me
              </a>
            </div>

            <div className="hero-socials">
              <a href="https://github.com/Anwar8755" target="_blank" rel="noreferrer" aria-label="GitHub">
                <FaGithub />
              </a>
              <a href="https://linkedin.com/in/anwar-ali-516b861b7" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                <FaLinkedin />
              </a>
              <span className="social-line" />
              <span className="social-text">anwarali812632@gmail.com</span>
            </div>

          </div>

          {/* RIGHT — code card */}
          <div className="hero-right">
            <div className="code-card">
              <div className="code-card__bar">
                <span /><span /><span />
                <span className="code-card__file">developer.js</span>
                <span className="code-card__lang">JavaScript</span>
              </div>
              <div className="code-card__body">
                <div className="code-row"><span className="ln">1</span><span className="kw">const</span> <span className="fn">developer</span> <span className="op">=</span> <span className="br">{"{"}</span></div>
                <div className="code-row"><span className="ln">2</span><span className="key">  name</span><span className="op">:</span> <span className="str">"Anwar Ali"</span><span className="op">,</span></div>
                <div className="code-row"><span className="ln">3</span><span className="key">  role</span><span className="op">:</span> <span className="str">"Full Stack Dev"</span><span className="op">,</span></div>
                <div className="code-row"><span className="ln">4</span><span className="key">  stack</span><span className="op">:</span> <span className="str">"MERN"</span><span className="op">,</span></div>
                <div className="code-row"><span className="ln">5</span><span className="key">  focus</span><span className="op">:</span> <span className="str">"Web Apps"</span><span className="op">,</span></div>
                <div className="code-row"><span className="ln">6</span><span className="key">  status</span><span className="op">:</span> <span className="str available">"available"</span><span className="op">,</span></div>
                <div className="code-row"><span className="ln">7</span><span className="br">{"}"}</span><span className="cursor" aria-hidden="true" /></div>
              </div>
              <div className="code-card__footer">
                <span className="footer-dot footer-dot--green" />
                <span>No issues · 7 lines</span>
                <span className="footer-branch">main</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ═══════════ STATS ═══════════ */}
      <section className="stats-strip">
        <div className="container stats-inner sr-stagger">
          <div className="stat">
            <span className="stat__num" data-count="10" data-suffix="+">10+</span>
            <span className="stat__lbl">Projects Shipped</span>
          </div>
          <div className="stat-sep" aria-hidden="true" />
          <div className="stat">
            <span className="stat__num" data-count="2" data-suffix="+">3+</span>
            <span className="stat__lbl">Years of Learning</span>
          </div>
          <div className="stat-sep" aria-hidden="true" />
          <div className="stat">
            <span className="stat__num stat__num--alt">MERN</span>
            <span className="stat__lbl">Core Stack</span>
          </div>
          <div className="stat-sep" aria-hidden="true" />
          <div className="stat">
            <span className="stat__num stat__num--alt">REST</span>
            <span className="stat__lbl">API Architecture</span>
          </div>
        </div>
      </section>

      {/* ═══════════ PROJECTS ═══════════ */}
      <section className="section projects-section">
        <div className="container">

          <div className="sec-head sr">
            <div className="sec-head__left">
              <span className="sec-eyebrow">Featured work</span>
              <h2>Selected Projects</h2>
            </div>
            <a href="/project" className="sec-head__link">
              All projects <FaArrowRight />
            </a>
          </div>

          <div className="proj-grid sr-stagger">
            {projects.map((project, i) => (
              <article className="proj-card" key={project._id}>

                <div className="proj-card__img">
                  <img src={project.image} alt={project.title} />
                  <div className="proj-card__img-overlay" />
                  <span className="proj-card__num">0{i + 1}</span>
                </div>

                <div className="proj-card__body">
                  <div className="proj-card__top">
                    <span className="proj-card__tag">Featured</span>
                    <div className="proj-card__links">
                      <a href={project.link} target="_blank" rel="noreferrer" aria-label="Live">
                        <FaExternalLinkAlt />
                      </a>
                      {project.github && (
                        <a href={project.github} target="_blank" rel="noreferrer" aria-label="GitHub">
                          <FaGithub />
                        </a>
                      )}
                    </div>
                  </div>

                  <h3 className="proj-card__title">{project.title}</h3>

                  {project.description && (
                    <p className="proj-card__desc">{project.description}</p>
                  )}

                  {project.techStack?.length > 0 && (
                    <div className="proj-card__pills">
                      {project.techStack.slice(0, 4).map((t, j) => (
                        <span key={j}>{t}</span>
                      ))}
                    </div>
                  )}
                </div>

              </article>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════ SKILLS ═══════════ */}
      <section className="section skills-section">
        <div className="container">

          <div className="sec-head sec-head--center sr">
            <span className="sec-eyebrow">Tech stack</span>
            <h2>Tools I Build With</h2>
            <p className="sec-sub">Technologies I reach for when building production-grade apps.</p>
          </div>

          <div className="skills-grid sr-stagger">
            {skills.map((tech, i) => (
              <div
                key={i}
                className="skill-chip"
                style={{
                  backgroundColor: tech.color  || "#1c2333",
                  color:           tech.textColor || "#ffffff",
                }}
              >
                <span className="skill-chip__icon">
                  <img src={tech.icon} alt={tech.name} className="skill-chip__img" />
                </span>
                <span className="skill-chip__name">{tech.name}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-box sr">
            <div className="cta-box__glow" aria-hidden="true" />
            <div className="cta-box__corner cta-box__corner--tl" aria-hidden="true" />
            <div className="cta-box__corner cta-box__corner--tr" aria-hidden="true" />
            <div className="cta-box__corner cta-box__corner--bl" aria-hidden="true" />
            <div className="cta-box__corner cta-box__corner--br" aria-hidden="true" />

            <span className="cta-eyebrow">// open to opportunities</span>
            <h2 className="cta-title">
              Let's build something<br />
              <em>exceptional</em> together.
            </h2>
            <p className="cta-sub">Have a project in mind? I'd love to hear about it.</p>
            <a href="/contact" className="btn-primary btn-primary--lg">
              Start a Conversation <FaArrowRight className="btn-icon" />
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}