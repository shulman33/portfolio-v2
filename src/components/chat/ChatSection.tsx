import ChatWidget from "./ChatWidget";

export default function ChatSection() {
  return (
    <section
      id="chat"
      className="px-6 py-16 lg:px-16 lg:py-28 bg-void grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start"
    >
      {/* Intro column */}
      <div>
        <div className="flex items-center gap-4 mb-8">
          <span className="font-mono text-[0.72rem] text-green tracking-wider uppercase">
            {"// conversation"}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

        <h2 className="font-heading text-[clamp(2.2rem,3.5vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.03em] uppercase mb-6">
          Talk to my{" "}
          <span className="text-green">AI twin</span>
        </h2>

        <p className="text-[0.92rem] leading-[1.85] text-text-dim font-light mb-5 max-w-[40ch]">
          My AI career twin has full context on my professional history,
          projects, and technical thinking. Ask it anything — it&apos;s better
          than a r&eacute;sum&eacute;.
        </p>

        <p className="text-[0.92rem] leading-[1.85] text-text-dim font-light mb-5 max-w-[40ch] hidden lg:block">
          It can answer technical questions, walk you through projects, or send
          a real email introduction.
        </p>

        <a
          href="#contact"
          className="hidden lg:inline-block font-mono text-[0.72rem] tracking-wider text-text-dim border border-border px-4 py-2 mt-4 hover:border-green/40 hover:text-green transition-colors"
        >
          ./contact_directly &rarr;
        </a>
      </div>

      {/* Chat widget column */}
      <div>
        <ChatWidget />
      </div>
    </section>
  );
}
