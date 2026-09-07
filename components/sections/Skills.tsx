import { skillGroups } from "@/content";
import { Section } from "@/components/primitives/Section";
import { Chip } from "@/components/primitives/Chip";

/**
 * Grouped by what the technology does, not by badge count, and with no
 * proficiency percentages: a number nobody can verify is worth less than the
 * shipped system it came from. Each group's description says why the cluster
 * exists.
 */
export function Skills() {
  return (
    <Section
      id="skills"
      label="Skills"
      title="What I reach for, grouped by the job it does"
      intro="Every entry here appears in a project or a role on this page."
    >
      <div className="grid gap-px overflow-hidden rounded-sheet border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
        {skillGroups.map((group) => (
          <section key={group.name} className="bg-base p-l">
            <h3 className="text-lg">{group.name}</h3>
            <p className="mt-2xs text-xs text-faint">{group.description}</p>
            <ul className="mt-m flex flex-wrap gap-2xs">
              {group.items.map((item) => (
                <li key={item}>
                  <Chip>{item}</Chip>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Section>
  );
}
