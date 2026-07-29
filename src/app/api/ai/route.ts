import { NextResponse } from "next/server";

function localAnswer(prompt: string) {
  const p = prompt.toLowerCase();
  const topic = prompt.replace(/^(write|create|generate|suggest|summarize|explain)\s+/i, "").slice(0, 80);

  if (p.includes("price") || p.includes("pricing")) {
    return `💰 Pricing suggestion for "${topic}"

• Anchor tier: $149 (full access + community)
• Core tier: $79 — best conversion for this category
• Entry tier: $29 (lite / template only)

Reasoning: comparable products in this category sell at $49–$189 with a median of $79. Launch at $79 with a 30% LAUNCH coupon for 7 days, then step to $99.
Platform fee is only 5%, so at $79 you keep $75.05 per sale.`;
  }
  if (p.includes("outline") || p.includes("curriculum") || p.includes("course")) {
    return `📚 Course outline: ${topic}

Module 1 · Foundations
 1.1 Why this matters in 2026
 1.2 The mental model
 1.3 Tools & setup

Module 2 · The Core Framework
 2.1 Step-by-step system
 2.2 Live walkthrough
 2.3 Common failure modes

Module 3 · Automation & AI Leverage
 3.1 Prompt library
 3.2 Workflow automations

Module 4 · Launch & Scale
 4.1 Pricing & positioning
 4.2 Your 30-day launch plan
 4.3 Certificate project

Estimated length: 6h 20m across 24 lessons.`;
  }
  if (p.includes("quiz")) {
    return `🧠 Quiz: ${topic}

1. What is the primary goal of the core framework? (multiple choice)
2. Name two failure modes covered in module 3. (short answer)
3. True/False: pricing should always start at the lowest tier.
4. Which metric best signals product-market fit? (multiple choice)
5. Describe how you would apply this to your own project. (essay)

Answer key + rubric generated for instructors.`;
  }
  if (p.includes("summar") || p.includes("chapter") || p.includes("lesson")) {
    return `📝 Summary of ${topic}

• Core idea: attention is the scarcest asset — design your systems to protect it.
• Three practices: single-tasking blocks, capture-everything inbox, weekly review.
• Key metric: hours of uninterrupted deep work per week (target: 15+).
• Action step: schedule two 90-minute blocks tomorrow and log the result.

Want flashcards or a 7-day learning plan from this?`;
  }
  if (p.includes("seo") || p.includes("keyword")) {
    return `🔍 SEO keywords for "${topic}"

Primary: ${topic.toLowerCase()} template, buy ${topic.toLowerCase()}, best ${topic.toLowerCase()} 2026
Long tail: how to use ${topic.toLowerCase()} for beginners, ${topic.toLowerCase()} for creators, affordable ${topic.toLowerCase()} download
Meta title: ${topic} — Premium Digital Download (Instant Access)
Meta description: Get ${topic} instantly. Lifetime updates, 5-minute setup, loved by 12,000+ creators.`;
  }
  return `✍️ Sales copy for "${topic}"

Headline: ${topic} — the shortcut you wish you had a year ago.

Most people spend months piecing this together from scattered tutorials. This gives you the finished system on day one: every template, checklist and workflow, ready to use in under 10 minutes.

What you get:
• A complete, opinionated system (no blank pages)
• Lifetime updates and new drops each quarter
• Private community + weekly Q&A
• 30-day money-back guarantee

Buy once. Use forever. Instant secure download.`;
}

export async function POST(req: Request) {
  const { prompt } = (await req.json()) as { prompt?: string };
  if (!prompt) return NextResponse.json({ error: "prompt required" }, { status: 400 });

  const key = process.env.OPENAI_API_KEY;
  if (key) {
    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}` },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are the AI copilot for Digital Knowledge Marketplace. Help creators write product copy, SEO keywords, pricing and course outlines; help learners summarize lessons, explain chapters, build quizzes and learning plans. Be concise and structured.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const output = data?.choices?.[0]?.message?.content;
        if (output) return NextResponse.json({ output, source: "openai" });
      }
    } catch {
      /* fall through to local */
    }
  }

  return NextResponse.json({ output: localAnswer(prompt), source: "local" });
}
