import { cn } from "@/lib/utils";

/**
 * A subsection inside a top-level Section.
 *
 * This exists so the document outline matches the navigation. Content that is
 * subordinate to a nav destination (certifications under education, references
 * under about) is nested here rather than sitting at the same level as the
 * things the header links to. Two consequences follow:
 *
 *  - the active nav indicator cannot be wrong, because every top-level section
 *    has a nav link and there are no orphaned siblings to land on
 *  - a screen reader user navigating by landmark gets exactly as many regions
 *    as the nav has links, with a correct h2 to h3 heading hierarchy
 *
 * It keeps its own id, so deep links from the footer and the command menu still
 * land on it directly.
 */
export function Subsection({
  id,
  title,
  intro,
  className,
  children,
}: {
  id: string;
  title: string;
  intro?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("border-t border-line pt-xl", className)}
    >
      <h3 id={headingId} className="text-xl">
        {title}
      </h3>
      {intro ? <p className="measure mt-s text-base text-muted">{intro}</p> : null}
      <div className="mt-l">{children}</div>
    </section>
  );
}
