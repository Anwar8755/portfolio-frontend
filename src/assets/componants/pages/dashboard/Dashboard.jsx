import React, { useEffect, useState, createContext } from "react";
import { useNavigate, Link, Outlet, useLocation } from "react-router-dom";
import API from "../../../../services/api";
import "./dashboard.css";
import {
  PieChart, Pie, Cell, Tooltip as RTooltip, ResponsiveContainer,
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from "recharts";
import {
  FaCode, FaFolderOpen, FaEnvelope, FaFileAlt,
  FaSignOutAlt, FaTachometerAlt, FaChartLine,
  FaCircle, FaRobot, FaBolt, FaUser, FaRoute,
  FaThumbsUp, FaQuoteRight, FaGraduationCap,
} from "react-icons/fa";

export const DashboardContext = createContext();

const NAV_ITEMS = [
  { to: "/admin-dashboard",              label: "Overview",     icon: <FaTachometerAlt />, exact: true },
  { to: "/admin-dashboard/about",        label: "About",        icon: <FaUser />                       },
  { to: "/admin-dashboard/education", label: "Education", icon: <FaGraduationCap /> },
  { to: "/admin-dashboard/skills",       label: "Skills",       icon: <FaCode />                       },
  { to: "/admin-dashboard/projects",     label: "Projects",     icon: <FaFolderOpen />                 },
  { to: "/admin-dashboard/timeline",     label: "Timeline",     icon: <FaRoute />                      },
  { to: "/admin-dashboard/why-work-with-me", label: "Why Me",   icon: <FaThumbsUp />                   },
  { to: "/admin-dashboard/testimonials", label: "Testimonials", icon: <FaQuoteRight />                 },
  { to: "/admin-dashboard/messages",     label: "Messages",     icon: <FaEnvelope />                   },
  { to: "/admin-dashboard/resume",       label: "Resume",       icon: <FaFileAlt />                    },
  { to: "/admin-dashboard/prompt",       label: "AI Prompt",    icon: <FaRobot />                      },
  { to: "/admin-dashboard/availability", label: "Availability", icon: <FaBolt />                       },
];

const PAGE_LABELS = {
  "/":        "Home",
  "/project": "Projects",
  "/skills":  "Technologies",
  "/resume":  "Resume",
  "/contact": "Contact",
};

const C = {
  cyan:   "#56d4dd",
  purple: "#bc8cff",
  green:  "#3fb950",
  yellow: "#d29922",
  red:    "#f85149",
};

function AnimatedNumber({ target, duration = 1200 }) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start     = 0;
    const end     = parseInt(target, 10) || 0;
    if (!end)     { setVal(0); return; }
    const step    = Math.max(Math.ceil(end / (duration / 16)), 1);
    const timer   = setInterval(() => {
      start += step;
      if (start >= end) { setVal(end); clearInterval(timer); }
      else setVal(start);
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <>{val.toLocaleString()}</>;
}

function TimeAgo({ date }) {
  if (!date) return <>Never</>;
  const d = Date.now() - new Date(date).getTime();
  const m = Math.floor(d / 60000);
  const h = Math.floor(d / 3600000);
  const dy = Math.floor(d / 86400000);
  if (m < 1)  return <>Just now</>;
  if (m < 60) return <>{m}m ago</>;
  if (h < 24) return <>{h}h ago</>;
  return <>{dy}d ago</>;
}

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="d-tip">
      <p className="d-tip__label">{label || payload[0]?.name}</p>
      <p className="d-tip__val">{payload[0]?.value?.toLocaleString()}</p>
    </div>
  );
};

