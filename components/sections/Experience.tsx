import { organisations } from "@/content";
import { Section } from "@/components/primitives/Section";
import { ChipList } from "@/components/primitives/Chip";
import { Disclosure } from "@/components/motion/Disclosure";

/**
 * Roles nest under their employer, so three roles at one company read as one
 * progression rather than three unrelated jobs.
 *
 * Scannable first, detailed on request: a recruiter reads employer, title,
 * dates and one line; anyone who wants the substance opens it. Contributions
 * are grouped by theme because these roles cover a lot of ground and an
 * undifferentiated bullet list of twelve items is unreadable.
 */
export function Experience() {
  return (
    <Section
      id="experience"
      label="Experience"
      title="Four employers, seven roles, one throughline"
      intro="Almost four years at Capgemini on an automotive platform built with Amazon, then teaching databases and distributed systems at Northeastern. Most recent first."
    >
      <div className="flex flex-col gap-2xl">
        {organisations.map((org) => (
          <section key={org.id} aria-label={org.name}>
            <header className="flex flex-col gap-2xs border-b border-line pb-m md:flex-row md:items-baseline md:justify-between">
              <div>
                <h3 className="text-xl">{org.name}</h3>
                {org.detail ? (
                  <p className="mt-2xs text-xs text-muted">{org.detail}</p>
                ) : null}
              </div>
              <p className="text-2xs mono text-faint md:text-end">{org.period}</p>
            </header>

            <ol className="relative mt-l flex flex-col gap-l">
              <span aria-hidden className="org-rule" />
              {org.roles.map((role) => (
                <li key={role.id} className="relative ps-l">
                  <span
                    aria-hidden
                    className="absolute left-0 top-[0.6em] size-1.5 -translate-x-1/2 rounded-chip bg-accent"
                  />
                  <div className="flex flex-col gap-2xs md:flex-row md:items-baseline md:justify-between md:gap-l">
                    <h4 className="text-lg text-ink">{role.title}</h4>
                    <p className="shrink-0 text-2xs mono text-faint">{role.period}</p>
                  </div>
                  <p className="mt-2xs text-2xs mono text-faint">
                    {role.term ? `${role.term}, ${role.location}` : role.location}
                  </p>
                  <p className="mt-s measure text-base text-muted">{role.summary}</p>

                  {role.contributions.length > 0 ? (
                    <Disclosure className="mt-m" openLabel="Contributions">
                      <div className="flex flex-col gap-l">
                        {role.contributions.map((group) => (
                          <div key={group.theme}>
                            <h5 className="text-2xs mono text-accent">{group.theme}</h5>
                            <ul className="mt-s measure space-y-s">
                              {group.items.map((item) => (
                                <li
                                  key={item}
                                  className="relative ps-l text-base text-muted before:absolute before:start-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent-line"
                                >
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>

                      {role.note ? (
                        <p className="mt-l text-xs text-faint">{role.note}</p>
                      ) : null}

                      {role.stack.length > 0 ? (
                        <div className="mt-l">
                          <ChipList items={role.stack} label={`${role.title} stack`} />
                        </div>
                      ) : null}
                    </Disclosure>
                  ) : null}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
    </Section>
  );
}
