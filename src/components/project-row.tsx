import Image from "next/image";
import type { Project } from "@/data/projects";

interface ProjectRowProps {
  project: Project;
  index: number;
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/\bagent\b/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** The framed "browser window" that holds the screenshot, or a terminal fallback. */
function ProjectFrame({
  project,
  side,
}: {
  project: Project;
  side: "left" | "right";
}) {
  const tilt = side === "left" ? "proj-frame--left" : "proj-frame--right";
  const projectLink = project.links.find((l) => l.label === "view_project");
  const barLabel = project.image
    ? project.previewUrl ??
      (projectLink
        ? projectLink.url.replace(/^https?:\/\//, "").replace(/\/$/, "")
        : slugify(project.title))
    : `~/projects/${slugify(project.title)}`;

  return (
    <div className={`proj-frame ${tilt} relative border border-border bg-surface`}>
      {/* window chrome */}
      <div className="flex items-center gap-3 border-b border-border px-3.5 py-2.5">
        <div className="flex gap-1.5" aria-hidden="true">
          <span className="block h-2.5 w-2.5 bg-green" />
          <span className="block h-2.5 w-2.5 bg-purple" />
          <span className="block h-2.5 w-2.5 bg-blue" />
        </div>
        <div className="min-w-0 flex-1 truncate border border-border bg-void px-2.5 py-1 font-mono text-[0.6rem] tracking-[0.02em] text-text-muted">
          {barLabel}
        </div>
      </div>

      {/* window body */}
      {project.image ? (
        <div className="relative overflow-hidden">
          <Image
            src={project.image}
            alt={project.imageAlt ?? `${project.title} preview`}
            width={1440}
            height={900}
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="proj-img block h-auto w-full"
          />
          <div
            className="proj-scan pointer-events-none absolute inset-0"
            aria-hidden="true"
          />
        </div>
      ) : (
        <div className="flex aspect-[16/10] flex-col justify-center gap-2 px-6 py-6 font-mono text-[0.72rem] leading-relaxed">
          <p className="text-text">
            <span className="text-green">❯</span> open {slugify(project.title)}
          </p>
          <p className="text-text-muted">{"> live demo: source-only"}</p>
          <p className="text-text-dim">
            {"> stack: "}
            {project.tags.slice(0, 3).join(" · ")}
          </p>
          <p className="text-text">
            {"> browse the repo "}
            <span className="cursor-blink align-baseline" />
          </p>
        </div>
      )}
    </div>
  );
}

export default function ProjectRow({ project, index }: ProjectRowProps) {
  const indexLabel = String(index + 1).padStart(2, "0");
  const reversed = index % 2 === 1;

  return (
    <article className="group proj-rise grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      {/* Text column */}
      <div className={reversed ? "lg:order-2" : "lg:order-1"}>
        <div
          className="mb-3 select-none font-heading text-[3.5rem] font-extrabold leading-none text-transparent lg:text-[5rem]"
          style={{ WebkitTextStroke: "1.4px var(--text-muted)", opacity: 0.5 }}
          aria-hidden="true"
        >
          {indexLabel}
        </div>

        {project.kicker && (
          <div className="mb-3 font-mono text-[0.66rem] uppercase tracking-[0.14em] text-green">
            {project.kicker}
          </div>
        )}

        <h3 className="mb-5 font-heading text-3xl font-extrabold leading-[1.04] tracking-tight lg:text-[2.6rem]">
          {project.title}
        </h3>

        <p className="mb-6 max-w-[48ch] text-[0.92rem] font-light leading-[1.85] text-text-dim">
          {project.description}
        </p>

        <div className="mb-7 flex flex-wrap gap-[0.4rem]">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="border px-2 py-0.5 font-mono text-[0.6rem] tracking-[0.06em] text-purple"
              style={{
                borderColor: "rgba(155, 127, 212, 0.2)",
                backgroundColor: "rgba(155, 127, 212, 0.05)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-5">
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.url}
              target={link.url.startsWith("http") ? "_blank" : undefined}
              rel={link.url.startsWith("http") ? "noopener noreferrer" : undefined}
              className="border-b border-border pb-0.5 font-mono text-[0.72rem] text-text transition-colors hover:border-green hover:text-green"
            >
              {link.label} &rarr;
            </a>
          ))}
        </div>
      </div>

      {/* Stage column */}
      <div className={`proj-stage ${reversed ? "lg:order-1" : "lg:order-2"}`}>
        <ProjectFrame project={project} side={reversed ? "right" : "left"} />
      </div>
    </article>
  );
}
