import { PrismaClient, Difficulty } from "@prisma/client";

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const projects = [
  {
    title: "Landing Page Template",
    slug: "landing-page-template",
    difficultyLevel: Difficulty.BEGINNER,
    description:
      "Build a responsive landing page with modern design principles",
    technologies: ["HTML", "CSS"],
    categories: ["Frontend", "Web Design"],
    estimatedTime: "4-6 hours",
    learningObjectives: [
      "Responsive design",
      "CSS Flexbox/Grid",
      "Modern UI patterns",
    ],
    resourceLinks: [
      { type: "video", url: "#", title: "HTML & CSS Crash Course" },
    ],
    featured: true,
  },
  {
    title: "E-Commerce Dashboard",
    slug: "ecommerce-dashboard",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Create dynamic admin dashboard with React and Chart.js",
    technologies: ["React", "Chart.js"],
    categories: ["Frontend", "Data Visualization"],
    estimatedTime: "12-16 hours",
    learningObjectives: [
      "React state management",
      "Data visualization",
      "Dashboard UX",
    ],
    resourceLinks: [
      { type: "article", url: "#", title: "React State Management Guide" },
    ],
    featured: true,
  },
  {
    title: "E-Commerce REST API",
    slug: "ecommerce-rest-api",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description:
      "Develop a Node.js API with Express and MongoDB for product management",
    technologies: ["Node.js", "Express", "MongoDB"],
    categories: ["Backend", "API Development"],
    estimatedTime: "16-20 hours",
    learningObjectives: [
      "RESTful API design",
      "Database modeling",
      "Authentication",
    ],
    resourceLinks: [
      { type: "course", url: "#", title: "Node.js Fundamentals" },
    ],
    featured: false,
  },
  {
    title: "Social Media Dashboard",
    slug: "social-media-dashboard",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Build real-time dashboard with React, GraphQL and WebSockets",
    technologies: ["React", "GraphQL", "WebSockets"],
    categories: ["Full-stack", "Real-time"],
    estimatedTime: "24-32 hours",
    learningObjectives: [
      "GraphQL subscriptions",
      "Real-time data",
      "Advanced state management",
    ],
    resourceLinks: [
      { type: "video", url: "#", title: "GraphQL Subscriptions" },
    ],
    featured: true,
  },
  {
    title: "Portfolio Website",
    slug: "portfolio-website",
    difficultyLevel: Difficulty.BEGINNER,
    description: "Create a personal portfolio with Next.js and Tailwind CSS",
    technologies: ["Next.js", "Tailwind CSS"],
    categories: ["Frontend", "Web Design"],
    estimatedTime: "8-10 hours",
    learningObjectives: [
      "Next.js basics",
      "Tailwind CSS",
      "Portfolio best practices",
    ],
    resourceLinks: [
      { type: "article", url: "#", title: "Next.js Deployment Guide" },
    ],
    featured: false,
  },
  {
    title: "React Todo App with Firebase",
    slug: "react-todo-firebase",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Create a collaborative todo application with real-time sync",
    technologies: ["React", "Firebase"],
    categories: ["Frontend", "Real-time"],
    estimatedTime: "10-14 hours",
    learningObjectives: [
      "Firebase integration",
      "Real-time sync",
      "CRUD operations",
    ],
    resourceLinks: [
      { type: "article", url: "#", title: "Firebase Realtime Database Guide" },
    ],
    featured: false,
  },
  {
    title: "Authentication System",
    slug: "authentication-system",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Implement OAuth 2.0 flow with Node.js and Passport.js",
    technologies: ["Node.js", "Passport.js"],
    categories: ["Backend", "Security"],
    estimatedTime: "20-24 hours",
    learningObjectives: ["OAuth 2.0", "JWT tokens", "Security best practices"],
    resourceLinks: [
      { type: "course", url: "#", title: "Web Security Fundamentals" },
    ],
    featured: false,
  },
  {
    title: "Mobile Recipe App",
    slug: "mobile-recipe-app",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Build cross-platform recipe manager with React Native",
    technologies: ["React Native"],
    categories: ["Mobile", "Frontend"],
    estimatedTime: "18-22 hours",
    learningObjectives: [
      "React Native basics",
      "Mobile navigation",
      "API integration",
    ],
    resourceLinks: [
      { type: "video", url: "#", title: "React Native Navigation Tutorial" },
    ],
    featured: false,
  },
  {
    title: "CMS Platform",
    slug: "cms-platform",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Headless CMS with Next.js and Sanity.io",
    technologies: ["Next.js", "Sanity.io"],
    categories: ["Full-stack", "CMS"],
    estimatedTime: "28-36 hours",
    learningObjectives: ["Headless CMS", "Content modeling", "Next.js ISR"],
    resourceLinks: [
      { type: "article", url: "#", title: "Sanity Studio Customization" },
    ],
    featured: true,
  },
  {
    title: "AI Chat Interface",
    slug: "ai-chat-interface",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Build GPT-4 chatbot with streaming responses",
    technologies: ["GPT-4", "Streaming"],
    categories: ["AI/ML", "Full-stack"],
    estimatedTime: "24-30 hours",
    learningObjectives: ["LLM integration", "Streaming responses", "Chat UX"],
    resourceLinks: [
      { type: "course", url: "#", title: "LLM Integration Patterns" },
    ],
    featured: true,
  },
  {
    title: "Real-time Chat Application",
    slug: "realtime-chat-app",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Build chat app with Socket.io and React",
    technologies: ["Socket.io", "React"],
    categories: ["Full-stack", "Real-time"],
    estimatedTime: "14-18 hours",
    learningObjectives: [
      "WebSocket protocol",
      "Real-time messaging",
      "Chat features",
    ],
    resourceLinks: [
      { type: "video", url: "#", title: "WebSocket Fundamentals" },
    ],
    featured: false,
  },
  {
    title: "Serverless API Gateway",
    slug: "serverless-api-gateway",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Create REST API using AWS Lambda & API Gateway",
    technologies: ["AWS Lambda", "API Gateway"],
    categories: ["Backend", "Cloud"],
    estimatedTime: "20-26 hours",
    learningObjectives: [
      "Serverless architecture",
      "AWS services",
      "API design",
    ],
    resourceLinks: [
      { type: "article", url: "#", title: "AWS Serverless Patterns" },
    ],
    featured: false,
  },
  {
    title: "E-commerce Product Search",
    slug: "ecommerce-product-search",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Implement search functionality with Algolia",
    technologies: ["Algolia"],
    categories: ["Frontend", "Search"],
    estimatedTime: "16-20 hours",
    learningObjectives: [
      "Search algorithms",
      "Algolia integration",
      "Search UX",
    ],
    resourceLinks: [
      { type: "course", url: "#", title: "Search Engine Optimization" },
    ],
    featured: false,
  },
  {
    title: "Mobile Payment Integration",
    slug: "mobile-payment-integration",
    difficultyLevel: Difficulty.ADVANCED,
    description: "Add Stripe payments to React Native app",
    technologies: ["React Native", "Stripe"],
    categories: ["Mobile", "Payments"],
    estimatedTime: "18-24 hours",
    learningObjectives: ["Payment processing", "Stripe API", "Mobile security"],
    resourceLinks: [
      { type: "video", url: "#", title: "Mobile Payment Systems" },
    ],
    featured: false,
  },
  {
    title: "Data Visualization Dashboard",
    slug: "data-visualization-dashboard",
    difficultyLevel: Difficulty.INTERMEDIATE,
    description: "Create analytics dashboard with D3.js",
    technologies: ["D3.js"],
    categories: ["Frontend", "Data Visualization"],
    estimatedTime: "14-18 hours",
    learningObjectives: [
      "D3.js fundamentals",
      "Data visualization",
      "Interactive charts",
    ],
    resourceLinks: [{ type: "article", url: "#", title: "D3.js Essentials" }],
    featured: false,
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
    const createdProject = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        ...project,
        createdById: user.id,
      },
      create: {
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
