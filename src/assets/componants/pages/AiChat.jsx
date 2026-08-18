import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { FaRobot, FaTimes, FaPaperPlane, FaCircle } from "react-icons/fa";
import "./AiChat.css";

const API = import.meta.env.VITE_API_URL;

const SUGGESTIONS = [
    "What's Anwar's tech stack?",
    "Tell me about his live projects",
    "Does he do AI integration?",
    "How can I hire Anwar?",
];

const formatMessage = (text) => {
    return text
        .replace(/\n\n/g, "<br /><br />")
        .replace(/\n/g, "<br />");
};

export default function AiChat() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: "ai",
            text: "Hey there! 👋 I'm Anwar's AI assistant — Ask me anything about his skills, projects, or how to hire him.",
        },
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const bottomRef = useRef(null);
    const inputRef = useRef(null);
    const chatId = useRef(`chat_${Date.now()}`);

    /* delayed entry */
    useEffect(() => {
        const t1 = setTimeout(() => setVisible(true), 2200);
        const t2 = setTimeout(() => setShowTooltip(true), 3500);
        // t3 hatao — tooltip band nahi hoga
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, []);

    /* scroll to bottom */
    useEffect(() => {
        if (open) {
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 60);
        }
    }, [messages, open, loading]);

    /* focus input on open */
    useEffect(() => {
        if (open) setTimeout(() => inputRef.current?.focus(), 300);
    }, [open]);

    /* escape to close */
    useEffect(() => {
        const fn = (e) => { if (e.key === "Escape" && open) setOpen(false); };
        window.addEventListener("keydown", fn);
        return () => window.removeEventListener("keydown", fn);
    }, [open]);

    /* hide tooltip when opened */
    useEffect(() => {
        if (open) setShowTooltip(false);
    }, [open]);

    const buildHistory = () =>
        messages
            .filter((m) => m.role !== "error")
            .map((m) => ({
                role: m.role === "ai" ? "model" : "user",
                parts: [{ text: m.text }],
            }));

    const send = async (text) => {
        const msg = (text || input).trim();
        if (!msg || loading) return;

        setMessages((p) => [...p, { role: "user", text: msg }]);
        setInput("");
        setLoading(true);

        try {
            const { data } = await axios.post(`${API}/ai/chat`, {
                message: msg,
                history: buildHistory(),
            });
            setMessages((p) => [...p, { role: "ai", text: data.reply }]);
        } catch {
            setMessages((p) => [
                ...p,
                { role: "error", text: "Couldn't reach AI right now. Please try again!" },
            ]);
        } finally {
            setLoading(false);
        }
    };

    const onKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    };

    if (!visible) return null;

    return (
        <div style={{
            position: "fixed",
            bottom: "28px",
            left: "28px",
            right: "auto",
            zIndex: 9998,
            fontFamily: "Space Grotesk, sans-serif"
        }}>

            {/* backdrop */}
            {open && (
                <div
                    className="aic-backdrop"
                    onClick={() => setOpen(false)}
                    aria-hidden="true"
                />
            )}

            {/* ════════ CHAT WINDOW ════════ */}
            <div
                className={`aic-window ${open ? "aic-window--open" : ""}`}
                style={{
                    position: "fixed",
                    bottom: "96px",
                    left: "28px",
                    right: "auto",
                    width: "380px",
                    height: "540px"
                }}
                role="dialog"
                aria-label="Anwar's AI Assistant"
                aria-modal="true"
            >

                {/* ── TOP BAR (macOS style) ── */}
                <div className="aic-topbar">
                    <div className="aic-topbar__dots">
                        <span className="tdot tdot--red" />
                        <span className="tdot tdot--yellow" />
                        <span className="tdot tdot--green" />
                    </div>
                    <span className="aic-topbar__title">
                        <FaRobot className="aic-topbar__icon" />
                        anwar-ai.js
                    </span>
                    <button
                        className="aic-topbar__close"
                        onClick={() => setOpen(false)}
                        aria-label="Close"
                    >
                        <FaTimes />
                    </button>
                </div>

                {/* ── HEADER ── */}
                <div className="aic-header">
                    <div className="aic-header__avatar">
                        <FaRobot />
                        <span className="aic-header__ping" />
                    </div>
                    <div className="aic-header__info">
                        <p className="aic-header__name">Anwar's AI Assistant</p>
                        <p className="aic-header__status">
                            <FaCircle className="aic-status-dot" />
                            Online 
                        </p>
                    </div>
                </div>

                {/* ── MESSAGES ── */}
                <div className="aic-messages">

                    {messages.map((m, i) => (
                        <div
                            key={i}
                            className={`aic-msg aic-msg--${m.role} ${i === messages.length - 1 && m.role === "ai" ? "aic-msg--latest" : ""}`}
                        >
                            {m.role === "ai" && (
                                <span className="aic-msg__av">
                                    <FaRobot />
                                </span>
                            )}
                            <div className="aic-msg__wrap">
                                <span
                                    className="aic-msg__bubble"
                                    dangerouslySetInnerHTML={{ __html: formatMessage(m.text) }}
                                />
                                {m.role === "ai" && (
                                    <span className="aic-msg__label">Anwar's AI</span>
                                )}
                            </div>
                        </div>
                    ))}

                    {/* typing indicator */}
                    {loading && (
                        <div className="aic-msg aic-msg--ai">
                            <span className="aic-msg__av"><FaRobot /></span>
                            <div className="aic-msg__wrap">
                                <span className="aic-msg__bubble aic-typing">
                                    <span /><span /><span />
                                </span>
                                <span className="aic-msg__label">Thinking…</span>
                            </div>
                        </div>
                    )}

                    {/* suggestion chips — only on first message */}
                    {messages.length === 1 && !loading && (
                        <div className="aic-suggestions">
                            <p className="aic-suggestions__label">// quick questions</p>
                            <div className="aic-suggestions__chips">
                                {SUGGESTIONS.map((s) => (
                                    <button
                                        key={s}
                                        className="aic-chip"
                                        onClick={() => send(s)}
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>

                {/* ── INPUT ROW ── */}
                <div className="aic-input-row">
                    <div className="aic-input-wrap">
                        <span className="aic-input-prompt">{">"}</span>
                        <textarea
                            ref={inputRef}
                            className="aic-input"
                            placeholder="Ask about skills, projects, hiring…"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={onKeyDown}
                            rows={1}
                            maxLength={500}
                            disabled={loading}
                        />
                    </div>
                    <button
                        className="aic-send"
                        onClick={() => send()}
                        disabled={!input.trim() || loading}
                        aria-label="Send"
                    >
                        <FaPaperPlane />
                    </button>
                </div>

                {/* footer */}
                <div className="aic-footer">
                    <span>Powered by Google Gemini · Integrated by Anwar Ali</span>
                </div>

            </div>

            {/* ════════ TOOLTIP ════════ */}
            {showTooltip && !open && (
                <div className="aic-tooltip">
                    <span className="aic-tooltip__dot" />
                    Ask me about Anwar!
                    <span className="aic-tooltip__arrow" />
                </div>
            )}

            {/* ════════ TRIGGER ════════ */}
            <button
                className={`aic-trigger ${open ? "aic-trigger--open" : ""}`}
                onClick={() => setOpen(!open)}
                aria-label={open ? "Close AI" : "Chat with Anwar's AI"}
                aria-expanded={open}
            >
                <span className="aic-ring aic-ring--1" aria-hidden="true" />
                <span className="aic-ring aic-ring--2" aria-hidden="true" />

                <span className="aic-trigger__inner">
                    <FaRobot className="aic-trigger__robot" />
                    <FaTimes className="aic-trigger__x" />
                </span>

                {!open && <span className="aic-trigger__badge">AI</span>}
            </button>

        </div>
    );
}