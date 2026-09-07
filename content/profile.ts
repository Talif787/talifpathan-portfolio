import type { Award, Credential, Education, Profile } from "./types";

export const profile: Profile = {
  name: "Talif Pathan",
  initials: "TP",
  role: "Full-stack software engineer",
  positioning:
    "I build real-time and cloud systems: the message paths, sync layers and AWS pipelines that have to keep working while people are using them.",
  summary:
    "Nearly four years of production engineering at Capgemini, progressing from Software Engineer to Associate Consultant, now finishing an MS in Computer Science at Northeastern. My work sits where the frontend meets the backend it depends on: websocket transports, collaborative document state, AWS ingestion and update pipelines.",
  // VERIFY: derived from the Northeastern affiliation. Change if you list a different base.
  location: "Boston, MA",
  // VERIFY: replaces the stale "seeking Spring/Summer 2026 co-op" line in the old README.
  status: "Graduating December 2026",
  emails: {
    personal: "talifpathan13@gmail.com",
    academic: "pathan.t@northeastern.edu",
  },
  // No resume file exists in /public yet. Drop one in and set this path; the CTA appears automatically.
  resumeUrl: null,
  socials: [
    {
      label: "GitHub",
      href: "https://github.com/Talif787",
      handle: "Talif787",
      icon: "github",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/talif-pathan",
      handle: "talif-pathan",
      icon: "linkedin",
    },
    {
      label: "Email",
      href: "mailto:talifpathan13@gmail.com",
      handle: "talifpathan13@gmail.com",
      icon: "mail",
    },
  ],
  focusAreas: [
    "Real-time collaboration",
    "Distributed systems",
    "AWS cloud engineering",
  ],
};

export const education: Education = {
  institution: "Northeastern University",
  credential: "MS, Computer Science",
  detail: "GPA 3.889",
};

export const credentials: Credential[] = [
  {
    name: "AWS Certified Solutions Architect, Associate",
    issuer: "Amazon Web Services",
    period: "2023 to 2026",
  },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    period: "2022 to 2026",
  },
];

export const awards: Award[] = [
  { name: "XTRAMILE Award", issuer: "Capgemini", year: "2023" },
  { name: "The SUPER TEAM Award", issuer: "Capgemini", year: "2023" },
];
