import { projects } from "@/content";
import { Section } from "@/components/primitives/Section";
import { ProjectList } from "./ProjectList";

export function Projects() {
  return (
    <Section
      id="projects"
      label="Projects"
      title="Fourteen systems, every one with public source"
      intro="Consensus written from scratch, a storage engine built from first principles, control planes, event-driven platforms and real-time products. Filter by area, or open any project for the engineering detail."
      aside={
        <p className="text-2xs mono text-faint">
          {projects.length} projects, {projects.filter((p) => p.links.demo).length} with
          live deployments
        </p>
      }
    >
      <ProjectList />
    </Section>
  );
}
