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
 *  - active section: computed from live section geometry once per frame
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

  /**
   * Active section, computed from live geometry.
   *
   * This deliberately does not use IntersectionObserver, which the first
   * version did and got wrong three ways:
   *
   *  1. The callback receives only the sections whose intersection *changed*,
   *     so picking a winner from that batch decided the active section from a
   *     partial view of the page instead of its whole current state.
   *  2. `intersectionRatio` is a fraction of the target's own height. Against a
   *     narrow rootMargin band, a very tall section scores near zero while a
   *     short one fully inside the band scores 1, so tall sections always lost.
   *  3. With thresholds above zero, a section taller than the band can never
   *     reach them, so it never reported as intersecting at all.
   *
   * Reading `getBoundingClientRect` for the handful of nav sections once per
   * animation frame is both cheaper to reason about and immune to the
   * `content-visibility: auto` reflows that happen as sections below the fold
   * render for the first time and grow past their intrinsic-size placeholder.
   */
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.sectionId))
      .filter((element): element is HTMLElement => element !== null)
      .sort((a, b) => a.offsetTop - b.offsetTop);

    if (sections.length === 0) return;

    let frame = 0;

    const compute = () => {
      frame = 0;
      const header = document.querySelector("header")?.offsetHeight ?? 0;
      // The line the reader is actually reading at: just under the header.
      const readingLine = header + window.innerHeight * 0.28;

      let current = sections[0].id;
      for (const section of sections) {
        if (section.getBoundingClientRect().top - readingLine > 0) break;
        current = section.id;
      }

      // At the foot of the page the last section wins even if its top sits
      // below the reading line, so the final nav item can always light up.
      const atBottom =
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) current = sections[sections.length - 1].id;

      setActive((previous) => (previous === current ? previous : current));
    };

    const schedule = () => {
      if (frame === 0) frame = requestAnimationFrame(compute);
    };

    compute();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    return () => {
      if (frame !== 0) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
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
            className="mono rounded-inline text-xs tracking-tight text-ink"
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
            <span className="mono hidden md:inline">K</span>
          </button>
        </nav>
      </header>

      <CommandMenu open={menuOpen} onOpenChange={setMenuOpen} />
    </>
  );
}
