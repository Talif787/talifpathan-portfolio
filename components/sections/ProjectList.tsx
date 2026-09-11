"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { projects } from "@/content";
import type { ProjectDomain } from "@/content";
import { layoutSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { ProjectRow } from "./ProjectRow";

const domains: ProjectDomain[] = [
  "Distributed systems",
  "Platform engineering",
  "AI systems",
  "Products",
];

type Filter = "All" | ProjectDomain;

/**
 * Filtering fourteen projects.
 *
 * This is the one place Motion's layout animation earns its place: rows
 * physically reposition when the filter changes, and animating that with
 * `layout` is both simpler and more correct than computing offsets by hand.
 * Under reduced motion the reorder is instant and the presence animation is
 * dropped, so nothing is left mid-transform.
 *
 * Filters are single-assignment, so the counts add up to the total and no
 * project is reachable from two filters. Featured projects sort first within
 * whatever is showing, and "All" is the default so nothing is hidden on load.
 */
export function ProjectList() {
  const [filter, setFilter] = useState<Filter>("All");
  const reduced = useReducedMotion();

  const counts = useMemo(() => {
    const map = new Map<Filter, number>([["All", projects.length]]);
    for (const domain of domains) {
      map.set(domain, projects.filter((project) => project.domain === domain).length);
    }
    return map;
  }, []);

  const visible = useMemo(() => {
    const list =
      filter === "All"
        ? projects
        : projects.filter((project) => project.domain === filter);
    return [...list].sort((a, b) => Number(b.featured) - Number(a.featured));
  }, [filter]);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter projects by area"
        className="flex flex-wrap gap-2xs border-b border-line pb-l"
      >
        {(["All", ...domains] as Filter[]).map((option) => (
          <button
            key={option}
            type="button"
            aria-pressed={filter === option}
            onClick={() => setFilter(option)}
            className={cn("chip", "cursor-pointer")}
          >
            {option}
            <span className="chip-count">{counts.get(option)}</span>
          </button>
        ))}
      </div>

      <p aria-live="polite" className="sr-only">
        Showing {visible.length} of {projects.length} projects
        {filter === "All" ? "" : ` in ${filter}`}.
      </p>

      <LayoutGroup id="projects">
        <div className="mt-xl flex flex-col">
          <AnimatePresence initial={false} mode="popLayout">
            {visible.map((project) => (
              <motion.div
                key={project.slug}
                layout={reduced ? false : "position"}
                transition={reduced ? { duration: 0 } : layoutSpring}
                initial={reduced ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduced ? { opacity: 0 } : { opacity: 0, y: -8 }}
                className="min-w-0"
              >
                <ProjectRow project={project} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </LayoutGroup>
    </div>
  );
}
