import { useState, useRef, useEffect } from "react";

const SYNAPSES_SYSTEM = `You are Synapses, an intelligent academic assistant created by Synapses Company to help Grade 12 learners in South Africa succeed. You assist with:

1. HOMEWORK HELP - Explain concepts clearly, solve problems step by step across all subjects (Maths, Physics, Chemistry, Life Sciences, History, Geography, English, Afrikaans, etc.)
2. STUDY SUMMARIES - Create concise, exam-ready summaries of any topic or chapter
3. ASSIGNMENT PLANNING - Break assignments into manageable steps with deadlines and structure
4. EXAM PREPARATION - Generate practice questions, revision plans, and memory techniques

Rules:
- Always be encouraging but honest
- Use simple, clear language a Grade 12 learner understands
- For Maths/Science, show working step by step
- For essays, provide structure and key points
- Keep responses focused and practical
- If asked something non-academic, gently redirect to school work
- Greet the learner warmly on first message
- You follow the South African CAPS curriculum`;

const subjects = ["Mathematics", "Physics", "Chemistry", "Life Sciences", "History", "Geography", "English", "Afrikaans", "Economics", "Accounting"];

const quickActions = [
  { icon: "📚", label: "Homework Help", prompt: "I need help with my homework on " },
  { icon: "📝", label: "Study Summary", prompt: "Please give me a summary of " },
  { icon: "📅", label: "Plan Assignment", prompt: "Help me plan my assignment on " },
  { icon: "🎯", label: "Exam Prep", prompt: "Help me prepare for my exam on " },
];

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text) => {
    const userText = text || input.trim();
    if (!userText || loading) return;
    setInput("");
    setStarted(true);
    const userMsg = { role: "user", content: userText, id: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    const newHistory = [...conversationHistory, { role: "user", content: userText }];
    setConversationHistory(newHistory);
    setLoading(true);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYNAPSES_SYSTEM,
          messages: newHistory,
        }),
      });
      const data = await response.json();
      const reply = data.content?.[0]?.text || "Sorry, I couldn't process that. Please try again.";
      const assistantMsg = { role: "assistant", content: reply, id: Date.now() + 1 };
      setMessages(prev => [...prev, assistantMsg]);
      setConversationHistory(prev => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Connection error. Please check your internet and try again.",
        id: Date.now() + 1
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/\n/g, '<br/>');
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0a0a0f",
      fontFamily: "'Courier New', monospace",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "0",
      position: "relative",
      overflow: "hidden",
    }}>
      <div style={{
        position: "fixed", inset: 0,
        backgroundImage: `linear-gradient(rgba(0,255,180,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,180,0.03) 1px, transparent 1px)`,
        backgroundSize: "40px 40px",
        pointerEvents: "none",
      }} />
      <div style={{
        width: "100%", maxWidth: "480px", height: "100vh",
        display: "flex", flexDirection: "column", position: "relative", zIndex: 1,
      }}>
        <div style={{
          padding: "20px 20px 16px",
          borderBottom: "1px solid rgba(0,255,180,0.15)",
          background: "rgba(10,10,15,0.95)",
          backdropFilter: "blur(20px)",
          position: "sticky", top: 0, zIndex: 10,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <div style={{
              width: "40px", height: "40px", borderRadius: "10px",
              background: "linear-gradient(135deg, #00ffb4, #00c896)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "20px", flexShrink: 0,
              boxShadow: "0 0 20px rgba(0,255,180,0.3)",
            }}>⚡</div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "bold", color: "#00ffb4", letterSpacing: "0.1em", textTransform: "uppercase" }}>SYNAPSES</div>
              <div style={{ fontSize: "10px", color: "rgba(0,255,180,0.5)", letterSpacing: "0.2em", textTransform: "uppercase" }}>Academic Intelligence</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#00ffb4", boxShadow: "0 0 8px #00ffb4" }} />
              <span style={{ fontSize: "10px", color: "rgba(0,255,180,0.6)", letterSpacing: "0.1em" }}>ONLINE</span>
            </div>
          </div>
        </div>
        <div style={{
          flex: 1, overflowY: "auto", padding: "20px",
          display: "flex", flexDirection: "column", gap: "16px",
        }}>
          {!started && (
            <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div style={{
                background: "rgba(0,255,180,0.05)",
                border: "1px solid rgba(0,255,180,0.15)",
                borderRadius: "16px", padding: "24px", textAlign: "center",
              }}>
                <div style={{ fontSize: "40px", marginBottom: "12px" }}>🧠</div>
                <div style={{ fontSize: "14px", color: "#00ffb4", fontWeight: "bold", marginBottom: "8px" }}>Your Grade 12 Academic Assistant</div>
                <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", lineHeight: "1.6" }}>
                  Homework help · Study summaries · Assignment planning · Exam prep
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                {quickActions.map((action, i) => (
                  <button key={i} onClick={() => { setInput(actio
