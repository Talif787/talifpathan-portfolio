import { ImageResponse } from "next/og";
import { profile } from "@/content";

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Social preview, generated at build time from the same content the page uses,
 * so it can never drift from the site.
 *
 * Satori implements a subset of CSS and JSX. Three constraints apply:
 *  - radial-gradient needs a shape keyword before `at`; the browser form
 *    `radial-gradient(900px 500px at 85% -10%, ...)` is rejected.
 *  - gradient stops use an explicit zero-alpha colour rather than `transparent`,
 *    which can interpolate through black and leave a grey fringe.
 *  - any element with more than one child needs an explicit display value, and
 *    an interpolation sitting next to literal text counts as two children. All
 *    text below is therefore a single template literal.
 */
const headline = `${profile.role}: real-time collaboration, distributed systems, AWS.`;
const handles = profile.socials
  .filter((social) => social.icon !== "mail")
  .map((social) => social.href.replace(/^https?:\/\/(www\.)?/, ""));

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
          backgroundColor: "#0c141f",
          backgroundImage:
            "radial-gradient(circle at 85% 0%, rgba(242,178,92,0.18), rgba(242,178,92,0) 55%)",
          color: "#e6ecf5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ width: 28, height: 2, backgroundColor: "#f2b25c" }} />
          <div style={{ display: "flex", marginLeft: 16, fontSize: 24, color: "#8c9cb3" }}>
            {profile.location}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 92, letterSpacing: -3, lineHeight: 1 }}>
            {profile.name}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 34,
              color: "#8c9cb3",
              marginTop: 24,
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            {headline}
          </div>
        </div>

        <div style={{ display: "flex", fontSize: 24, color: "#5d6b80" }}>
          {handles.map((handle) => (
            <div key={handle} style={{ display: "flex", marginRight: 40 }}>
              {handle}
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
