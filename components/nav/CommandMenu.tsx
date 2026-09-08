"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Check, Copy, CornerDownLeft, Search } from "lucide-react";
import { dialogVariants, overlayVariants } from "@/lib/motion";
import { navItems, profile, secondaryNavItems } from "@/content";
import { cn } from "@/lib/utils";

type Command = {
  id: string;
  label: string;
  group: "Navigate" | "Open" | "Copy";
  hint?: string;
  run: () => void;
  external?: boolean;
};

/**
 * Command palette. Doubles as the mobile navigation menu, so there is one
 * navigation model on the site rather than two that can drift apart.
 *
 * Accessibility: focus moves into the input on open and returns to the trigger
 * on close, the surface is a labelled modal dialog, the results are a listbox
 * driven by aria-activedescendant, and every action is reachable by keyboard.
 * Every command here maps to a destination that actually exists.
 */
export function CommandMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const restoreFocusRef = useRef<HTMLElement | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(profile.emails.personal);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is unavailable over http or when permission is denied.
      // Fall back to the mail client rather than failing silently.
      window.location.href = `mailto:${profile.emails.personal}`;
    }
  }, []);

  const commands = useMemo<Command[]>(() => {
    const goTo = (hash: string) => () => {
      close();
      document
        .querySelector(hash)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.replaceState(null, "", hash);
    };

    const list: Command[] = [...navItems, ...secondaryNavItems].map((item) => ({
      id: `nav-${item.sectionId}`,
      label: `Go to ${item.label.toLowerCase()}`,
      group: "Navigate",
      run: goTo(item.href),
    }));

    for (const social of profile.socials) {
      if (social.icon === "mail") continue;
      list.push({
        id: `open-${social.label}`,
        label: `Open ${social.label}`,
        group: "Open",
        hint: social.handle,
        external: true,
        run: () => {
          window.open(social.href, "_blank", "noopener,noreferrer");
          close();
        },
      });
    }

    if (profile.resumeUrl) {
      list.push({
        id: "open-resume",
        label: "Open resume",
        group: "Open",
        external: true,
        run: () => {
          window.open(profile.resumeUrl as string, "_blank", "noopener,noreferrer");
          close();
        },
      });
    }

    list.push(
      {
        id: "copy-email",
        label: "Copy email address",
        group: "Copy",
        hint: profile.emails.personal,
        run: copyEmail,
      },
      {
        id: "send-email",
        label: "Send an email",
        group: "Open",
        hint: profile.emails.personal,
        run: () => {
          window.location.href = `mailto:${profile.emails.personal}`;
          close();
        },
      },
    );

    return list;
  }, [close, copyEmail]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return commands;
    return commands.filter((command) =>
      `${command.label} ${command.hint ?? ""}`.toLowerCase().includes(term),
    );
  }, [commands, query]);

  // Global shortcut. Registered once, independent of open state.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        restoreFocusRef.current = document.activeElement as HTMLElement;
        onOpenChange(!open);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onOpenChange, open]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
      restoreFocusRef.current?.focus();
      return;
    }
    restoreFocusRef.current =
      restoreFocusRef.current ?? (document.activeElement as HTMLElement);
    const frame = requestAnimationFrame(() => inputRef.current?.focus());
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
    };
  }, [open]);

  useEffect(() => setActiveIndex(0), [query]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => (results.length ? (index + 1) % results.length : 0));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) =>
        results.length ? (index - 1 + results.length) % results.length : 0,
      );
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      results[activeIndex]?.run();
      return;
    }
    if (event.key === "Tab") {
      // Single focusable surface: keep focus inside the dialog.
      event.preventDefault();
    }
  };

  let lastGroup: Command["group"] | null = null;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="command"
          className="fixed inset-0 z-[70] flex items-start justify-center px-gutter pt-[18vh]"
          initial={reduced ? false : "hidden"}
          animate={reduced ? undefined : "visible"}
          exit={reduced ? undefined : "hidden"}
          variants={reduced ? undefined : overlayVariants}
        >
          <div
            aria-hidden
            onClick={close}
            className="absolute inset-0 bg-scrim backdrop-blur-[2px]"
          />

          <motion.div
            ref={surfaceRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            onKeyDown={onKeyDown}
            variants={reduced ? undefined : dialogVariants}
            className="glass relative w-full max-w-xl overflow-hidden rounded-panel shadow-panel"
          >
            <div className="flex items-center gap-s border-b border-line px-l">
              <Search aria-hidden className="size-4 shrink-0 text-faint" />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="text"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-results"
                aria-activedescendant={results[activeIndex]?.id}
                aria-autocomplete="list"
                placeholder="Jump to a section or open a link"
                className="h-12 w-full bg-transparent text-base text-ink outline-none placeholder:text-faint"
              />
              <kbd className="chip hidden sm:inline-flex">esc</kbd>
            </div>

            <ul
              id="command-results"
              role="listbox"
              aria-label="Commands"
              className="max-h-[min(24rem,50vh)] overflow-y-auto p-xs"
            >
              {results.length === 0 ? (
                <li className="px-m py-l text-xs text-muted">
                  Nothing matches that. Try a section name, GitHub, or email.
                </li>
              ) : (
                results.map((command, index) => {
                  const showGroup = command.group !== lastGroup;
                  lastGroup = command.group;
                  const isActive = index === activeIndex;
                  const isCopied = copied && command.id === "copy-email";

                  return (
                    <li key={command.id}>
                      {showGroup ? (
                        <p className="mono px-m pb-1 pt-m text-2xs text-faint">
                          {command.group}
                        </p>
                      ) : null}
                      <button
                        id={command.id}
                        role="option"
                        aria-selected={isActive}
                        type="button"
                        tabIndex={-1}
                        onMouseMove={() => setActiveIndex(index)}
                        onClick={command.run}
                        className={cn(
                          "flex w-full items-center gap-s rounded-node px-m py-2.5 text-left",
                          "transition-colors duration-micro ease-standard",
                          isActive ? "bg-surface-raised text-ink" : "text-muted",
                        )}
                      >
                        <span className="flex-1 text-xs">
                          {isCopied ? "Copied to clipboard" : command.label}
                        </span>
                        {command.hint ? (
                          <span className="mono hidden text-2xs text-faint sm:inline">
                            {command.hint}
                          </span>
                        ) : null}
                        {isCopied ? (
                          <Check aria-hidden className="size-3.5 text-ok" />
                        ) : command.id === "copy-email" ? (
                          <Copy aria-hidden className="size-3.5 text-faint" />
                        ) : command.external ? (
                          <ArrowUpRight aria-hidden className="size-3.5 text-faint" />
                        ) : (
                          <CornerDownLeft
                            aria-hidden
                            className={cn(
                              "size-3.5 text-faint transition-opacity duration-micro",
                              isActive ? "opacity-100" : "opacity-0",
                            )}
                          />
                        )}
                      </button>
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
