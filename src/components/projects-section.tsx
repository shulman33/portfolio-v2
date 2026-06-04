import { projects } from "@/data/projects";
import ProjectRow from "./project-row";

export default function ProjectsSection() {
  return (
    <section id="projects" className="bg-surface border-t border-border">
      <div className="px-5 pt-12 md:px-10 lg:px-16">
        <div className="flex items-center gap-4">
          <span className="font-mono text-[0.72rem] text-green tracking-wider uppercase">
            {"// selected_projects"}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>

      <div className="flex flex-col gap-24 px-5 py-16 md:px-10 lg:gap-32 lg:px-16 lg:py-24">
        {projects.map((project, i) => (
          <ProjectRow key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
