import type { SkillGroup } from "./types";

/**
 * Only technologies evidenced by the projects, roles and certifications in this
 * repository. No proficiency percentages: a bar chart cannot be verified,
 * a shipped system can.
 */
export const skillGroups: SkillGroup[] = [
  {
    name: "Languages",
    description: "What I write day to day",
    items: ["TypeScript", "JavaScript", "Python", "SQL"],
  },
  {
    name: "Web",
    description: "Application layer",
    items: ["Next.js", "React", "Tailwind CSS"],
  },
  {
    name: "Real-time",
    description: "Keeping clients in agreement",
    items: ["Socket.io", "Convex", "WebSockets"],
  },
  {
    name: "Data",
    description: "Persistence and access",
    items: ["MySQL", "Prisma"],
  },
  {
    name: "AWS",
    description: "Cloud services I have shipped on",
    items: ["Lambda", "Kinesis", "IoT FleetWise", "Bedrock"],
  },
  {
    name: "Quality",
    description: "How the work stays correct",
    items: ["Playwright", "End-to-end testing", "Agile delivery"],
  },
];
