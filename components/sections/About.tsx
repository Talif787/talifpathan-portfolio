import { profile } from "@/content";
import { Section } from "@/components/primitives/Section";
import { StatusDot } from "@/components/primitives/StatusDot";
import { ReferencesBlock } from "./Testimonials";

/**
 * The side panel is a definition list, not a stack of headings. These are
 * term-and-value pairs, and marking them up as headings would put "Looking
 * for" and "Based in" into the document outline as peers of the references
 * heading nested below, which is outline noise rather than structure. This
 * also matches how the contact section already presents the same kind of data.
 */
export function About() {
  return (
    <Section
      id="about"
      label="About"
      title="Backend first, then whatever the problem needs"
      aside={<StatusDot label={profile.status} />}
    >
      <div className="flex flex-col gap-2xl">
        <div className="grid gap-2xl lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="measure flex flex-col gap-m">
            {profile.summary.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-lg text-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="flex flex-col gap-l">
            <div>
              <dt className="text-xs text-faint">Looking for</dt>
              <dd className="mt-2xs text-base text-ink">{profile.seeking}</dd>
            </div>
            <div>
              <dt className="text-xs text-faint">Based in</dt>
              <dd className="mt-2xs text-base text-ink">{profile.location}</dd>
            </div>
            <div>
              <dt className="text-xs text-faint">Languages</dt>
              <dd className="mt-2xs text-base text-ink">
                {profile.spokenLanguages.join(", ")}
              </dd>
            </div>
          </dl>
        </div>

        <ReferencesBlock />
      </div>
    </Section>
  );
}
