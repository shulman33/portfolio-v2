# AI Career Twin Chat — Feature Spec

## Overview

The AI Career Twin Chat is the flagship feature of the portfolio. It's a native chat interface backed by a Vercel AI SDK + Google Gemini agent with full context on Sam's professional history, projects, and technical thinking. The agent can hold nuanced conversations and send real email introductions via the Resend API.

**Design reference:** `design/concept-2-void-terminal.html` (Chat Section)
**Existing backend:** `src/app/api/chat/route.ts`

---

## 1. Layout & Surface

### Desktop (>= 1024px)
- Two-column grid: left column is intro text ("Talk to my AI twin"), right column is the chat widget.
- Grid ratio: `1fr 1.4fr` (matching the mockup).
- Chat widget uses `min(560px, 70vh)` height — adapts to viewport while maintaining usability.

### Mobile (< 1024px)
- Single-column stack: condensed intro text (2-3 lines max) above the chat widget.
- Chat widget takes most of the viewport height, approximately `70vh`.
- Intro heading and one short paragraph only; the `./contact_directly` link and second paragraph are hidden on mobile.

### Chat Position
- The chat remains an **inline section** on the page (not a modal, drawer, or overlay). Users scroll to it naturally. Given its status as the hero feature, the nav CTA `./chat` anchors directly to it.

---

## 2. Chat Widget Structure

### Header Bar
- **Avatar:** Square box with green border and "S" initial, matching the void terminal aesthetic (no border-radius).
- **Name:** "Career Twin" in Syne 600.
- **Subtitle:** `ai-powered agent // always online` in Fragment Mono. (Model-agnostic — no "gemini" branding.)
- **Status indicator:** Pulsing green dot + "ACTIVE" text. Always shows active (no dynamic online/offline state).

### Messages Area
- Scrollable container with internal scroll.
- Height is the widget height minus header, suggestion bar, and input area.
- Custom scrollbar: 3px width, `var(--border)` thumb.
- Messages auto-scroll to bottom on new message arrival.

### Suggestion Pills Bar
- Positioned between messages area and input.
- Horizontally scrollable row of 4 pills:
  - "what are you building?"
  - "tell me about AI work"
  - "tech stack?"
  - "connect me with sam"
- **One-and-done behavior:** The suggestion bar disappears permanently after the user sends their first message (whether typed or via pill click).
- No contextual follow-up suggestions after bot responses.

### Input Area
- **Auto-expanding textarea** that starts as a single line and grows up to 3-4 lines.
- `Enter` sends the message. `Shift+Enter` inserts a newline.
- Placeholder: `// ask about experience, projects, or skills`
- Font: Fragment Mono, matching user message bubbles.
- Green border glow on focus (`rgba(0,232,122,0.35)`).
- **Send button:** 36x36 square, green background, arrow icon. Green glow on hover.
- **No visible character limit.** Silently cap at 2000 characters server-side if needed.

---

## 3. Message Bubbles

### Bot Messages
- **Alignment:** Left-aligned (`flex-start`).
- **Background:** `var(--surface-2)` with `1px solid var(--border)`.
- **Font:** DM Sans, 0.84rem, font-weight 300.
- **Markdown rendering:** Full markdown support including:
  - Bold, italic, strikethrough
  - Bullet and numbered lists
  - Inline code and fenced code blocks (styled with terminal aesthetics)
  - Links (see Link Styling below)
  - Headings (only h3-h6 to prevent visual hierarchy conflicts)
- **Timestamp:** `~ received` in Fragment Mono, muted.

### User Messages
- **Alignment:** Right-aligned (`flex-end`).
- **Background:** `var(--green-dim)` with `1px solid rgba(0,232,122,0.25)`.
- **Font:** Fragment Mono, 0.78rem. Green text.
- **No markdown rendering.** Plain text only for user messages.
- **Timestamp:** `> sent` in Fragment Mono, muted.

### Link Styling (in bot messages)
- Color: `var(--green)` with subtle underline.
- Open in new tab (`target="_blank"`, `rel="noopener noreferrer"`).
- Hover: increased opacity / glow effect.

---

## 4. Streaming & Response Behavior

### Token-by-Token Streaming
- Bot responses render progressively as tokens arrive from the Vercel AI SDK stream.
- No typing indicator dots before streaming starts — text begins appearing as soon as the first token arrives.
- A blinking cursor (`var(--green)`, 8x14px) appears at the end of the streaming text and disappears when the response is complete.

### Tool Execution States
When the agent invokes the `sendEmail` tool:
1. The streaming text pauses.
2. A **transient status message** appears in the chat: styled as a small, muted inline status (Fragment Mono, `var(--text-muted)`) — e.g., `> composing introduction...` or `> sending email...`
3. Once the tool returns, the status disappears and the agent's final text response streams in.

### Input State During Streaming
- **Input is disabled** while the bot is streaming a response.
- Send button is visually grayed out / non-interactive.
- Input re-enables once the full response is received.
- User can still type (for muscle memory), but cannot send.

---

## 5. Welcome Message

- **Source:** Hardcoded client-side. No API call on page load.
- **Content:**
  ```
  // initializing career_twin_agent...

  Hello! I'm Sam's career twin — I have full context on his professional story, projects, and technical thinking. What would you like to know?
  ```
- **Timing:** Displayed immediately on page load (present when user scrolls to the section).
- The first line (`// initializing...`) should be styled in `var(--text-muted)` to look like a code comment, with the greeting text in normal bot message styling.

---

## 6. Entrance Animation (Boot Sequence)

When the chat section first scrolls into the viewport (detected via IntersectionObserver, fires once):

