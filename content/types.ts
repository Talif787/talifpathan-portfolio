/**
 * Content model for the portfolio.
 *
 * Every field here is presentation-agnostic. Sections read from `content/*`
 * and never hardcode copy, so updating the portfolio means editing data,
 * not JSX.
 */

export type SocialLink = {
  label: string;
  href: string;
  handle: string;
  icon: "github" | "linkedin" | "mail";
};

export type NavItem = {
  label: string;
  href: string;
  /** DOM id of the section this item scrolls to. */
  sectionId: string;
};

export type Profile = {
  name: string;
  initials: string;
  role: string;
  positioning: string;
  summary: string;
  location: string;
  status: string;
  emails: { personal: string; academic: string };
  /** Null until a resume file exists in /public. The CTA hides itself when null. */
  resumeUrl: string | null;
  socials: SocialLink[];
  focusAreas: string[];
};

export type Education = {
  institution: string;
  credential: string;
  detail: string;
};

export type Credential = {
  name: string;
  issuer: string;
  period: string;
};

export type Award = {
  name: string;
  issuer: string;
  year: string;
};

/** A single hop in a project's request path. Nodes must describe real components. */
export type ArchitectureNode = {
  id: string;
  label: string;
  /** Short technical annotation shown under the node label. */
  detail: string;
  kind: "client" | "app" | "transport" | "data";
};

export type Project = {
  slug: string;
  name: string;
  /** One line, plain language: what this system is. */
  kicker: string;
  problem: string;
  /** Verified capabilities, taken from the project's own description. */
  highlights: string[];
  stack: string[];
  architecture: {
    caption: string;
    nodes: ArchitectureNode[];
  };
  links: { demo?: string; repo?: string };
};

export type ExperienceEntry = {
  id: string;
  role: string;
  organisation: string;
  /** Undefined until real dates are supplied; the UI omits the field entirely. */
  period?: string;
  summary: string;
  contributions: string[];
  stack: string[];
};

export type SkillGroup = {
  name: string;
  description: string;
  items: string[];
};

export type Testimonial = {
  id: string;
  quote: string;
  name: string;
  title: string;
  linkedin: string;
};
