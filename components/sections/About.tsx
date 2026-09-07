import { awards, credentials, education, profile } from "@/content";
import { Section } from "@/components/primitives/Section";

export function About() {
  return (
    <Section
      id="about"
      label="About"
      title="Engineer first, then whatever the problem needs"
    >
      <div className="grid gap-2xl lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="measure">
          <p className="text-lg text-muted">{profile.summary}</p>
        </div>

        <div className="flex flex-col gap-l">
          <div className="sheet p-l">
            <h3 className="text-xs text-faint">Education</h3>
            <p className="mt-s text-base text-ink">{education.credential}</p>
            <p className="mt-2xs text-xs text-muted">{education.institution}</p>
            <p className="mt-2xs text-2xs mono text-faint">{education.detail}</p>
          </div>

          <div className="sheet p-l">
            <h3 className="text-xs text-faint">Certifications</h3>
            <ul className="mt-s flex flex-col gap-m">
              {credentials.map((item) => (
                <li key={item.name}>
                  <p className="text-base text-ink">{item.name}</p>
                  <p className="mt-2xs text-2xs mono text-faint">{item.period}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="sheet p-l">
            <h3 className="text-xs text-faint">Recognition</h3>
            <ul className="mt-s flex flex-col gap-m">
              {awards.map((item) => (
                <li key={item.name}>
                  <p className="text-base text-ink">{item.name}</p>
                  <p className="mt-2xs text-2xs mono text-faint">
                    {item.issuer}, {item.year}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Section>
  );
}
