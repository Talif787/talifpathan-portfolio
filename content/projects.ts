import type { Project } from "./types";

/**
 * Architecture nodes describe components that the project actually uses,
 * taken from each project's recorded stack. Nothing here is inferred.
 */
export const projects: Project[] = [
  {
    slug: "realtime-chat",
    name: "Real-time chat platform",
    kicker: "Discord-style messaging with rooms, roles and 1:1 video",
    problem:
      "Group chat breaks in the gaps: a message that arrives twice, a member list that lags behind who is actually in the room, an upload that blocks the thread. The interesting work is keeping socket state and database state agreeing with each other while people are typing.",
    highlights: [
      "Instant messaging across channels, holding 100+ concurrent users",
      "File uploads alongside the message stream",
      "1:1 video calls",
      "Role-based member management per server",
    ],
    stack: ["Next.js", "React", "Socket.io", "Prisma", "MySQL", "Tailwind CSS"],
    architecture: {
      caption: "Message path",
      nodes: [
        { id: "client", label: "Client", detail: "React", kind: "client" },
        { id: "app", label: "Next.js", detail: "routes, auth", kind: "app" },
        { id: "socket", label: "Socket.io", detail: "duplex events", kind: "transport" },
        { id: "orm", label: "Prisma", detail: "typed queries", kind: "app" },
        { id: "db", label: "MySQL", detail: "durable store", kind: "data" },
      ],
    },
    links: {
      demo: "https://discord-clone-production-0af1.up.railway.app/sign-in",
    },
  },
  {
    slug: "collaborative-editor",
    name: "Collaborative document editor",
    kicker: "Google Docs-style editing with live cursors and comments",
    problem:
      "Two people editing one paragraph is the whole problem. Every keystroke has to reach everyone else fast enough that nobody notices the round trip, and the document has to end up in one agreed state regardless of who typed what first.",
    highlights: [
      "Sub-second synchronisation between editors",
      "Live cursor tracking",
      "Comments and mentions",
      "Exports to PDF, HTML, TXT and JSON",
    ],
    stack: ["Next.js", "React", "TypeScript", "Convex", "Tailwind CSS"],
    architecture: {
      caption: "Sync path",
      nodes: [
        { id: "editor", label: "Editor", detail: "React", kind: "client" },
        { id: "app", label: "Next.js", detail: "app router", kind: "app" },
        { id: "sync", label: "Convex", detail: "reactive queries", kind: "transport" },
        { id: "doc", label: "Document state", detail: "shared source", kind: "data" },
      ],
    },
    links: {
      demo: "https://google-docs-clone-ivory.vercel.app/",
    },
  },
];
