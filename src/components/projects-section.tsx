import { projects } from "@/data/projects";
import ProjectCard from "./project-card";

export default function ProjectsSection() {
  return (
    <section id="projects" className="bg-surface border-t border-border">
      <div className="px-5 pt-12 pb-2 md:px-10 lg:px-16">
        <div className="flex items-center gap-4 mb-10">
          <span className="font-mono text-[0.72rem] text-green tracking-wider uppercase">
            {"// selected_projects"}
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border mx-5 md:mx-10 lg:mx-16 mb-12">
        {projects.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i} />
        ))}
      </div>
    </section>
  );
}
