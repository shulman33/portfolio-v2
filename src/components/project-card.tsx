import type { Project } from "@/data/projects";

interface ProjectCardProps {
  project: Project;
  index: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  const indexLabel = `project_${String(index + 1).padStart(2, "0")}`;

  return (
    <div className="group relative bg-void p-6 lg:p-8 transition-colors hover:bg-surface-2">
      {/* Green top line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-green origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-350 ease-out"
        aria-hidden="true"
      />

      <span className="font-mono text-[0.62rem] text-text-muted tracking-wider block mb-4">
        {indexLabel}
      </span>

      <h3 className="font-heading font-bold text-[1.15rem] text-text mb-3">
        {project.title}
      </h3>

      <p className="text-[0.82rem] leading-[1.8] text-text-dim font-light mb-5">
        {project.description}
      </p>

      <div className="flex flex-wrap gap-[0.35rem] mb-5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="font-mono text-[0.6rem] tracking-[0.06em] text-purple border px-2 py-0.5"
            style={{
              borderColor: "rgba(155, 127, 212, 0.2)",
              backgroundColor: "rgba(155, 127, 212, 0.05)",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-4">
        {project.links.map((link) => (
          <a
            key={link.label}
            href={link.url}
            target={link.url.startsWith("http") ? "_blank" : undefined}
            rel={
              link.url.startsWith("http") ? "noopener noreferrer" : undefined
            }
            className="font-mono text-[0.65rem] text-text-muted hover:text-green transition-colors"
          >
            {link.label} &rarr;
          </a>
        ))}
      </div>
    </div>
  );
}
