import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content";
import { ChipList } from "@/components/primitives/Chip";
import { MetricStrip } from "@/components/primitives/MetricStrip";
import { ArchitectureFlow } from "@/components/motion/ArchitectureFlow";
import { Disclosure } from "@/components/motion/Disclosure";
import { cn } from "@/lib/utils";

/**
 * Projects are rows, not cards. Fourteen identical cards would be exactly the
 * repetitive grid this is meant to avoid, so the row differentiates by weight:
 *
 *  - featured: architecture strip and metrics visible inline, in a two-column
 *    layout, so the deepest work reads as deepest at a glance.
 *  - compact: name, problem, metrics and stack inline, with the architecture
 *    and the full engineering detail behind one disclosure.
 *
 * Both variants share every primitive, so nothing new enters the design system.
 */
export function ProjectRow({ project }: { project: Project }) {
  const featured = project.featured;
  const links = (
    <div className="flex flex-wrap items-center gap-l">
      {project.links.demo ? (
        <a
          href={project.links.demo}
          target="_blank"
          rel="noopener noreferrer"
          className="group/link inline-flex items-center gap-1.5 rounded-inline text-xs text-ink"
        >
          <span className="link-underline">Live</span>
          <ArrowUpRight
            aria-hidden
            className={cn(
              "size-3.5 text-accent transition-transform duration-micro ease-standard",
              "group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5",
            )}
          />
        </a>
      ) : null}
      {project.links.repo ? (
        <a
          href={project.links.repo}
          target="_blank"
          rel="noopener noreferrer"
          className="link-underline text-xs text-muted hover:text-ink"
        >
          Source
        </a>
      ) : null}
    </div>
  );

  const detail = (
    <>
      <ul className="measure space-y-s">
        {project.highlights.map((highlight) => (
          <li
            key={highlight}
            className="relative ps-l text-base text-muted before:absolute before:start-0 before:top-[0.7em] before:h-px before:w-3 before:bg-accent-line"
          >
            {highlight}
          </li>
        ))}
      </ul>

      {!featured ? (
        <div className="sheet mt-l max-w-2xl p-l">
          <ArchitectureFlow
            caption={project.architecture.caption}
            nodes={project.architecture.nodes}
          />
        </div>
      ) : null}

      {project.ownership ? (
        <div className="measure mt-l border-t border-line-faint pt-m">
          <h4 className="mono text-2xs text-faint">My part</h4>
          <p className="mt-2xs text-base text-muted">{project.ownership}</p>
          {project.collaborators?.length ? (
            <p className="mt-s text-xs text-faint">
              Built with{" "}
              {project.collaborators
                .map((person) => `${person.name} (${person.scope})`)
                .join(", ")}
              .
            </p>
          ) : null}
        </div>
      ) : null}
    </>
  );

  const head = (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline gap-x-s gap-y-2xs">
        <p className="mono text-2xs text-faint">
          {project.period ? `${project.context}, ${project.period}` : project.context}
        </p>
        {featured ? <p className="mono text-2xs text-accent">Featured</p> : null}
      </div>
      <h3 className={cn("mt-2xs", featured ? "text-2xl" : "text-xl")}>
        {project.name}
      </h3>
      <p className="mt-2xs text-lg text-muted">{project.kicker}</p>
      <p className="measure mt-m text-base text-muted">{project.problem}</p>

      {project.metrics ? (
        <MetricStrip
          className="mt-l"
          metrics={project.metrics}
          label={`${project.name} measurements`}
        />
      ) : null}

      <div className="mt-l">
        <ChipList items={project.stack} label={`${project.name} stack`} />
      </div>

      <Disclosure
        className="mt-l"
        openLabel="Engineering detail"
        closeLabel="Hide detail"
        summary={links}
      >
        {detail}
      </Disclosure>
    </div>
  );

  return (
    <article className="border-t border-line py-xl first:border-t-0 first:pt-0">
      {featured ? (
        <div className="grid gap-l lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-2xl">
          {head}
          <div className="sheet min-w-0 p-l lg:self-start">
            <ArchitectureFlow
              caption={project.architecture.caption}
              nodes={project.architecture.nodes}
            />
          </div>
        </div>
      ) : (
        head
      )}
    </article>
  );
}
