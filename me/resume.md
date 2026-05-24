Samuel Shulman
Teaneck, New Jersey, US | +1 (973) 699-8748 | samshulman6@gmail.com | github.com/shulman33 | samjshulman.com

PROFESSIONAL SUMMARY
Software engineer passionate about full-stack development with hands-on experience across React, Next.js, FastAPI, and AWS. Currently building healthcare interoperability systems at Healthfirst while shipping side projects on nights and weekends. Self-motivated learner drawn to AI engineering and product-focused teams.

WORK EXPERIENCE

Technology Associate, Healthfirst                                          Sep 2025 – Present
• Engineered address-matching algorithm using NLP, fuzzy matching, and rule-based scoring; cut manual claim adjudication from 50%+ to under 10% across 4M+ monthly claims.
• Built Python sync service between Workato and LeanIX, automating documentation updates across 500+ APIs to eliminate stale architecture records.
• Architected Cost Estimator PoC using AWS Step Functions to parallelize provider lookups across Lambdas, resolving N+1 bottleneck.

PROJECTS

Real-Time Market Data Platform (shulman33.github.io/market-pipeline)       May 2026 – Present
• Architected a four-service microservices platform in Python and Java for real-time equity ingestion and order matching; containerized with Docker, deployed to Amazon Web Services (AWS), and shipped through a GitHub Actions CI/CD pipeline.
• Engineered a limit-order-book matching engine in Java with price-time priority, applying data structures and algorithms (TreeMap, HashMap, doubly-linked FIFO queues) to keep order submission and cancellation fast; persisted to PostgreSQL via JDBC.
• Built an async Python WebSocket client against a low-latency trade feed with auto-reconnect and a stale-stream watchdog; flagged real-time price anomalies with a hand-rolled rolling z-score detector and wrote each tick atomically to PostgreSQL.
• Exposed the system via a FastAPI REST service and a Streamlit + Plotly dashboard; verified end-to-end through 46 automated tests with real PostgreSQL integration tests.

HelloMealio (hellomealio.com)                                              March 2026 – Present
• Engineered deterministic greedy + 1-swap algorithm to replace Gemini LLM meal planner; 250× faster (3s → 10ms) and beat LLM quality in 13 of 15 head-to-head trials.
• Built AI pipeline with AssemblyAI and Gemini to extract structured recipe data from social media videos and shared links.
• Built single-call Postgres RPC functions to consolidate multi-statement transactions; reduced API write latency by 82–95%, all writes under 300ms.
• Integrated Sentry tracing across React Native, FastAPI, and Postgres; diagnosed and resolved production latency bottlenecks end-to-end.

Career Twin                                                                Feb 2026 – Feb 2026
• Built streaming AI chat agent on Next.js using the Vercel AI SDK with Google Gemini, grounded in resume, LinkedIn, and personal context to answer in first person.
• Integrated Resend API as an autonomous tool call; agent forwards recruiter messages plus AI-generated summaries to my inbox for follow-up.
• Implemented Langfuse OpenTelemetry tracing across chat and summarization calls for end-to-end production observability of agent behavior.

ImIn                                                                       Jan 2023 – June 2023
• Engineered Selenium-based registration bot on AWS Lambda, S3, DynamoDB, and EventBridge that auto-enrolled students into classes within seconds of slots opening at YU.
• Designed React web app where students queued target classes; system handled login, form submission, and screenshot confirmation end-to-end.
• Achieved ~50% adoption across 2,300-student campus (2,256 page views, 946 unique in 30 days); university responded by mandating MFA on its registration system.

SKILLS
Languages: Python, React, Typescript, Javascript, HTML, CSS, SQL, Java
Technologies: Postgres, Next.js, FastAPI, Redis, AWS, Claude Code, Claude, Supabase, Vercel, Fly.io, Langchain

EDUCATION
Bachelor of Science, Computer Science, Yeshiva University                  May 2025
• Relevant Coursework: Distributed Systems, Algorithms, Operating Systems, Modern Data Management, Compilers, Industrial Software Engineering, Data Structures, Networking, Cyber Security, Database Implementation, Programming languages

AWARDS AND ACCOLADES
• Yeshiva University Hackathon - Second Place                              2023
