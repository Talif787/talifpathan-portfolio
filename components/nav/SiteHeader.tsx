"use client";

import { useEffect, useState } from "react";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
import { Command } from "lucide-react";
import { navItems, profile } from "@/content";
import { indicatorSpring } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { CommandMenu } from "./CommandMenu";

/**
 * The header carries three pieces of state:
 *  - scrolled: switches the bar from transparent to a glass surface
 *  - active section: tracked with IntersectionObserver, not a scroll listener
 *  - command menu open
 *
 * The active indicator is a single element moved between links with a shared
 * layout id, so the highlight travels rather than blinking from one item to
 * the next. On small screens the command menu replaces the link row entirely,
 * which keeps one navigation model instead of two.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState<string>(navItems[0]?.sectionId ?? "");
  const [menuOpen, setMenuOpen] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const sentinel = document.getElementById("scroll-sentinel");
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { rootMargin: "0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((element): element is HTMLElement => element !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-25% 0px -55% 0px", threshold: [0.1, 0.5, 1] },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a
        href="#main"
        className={cn(
          "sr-only focus:not-sr-only focus:fixed focus:left-gutter focus:top-3 focus:z-[80]",
          "focus:rounded-inline focus:border focus:border-line focus:bg-surface",
          "focus:px-4 focus:py-2 focus:text-xs focus:text-ink",
        )}
      >
        Skip to content
      </a>

      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 h-[var(--header-h)]",
          "transition-[background-color,border-color,backdrop-filter] duration-card ease-standard",
          scrolled
            ? "glass border-b border-line"
            : "border-b border-transparent bg-transparent",
        )}
      >
        <nav
          aria-label="Primary"
          className="shell flex h-full items-center justify-between gap-m"
        >
          <a
            href="#top"
            className="rounded-inline text-xs mono tracking-tight text-ink"
          >
            {profile.name}
          </a>

          <LayoutGroup id="nav">
            <ul className="hidden items-center gap-1 md:flex">
              {navItems.map((item) => {
                const isActive = active === item.sectionId;
                return (
                  <li key={item.sectionId}>
                    <a
                      href={item.href}
                      aria-current={isActive ? "true" : undefined}
                      className={cn(
                        "relative inline-flex items-center rounded-inline px-3 py-1.5 text-xs",
                        "transition-colors duration-ui ease-standard",
                        isActive ? "text-ink" : "text-muted hover:text-ink",
                      )}
                    >
                      {isActive ? (
                        <motion.span
                          aria-hidden
                          layoutId="nav-active"
                          transition={reduced ? { duration: 0 } : indicatorSpring}
                          className="absolute inset-0 rounded-inline border border-line bg-surface"
                        />
                      ) : null}
                      <span className="relative">{item.label}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </LayoutGroup>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            className={cn(
              "inline-flex h-9 items-center gap-2 rounded-inline border border-line",
              "bg-surface px-3 text-xs text-muted",
              "transition-colors duration-ui ease-standard hover:border-line-strong hover:text-ink",
            )}
          >
            <Command aria-hidden className="size-3.5" />
            <span className="md:hidden">Menu</span>
            <span className="hidden md:inline mono">K</span>
          </button>
        </nav>
      </header>

      <CommandMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
