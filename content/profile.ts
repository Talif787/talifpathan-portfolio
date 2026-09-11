import type { Profile } from "./types";

export const profile: Profile = {
  name: "Talif Pathan",
  fullName: "Talif Andalib Pathan",
  initials: "TP",
  role: "Software engineer",
  positioning:
    "I build systems where the hard part is what happens between machines: consensus that holds when a node dies, storage engines that survive a crash mid-write, and event pipelines that deliver exactly once on top of at-least-once.",
  summary: [
    "I started at Capgemini as a backend engineer and stayed three years and nine months, most of it on Trusted Vehicle, an automotive platform built with Amazon. The work ran the full stack: React analytics dashboards shown at AWS Auto Accelerate 2022 in Boston, Python services on Lambda, a WebSocket layer with ActiveMQ and RabbitMQ that had to guarantee delivery and ordering through frontend failures, and IoT pipelines ingesting CAN bus telemetry every two seconds.",
    "In my last year there I led the Generative AI for Software Engineering initiative on Amazon Bedrock, built a retrieval-augmented documentation assistant with LangChain, and set up a RAGAS evaluation workflow so answer quality could be measured rather than guessed at.",
    "I am now finishing an MS in Computer Science at Northeastern, where distributed systems became the thing I care most about. I also teach: three teaching assistantships across relational and NoSQL database courses, supporting several hundred students.",
  ],
  location: "Boston, MA",
  // CONFLICT: resumes say "Expected Graduation: May 2027"; LinkedIn headline and
  // summary both say December 2026. LinkedIn is more recent and self-authored.
  status: "MS Computer Science, Northeastern, graduating December 2026",
  // CONFLICT: LinkedIn headline says "Open to 2027 New Grad Roles" while the
  // summary says graduating December 2026. Phrased here without a year.
  seeking: "Open to software engineer, SDE, full-stack, backend and frontend roles",
  emails: {
    personal: "talifpathan13@gmail.com",
    academic: "pathan.t@northeastern.edu",
  },
  // Phone number deliberately omitted: a public page is scraped constantly.
  // It belongs on the resume PDF, which people request rather than crawl.
  resumeUrl: null,
  // Drop a real photograph in /public and fill this in. Give the real pixel
  // dimensions: next/image uses them to reserve space and avoid layout shift.
  portrait: {
    src: "/talif-pathan.jpg",
    alt: "Talif Pathan",
    width: 1200,
    height: 1500,
  },
  // portrait: null,
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
    "Distributed systems",
    "Real-time and event-driven backends",
    "AWS cloud engineering",
    "Applied LLM and RAG systems",
  ],
  spokenLanguages: ["English", "Hindi"],
  headlineMetrics: [
    { value: "3y 9m", label: "Engineering at Capgemini" },
    { value: "14", label: "Projects with public source" },
    { value: "1,000+", label: "IoT devices in production pipelines" },
    { value: "2", label: "Published papers" },
  ],
};
