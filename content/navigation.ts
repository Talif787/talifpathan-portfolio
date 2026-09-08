import type { NavItem } from "./types";

/**
 * Each entry must match a section id rendered on the page. SiteHeader observes
 * these ids for the active indicator and CommandMenu builds its Navigate group
 * from the same list, so there is one source of truth for navigation.
 */
export const navItems: NavItem[] = [
  { label: "Projects", href: "#projects", sectionId: "projects" },
  { label: "Experience", href: "#experience", sectionId: "experience" },
  { label: "Skills", href: "#skills", sectionId: "skills" },
  { label: "Education", href: "#education", sectionId: "education" },
  { label: "About", href: "#about", sectionId: "about" },
  { label: "Contact", href: "#contact", sectionId: "contact" },
];

/** Reachable from the command menu and the footer, but not the header row. */
export const secondaryNavItems: NavItem[] = [
  { label: "Recognition", href: "#recognition", sectionId: "recognition" },
  { label: "References", href: "#references", sectionId: "references" },
];
