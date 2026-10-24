import { ImageResponse } from "next/og";

export const alt = "DeployDex — the home of BOT Chain dApps";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
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
        <div style={{ fontSize: 34, color: "#FF5C00" }}>DeployDex</div>
        <div style={{ fontSize: 96, lineHeight: 1.02, marginTop: 20, letterSpacing: -4 }}>
          The home of BOT Chain dApps.
        </div>
        <div style={{ fontSize: 36, marginTop: 28, color: "#444" }}>Ship it. List it. Get starred.</div>
      </div>
    ),
    size,
  );
}
