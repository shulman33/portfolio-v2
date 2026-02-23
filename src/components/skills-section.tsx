const skillGroups = [
  { category: "frontend", skills: ["React / Next.js", "TypeScript", "JavaScript", "Tailwind CSS"] },
  { category: "ai_ml", skills: ["Agentic Systems", "LangChain", "Python", "Claude", "OpenAI", "Gemini", "xAI / Grok", "Context Engineering"] },
  { category: "backend", skills: ["Node.js", "FastAPI", "Java", "PostgreSQL", "Redis", "Supabase"] },
  { category: "infra", skills: ["AWS (Scalable Architectures, Serverless)", "Docker", "Vercel"] },
];

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="bg-surface border-t border-border px-5 py-16 md:px-10 lg:px-16 lg:py-24"
    >
      {/* Section header */}
      <div className="flex items-center gap-4 mb-12">
        <span className="font-mono text-[0.72rem] text-green tracking-wider uppercase">
          {"// tech_stack"}
        </span>
        <div className="flex-1 h-px bg-border" />
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Left — heading + description */}
        <div>
          <h2
            className="font-heading font-extrabold uppercase leading-[1.05] tracking-[-0.03em] mb-6"
            style={{ fontSize: "clamp(2rem, 3vw, 3rem)" }}
          >
            Technical{" "}
            <span className="text-green">Stack</span>
          </h2>
          <p className="text-[0.9rem] leading-[1.8] text-text-dim font-light max-w-[45ch]">
            Depth across the modern stack — AI systems, full-stack web, and
            distributed architecture. I reach for the right tool, not the
            familiar one.
          </p>
        </div>

        {/* Right — skill groups */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {skillGroups.map((group) => (
            <div
              key={group.category}
              className="bg-void border border-border p-6"
            >
              <div className="font-mono text-[0.62rem] text-green tracking-wider uppercase border-b border-border pb-3 mb-4">
                {"// " + group.category}
              </div>
              <div className="flex flex-wrap gap-[0.35rem]">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="font-mono text-[0.6rem] tracking-[0.06em] text-purple px-2 py-0.5"
                    style={{
                      border: "1px solid rgba(155, 127, 212, 0.2)",
                      backgroundColor: "rgba(155, 127, 212, 0.05)",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
