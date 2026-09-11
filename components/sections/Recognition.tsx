import { awards, certifications, publications } from "@/content";
import { Subsection } from "@/components/primitives/Subsection";
import { Disclosure } from "@/components/motion/Disclosure";

const primaryCerts = certifications.filter((item) => item.primary);
const otherCerts = certifications.filter((item) => !item.primary);

/**
 * Nested inside the education section rather than standing alone, because
 * these are the credentials behind the degrees rather than a destination
 * someone navigates to. Keeps its own id so the footer and command menu can
 * still deep-link to it.
 *
 * Three short lists rather than nine cards: this is reference material a
 * reader scans once, and a card per item would give each the same visual
 * weight as a project.
 */
export function RecognitionBlock() {
  return (
    <Subsection id="recognition" title="Certifications, awards and published work">
      <div className="grid gap-2xl lg:grid-cols-3">
        <section aria-label="Certifications">
          <h4 className="text-xs text-faint">Certifications</h4>
          <ul className="mt-m flex flex-col gap-m">
            {primaryCerts.map((item) => (
              <li
                key={item.name}
                className="border-t border-line-faint pt-m first:border-t-0 first:pt-0"
              >
                <p className="text-base text-ink">{item.name}</p>
                <p className="mt-2xs text-2xs mono text-faint">
                  {item.issuer}
                  {item.period ? `, ${item.period}` : ""}
                </p>
              </li>
            ))}
          </ul>

          {otherCerts.length > 0 ? (
            <Disclosure
              className="mt-m"
              openLabel={`${otherCerts.length} more course certificates`}
              closeLabel="Hide course certificates"
            >
              <ul className="flex flex-col gap-xs">
                {otherCerts.map((item) => (
                  <li key={item.name} className="text-xs text-muted">
                    {item.name}
                  </li>
                ))}
              </ul>
            </Disclosure>
          ) : null}
        </section>

        <section aria-label="Awards">
          <h4 className="text-xs text-faint">Awards</h4>
          <ul className="mt-m flex flex-col gap-m">
            {awards.map((item) => (
              <li
                key={item.name}
                className="border-t border-line-faint pt-m first:border-t-0 first:pt-0"
              >
                <p className="text-base text-ink">{item.name}</p>
                <p className="mt-2xs text-2xs mono text-faint">
                  {item.issuer}, {item.year}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Publications">
          <h4 className="text-xs text-faint">Publications</h4>
          <ul className="mt-m flex flex-col gap-m">
            {publications.map((item) => (
              <li
                key={item.title}
                className="border-t border-line-faint pt-m first:border-t-0 first:pt-0"
              >
                <p className="text-base text-ink">{item.title}</p>
                <p className="mt-2xs text-2xs mono text-faint">
                  {item.venue}, {item.year}
                </p>
                {item.note ? (
                  <p className="mt-2xs text-xs text-faint">{item.note}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </Subsection>
  );
}
