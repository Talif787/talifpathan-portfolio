import { experience } from "@/content";
import { Section } from "@/components/primitives/Section";
import { ChipList } from "@/components/primitives/Chip";
import { Disclosure } from "@/components/motion/Disclosure";

/**
 * Scannable first, detailed on request. A recruiter reads role, organisation
 * and one line; anyone who wants the substance opens it.
 *
 * The vertical rule is a real timeline (entries are in reverse order), which is
 * why an ordered list and a connecting line are appropriate here and numbered
 * markers are not used anywhere else on the page.
 */
export function Experience() {
  return (
    <Section
      id="experience"
      label="Experience"
      title="Four years of shipping into production systems"
      intro="Three roles at Capgemini and a teaching assistantship at Northeastern, most recent first."
    >
      <ol className="relative flex flex-col">
        <span
          aria-hidden
          className="absolute inset-y-2 start-0 w-px bg-line md:start-[7.5rem]"
        />
        {experience.map((entry) => (
          <li key={entry.id} className="relative ps-l md:ps-0">
            <div className="grid gap-m py-l md:grid-cols-[7.5rem_minmax(0,1fr)] md:gap-2xl">
              <div className="md:pe-l md:text-end">
                <span className="text-2xs mono text-faint">
                  {entry.period ?? entry.organisation}
                </span>
              </div>

              <div className="relative min-w-0 md:ps-l">
                <span
                  aria-hidden
                  className="absolute -start-[3px] top-[0.55em] size-1.5 rounded-chip bg-accent md:start-[-3px]"
                />
                <h3 className="text-xl">{entry.role}</h3>
                <p className="mt-2xs text-xs text-muted">{entry.organisation}</p>
                <p className="mt-s measure text-base text-muted">{entry.summary}</p>

                <Disclosure className="mt-m" openLabel="Contributions">
                  <ul className="measure space-y-s">
                    {entry.contributions.map((item) => (
                      <li
                        key={item}
                        className="relative ps-l text-base text-muted before:absolute before:start-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent-line"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-l">
                    <ChipList items={entry.stack} label={`${entry.role} stack`} />
                  </div>
                </Disclosure>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Section>
  );
}
