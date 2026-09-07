import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Reveal } from "@/components/motion/Reveal";

type SectionProps = {
  id: string;
  /** Short label shown on the left rail. Doubles as the accessible name. */
  label: string;
  title: string;
  intro?: string;
  /** Content rendered under the rail label, above the title. */
  aside?: React.ReactNode;
  /** Skip content-visibility for above-the-fold sections. */
  eager?: boolean;
  className?: string;
  children: React.ReactNode;
};

/**
 * Every section shares one structure: a left rail carrying the label and any
 * supporting metadata, and a content column. Left aligned throughout, so the
 * page reads as documentation rather than a stack of centred marketing blocks.
 */
export function Section({
  id,
  label,
  title,
  intro,
  aside,
  eager = false,
  className,
  children,
}: SectionProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("py-section", !eager && "section-defer", className)}
    >
      <Container>
        <Reveal>
          <div className="rail">
            <div className="flex flex-col gap-m">
              <span className="rail-mark">{label}</span>
              {aside}
            </div>
            <div>
              <h2 id={headingId} className="text-3xl measure-tight">
                {title}
              </h2>
              {intro ? (
                <p className="mt-l measure text-muted text-lg">{intro}</p>
              ) : null}
            </div>
          </div>
        </Reveal>
        <div className="mt-xl lg:mt-2xl">{children}</div>
      </Container>
    </section>
  );
}
