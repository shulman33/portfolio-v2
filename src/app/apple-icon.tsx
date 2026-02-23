import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#080810",
          color: "#00E87A",
          fontSize: 110,
          fontFamily: "monospace",
          fontWeight: 700,
          lineHeight: 1,
        }}
      >
        &gt;_
      </div>
    ),
    { ...size }
  );
}
