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
    title: "GridClean",
    description:
      "Data-fusion API that computes the live carbon intensity (gCO₂/kWh) of the grid serving any ZIP code by multiplying real-time EIA-930 fuel mix against EPA emission factors, then forecasts the cleanest hours ahead with ETS prediction intervals. Includes a guardrailed Claude text-to-SQL layer with sqlglot AST validation and a read-only Postgres role. FastAPI, TimescaleDB, Redis.",
    tags: ["Python", "FastAPI", "TimescaleDB", "Redis", "Claude", "Railway"],
    links: [
      { label: "view_project", url: "https://web-production-8ecb8.up.railway.app/app/" },
      { label: "view_source", url: "https://github.com/shulman33/GridClean" },
    ],
  },
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
    title: "UAP Atlas",
    description:
      "Interactive archive that makes all 161 of the U.S. Department of War's declassified UFO/UAP files browsable, mappable, and shareable. Geolocation-aware map surfaces the closest sighting to you, a scroll-snap feed embeds declassified DVIDS videos and images, and a searchable browse view filters every record. Vanilla JS with a Node build step that statically generates 161 SEO pages, JSON-LD, and a sitemap.",
    tags: ["JavaScript", "Leaflet", "Node.js", "Static Site"],
    links: [
      { label: "view_project", url: "https://uapatlas.world/" },
      { label: "view_source", url: "https://github.com/shulman33/ufo-files" },
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