function DonutWidget({ label, value, color, icon, max = 20 }) {
  const pct  = max > 0 ? Math.min(Math.round((value / max) * 100), 100) : 0;
  const data = [
    { v: Math.min(value, max) },
    { v: Math.max(max - value, 0) },
  ];
  return (
    <div className={`dw dw--${color}`}>
      <div className="dw__ring">
        <ResponsiveContainer width="100%" height={110}>
          <PieChart>
            <Pie data={data} dataKey="v"
              cx="50%" cy="50%"
              innerRadius={36} outerRadius={50}
              startAngle={90} endAngle={-270}
              strokeWidth={0}
            >
              <Cell fill={C[color]} opacity={0.9} />
              <Cell fill="#1c2333" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="dw__mid">
          <span className="dw__num"><AnimatedNumber target={value} /></span>
          <span className="dw__pct">{pct}%</span>
        </div>
      </div>
      <div className="dw__foot">
        <span className="dw__icon">{icon}</span>
        <span className="dw__label">{label}</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate     = useNavigate();
  const location     = useLocation();
  const [counts,     setCounts]     = useState({ skills: 0, projects: 0, messages: 0, resume: 0 });
  const [analytics,  setAnalytics]  = useState(null);
  const [sidebar,    setSidebar]    = useState(false);

  const fetchCounts = async () => {
    try {
      const [s, p, c, r] = await Promise.all([
        API.get("/skills"),
        API.get("/projects"),
        API.get("/contacts"),
        API.get("/resume"),
      ]);
      setCounts({
        skills:   s.data.length,
        projects: p.data.length,
        messages: c.data.length,
        resume:   r.data ? 1 : 0,
      });
    } catch (e) { console.error("Count error", e); }
  };

  const fetchAnalytics = async () => {
    try {
      const r = await API.get("/analytics");
      setAnalytics(r.data);
    } catch (e) { console.error("Analytics error", e); }
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    fetchCounts();
    fetchAnalytics();
  }, [location.pathname]);

  const isHome = location.pathname === "/admin-dashboard";

  const pieData = [
    { name: "Skills",   value: counts.skills,   color: C.cyan   },
    { name: "Projects", value: counts.projects, color: C.purple },
    { name: "Messages", value: counts.messages, color: C.green  },
  ].filter(d => d.value > 0);

  const barData  = analytics?.pages?.map(p => ({
    name:   PAGE_LABELS[p.page] || p.page,
    visits: p.visits,
  })) || [];

  const areaData = analytics?.pages?.map((p, i) => ({
    name:       PAGE_LABELS[p.page] || p.page,
    cumulative: analytics.pages.slice(0, i + 1).reduce((a, x) => a + x.visits, 0),
  })) || [];

  const currentPage = location.pathname.split("/").pop();

  return (
    <DashboardContext.Provider value={{ refetchCounts: fetchCounts }}>
      <div className={`ds ${sidebar ? "ds--open" : ""}`}>

        {sidebar && <div className="ds-overlay" onClick={() => setSidebar(false)} />}

        {/* ════════════ SIDEBAR ════════════ */}
        <aside className="ds-side">

          {/* brand */}
          <div className="ds-brand">
            <div className="ds-brand__dots">
              <span /><span /><span />
            </div>
            <span className="ds-brand__name">
              Portfolio<span>Admin</span>
            </span>
            <button className="ds-brand__close" onClick={() => setSidebar(false)}>✕</button>
          </div>

          {/* nav */}
          <nav className="ds-nav">
            <p className="ds-nav__label">// navigation</p>
            {NAV_ITEMS.map(item => {
              const active = item.exact
                ? location.pathname === item.to
                : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`ds-nav__link ${active ? "ds-nav__link--on" : ""}`}
                  onClick={() => setSidebar(false)}
                >
                  <span className="ds-nav__icon">{item.icon}</span>
                  <span className="ds-nav__txt">{item.label}</span>
                  {active && <span className="ds-nav__pip" />}
                </Link>
              );
            })}
          </nav>

          {/* user */}
          <div className="ds-user">
            <div className="ds-user__card">
              <span className="ds-user__av">AA</span>
              <div>
                <p className="ds-user__name">Anwar Ali</p>
                <p className="ds-user__role">Administrator</p>
              </div>
            </div>
            <button className="ds-user__logout logout-btn" onClick={logout}>
              <FaSignOutAlt /> Logout
            </button>
          </div>

        </aside>

        {/* ════════════ MAIN ════════════ */}
        <main className="ds-main dashboard-main">

          {/* topbar */}
          <header className="ds-top dash-topbar">
            <button className="ds-top__burger" onClick={() => setSidebar(true)}>
              <span /><span /><span />
            </button>
            <div className="ds-top__crumb">
              <span>admin-dashboard</span>
              {!isHome && <><span className="ds-top__sep">/</span><span className="ds-top__page">{currentPage}</span></>}
            </div>
            <span className="ds-top__live">
              <FaCircle className="ds-top__dot" /> Live
            </span>
          </header>

          {/* content */}
          <div className="ds-body dash-content">
            {isHome ? (
              <>

                {/* ── HEADER ── */}
                <div className="ds-ph">
                  <div>
                    <p className="ds-ph__eye">// overview</p>
                    <h1 className="ds-ph__title">Dashboard</h1>
                  </div>
                  <span className="ds-ph__badge dash-page-badge">
                    All systems operational
                  </span>
                </div>

                {/* ── TOP ROW : donuts + pie ── */}
                <div className="ds-top-row">

                  <div className="ds-donuts">
                    <p className="ds-sec-eye">// portfolio content</p>
                    <div className="ds-donuts__grid">
                      <DonutWidget label="Skills"   value={counts.skills}   color="cyan"   icon={<FaCode />}       max={30} />
                      <DonutWidget label="Projects" value={counts.projects} color="purple" icon={<FaFolderOpen />} max={20} />
                      <DonutWidget label="Messages" value={counts.messages} color="green"  icon={<FaEnvelope />}  max={50} />
                      <DonutWidget label="Resume"   value={counts.resume}   color="yellow" icon={<FaFileAlt />}   max={1}  />
                    </div>
                  </div>

                  <div className="ds-pie-card">
                    <div className="ds-card-head">
                      <p className="ds-card-head__title">Content Split</p>
                      <p className="ds-card-head__sub">Portfolio data breakdown</p>
                    </div>
                    <div className="ds-pie-body">
                      <ResponsiveContainer width="100%" height={180}>
                        <PieChart>
                          <Pie
                            data={pieData} dataKey="value"
                            cx="50%" cy="50%"
                            innerRadius={52} outerRadius={80}
                            paddingAngle={4} strokeWidth={0}
                          >
                            {pieData.map((d, i) => (
                              <Cell key={i} fill={d.color} opacity={0.9} />
                            ))}
                          </Pie>
                          <RTooltip
                            contentStyle={{
                              background: "#0d1117",
                              border: "1px solid #21262d",
                              borderRadius: 8,
                              fontFamily: "JetBrains Mono",
                              fontSize: 12,
                              color: "#e6edf3",
                            }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="ds-pie-legend">
                        {pieData.map((d, i) => (
                          <div key={i} className="ds-pie-legend__row">
                            <span className="ds-pie-legend__dot" style={{ background: d.color }} />
                            <span className="ds-pie-legend__name">{d.name}</span>
                            <span className="ds-pie-legend__val">{d.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                </div>

                {/* ── ANALYTICS STRIP ── */}
                <div className="ds-sec-head">
                  <p className="ds-sec-eye">// visitor analytics</p>
                  <h2 className="ds-sec-title">Traffic Overview</h2>
                </div>

                <div className="ds-av-row">
                  {[
                    { label: "Total Visits",   val: <AnimatedNumber target={analytics?.totalVisits || 0} />, color: "cyan",   icon: <FaChartLine /> },
                    { label: "Pages Tracked",  val: <AnimatedNumber target={analytics?.pages?.length || 0} />, color: "purple", icon: <FaCode /> },
                    { label: "Top Page",       val: analytics?.pages?.[0] ? PAGE_LABELS[analytics.pages[0].page] || analytics.pages[0].page : "N/A", color: "green",  icon: <FaFolderOpen />, sm: true },
                    { label: "Last Visit",     val: <TimeAgo date={analytics?.lastVisit} />, color: "yellow", icon: <FaCircle />, sm: true },
                  ].map((s, i) => (
                    <div key={i} className={`ds-av ds-av--${s.color}`}
                      style={{ animationDelay: `${i * 0.08}s` }}>
                      <div className="ds-av__icon">{s.icon}</div>
                      <div className="ds-av__body">
                        <p className="ds-av__label">{s.label}</p>
                        <p className={`ds-av__val ${s.sm ? "ds-av__val--sm" : ""}`}>{s.val}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* ── CHARTS ── */}
                {barData.length > 0 && (
                  <div className="ds-charts">

                    <div className="ds-chart">
                      <div className="ds-card-head">
                        <p className="ds-card-head__title">Page Visits</p>
                        <p className="ds-card-head__sub">Visits per page</p>
                      </div>
                      <div className="ds-chart__body">
                        <ResponsiveContainer width="100%" height={220}>
                          <BarChart data={barData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#8b949e", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                            <RTooltip content={<ChartTip />} cursor={{ fill: "rgba(86,212,221,0.06)" }} />
                            <Bar dataKey="visits" radius={[6, 6, 0, 0]} maxBarSize={44}>
                              {barData.map((_, i) => (
                                <Cell key={i} fill={Object.values(C)[i % 4]} opacity={0.85} />
                              ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div className="ds-chart">
                      <div className="ds-card-head">
                        <p className="ds-card-head__title">Cumulative Traffic</p>
                        <p className="ds-card-head__sub">Running total across pages</p>
                      </div>
                      <div className="ds-chart__body">
                        <ResponsiveContainer width="100%" height={220}>
                          <AreaChart data={areaData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%"  stopColor="#56d4dd" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#56d4dd" stopOpacity={0}   />
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#21262d" vertical={false} />
                            <XAxis dataKey="name" tick={{ fill: "#8b949e", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                            <YAxis tick={{ fill: "#8b949e", fontSize: 11, fontFamily: "JetBrains Mono" }} axisLine={false} tickLine={false} />
                            <RTooltip content={<ChartTip />} />
                            <Area type="monotone" dataKey="cumulative" stroke="#56d4dd" strokeWidth={2} fill="url(#ag)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>
                )}

                {/* ── QUICK NAV ── */}
                <div className="ds-sec-head">
                  <p className="ds-sec-eye">// quick access</p>
                  <h2 className="ds-sec-title">Manage Content</h2>
                </div>
                <div className="ds-quick">
                  {NAV_ITEMS.filter(n => !n.exact).map(item => (
                    <Link key={item.to} to={item.to} className="ds-quick__card">
                      <span className="ds-quick__icon">{item.icon}</span>
                      <span className="ds-quick__label">{item.label}</span>
                      <span className="ds-quick__arrow">→</span>
                    </Link>
                  ))}
                </div>

              </>
            ) : (
              <Outlet />
            )}
          </div>

        </main>

      </div>
    </DashboardContext.Provider>
  );
}