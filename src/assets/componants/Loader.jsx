import { useEffect, useState } from "react";
import "./Loader.css";

const LINES = [
  { text: "Initializing portfolio...",     delay: 0    },
  { text: "Loading components...",         delay: 600  },
  { text: "Fetching projects...",          delay: 1200 },
  { text: "Loading skills...",             delay: 1800 },
  { text: "Connecting to server...",       delay: 2400 },
  { text: "All systems ready...",          delay: 3000 },
];

function TypeLine({ text, onDone }) {
  const [displayed, setDisplayed] = useState("");
  const [done,      setDone]      = useState(false);

  useEffect(() => {
    let i     = 0;
    const int = setInterval(() => {
      setDisplayed(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(int);
        setDone(true);
        onDone?.();
      }
    }, 28);
    return () => clearInterval(int);
  }, [text]);

  return (
    <div className="ld-line">
      <span className="ld-prompt">{">"}</span>
      <span className="ld-text">{displayed}</span>
      {!done && <span className="ld-cursor" />}
      {done  && <span className="ld-check">✓</span>}
    </div>
  );
}

export default function Loader({ onComplete }) {
  const [step,     setStep]     = useState(0);
  const [progress, setProgress] = useState(0);
  const [welcome,  setWelcome]  = useState(false);
  const [fadeOut,  setFadeOut]  = useState(false);

  /* progress bar */
  useEffect(() => {
    const target = Math.round(((step) / LINES.length) * 100);
    const int    = setInterval(() => {
      setProgress(p => {
        if (p >= target) { clearInterval(int); return target; }
        return p + 1;
      });
    }, 12);
    return () => clearInterval(int);
  }, [step]);

  /* show welcome after all lines done */
  useEffect(() => {
    if (step >= LINES.length) {
      setProgress(100);
      setTimeout(() => setWelcome(true),  400);
      setTimeout(() => setFadeOut(true),  1400);
      setTimeout(() => onComplete?.(),    2000);
    }
  }, [step]);

  /* which lines to show based on delay */
  const [visibleLines, setVisibleLines] = useState([0]);
  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(v => v.includes(i) ? v : [...v, i]);
      }, line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div className={`ld-root ${fadeOut ? "ld-root--out" : ""}`}>

      {/* background grid */}
      <div className="ld-grid" aria-hidden="true" />

      {/* terminal window */}
      <div className="ld-terminal">

        {/* top bar */}
        <div className="ld-bar">
          <div className="ld-bar__dots">
            <span className="ld-dot ld-dot--red"    />
            <span className="ld-dot ld-dot--yellow" />
            <span className="ld-dot ld-dot--green"  />
          </div>
          <span className="ld-bar__title">anwar-ali.dev — bash</span>
          <span className="ld-bar__version">v3.0.0</span>
        </div>

        {/* terminal body */}
        <div className="ld-body">

          {/* session header */}
          <div className="ld-header-line">
            <span className="ld-header-line__bracket">[</span>
            <span className="ld-header-line__text">Portfolio OS — Anwar Ali</span>
            <span className="ld-header-line__bracket">]</span>
          </div>
          <div className="ld-divider" />

          {/* typed lines */}
          <div className="ld-lines">
            {visibleLines.map(i => (
              <TypeLine
                key={i}
                text={LINES[i].text}
                onDone={() => setStep(s => Math.max(s, i + 1))}
              />
            ))}
          </div>

          {/* progress bar */}
          {step > 0 && (
            <div className="ld-progress">
              <div className="ld-progress__bar">
                <div
                  className="ld-progress__fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="ld-progress__num">{progress}%</span>
            </div>
          )}

          {/* welcome */}
          {welcome && (
            <div className="ld-welcome">
              <span className="ld-welcome__icon">✦</span>
              <span className="ld-welcome__text">
                Welcome to <span>Anwar Ali</span>.dev
              </span>
              <span className="ld-welcome__check">✓</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}