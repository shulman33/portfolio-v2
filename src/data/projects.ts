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
    tags: ["Next.js", "Vercel AI SDK", "Gemini", "Resend"],
    links: [{ label: "view_project", url: "https://www.samjshulman.com/" }, { label: "view_source", url: "https://github.com/shulman33/portfolio-v2" }],
  },
  {
    title: "MarketLinter",
    description:
      "GenAI platform that validates startup ideas by gathering demand signals from social platforms using multi-model LLM orchestration.",
    tags: ["Next.js", "FastAPI", "Gemini", "xAI Grok", "OpenAI"],
    links: [{ label: "view_project", url: "https://www.marketlinter.com/" }],
  },
  {
    title: "ImIn",
    description:
      "Automated course registration system that enrolled students in under one second when slots opened. Served 50% of the student body.",
    tags: ["Full-Stack", "Automation"],
    links: [
      {
        label: "view_source",
        url: "https://github.com/shulman33/imin-fullstack",
      },
    ],
  },
];
