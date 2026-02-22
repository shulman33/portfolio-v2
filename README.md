# portfolio-v2

Sam Shulman's personal portfolio site. Built with a "Void Terminal" design aesthetic — dark background, neon green accents, monospace typography, and a terminal-inspired UI throughout.

## Features

- Hero section with an interactive terminal window displaying a JSON career profile
- AI Career Twin chat backed by Gemini that knows Sam's full professional context and can send real email introductions to recruiters
- Projects grid, skills section with bar charts, and a contact form
- Dynamic Open Graph and Twitter card image generation
- Boot sequence animation on page load

## Tech Stack

- **Next.js 16** (App Router) with **React 19** and TypeScript
- **Tailwind CSS v4** for styling
- **Vercel AI SDK** + **Google Gemini** for the AI chat (streaming, tool calling)
- **Resend** for transactional email (contact form + AI-generated intro emails)
- **shadcn/ui** for base components, customized to the Void Terminal theme

## Local Development

```bash
# Install dependencies
npm install

# Copy the environment variable template and fill in values
cp .env.local.example .env.local

# Start the development server
npm run dev
```

The app runs at `http://localhost:3000`.

## Environment Variables

| Variable | Description |
|---|---|
| `GOOGLE_GENERATIVE_AI_API_KEY` | Gemini API key from [Google AI Studio](https://aistudio.google.com) |
| `RESEND_API_KEY` | Resend API key for sending email |
| `RECIPIENT_EMAIL` | Address that receives contact form submissions and AI intro emails (defaults to `samshulman6@gmail.com`) |
| `FROM_EMAIL` | Sending address verified with Resend (defaults to `onboarding@resend.dev`) |

## Context Files

The AI Career Twin reads context from the `/me` directory at startup. Place the following files there before running the app:

| File | Purpose |
|---|---|
| `me/summary.md` | Short biography and career context in plain text |
| `me/resume.pdf` | Resume — parsed server-side and fed to the AI agent |
| `me/linkedin.pdf` | LinkedIn profile export — also parsed and fed to the AI agent |

Without these files, the AI chat will still function but will lack personal context.

## Other Commands

```bash
npm run build   # Production build
npm run start   # Start production server
npm run lint    # Run ESLint
```

## Deployment

Deploy to Vercel. Set all environment variables in the Vercel dashboard under Project Settings > Environment Variables.
