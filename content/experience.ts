import type { ExperienceEntry } from "./types";

/**
 * `period` is intentionally absent: the previous content layer carried no dates,
 * and inventing them would be a fabrication. Add `period: "Mon YYYY - Mon YYYY"`
 * to any entry and the timeline renders it.
 */
export const experience: ExperienceEntry[] = [
  {
    id: "neu-ta",
    role: "Teaching Assistant",
    organisation: "Northeastern University",
    summary:
      "Supporting CS 3200, Introduction to Databases.",
    contributions: [
      "Help students work through relational database concepts",
      "Review and debug SQL queries",
      "Troubleshoot MySQL Workbench issues during lab hours",
    ],
    stack: ["SQL", "MySQL"],
  },
  {
    id: "capgemini-ac",
    role: "Associate Consultant",
    organisation: "Capgemini",
    summary:
      "End-to-end test automation and internal AI tooling.",
    contributions: [
      "Automated end-to-end testing with Playwright, cutting manual effort by 40%",
      "Built AI-powered internal tools on AWS Bedrock, speeding up information retrieval by 50%",
    ],
    stack: ["Playwright", "AWS Bedrock", "Python"],
  },
  {
    id: "capgemini-sse",
    role: "Senior Software Engineer",
    organisation: "Capgemini",
    summary:
      "Vehicle telemetry ingestion and over-the-air update delivery.",
    contributions: [
      "Integrated AWS IoT FleetWise for real-time CAN bus data collection",
      "Engineered scalable OTA update pipelines, reducing deployment downtime by 30%",
    ],
    stack: ["AWS IoT FleetWise", "Python", "AWS"],
  },
  {
    id: "capgemini-se",
    role: "Software Engineer",
    organisation: "Capgemini",
    summary:
      "Frontend modules and event-driven notification delivery.",
    contributions: [
      "Developed interactive React.js modules",
      "Implemented real-time notification systems on AWS Lambda and Kinesis, improving monitoring efficiency by 20%",
    ],
    stack: ["React", "AWS Lambda", "AWS Kinesis"],
  },
];
