import HeroTerminal from "./hero-terminal";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] items-center px-5 pt-32 pb-16 md:px-10 lg:px-16 lg:pt-32 lg:pb-16"
    >
      {/* Grid background */}
      <div
        className="hero-grid-bg absolute inset-0 opacity-40"
        style={{
          maskImage:
            "radial-gradient(ellipse 70% 70% at 30% 50%, transparent 0%, var(--void) 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 70% at 30% 50%, transparent 0%, var(--void) 100%)",
        }}
        aria-hidden="true"
      />

      {/* Left column — content */}
      <div className="relative z-10 overflow-hidden">
        <p className="font-mono text-green text-[0.75rem] mb-6">
          &gt; whoami --verbose
        </p>

        <h1
          className="font-heading font-extrabold uppercase leading-[0.9] mb-6"
          style={{ fontSize: "clamp(2.2rem, 5.5vw, 6rem)" }}
        >
          <span className="block text-text">Samuel</span>
          <span
            className="block"
            style={{
              color: "transparent",
              WebkitTextStroke: "1px var(--green)",
            }}
          >
            Shulman
          </span>
        </h1>

        <p className="text-[0.95rem] leading-[1.8] text-text-dim font-light max-w-[42ch] mb-8">
          <strong className="text-text font-normal">
            Software engineer &amp; AI systems builder.
          </strong>{" "}
          I design intelligent interfaces and robust backends — and I built an
          AI twin that knows my career better than a resume ever could.
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#chat"
            className="font-mono text-[0.75rem] tracking-wider bg-green text-void px-6 py-3 hover:shadow-[var(--green-glow)] transition-shadow"
          >
            ./start_conversation
          </a>
          <a
            href="#projects"
            className="font-mono text-[0.75rem] tracking-wider text-text-dim border border-border px-6 py-3 hover:border-green/40 hover:text-green transition-colors"
          >
            ./view_projects
          </a>
        </div>
      </div>

      {/* Right column — terminal (desktop only) */}
      <div className="relative z-10 hidden lg:block">
        <HeroTerminal />
      </div>
    </section>
  );
}
