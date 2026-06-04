export interface ProjectLink {
  label: string;
  url: string;
}

export interface Project {
  title: string;
  /** Short eyebrow label shown above the title in the editorial layout. */
  kicker?: string;
  description: string;
  tags: string[];
  links: ProjectLink[];
  /** Optional hero screenshot (path under /public). Rows without one render a terminal-window fallback. */
  image?: string;
  imageAlt?: string;
  /** Short label shown in the browser-window URL bar; falls back to the view_project hostname. */
  previewUrl?: string;
}

export const projects: Project[] = [
  {
    title: "GridClean",
    kicker: "live grid carbon",
    description:
      "Data-fusion API that computes the live carbon intensity (gCO₂/kWh) of the grid serving any ZIP code by multiplying real-time EIA-930 fuel mix against EPA emission factors, then forecasts the cleanest hours ahead with ETS prediction intervals. Includes a guardrailed Claude text-to-SQL layer with sqlglot AST validation and a read-only Postgres role. FastAPI, TimescaleDB, Redis.",
    tags: ["Python", "FastAPI", "TimescaleDB", "Redis", "Claude", "Railway"],
    image: "/projects/gridclean.jpeg",
    imageAlt:
      "GridClean console showing a 48-hour carbon-intensity history and 24-hour forecast chart with a ranked list of the cleanest upcoming hours.",
    previewUrl: "gridclean.up.railway.app",
    links: [
      { label: "view_project", url: "https://web-production-8ecb8.up.railway.app/app/" },
      { label: "view_source", url: "https://github.com/shulman33/GridClean" },
    ],
  },
  {
    title: "Market Pipeline",
    kicker: "real-time markets",
    description:
      "Real-time market data pipeline with rolling z-score anomaly detection and a Java limit-order-book matching engine using price-time priority. Python WebSocket ingestor on Finnhub, FastAPI, Streamlit dashboard, Postgres. Deployed on AWS Lightsail with GitHub Actions CI.",
    tags: ["Python", "Java", "FastAPI", "Postgres", "Docker", "AWS"],
    image: "/projects/market-pipeline.jpeg",
    imageAlt:
      "The Portfolio Ledger — an editorial broadsheet landing page for the Market Pipeline project with a live stock ticker and a vital-statistics panel.",
    previewUrl: "shulman33.github.io/market-pipeline",
    links: [
      { label: "view_project", url: "https://shulman33.github.io/market-pipeline/" },
      { label: "view_source", url: "https://github.com/shulman33/market-pipeline" },
    ],
  },
  {
    title: "UAP Atlas",
    kicker: "declassified archive",
    description:
      "Interactive archive that makes all 161 of the U.S. Department of War's declassified UFO/UAP files browsable, mappable, and shareable. Geolocation-aware map surfaces the closest sighting to you, a scroll-snap feed embeds declassified DVIDS videos and images, and a searchable browse view filters every record. Vanilla JS with a Node build step that statically generates 161 SEO pages, JSON-LD, and a sitemap.",
    tags: ["JavaScript", "Leaflet", "Node.js", "Static Site"],
    image: "/projects/uap-atlas.jpeg",
    imageAlt:
      "UAP Atlas dark map of North America dotted with green sighting pins and a card highlighting the closest declassified event to the viewer.",
    previewUrl: "uapatlas.world",
    links: [
      { label: "view_project", url: "https://uapatlas.world/" },
      { label: "view_source", url: "https://github.com/shulman33/ufo-files" },
    ],
  },
  {
    title: "HelloMealio",
    kicker: "ai meal planning",
    description:
      "AI-powered dinner planning and recipe management app that generates weekly meal plans optimized for shared ingredients to minimize grocery waste and spending.",
    tags: ["React Native", "FastAPI", "PostgreSQL", "Gemini", "ElevenLabs"],
    image: "/projects/hellomealio.jpeg",
    imageAlt:
      "HelloMealio landing page with the headline \"Seven dinners. One grocery run. Way less money.\" beside an iPhone showing a weekly meal plan.",
    previewUrl: "hellomealio.com",
    links: [{ label: "view_project", url: "https://www.hellomealio.com/" }],
  },
  {
    title: "Career Twin Agent",
    kicker: "agentic ai",
    description:
      "Agentic AI system with full professional context. Handles nuanced conversations and recruiter outreach via email tools.",
    tags: ["Next.js", "Vercel AI SDK", "Gemini", "Resend"],
    links: [{ label: "view_project", url: "https://www.samjshulman.com/" }, { label: "view_source", url: "https://github.com/shulman33/portfolio-v2" }],
  },
  {
    title: "ImIn",
    kicker: "automation · 2023",
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
