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
    title: "Market Pipeline",
    description:
      "Real-time market data pipeline with rolling z-score anomaly detection and a Java limit-order-book matching engine using price-time priority. Python WebSocket ingestor on Finnhub, FastAPI, Streamlit dashboard, Postgres. Deployed on AWS Lightsail with GitHub Actions CI.",
    tags: ["Python", "Java", "FastAPI", "Postgres", "Docker", "AWS"],
    links: [
      { label: "view_project", url: "https://shulman33.github.io/market-pipeline/" },
      { label: "view_source", url: "https://github.com/shulman33/market-pipeline" },
    ],
  },
  {
    title: "HelloMealio",
    description:
      "AI-powered dinner planning and recipe management app that generates weekly meal plans optimized for shared ingredients to minimize grocery waste and spending.",
    tags: ["React Native", "FastAPI", "PostgreSQL", "Gemini", "ElevenLabs"],
    links: [{ label: "view_project", url: "https://www.hellomealio.com/" }],
  },
  {
    title: "Career Twin Agent",
    description:
      "Agentic AI system with full professional context. Handles nuanced conversations and recruiter outreach via email tools.",
    tags: ["Next.js", "Vercel AI SDK", "Gemini", "Resend"],
    links: [{ label: "view_project", url: "https://www.samjshulman.com/" }, { label: "view_source", url: "https://github.com/shulman33/portfolio-v2" }],
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
