"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronDown } from "lucide-react";
import { disclosureVariants } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * One disclosure implementation, shared by projects and experience.
 *
 * Height is animated with a spring because the surrounding layout physically
 * moves and the reader needs to follow it. The trigger is a real <button> with
 * aria-expanded and aria-controls, so the interaction works from the keyboard
 * and is announced correctly.
 */
export function Disclosure({
  summary,
  openLabel = "Show details",
  closeLabel = "Hide details",
  className,
  children,
}: {
  summary?: React.ReactNode;
  openLabel?: string;
  closeLabel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const reduced = useReducedMotion();
  const panelId = useId();

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex flex-wrap items-center gap-m">
        {summary}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls={panelId}
          className={cn(
            "group inline-flex items-center gap-1.5 rounded-inline text-xs text-muted",
            "transition-colors duration-ui ease-standard hover:text-ink",
          )}
        >
          {open ? closeLabel : openLabel}
          <ChevronDown
            aria-hidden
            className={cn(
              "size-3.5 transition-transform duration-card ease-standard",
              open && "rotate-180",
            )}
          />
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id={panelId}
            key="panel"
            className="overflow-hidden"
            variants={reduced ? undefined : disclosureVariants}
            initial={reduced ? false : "collapsed"}
            animate={reduced ? undefined : "expanded"}
            exit={reduced ? undefined : "collapsed"}
          >
            <div className="pt-l">{children}</div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
