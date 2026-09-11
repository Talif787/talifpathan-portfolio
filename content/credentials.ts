import type { Award, Certification, Publication } from "./types";

export const certifications: Certification[] = [
  {
    name: "AWS Certified Solutions Architect, Associate",
    issuer: "Amazon Web Services",
    period: "2023 to 2026",
    primary: true,
  },
  {
    name: "AWS Certified Cloud Practitioner",
    issuer: "Amazon Web Services",
    period: "2022 to 2026",
    primary: true,
  },
  { name: "Terraform for the Absolute Beginners with Labs", issuer: "Course certificate", primary: false },
  { name: "The Blockchain System", issuer: "Course certificate", primary: false },
  { name: "Python (Basic)", issuer: "Course certificate", primary: false },
  { name: "Interactivity with JavaScript", issuer: "Course certificate", primary: false },
  { name: "Introduction to CSS3", issuer: "Course certificate", primary: false },
];

export const awards: Award[] = [
  { name: "XTRAMILE Award", issuer: "Capgemini", year: "2023" },
  { name: "The SUPER TEAM Award", issuer: "Capgemini", year: "2023" },
];

export const publications: Publication[] = [
  {
    title: "Loan Distribution and Prediction System Using Machine Learning",
    venue: "IJARESM",
    year: "2024",
  },
  {
    title: "Blockchain Technology Based E-Voting System",
    venue: "ICACC 2020",
    year: "2020",
    note: "Also published in ITM Web of Conferences, volume 32",
  },
];
