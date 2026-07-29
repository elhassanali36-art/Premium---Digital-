"use client";

import { useState } from "react";

type Msg = { role: "user" | "ai"; text: string };

const presets = [
  "Write a product description for my Notion template",
  "Suggest a price for my 6-hour AI course",
  "Create a course outline about email marketing",
  "Summarize chapter 3 of The Focus Economy",
  "Generate a 5-question quiz on design systems",
];

export default function AiAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([
    {
      role: "ai",
      text: "Hi 👋 I'm your DKM AI copilot. I can write sales copy, SEO keywords, pricing suggestions, course outlines, lesson summaries and quizzes.",
    },
  ]);

  async function send(text: string) {
    if (!text.trim() || busy) return;
    setMsgs((m) => [...m, { role: "user", text }]);
    setInput("");
    setBusy(true);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text }),
      });
      const data = await res.json();
      setMsgs((m) => [...m, { role: "ai", text: data.output ?? "Something went wrong." }]);
    } catch {
      setMsgs((m) => [...m, { role: "ai", text: "Network error, please retry." }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 end-5 z-50 flex h-14 items-center gap-2 rounded-full bg-gradient-to-r from-brand to-gold px-5 text-sm font-bold text-white shadow-2xl shadow-brand/40 transition hover:scale-105"
      >
        <span className="text-lg">✦</span> AI
      </button>

      {open && (
        <div className="fixed bottom-24 end-5 z-50 flex h-[520px] w-[min(92vw,400px)] flex-col overflow-hidden rounded-3xl border border-line bg-bg shadow-2xl animate-rise">
          <div className="flex items-center justify-between border-b border-line bg-gradient-to-r from-brand/15 to-gold/10 px-4 py-3">
            <div>
              <p className="text-sm font-bold">DKM AI Copilot</p>
              <p className="text-[11px] text-muted">For creators & learners</p>
            </div>
            <button onClick={() => setOpen(false)} className="text-muted hover:text-fg">
              ✕
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4">
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                  m.role === "user"
                    ? "ms-auto bg-brand text-white"
                    : "border border-line bg-panel text-fg"
                }`}
              >
                {m.text}
              </div>
            ))}
            {busy && <div className="text-xs text-muted">thinking…</div>}
            {msgs.length === 1 && (
              <div className="space-y-1.5 pt-2">
                {presets.map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    className="block w-full rounded-xl border border-line bg-panel px-3 py-2 text-start text-[12px] text-muted transition hover:border-brand hover:text-fg"
                  >
                    {p}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t border-line p-3"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything…"
              className="flex-1 rounded-xl border border-line bg-panel px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <button className="rounded-xl bg-gradient-to-r from-brand to-gold px-4 text-sm font-bold text-white">
              →
            </button>
          </form>
        </div>
      )}
    </>
  );
}
