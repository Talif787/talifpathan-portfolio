import { ArrowDown } from "lucide-react";
import { profile, projects } from "@/content";
import { Container } from "@/components/primitives/Container";
import { LinkButton } from "@/components/primitives/Button";
import { StatusDot } from "@/components/primitives/StatusDot";
import { ArchitectureFlow } from "@/components/motion/ArchitectureFlow";
import { SocialLinks } from "./SocialLinks";

/**
 * The hero answers three questions inside the first viewport: who this is,
 * what they build, and where to go next.
 *
 * The one distinctive element is the live message path underneath the
 * headline. It is not decoration: it is the real request path of the chat
 * platform below, and it introduces the motion motif that every project reuses.
 * Fully server rendered, animated in CSS, no client JavaScript.
 */
export function Hero() {
  const flagship = projects[0];

  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative pb-section pt-[calc(var(--header-h)_+_clamp(3rem,8vw,6rem))]"
    >
      {/* Hairline field: precise, quiet, and masked so it never competes. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.55]"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--c-line-faint) 1px, transparent 1px), linear-gradient(to bottom, var(--c-line-faint) 1px, transparent 1px)",
          backgroundSize: "clamp(3rem, 6vw, 5.5rem) clamp(3rem, 6vw, 5.5rem)",
          maskImage:
            "radial-gradient(120% 80% at 50% 0%, #000 20%, transparent 78%)",
          WebkitMaskImage:
            "radial-gradient(120% 80% at 50% 0%, #000 20%, transparent 78%)",
        }}
      />

      <Container>
        <div className="enter-seq flex flex-col items-start">
          <div
            style={{ "--i": 0 } as React.CSSProperties}
            className="flex flex-wrap items-center gap-x-l gap-y-xs"
          >
            <StatusDot label={profile.status} />
            <span className="text-2xs mono text-faint">{profile.location}</span>
          </div>

          <h1
            id="hero-heading"
            style={{ "--i": 1 } as React.CSSProperties}
            className="mt-l max-w-[18ch] text-display font-medium"
          >
            {profile.name}
          </h1>

          <p
            style={{ "--i": 2 } as React.CSSProperties}
            className="mt-l max-w-[34ch] text-2xl font-normal text-ink"
          >
            {profile.positioning}
          </p>

          <ul
            style={{ "--i": 3 } as React.CSSProperties}
            aria-label="Focus areas"
            className="mt-l flex flex-wrap items-center gap-x-l gap-y-xs"
          >
            {profile.focusAreas.map((area) => (
              <li key={area} className="text-xs text-muted">
                {area}
              </li>
            ))}
          </ul>

          <div
            style={{ "--i": 4 } as React.CSSProperties}
            className="mt-xl flex flex-wrap items-center gap-s"
          >
            <LinkButton href="#projects" variant="primary">
              View projects
              <ArrowDown aria-hidden className="size-4" />
            </LinkButton>
            {profile.resumeUrl ? (
              <LinkButton href={profile.resumeUrl} external>
                Resume
              </LinkButton>
            ) : null}
            <SocialLinks className="ms-2xs" />
          </div>

          {flagship ? (
            <div
              style={{ "--i": 5 } as React.CSSProperties}
              className="mt-2xl w-full max-w-3xl"
            >
              <ArchitectureFlow
                caption={`${flagship.name}: ${flagship.architecture.caption.toLowerCase()}`}
                nodes={flagship.architecture.nodes}
              />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}
