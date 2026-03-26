Samuel Shulman
Teaneck, NJ • 973-699-8748 • samshulman6@gmail.com • linkedin.com/in/sam-shulman • https://www.samjshulman.com/
Full-stack Software Engineer combining enterprise architecture rigor with a founder’s shipping velocity. Proven track record of designing scalable serverless
architectures and heavily optimizing API performance under high concurrency. Currently building an end-to-end consumer SaaS application (React, Python,
Postgres) while driving cloud architecture initiatives in a highly regulated sector. Built to compound speed and quality in fast-paced, product-driven startup
environments.
WORK EXPERIENCE
HelloMealio • Teaneck, NJ 	02/2026 - Present
Founder
• Shipped an end-to-end SaaS application in 4 weeks by prompting and guiding Claude Code to build the application from scratch.
• Reduced API write latency 82-95% (dropping median 3,549ms to 186ms on the slowest endpoint) by replacing up to 20 sequential Supabase round-trips
with single-call Postgres functions, bringing all write endpoints under a 300ms budget.
• Migrated Python FastAPI backend to micro-VMs following comprehensive load testing, resolving single-node CPU bottlenecks through horizontal
scaling to increase throughput by 7x (to 172 req/s) and reduce p95 tail latency to 831ms under high-concurrency load.
• Instrumented the full stack with Sentry, tracing user interactions from the frontend through the backend to database calls, to pinpoint latency bottlenecks
• Integrated ElevenLabs text-to-speech to give users a personalized AI chef with low-latency voice responses for hands-free cooking guidance
• Built a social media recipe import pipeline that uses AssemblyAI to transcribe the video narration, and Gemini to extract structured recipe data from the
transcript
• Founded a dinner planning and recipe management React Native app that dynamically generates weekly meal plans optimized for shared ingredients to
minimize users' grocery expenses
Healthfirst • New York, NY 	09/2025 - Present
Enterprise Architect
• Architected and scaled distributed data pipelines for critical interoperability systems, ensuring strict federal compliance without compromising high-
throughput performance.
• Resolved critical N+1 API query bottlenecks by entirely redesigning the core architecture for a high-traffic Cost Estimator platform, drastically reducing
database load.
• Engineered an event-driven serverless pipeline leveraging AWS Step Functions for provider data retrieval, boosting end-to-end performance by 80%.
• Integrated Workato with LeanIX using GraphQL, achieving real-time API documentation synchronization within 3 months, enhancing operational
efficiency.
PROJECTS
Career Twin
• Built a streaming AI chat agent (Vercel AI SDK + Google Gemini) that answers recruiter questions in first person, grounded in 3 context documents to
prevent hallucination.
• Integrated a sendEmail tool so the agent autonomously sends formatted introduction emails with AI-generated conversation summaries via the Resend
API, converting chat interactions into real recruiter contact.
• Instrumented the agent with Langfuse OpenTelemetry tracing across both chat and summarization calls for end-to-end observability.
ImIn
Built a system that automated class enrollment in under one second when slots opened; achieved 2,256 page views serving 50% of the student body.
SKILLS
Frontend: Next.js, React, TypeScript, Vite
Backend: FastAPI, Java, Node.js, PostgreSQL, Python, Redis, SQL, Supabase
Cloud & Infra: AWS, Docker, GitHub Actions
AI Development: Claude Code, Codex, Cursor, Gemini API, LangChain, OpenAI API

-- 1 of 2 --

EDUCATION
B.S. Computer Science, Distributed Systems Track
Yeshiva University 	05/2025
software engineer

-- 2 of 2 --