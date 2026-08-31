import React, { useEffect, useState, useRef } from "react";
import API from "../../../services/api";
import "./skill.css";
import {
  PieChart, Pie, Cell, Tooltip as RTooltip, ResponsiveContainer,
} from "recharts";

const CATEGORY_ORDER = ["Frontend", "Backend", "Database", "Tools"];

const ACCENT = {
  Frontend: "#56d4dd",
  Backend:  "#3fb950",
  Database: "#bc8cff",
  Tools:    "#d29922",
};

const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="sk-donut-tip">
      <span className="sk-donut-tip__dot" style={{ background: d.fill }} />
      <span className="sk-donut-tip__name">{d.name}</span>
      <span className="sk-donut-tip__val">{d.value} skills</span>
    </div>
  );
};

export default function Technologies() {
  const [skills,      setSkills]      = useState([]);
  const [loading,      setLoading]     = useState(true);
  const [hoveredSkill, setHoveredSkill] = useState(null);
  const [pinnedSkill,  setPinnedSkill]  = useState(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const res = await API.get("/skills");
        setSkills(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching skills:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSkills();
  }, []);

  const grouped = CATEGORY_ORDER.reduce((acc, cat) => {
    const items = skills.filter((s) => (s.category || "Frontend") === cat);
    if (items.length > 0) acc.push({ category: cat, items });
    return acc;
  }, []);

  const donutData = grouped.map((g) => ({
    name:  g.category,
    value: g.items.length,
    fill:  ACCENT[g.category],
  }));

  const activeSkill = pinnedSkill || hoveredSkill;

  const handleCardEnter = (skill) => {
    clearTimeout(closeTimer.current);
    if (!pinnedSkill) setHoveredSkill(skill);
  };

  const handleCardLeave = () => {
    if (!pinnedSkill) {
      closeTimer.current = setTimeout(() => setHoveredSkill(null), 120);
    }
  };

  const handleCardClick = (skill) => {
    if (pinnedSkill?._id === skill._id) {
      setPinnedSkill(null);
    } else {
      setPinnedSkill(skill);
      setHoveredSkill(null);
    }
  };

  const closePopup = () => {
    setPinnedSkill(null);
    setHoveredSkill(null);
  };

  return (
    <div className="sk-page">
      <div className="sk-page__noise" aria-hidden="true" />

      <div className="sk-header">
        <p className="sk-eyebrow">// tech-stack.json</p>
        <h1 className="sk-title">Skills & Technologies</h1>
        <p className="sk-subtitle">
          Tools and technologies I use to build fast, scalable, and clean web applications.
        </p>
      </div>

      {loading ? (
        <div className="sk-loading">
          <span className="sk-spinner" />
          Loading skills...
        </div>
      ) : skills.length === 0 ? (
        <div className="sk-empty">
          <p>// no skills added yet</p>
        </div>
      ) : (
        <>
          {/* ── BIG DONUT ── */}
          <div className="sk-donut-card">
            <div className="sk-donut-chart">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={donutData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%" cy="50%"
                    innerRadius={70} outerRadius={105}
                    paddingAngle={3}
                    strokeWidth={0}
                  >
                    {donutData.map((d, i) => (
                      <Cell key={i} fill={d.fill} opacity={0.9} />
                    ))}
                  </Pie>
                  <RTooltip content={<DonutTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="sk-donut-center">
                <span className="sk-donut-center__num">{skills.length}</span>
                <span className="sk-donut-center__label">Total Skills</span>
              </div>
            </div>

            <div className="sk-donut-legend">
              {donutData.map((d) => (
                <div key={d.name} className="sk-donut-legend__item">
                  <span className="sk-donut-legend__dot" style={{ background: d.fill }} />
                  <span className="sk-donut-legend__name">{d.name}</span>
                  <span className="sk-donut-legend__count">{d.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── CATEGORY SECTIONS ── */}
          <div className="sk-groups">
            {grouped.map(({ category, items }) => (
              <section key={category} className="sk-group">
                <div className="sk-group__head">
                  <span className="sk-group__dot" style={{ background: ACCENT[category] }} />
                  <h2 className="sk-group__title">{category}</h2>
                  <span className="sk-group__count">{items.length}</span>
                </div>

                <div className="sk-mini-grid">
                  {items.map((skill) => (
                    <div
                      key={skill._id}
                      className={`sk-mini ${pinnedSkill?._id === skill._id ? "sk-mini--pinned" : ""}`}
                      onMouseEnter={() => handleCardEnter(skill)}
                      onMouseLeave={handleCardLeave}
                      onClick={() => handleCardClick(skill)}
                    >
                      {skill.featured && <span className="sk-mini__star">★</span>}
                      <span className="sk-mini__icon-wrap">
                        <img src={skill.icon} alt={skill.name} className="sk-mini__icon" />
                      </span>
                      <span className="sk-mini__name">{skill.name}</span>
                      <span
                        className="sk-mini__level"
                        style={{ color: ACCENT[category] }}
                      >
                        {skill.level || "Intermediate"}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </>
      )}

      {/* ── DETAIL POPUP ── */}
      {activeSkill && (
        <>
          <div
            className={`sk-popup-backdrop ${pinnedSkill ? "sk-popup-backdrop--visible" : ""}`}
            onClick={closePopup}
          />
          <div
            className="sk-popup"
            onMouseEnter={() => clearTimeout(closeTimer.current)}
            onMouseLeave={handleCardLeave}
          >
            {pinnedSkill && (
              <button className="sk-popup__close" onClick={closePopup}>✕</button>
            )}

            <div className="sk-popup__top">
              <span className="sk-popup__icon-wrap">
                <img src={activeSkill.icon} alt={activeSkill.name} className="sk-popup__icon" />
              </span>
              <div>
                <h3 className="sk-popup__name">{activeSkill.name}</h3>
                <span
                  className="sk-popup__level"
                  style={{ color: ACCENT[activeSkill.category] || "#56d4dd" }}
                >
                  ● {activeSkill.level || "Intermediate"}
                </span>
              </div>
            </div>

            <div className="sk-popup__bar">
              <div className="sk-popup__bar-track">
                <div
                  className="sk-popup__bar-fill"
                  style={{
                    width: `${activeSkill.percentage ?? 50}%`,
                    background: ACCENT[activeSkill.category] || "#56d4dd",
                  }}
                />
              </div>
              <span className="sk-popup__bar-num">{activeSkill.percentage ?? 50}%</span>
            </div>

            <div className="sk-popup__meta">
              <span className="sk-popup__cat">{activeSkill.category}</span>
            </div>

            {activeSkill.description && (
              <p className="sk-popup__desc">{activeSkill.description}</p>
            )}
          </div>
        </>
      )}
    </div>
  );
}