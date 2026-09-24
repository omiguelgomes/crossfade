import { ImageResponse } from "next/og";

// Branded social card. Matches the app's locked dark theme and coral→teal
// accent pair, so a shared link reads unmistakably as Crossfade.
export const alt = "Crossfade: the daily song-chain music puzzle";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0a0a0c",
          backgroundImage:
            "radial-gradient(900px 600px at 12% -10%, rgba(255,93,71,0.22), transparent 60%), radial-gradient(800px 600px at 92% 4%, rgba(47,216,194,0.20), transparent 55%)",
          color: "#f4f4f6",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 72, fontWeight: 700, letterSpacing: "-0.03em" }}>
          <span style={{ color: "#f4f4f6" }}>Cross</span>
          <span style={{ color: "#63636e" }}>fade</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          {/* Artist → song → artist row */}
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <Pill label="Drake" color="#ff5d47" />
            <Edge song="Crew Love" />
            <Pill label="The Weeknd" color="#c1a4c9" />
            <Edge song="Starboy" />
            <Pill label="Daft Punk" color="#2fd8c2" />
          </div>
          <div style={{ fontSize: 40, color: "#9a9aa6", maxWidth: 900 }}>
            Connect two artists by writing songs. A new music puzzle every day.
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}

function Pill({ label, color }: { label: string; color: string }) {
  return (
    <div
      style={{
        display: "flex",
        fontSize: 34,
        fontWeight: 600,
        padding: "18px 30px",
        borderRadius: 22,
        background: "#131318",
        border: "1px solid #26262f",
        boxShadow: `inset 5px 0 0 ${color}`,
      }}
    >
      {label}
    </div>
  );
}

function Edge({ song }: { song: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <div style={{ fontSize: 24, fontStyle: "italic", color: "#63636e" }}>{song}</div>
      <div style={{ fontSize: 34, color: "#63636e" }}>→</div>
    </div>
  );
}
