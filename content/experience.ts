import type { Organisation } from "./types";

/**
 * Employment dates and contribution detail follow the LinkedIn profile, which
 * is the superset: the five resume variants each surface a different subset of
 * the same work, tailored to different applications.
 *
 * CONFLICT: resumes date the first Capgemini role May 2021 to Dec 2022 and the
 * second Jan 2023 to Dec 2023. LinkedIn gives Apr 2021 to Jan 2023 and Jan 2023
 * to Jan 2024. LinkedIn's figures are used and its stated total, 3 years and
 * 9 months, is consistent with them.
 *
 * Role titles and academic terms follow the profile verbatim. The
 * undergraduate/graduate prefix describes the course level, not the holder:
 * all three assistantships were held while enrolled in the MS programme.
 */
export const organisations: Organisation[] = [
  {
    id: "northeastern",
    name: "Northeastern University",
    detail: "Khoury College of Computer Sciences",
    period: "Sep 2025 to present, 1 year 1 month",
    roles: [
      {
        id: "ta-cs5200",
        title: "Graduate Teaching Assistant, CS 5200 Database Management Systems",
        period: "Jul 2026 to present",
        term: "Summer B 2026",
        location: "Boston, MA",
        summary:
          "Supporting graduate students under Professor Martin Schedlbauer across relational design, SQL, transactions and an introduction to NoSQL.",
        contributions: [
          {
            theme: "Teaching",
            items: [
              "Run Microsoft Teams office hours on relational algebra, query optimisation, indexing strategy and transaction control",
              "Support live viva voce demo reviews for practicum submissions",
            ],
          },
          {
            theme: "Assessment",
            items: [
              "Grade weekly assignments and two practicums, individual database design and implementation projects written in R, against structured rubrics",
              "Give technical feedback on ERD and UML modelling, normalisation and SQL query writing",
            ],
          },
        ],
        stack: ["SQL", "MySQL", "R", "Relational modelling"],
      },
      {
        id: "ta-ds4300",
        title:
          "Undergraduate Teaching Assistant, DS 4300 Large-Scale Information Storage and Retrieval",
        period: "Jan 2026 to Jun 2026",
        term: "Spring and Summer A 2026",
        location: "Boston, MA",
        summary:
          "Supported 270+ students on a distributed databases course covering four storage paradigms.",
        contributions: [
          {
            theme: "Distributed systems teaching",
            items: [
              "Led Piazza discussions and three weekly office hours on NoSQL systems and large-scale retrieval",
              "Clarified CAP theorem trade-offs, consistent hashing, horizontal scaling and storage reliability",
              "Helped students debug complex NoSQL queries and reason through performance and scaling decisions",
            ],
          },
          {
            theme: "Assessment",
            items: [
              "Graded implementation projects across MongoDB (document), Cassandra (wide-column), Redis (key-value) and Neo4j (graph)",
              "Gave technical feedback on data modelling, indexing and query optimisation",
            ],
          },
        ],
        stack: ["MongoDB", "Cassandra", "Redis", "Neo4j"],
      },
      {
        id: "ta-cs3200",
        title: "Undergraduate Teaching Assistant, CS 3200 Introduction to Databases",
        period: "Sep 2025 to Jan 2026",
        term: "Fall 2025",
        location: "Boston, MA, remote",
        summary:
          "Supported a large cohort through relational design and SQL query formulation.",
        contributions: [
          {
            theme: "Assessment and support",
            items: [
              "Graded 230+ assignments on relational design, SQL query formulation and systems integration using standardised rubrics, improving clarity and accuracy of feedback by 25%",
              "Led weekly office hours and Q&A sessions, contributing to a 30% improvement in course satisfaction scores",
              "Partnered with the instructor to align grading and feedback with course learning objectives",
            ],
          },
        ],
        stack: ["SQL", "MySQL", "Relational modelling"],
      },
    ],
  },
  {
    id: "capgemini",
    name: "Capgemini",
    detail: "Trusted Vehicle with Amazon, then Generative AI for Software Engineering",
    period: "Apr 2021 to Dec 2024, 3 years 9 months",
    roles: [
      {
        id: "cap-ac",
        title: "Associate Consultant",
        period: "Jan 2024 to Dec 2024",
        location: "Mumbai, India",
        summary:
          "Led the Generative AI for Software Engineering initiative and built the quality tooling around it.",
        contributions: [
          {
            theme: "Generative AI and LLM engineering",
            items: [
              "Led the Generative AI for Software Engineering initiative, architecting solutions on Amazon Bedrock",
              "Built an AI-powered documentation assistant with Streamlit, LangChain and Amazon Bedrock, cutting cross-team information lookup time by 50%",
              "Implemented a RAG evaluation framework with RAGAS benchmarking retrieval accuracy, answer relevancy, faithfulness and context precision, raising model iteration accuracy by 35%",
              "Designed prompt engineering and retrieval optimisation strategies for domain-specific software engineering queries",
            ],
          },
          {
            theme: "Test automation and quality",
            items: [
              "Automated enterprise end-to-end test coverage for the TAMM application with Playwright, Python and reasoning-enabled OpenAI API calls, reducing manual QA workload by 40% and raising automated coverage by 25%",
              "Designed test generation pipelines using LLM reasoning to analyse application behaviour and produce scenarios with better edge case coverage",
            ],
          },
          {
            theme: "Analytics and serverless",
            items: [
              "Built a production analytics dashboard combining Grafana visualisations with custom React chart components for 50+ concurrent enterprise users",
              "Used AWS Chalice to streamline serverless development for AI-powered services",
            ],
          },
        ],
        stack: [
          "Amazon Bedrock",
          "LangChain",
          "RAGAS",
          "OpenAI API",
          "Streamlit",
          "Playwright",
          "Python",
          "React",
          "Grafana",
          "AWS Chalice",
        ],
      },
      {
        id: "cap-sse",
        title: "Senior Software Engineer",
        period: "Jan 2023 to Jan 2024",
        location: "Mumbai, India",
        summary:
          "Owned the IoT and OTA infrastructure, and the microservices behind vehicle telemetry.",
        contributions: [
          {
            theme: "IoT and OTA infrastructure",
            items: [
              "Architected a high-volume OTA firmware deployment pipeline using AWS IoT Device Client, IoT Jobs, Lambda and S3 triggers, cutting device downtime by 30% across 1,000+ devices",
              "Delivered end-to-end OTA for the UK Capgemini team's vehicle use case",
              "Built a Python vehicle simulation framework integrated with AWS IoT FleetWise and EC2 for real-time CAN bus ingestion, improving fleet monitoring accuracy by 20%",
              "Presented the FleetWise work to the AWS product team, which generated direct hiring interest",
            ],
          },
          {
            theme: "Edge computing and data stores",
            items: [
              "Spearheaded a MongoDB versus OpenSearch evaluation for the MongoDB Paris team using AWS Greengrass V2 custom components",
              "Implemented edge processing of telematics every two seconds on vehicle TCU activation",
              "Integrated MongoDB Realm with an Atlas cluster to hold zero data loss through network interruptions",
            ],
          },
          {
            theme: "Microservices and APIs",
            items: [
              "Architected Python microservices on AWS Lambda with CloudFormation IaC, processing telemetry from 1,000+ devices every two seconds at 99.9% uptime",
              "Built REST APIs for vehicle lookup by VIN, vehicle state, tire pressure alerts, EV metrics and FleetWise campaign control, keeping state synchronised across MongoDB and OpenSearch",
              "Automated deployments through Jenkins CI/CD",
            ],
          },
          {
            theme: "Real-time messaging",
            items: [
              "Designed a WebSocket agent using ActiveMQ and RabbitMQ brokers with LocalStorage queuing, guaranteeing delivery and exact sequencing",
              "Created a Java agent and Spring Boot utilities for frontend to backend communication, preserving message ordering for transaction integrity",
            ],
          },
        ],
        stack: [
          "AWS IoT FleetWise",
          "AWS IoT Jobs",
          "Lambda",
          "S3",
          "EC2",
          "Greengrass V2",
          "CloudFormation",
          "Python",
          "MongoDB",
          "OpenSearch",
          "ActiveMQ",
          "RabbitMQ",
          "Spring Boot",
          "Jenkins",
        ],
        note: "Recognised with the XTRAMILE and SUPER TEAM awards in 2023.",
      },
      {
        id: "cap-swe",
        title: "Software Engineer",
        period: "Apr 2021 to Jan 2023",
        location: "Mumbai, India",
        summary:
          "Joined as a backend engineer and moved across the stack, building the analytics surface of Trusted Vehicle and the messaging layer under it.",
        contributions: [
          {
            theme: "Frontend and analytics",
            items: [
              "Architected React analytics dashboards with Recharts and Grafana, improving monitoring speed by 20% for 50+ enterprise clients",
              "Work showcased at AWS Auto Accelerate 2022 in Boston",
              "Built Fleet Management modules: an EV Operations tab for telemetry signals, a DTC History tab for diagnostics, and driver safety score integration",
            ],
          },
          {
            theme: "Geospatial and interface",
            items: [
              "Built an interactive geospatial incident-reporting interface with Mapbox, with live vehicle tracking, 10km radius site and vehicle filtering and route generation, cutting incident response time by 15%",
              "Developed drag-and-drop image upload modals, fixed navigation with smooth scrolling and reusable OTA notification modals",
              "Implemented multi-tenancy for secure data isolation across enterprise clients",
            ],
          },
          {
            theme: "Real-time backend",
            items: [
              "Engineered a fault-tolerant WebSocket layer using ActiveMQ and RabbitMQ with LocalStorage-backed queuing, holding 100% message delivery reliability through network drops and frontend failures",
              "Built a multi-tenant notification system on AWS Kinesis, Lambda and Cognito, improving reliability by 25%, and a proof of concept for Darden Restaurants demonstrating guaranteed delivery across broker protocols",
              "Implemented authentication for remote vehicle honking and real-time airbag status notifications",
              "Integrated WebSocket cart synchronisation between a React frontend and a Spring Boot backend for the e-commerce POS interface",
            ],
          },
          {
            theme: "Technical writing",
            items: [
              "Authored one-pagers on Remote VMS, anomaly detection, driver safety score and EV operations, compiled into an AWS and Capgemini e-book",
            ],
          },
        ],
        stack: [
          "React",
          "Recharts",
          "Mapbox",
          "Node.js",
          "Express.js",
          "AWS Kinesis",
          "Lambda",
          "Cognito",
          "ActiveMQ",
          "RabbitMQ",
          "Spring Boot",
          "Java",
        ],
      },
    ],
  },
  {
    id: "axis",
    name: "Axis Bank",
    period: "Sep 2020 to Apr 2021, 8 months",
    roles: [
      {
        id: "axis-am",
        title: "Assistant Manager",
        period: "Sep 2020 to Apr 2021",
        location: "Mumbai, India",
        summary:
          "First role after completing my undergraduate degree, before moving into software engineering full time.",
        contributions: [],
        stack: [],
      },
    ],
  },
];
