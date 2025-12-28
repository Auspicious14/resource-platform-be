import { PrismaClient, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    title: "Landing Page Template",
    difficultyLevel: Difficulty.BEGINNER,
    description:
      "Build a responsive landing page with modern design principles",
    technologies: ["HTML", "CSS"],
    resourceLinks: [
      { type: "video", url: "#", title: "HTML & CSS Crash Course" },
    ],
  },
  {
    title: "E-Commerce Dashboard",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Create dynamic admin dashboard with React and Chart.js",
    technologies: ["React", "Chart.js"],
    resourceLinks: [
      { type: "article", url: "#", title: "React State Management Guide" },
    ],
  },
  {
    title: "E-Commerce REST API",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description:
      "Develop a Node.js API with Express and MongoDB for product management",
    technologies: ["Node.js", "Express", "MongoDB"],
    resourceLinks: [
      { type: "course", url: "#", title: "Node.js Fundamentals" },
    ],
  },
  {
    title: "Social Media Dashboard",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Build real-time dashboard with React, GraphQL and WebSockets",
    technologies: ["React", "GraphQL", "WebSockets"],
    resourceLinks: [
      { type: "video", url: "#", title: "GraphQL Subscriptions" },
    ],
  },
  {
    title: "Portfolio Website",
    difficultyLevel: Difficulty.BEGINNER,
    description: "Create a personal portfolio with Next.js and Tailwind CSS",
    technologies: ["Next.js", "Tailwind CSS"],
    resourceLinks: [
      { type: "article", url: "#", title: "Next.js Deployment Guide" },
    ],
  },
  {
    title: "React Todo App with Firebase",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Create a collaborative todo application with real-time sync",
    technologies: ["React", "Firebase"],
    resourceLinks: [
      { type: "article", url: "#", title: "Firebase Realtime Database Guide" },
    ],
  },
  {
    title: "Authentication System",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Implement OAuth 2.0 flow with Node.js and Passport.js",
    technologies: ["Node.js", "Passport.js"],
    resourceLinks: [
      { type: "course", url: "#", title: "Web Security Fundamentals" },
    ],
  },
  {
    title: "Mobile Recipe App",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Build cross-platform recipe manager with React Native",
    technologies: ["React Native"],
    resourceLinks: [
      { type: "video", url: "#", title: "React Native Navigation Tutorial" },
    ],
  },
  {
    title: "CMS Platform",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Headless CMS with Next.js and Sanity.io",
    technologies: ["Next.js", "Sanity.io"],
    resourceLinks: [
      { type: "article", url: "#", title: "Sanity Studio Customization" },
    ],
  },
  {
    title: "AI Chat Interface",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Build GPT-4 chatbot with streaming responses",
    technologies: ["GPT-4", "Streaming"],
    resourceLinks: [
      { type: "course", url: "#", title: "LLM Integration Patterns" },
    ],
  },
  {
    title: "Real-time Chat Application",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Build chat app with Socket.io and React",
    technologies: ["Socket.io", "React"],
    resourceLinks: [
      { type: "video", url: "#", title: "WebSocket Fundamentals" },
    ],
  },
  {
    title: "Serverless API Gateway",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Create REST API using AWS Lambda & API Gateway",
    technologies: ["AWS Lambda", "API Gateway"],
    resourceLinks: [
      { type: "article", url: "#", title: "AWS Serverless Patterns" },
    ],
  },
  {
    title: "E-commerce Product Search",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Implement search functionality with Algolia",
    technologies: ["Algolia"],
    resourceLinks: [
      { type: "course", url: "#", title: "Search Engine Optimization" },
    ],
  },
  {
    title: "Mobile Payment Integration",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Add Stripe payments to React Native app",
    technologies: ["React Native", "Stripe"],
    resourceLinks: [
      { type: "video", url: "#", title: "Mobile Payment Systems" },
    ],
  },
  {
    title: "Data Visualization Dashboard",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Create analytics dashboard with D3.js",
    technologies: ["D3.js"],
    resourceLinks: [{ type: "article", url: "#", title: "D3.js Essentials" }],
  },
];

async function main() {
  console.log("Start seeding...");

  // Create a default user if not exists
  const user = await prisma.user.upsert({
    where: { email: "admin@devresource.com" },
    update: {},
    create: {
      email: "admin@devresource.com",
      firstName: "Admin",
      lastName: "User",
      password: "password123", // In a real app, this should be hashed
      role: "ADMIN",
    },
  });

  console.log(`Created user with id: ${user.id}`);

  for (const project of projects) {
    const createdProject = await prisma.project.create({
      data: {
        ...project,
        createdById: user.id,
      },
    });
    console.log(`Created project with id: ${createdProject.id}`);
  }

  console.log("Seeding finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
