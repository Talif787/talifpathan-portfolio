import { projects } from "@/content";
import { Section } from "@/components/primitives/Section";
import { ProjectRow } from "./ProjectRow";

export function Projects() {
  return (
    <Section
      id="projects"
      label="Projects"
      title="Systems where the hard part is keeping clients in agreement"
      intro="Both of these are real-time products. The interesting engineering is not the interface, it is what happens between a keystroke and everyone else seeing it."
    >
      <div className="flex flex-col">
        {projects.map((project) => (
          <ProjectRow key={project.slug} project={project} />
        ))}
      </div>
    </Section>
  );
}
