import type { Degree } from "./types";

/**
 * Grades, course codes, terms and GPA come from the official transcript.
 *
 * CONFLICT: the resume variants quote GPA as 3.933 and 3.889, and LinkedIn
 * rounds to 3.9. Those are stale cumulative figures from earlier terms
 * (3.889 after Summer 2025, 3.933 after Fall 2025). The transcript's current
 * cumulative across 28 credit hours is 3.905, which is what is shown.
 */
export const degrees: Degree[] = [
  {
    id: "neu-msc",
    institution: "Northeastern University",
    school: "Khoury College of Computer Sciences",
    credential: "Master of Science",
    field: "Computer Science",
    // CONFLICT: resumes say May 2027, LinkedIn says December 2026.
    period: "Jan 2025 to Dec 2026",
    location: "Boston, MA",
    gpa: "3.905",
    gpaNote: "28 credit hours completed, good standing",
    courses: [
      { code: "CS 5010", title: "Programming Design Paradigm", term: "Spring 2025", grade: "A-" },
      { code: "CS 5200", title: "Database Management Systems", term: "Spring 2025", grade: "A" },
      { code: "CS 5800", title: "Algorithms", term: "Summer 2025", grade: "A" },
      { code: "CS 6140", title: "Machine Learning", term: "Fall 2025", grade: "A" },
      { code: "CS 6650", title: "Building Scalable Distributed Systems", term: "Fall 2025", grade: "A" },
      { code: "CS 5340", title: "Computer/Human Interaction", term: "Spring 2026", grade: "A-" },
      { code: "CS 6120", title: "Natural Language Processing", term: "Spring 2026", grade: "A" },
      { code: "CS 5330", title: "Pattern Recognition and Computer Vision", term: "Fall 2026" },
    ],
  },
  {
    id: "rgit-be",
    institution: "Rajiv Gandhi Institute of Technology",
    school: "Manjara Charitable Trust, University of Mumbai",
    credential: "Bachelor of Engineering",
    field: "Computer Engineering",
    period: "2016 to 2020",
    location: "Mumbai, India",
    highlights: [
      "Final-year project: a blockchain-based e-voting system, published and presented at ICACC 2020",
      "Optimised a complex encryption technique that became a core part of that system",
      "One of two teams selected to present a microprocessor project, an Arduino-based solar tracker, to the NAAC accreditation committee",
    ],
  },
];
