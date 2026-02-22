export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
}

export const projects: Project[] = [
  {
    title: "Career Twin Agent",
    description:
      "Agentic AI system with full professional context. Handles nuanced conversations and recruiter outreach via email tools.",
    tags: ["LangChain", "Gemini", "Python"],
    links: [{ label: "view_project", url: "#" }],
  },
  {
    title: "Portfolio Platform",
    description:
      "This site — Next.js with a native AI chat interface, terminal-inspired design system, and dynamic OG generation.",
    tags: ["Next.js", "Tailwind", "TypeScript"],
    links: [{ label: "view_source", url: "https://github.com/shulman33" }],
  },
  {
    title: "Distributed Research",
    description:
      "Research into fault-tolerant architectures focusing on consensus algorithms and partition tolerance.",
    tags: ["Python", "Distributed", "Research"],
    links: [{ label: "view_project", url: "#" }],
  },
];
