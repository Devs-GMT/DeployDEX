import { ImageResponse } from "next/og";

export const alt = "DeployDex — the home of BOT Chain dApps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "linear-gradient(180deg,#9ec6e4,#eef0f0)",
        color: "#191919",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 18, fontSize: 34, color: "#FF5C00" }}
      >
        <svg width="64" height="64" viewBox="0 0 64 64">
          <rect width="64" height="64" rx="16" fill="#ff5c00" />
          <path
            fill="#fff"
            d="M14 24 L16.5 9.5 L26.5 19 H35 L45.5 10 L46.6 21.6 C50.6 25.4 52 30 52 35 C52 45.5 44.5 53 33 53 H18 C15.8 53 14 51.2 14 49 Z"
          />
          <ellipse cx="27" cy="35.5" rx="2.6" ry="3.4" fill="#191919" />
          <ellipse cx="39.5" cy="35.5" rx="2.6" ry="3.4" fill="#191919" />
          <path d="M31.4 41.2 h4.2 l-2.1 2.4 z" fill="#ff405d" />
        </svg>
        DeployDex
      </div>
      <div style={{ fontSize: 96, lineHeight: 1.02, marginTop: 20, letterSpacing: -4 }}>
        The home of BOT Chain dApps.
      </div>
      <div style={{ fontSize: 36, marginTop: 28, color: "#444" }}>
        Ship it. List it. Get starred.
      </div>
    </div>,
    size,
  );
}
