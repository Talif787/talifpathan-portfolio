import { ArrowUpRight } from "lucide-react";
import { testimonials } from "@/content";
import { Subsection } from "@/components/primitives/Subsection";

/**
 * Nested inside the about section: what other people say about the work sits
 * naturally next to what the person says about themselves, and it is not a
 * destination someone navigates to independently. Keeps its own id for deep
 * links from the footer and command menu.
 *
 * Each reference states how the person knows the work, so a reader can weigh
 * the quote without cross-referencing the experience section.
 *
 * Static quotes rather than the auto-scrolling marquee this replaced: a
 * marquee that pauses only on hover is unreadable on touch, unreachable by
 * keyboard, and moves text the reader is trying to read.
 */
export function ReferencesBlock() {
  return (
    <Subsection
      id="references"
      title="What managers and professors have written"
      intro="Excerpts from letters of recommendation, all four writers linked."
    >
      <div className="grid gap-l md:grid-cols-2">
        {testimonials.map((testimonial) => (
          <figure key={testimonial.id} className="sheet flex flex-col p-l">
            <blockquote className="flex-1 text-base text-muted">
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-l border-t border-line-faint pt-m">
              <a
                href={testimonial.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="group/ref inline-flex items-center gap-1.5 rounded-inline text-base text-ink"
              >
                <span className="link-underline">{testimonial.name}</span>
                <ArrowUpRight
                  aria-hidden
                  className="size-3.5 text-accent transition-transform duration-micro ease-standard group-hover/ref:-translate-y-0.5 group-hover/ref:translate-x-0.5"
                />
              </a>
              <p className="mt-2xs text-xs text-faint">{testimonial.title}</p>
              <p className="mono mt-2xs text-2xs text-faint">
                {testimonial.relationship}
              </p>
            </figcaption>
          </figure>
        ))}
      </div>
    </Subsection>
  );
}
