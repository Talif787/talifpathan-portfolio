import { ArrowUpRight } from "lucide-react";
import type { Project } from "@/content";
import { ChipList } from "@/components/primitives/Chip";
import { ArchitectureFlow } from "@/components/motion/ArchitectureFlow";
import { Disclosure } from "@/components/motion/Disclosure";
import { cn } from "@/lib/utils";

/**
 * Projects are rows, not cards.
 *
 * A card grid forces every project into the same rectangle regardless of how
 * much there is to say. A row gives the architecture strip room to breathe and
 * lets detail open in place, which is also the honest interaction: the reader
 * asked for more, so more appears where they were already looking.
 *
 * Only the disclosure is a client component. The row, the chips and the
 * diagram are all server rendered.
 */
export function ProjectRow({ project }: { project: Project }) {
  const hasLinks = Boolean(project.links.demo || project.links.repo);

  return (
    <article
      className={cn(
        "group/row border-t border-line py-xl",
        "first:border-t-0 first:pt-0",
      )}
    >
      <div className="grid gap-l lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-2xl">
        <div className="min-w-0">
          <h3 className="text-2xl">{project.name}</h3>
          <p className="mt-2xs text-lg text-muted">{project.kicker}</p>
          <p className="mt-m measure text-base text-muted">{project.problem}</p>

          <div className="mt-l">
            <ChipList items={project.stack} label={`${project.name} stack`} />
          </div>

          <Disclosure
            className="mt-l"
            openLabel="What it does"
            closeLabel="Hide details"
            summary={
              hasLinks ? (
                <div className="flex flex-wrap items-center gap-l">
                  {project.links.demo ? (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 rounded-inline text-xs text-ink"
                    >
                      <span className="link-underline">Open live demo</span>
                      <ArrowUpRight
                        aria-hidden
                        className={cn(
                          "size-3.5 text-accent",
                          "transition-transform duration-micro ease-standard",
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
              ) : null
            }
          >
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
          </Disclosure>
        </div>

        <div className="sheet min-w-0 p-l lg:self-start">
          <ArchitectureFlow
            caption={project.architecture.caption}
            nodes={project.architecture.nodes}
          />
        </div>
      </div>
    </article>
  );
}
