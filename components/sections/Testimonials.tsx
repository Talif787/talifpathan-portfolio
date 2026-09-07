import { ArrowUpRight } from "lucide-react";
import { testimonials } from "@/content";
import { Section } from "@/components/primitives/Section";

/**
 * Replaces the previous auto-scrolling marquee. A marquee that pauses only on
 * hover is unreadable on touch, unreachable by keyboard, and moves text the
 * reader is trying to read. Static quotes cost nothing and work everywhere.
 */
export function Testimonials() {
  return (
    <Section
      id="testimonials"
      label="References"
      title="What managers and professors have written"
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
            </figcaption>
          </figure>
        ))}
      </div>
    </Section>
  );
}
