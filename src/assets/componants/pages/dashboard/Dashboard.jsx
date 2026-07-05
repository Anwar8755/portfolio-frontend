import React, { useEffect, useState, createContext } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import API from "../../../../services/api";
import "./dashboard.css";
import {
  FaCode, FaFolderOpen, FaEnvelope, FaFileAlt,
  FaSignOutAlt, FaTachometerAlt, FaCircle
} from "react-icons/fa";

export const DashboardContext = createContext();

const NAV_ITEMS = [
  { to: "/admin-dashboard",           label: "Overview",  icon: <FaTachometerAlt />, exact: true  },
  { to: "/admin-dashboard/skills",    label: "Skills",    icon: <FaCode />                        },
  { to: "/admin-dashboard/projects",  label: "Projects",  icon: <FaFolderOpen />                  },
  { to: "/admin-dashboard/messages",  label: "Messages",  icon: <FaEnvelope />                    },
  { to: "/admin-dashboard/resume",    label: "Resume",    icon: <FaFileAlt />                     },
];

export default function Dashboard() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [counts, setCounts] = useState({ skills: 0, projects: 0, messages: 0, resume: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const fetchCounts = async () => {
    try {
      const [skillRes, projectRes, contactRes, resumeRes] = await Promise.all([
        API.get("/skills"),
        API.get("/projects"),
        API.get("/contacts"),
        API.get("/resume"),
      ]);
      setCounts({
        skills:   skillRes.data.length,
        projects: projectRes.data.length,
        messages: contactRes.data.length,
        resume:   resumeRes.data ? 1 : 0,
      });
    } catch (err) {
      console.error("Count fetch error", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => { fetchCounts(); }, [location.pathname]);

  const isOverview = location.pathname === "/admin-dashboard";

  const STAT_CARDS = [
    { label: "Total Skills",   value: counts.skills,   icon: <FaCode />,        accent: "cyan"   },
    { label: "Total Projects", value: counts.projects, icon: <FaFolderOpen />,  accent: "purple" },
    { label: "Total Messages", value: counts.messages, icon: <FaEnvelope />,    accent: "green"  },
    { label: "Resume",         value: counts.resume,   icon: <FaFileAlt />,     accent: "yellow" },
  ];

  return (
    <DashboardContext.Provider value={{ refetchCounts: fetchCounts }}>
      <div className={`dash-shell ${sidebarOpen ? "dash-shell--open" : ""}`}>

        {/* ── MOBILE OVERLAY ── */}
        {sidebarOpen && (
          <div className="dash-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ══════════ SIDEBAR ══════════ */}
        <aside className="dash-sidebar sidebar">
          <div className="dash-sidebar__head">
            <div className="dash-logo">
              <span className="dash-logo__dots">
                <span /><span /><span />
              </span>
              <span className="dash-logo__text">Portfolio<span className="dash-logo__accent">Admin</span></span>
            </div>
            <button
              className="dash-sidebar__close"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            >✕</button>
          </div>

          <div className="dash-sidebar__section">
            <span className="dash-sidebar__label">// navigation</span>
            <ul className="dash-nav sidebar-menu">
              {NAV_ITEMS.map((item) => {
                const active = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to) && !item.exact
                    ? location.pathname === item.to || location.pathname.startsWith(item.to + "/")
                    : false;
                const isActive = item.exact
                  ? location.pathname === item.to
                  : location.pathname.startsWith(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={`dash-nav__item ${isActive ? "dash-nav__item--active" : ""}`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <span className="dash-nav__icon">{item.icon}</span>
                      <span className="dash-nav__label">{item.label}</span>
                      {isActive && <span className="dash-nav__pip" />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="dash-sidebar__footer">
            <div className="dash-sidebar__user">
              <span className="dash-user__avatar">AA</span>
              <div className="dash-user__info">
                <span className="dash-user__name">Anwar Ali</span>
                <span className="dash-user__role">Administrator</span>
              </div>
            </div>
            
            <button onClick={handleLogout} className="dash-logout logout-btn">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* ══════════ MAIN ══════════ */}
        <div className="dash-main dashboard-main">

          {/* topbar */}
          <header className="dash-topbar">
            <button
              className="dash-topbar__burger"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              <span /><span /><span />
            </button>
            <div className="dash-topbar__breadcrumb">
              <span className="dash-topbar__root">admin-dashboard</span>
              {!isOverview && (
                <>
                  <span className="dash-topbar__sep">/</span>
                  <span className="dash-topbar__page">
                    {location.pathname.split("/").pop()}
                  </span>
                </>
              )}
            </div>
            <div className="dash-topbar__right">
              <span className="dash-topbar__status">
                <FaCircle className="status-dot" />
                Live
              </span>
            </div>
          </header>

          {/* content */}
          <div className="dash-content">
            {isOverview ? (
              <>
                <div className="dash-page-head">
                  <div>
                    <p className="dash-page-eyebrow">// dashboard</p>
                    <h2 className="dash-page-title">Overview</h2>
                  </div>
                  <span className="dash-page-badge">
                    All systems operational
                  </span>
                </div>

                
                <div className="dash-stats dashboard-cards">
                  {STAT_CARDS.map((s) => (
                    <div className={`dash-stat card dash-stat--${s.accent}`} key={s.label}>
                      <div className="dash-stat__icon">{s.icon}</div>
                      <div className="dash-stat__body">
                        <span className="dash-stat__label">{s.label}</span>
                        <span className="dash-stat__value">{s.value}</span>
                      </div>
                      <div className="dash-stat__bar" />
                    </div>
                  ))}
                </div>

                {/* quick-nav grid */}
                <div className="dash-quick-head">
                  <p className="dash-page-eyebrow">// quick access</p>
                  <h3 className="dash-quick-title">Manage Content</h3>
                </div>
                <div className="dash-quick">
                  {NAV_ITEMS.filter(n => !n.exact).map((item) => (
                    <Link to={item.to} className="dash-quick__item" key={item.to}>
                      <span className="dash-quick__icon">{item.icon}</span>
                      <span className="dash-quick__label">{item.label}</span>
                      <span className="dash-quick__arrow">→</span>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <Outlet />
            )}
          </div>
        </div>

      </div>
    </DashboardContext.Provider>
  );
}