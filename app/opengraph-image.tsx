import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview, generated at build time from the same content the page uses,
 * so it can never drift from the site. Uses system-adjacent fonts rather than
 * fetching a webfont, which keeps the generation step offline and fast.
 */
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
          padding: 80,
          background: "#0c141f",
          backgroundImage:
            "radial-gradient(900px 500px at 85% -10%, rgba(242,178,92,0.16), transparent 60%)",
          color: "#e6ecf5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 28, height: 2, background: "#f2b25c" }} />
          <div style={{ fontSize: 24, color: "#8c9cb3" }}>{profile.location}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 92, letterSpacing: -3, lineHeight: 1 }}>
            {profile.name}
          </div>
          <div
            style={{
              fontSize: 34,
              color: "#8c9cb3",
              marginTop: 24,
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            {profile.role}: real-time collaboration, distributed systems, AWS.
          </div>
        </div>

        <div style={{ display: "flex", gap: 40, fontSize: 24, color: "#5d6b80" }}>
          <div>github.com/Talif787</div>
          <div>linkedin.com/in/talif-pathan</div>
        </div>
      </div>
    ),
    size,
  );
}
