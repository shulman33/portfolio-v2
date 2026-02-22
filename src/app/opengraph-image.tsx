import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sam Shulman — Software Engineer & AI Builder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  const [syneBold, fragmentMono] = await Promise.all([
    fetch(
      "https://fonts.gstatic.com/s/syne/v22/8vIS7w4qzmVxp2zHgFZPYEYBbHSm6VY.ttf"
    ).then((res) => res.arrayBuffer()),
    fetch(
      "https://fonts.gstatic.com/s/fragmentmono/v4/4iCr6K5wdBRKGlF1yUn7g2FY.ttf"
    ).then((res) => res.arrayBuffer()),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#080810",
          padding: "60px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern background */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(rgba(37,37,56,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(37,37,56,0.4) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />

        {/* Radial fade over grid */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            background:
              "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 0%, #080810 100%)",
          }}
        />

        {/* Top bar with terminal dots */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "48px",
            display: "flex",
            alignItems: "center",
            padding: "0 30px",
            borderBottom: "1px solid #252538",
            backgroundColor: "rgba(15,15,26,0.8)",
          }}
        >
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#FF5F57",
              marginRight: "7px",
              display: "flex",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#FFBD2E",
              marginRight: "7px",
              display: "flex",
            }}
          />
          <div
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "#28CA41",
              display: "flex",
            }}
          />
          <span
            style={{
              fontFamily: "Fragment Mono",
              fontSize: "12px",
              color: "#5A5A75",
              marginLeft: "16px",
            }}
          >
            portfolio_og.tsx
          </span>
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* Prompt line */}
          <span
            style={{
              fontFamily: "Fragment Mono",
              fontSize: "16px",
              color: "#00E87A",
              marginBottom: "24px",
            }}
          >
            {">"} whoami --verbose
          </span>

          {/* Name */}
          <span
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: "82px",
              color: "#E2E2F0",
              lineHeight: 0.9,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
            }}
          >
            Samuel
          </span>
          <span
            style={{
              fontFamily: "Syne",
              fontWeight: 800,
              fontSize: "82px",
              lineHeight: 0.9,
              textTransform: "uppercase",
              letterSpacing: "-0.03em",
              color: "transparent",
              marginBottom: "32px",
              // Outline text effect via text-shadow trick for Satori
              WebkitTextStroke: "2px #00E87A",
            }}
          >
            Shulman
          </span>

          {/* Role */}
          <span
            style={{
              fontFamily: "Fragment Mono",
              fontSize: "20px",
              color: "#00E87A",
              marginBottom: "16px",
            }}
          >
            Software Engineer + AI Builder
          </span>

          {/* Tagline */}
          <span
            style={{
              fontFamily: "Fragment Mono",
              fontSize: "14px",
              color: "#888898",
            }}
          >
            Next.js | Python | LangChain | Gemini | TypeScript | PostgreSQL
          </span>
        </div>

        {/* Bottom border accent */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "3px",
            display: "flex",
            background:
              "linear-gradient(90deg, transparent 0%, #00E87A 30%, #00E87A 70%, transparent 100%)",
          }}
        />
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "Syne",
          data: syneBold,
          weight: 800,
          style: "normal",
        },
        {
          name: "Fragment Mono",
          data: fragmentMono,
          weight: 400,
          style: "normal",
        },
      ],
    }
  );
}
