/**
 * Content model for the portfolio.
 *
 * Every field is presentation-agnostic. Sections read from `content/*` and
 * never hardcode copy, so updating the portfolio means editing data, not JSX.
 *
 * Source-of-truth precedence used when the supplied documents disagreed:
 *   1. Official transcript  (grades, GPA, course codes and terms)
 *   2. LinkedIn profile     (employment dates, role scope, contribution detail)
 *   3. Resume variants      (only where they add something the above lack)
 * Conflicts are annotated inline with CONFLICT comments.
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
  sectionId: string;
};

/** A headline figure. `source` records where the number came from. */
export type Metric = {
  value: string;
  label: string;
};

export type Profile = {
  name: string;
  fullName: string;
  initials: string;
  role: string;
  positioning: string;
  summary: string[];
  location: string;
  status: string;
  seeking: string;
  emails: { personal: string; academic: string };
  /** Null until a resume file exists in /public. The CTA hides itself when null. */
  resumeUrl: string | null;
  /**
   * Null until a real photograph exists in /public. The About section renders
   * nothing when null, so there is no gap and no broken image.
   *
   * Must be an actual photograph. A generated portrait undermines every
   * verified claim on the rest of the page, and Content Credentials make it
   * checkable by anyone who drops the file on verify.contentauthenticity.org.
   */
  portrait: { src: string; alt: string; width: number; height: number } | null;
  socials: SocialLink[];
  focusAreas: string[];
  spokenLanguages: string[];
  /** Headline figures shown under the hero. Each traces to a documented fact. */
  headlineMetrics: Metric[];
};

export type Course = {
  code: string;
  title: string;
  term: string;
  /** Absent for courses still in progress. */
  grade?: string;
};

export type Degree = {
  id: string;
  institution: string;
  school?: string;
  credential: string;
  field: string;
  period: string;
  location: string;
  gpa?: string;
  gpaNote?: string;
  courses?: Course[];
  highlights?: string[];
};

export type Certification = {
  name: string;
  issuer: string;
  period?: string;
  /** Primary certifications are shown first; the rest sit behind a disclosure. */
  primary: boolean;
};

export type Award = {
  name: string;
  issuer: string;
  year: string;
};

export type Publication = {
  title: string;
  venue: string;
  year: string;
  note?: string;
};

/** A single hop in a system's request path. Nodes must describe real components. */
export type ArchitectureNode = {
  id: string;
  label: string;
  detail: string;
  kind: "client" | "app" | "transport" | "compute" | "data";
};

/** Contributions grouped by theme, so a long role stays scannable. */
export type ContributionGroup = {
  theme: string;
  items: string[];
};

/** Filter grouping. Each project belongs to exactly one, so counts stay honest. */
export type ProjectDomain =
  "Distributed systems" | "Platform engineering" | "AI systems" | "Products";

export type Project = {
  slug: string;
  name: string;
  kicker: string;
  domain: ProjectDomain;
  /** Featured projects show their architecture and lead highlights inline. */
  featured: boolean;
  /** Course code, or "Personal project" for self-directed work. */
  context: string;
  period?: string;
  problem: string;
  /** What this person personally owned, when the project had collaborators. */
  ownership?: string;
  collaborators?: { name: string; scope: string }[];
  highlights: string[];
  metrics?: Metric[];
  stack: string[];
  architecture: {
    caption: string;
    nodes: ArchitectureNode[];
  };
  links: { demo?: string; repo?: string };
};

export type Role = {
  id: string;
  title: string;
  period: string;
  /** Academic term, for teaching roles. Omitted for industry roles. */
  term?: string;
  location: string;
  summary: string;
  contributions: ContributionGroup[];
  stack: string[];
  note?: string;
};

/** Roles are grouped by employer so a multi-role tenure reads as one story. */
export type Organisation = {
  id: string;
  name: string;
  detail?: string;
  period: string;
  roles: Role[];
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
  /** How this person knows the work. */
  relationship: string;
  linkedin: string;
};