### Sequence (total ~2.5 seconds):
1. **0ms:** Chat widget fades in from `opacity: 0` + `translateY(20px)`.
2. **300ms:** Scanline flash effect across the chat window (a single horizontal line sweeps top to bottom).
3. **600ms:** Header text types in: "Career Twin" character by character.
4. **1000ms:** Status dot pulses on, "ACTIVE" fades in.
5. **1200ms:** Welcome message types in character by character (or line by line for the code comment portion).
6. **2200ms:** Suggestion pills fade in with a staggered delay (50ms between each).

### Reduced Motion
- If `prefers-reduced-motion: reduce` is active, **skip the entire boot sequence**.
- Chat widget appears in its final state immediately (no typing, no scanlines, no slide).
- All interactive functionality works identically.

---

## 7. Error Handling

### API Errors (network failure, Gemini outage, rate limits)
- Display an **inline error bubble** in the chat, styled as a bot message but with a warning state:
  - Border: `1px solid rgba(255,95,87,0.3)` (red-tinted).
  - Text: "Something went wrong. Try again or reach Sam directly at sam@shulman.dev"
  - **Retry button** inside the bubble: small Fragment Mono button styled like a suggestion pill, labeled "retry".
- Clicking retry resends the last user message.
- Input re-enables after an error so the user can also just send a new message.

### Email Tool Errors
- The agent's tool execution already returns a fallback message ("I wasn't able to send your message...").
- This message streams to the user as a normal bot response. No additional UI handling needed.

---

## 8. Conversation Persistence

- **SessionStorage** — conversation history (messages array) is saved to `sessionStorage` under a key like `career-twin-messages`.
- Survives page refreshes and in-tab navigation.
- Cleared when the browser tab is closed.
- On page load, if sessionStorage has messages, restore them and skip the welcome message (since it was already shown).
- If no stored messages, show the hardcoded welcome message.

---

## 9. Email Tool Flow (UX)

The email flow is **purely conversational** — no special UI forms or input cards.

### Typical flow:
1. User indicates they want to connect (e.g., "connect me with sam", "I'd like to introduce myself").
2. Agent responds conversationally asking for their email and a brief message.
3. User provides their email in a regular chat message.
4. Agent invokes `sendEmail` tool server-side:
   - Status message appears: `> sending introduction...`
   - Tool executes (Resend API call + Gemini summarization of conversation).
   - Agent confirms success in a streamed response.
5. No client-side email validation — the agent handles validation conversationally and the Zod schema in the tool validates server-side.

---

## 10. Technical Implementation Notes

### Client-Side Stack
- **`useChat` hook** from Vercel AI SDK (`ai/react`) for message state management, streaming, and API communication.
- Messages sent to `POST /api/chat` with full conversation history (no client-side trimming).
- Markdown rendering via `react-markdown` with `remark-gfm` for GitHub-flavored markdown.
- Code blocks styled with terminal theme colors (green text on void background).

### Server-Side (existing `route.ts`)
- Model: `gemini-3-flash` via `@ai-sdk/google`.
- System prompt loaded from `lib/prompts.ts` with context from `lib/context.ts`.
- `sendEmail` tool with Zod schema validation.
- `stopWhen: stepCountIs(3)` — per-request step limit, resets with each user message.
- Response via `result.toUIMessageStreamResponse()`.

### Component Architecture
- `ChatSection` — Server Component wrapper for the two-column layout.
- `ChatWidget` — Client Component (`'use client'`) owning all chat state and interactivity:
  - Uses `useChat` for message management.
  - Manages sessionStorage persistence.
  - Handles entrance animation via IntersectionObserver + refs.
  - Renders message list, input area, suggestion pills.
- `ChatMessage` — Presentational component for a single message bubble (bot or user).
- `ChatInput` — Auto-expanding textarea with send button.
- `BootSequence` — Animation controller for the entrance sequence.

### No Rate Limiting / Abuse Prevention
- No rate limiting on the chat API or email tool.
- Acceptable risk for a low-traffic portfolio site.

---

## 11. Contact CTA Button

The `./contact_directly` link in the left column intro text scrolls to the `#contact` section (standard anchor behavior). It does not interact with the chat.

---

## 12. Responsive Breakpoints Summary

| Breakpoint | Layout | Chat Height | Intro Text |
|---|---|---|---|
| >= 1024px | Two-column grid | `min(560px, 70vh)` | Full intro (heading + 2 paragraphs + CTA) |
| 768px - 1023px | Single column | `65vh` | Condensed (heading + 1 paragraph) |
| < 768px | Single column | `60vh` | Condensed (heading + 1 short line) |

---

## 13. Acceptance Criteria

- [ ] Chat widget renders with correct void terminal styling (sharp corners, 1px borders, green accents).
- [ ] Welcome message displays on page load without an API call.
- [ ] Suggestion pills work and disappear after first message sent.
- [ ] User messages stream to the API and bot responses render token-by-token.
- [ ] Full markdown renders correctly in bot messages (bold, lists, links, code blocks).
- [ ] Links in bot messages open in new tab with green styling.
- [ ] Auto-expanding textarea with Enter-to-send, Shift+Enter for newline.
- [ ] Input is disabled during bot streaming, re-enabled on completion.
- [ ] Tool execution shows transient status message (e.g., "sending introduction...").
- [ ] API errors show inline error bubble with retry button.
- [ ] Conversation persists in sessionStorage across page refreshes.
- [ ] Boot sequence animation plays on first scroll into view.
- [ ] Boot sequence is skipped when `prefers-reduced-motion` is enabled.
- [ ] Responsive layout works correctly at all breakpoints.
- [ ] Chat header shows "ai-powered agent // always online" (no model-specific branding).
