import { PrismaClient, Difficulty } from "@prisma/client";
import * as argon2 from "argon2";

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

const projects = [
  {
    "title": "E-Commerce Dashboard",
    "slug": "ecommerce-dashboard",
    "description": "Create dynamic admin dashboard with React and Chart.js",
    "technologies": [
      "React",
      "Chart.js"
    ],
    "categories": [
      "Frontend",
      "Data Visualization"
    ],
    "estimatedTime": "12-16 hours",
    "learningObjectives": [
      "React state management",
      "Data visualization",
      "Dashboard UX"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "article",
        "title": "React State Management Guide"
      }
    ],
    "featured": true,
    "coverImage": "https://image.pollinations.ai/prompt/E-Commerce%20Dashboard%20React%20Chart.js%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Initial Setup & Dashboard Shell",
        "description": "Set up the React project, configure basic routing, and build the static structural components of the dashboard (e.g., sidebar navigation, header, main content area) without any dynamic data. Focus on creating a clean, modular component structure.",
        "hints": {
          "GUIDED": [
            "Initialize your React project using `create-react-app` or Vite.",
            "Install `react-router-dom` for navigation between dashboard pages (e.g., 'Overview', 'Products', 'Orders').",
            "Design a basic layout component that includes a fixed header, a sidebar for navigation, and a main content area. Use dummy links for now.",
            "Consider using a CSS framework (like Tailwind CSS or Material-UI) for quicker styling and responsive design foundation."
          ]
        }
      },
      {
        "title": "Data Integration & Tabular Views",
        "description": "Implement fetching of mock e-commerce data (e.g., from a local JSON file or a mock API endpoint) for sales, orders, and products. Display this data in simple tabular or list formats within designated dashboard sections.",
        "hints": {
          "GUIDED": [
            "Create a `data.json` file in your `public` folder or a dedicated `data` folder to simulate API responses for products, orders, and sales metrics.",
            "Use React's `useState` and `useEffect` hooks to fetch and store this data when a component mounts.",
            "Design basic tables or lists to display product information (name, price, stock), recent orders (order ID, customer, status), and summary sales figures.",
            "Consider creating a custom hook (e.g., `useFetchData`) or using React Context for global data access, especially if multiple components will need the same data."
          ]
        }
      },
      {
        "title": "Core Charting with Chart.js",
        "description": "Integrate Chart.js into the dashboard. Create and display at least 3-4 key data visualizations using the fetched data, such as: Sales Over Time (Line Chart), Product Categories Distribution (Pie/Doughnut Chart), Top Selling Products (Bar Chart).",
        "hints": {
          "GUIDED": [
            "Install `chart.js` and `react-chartjs-2` to easily use Chart.js components in React.",
            "For each chart, prepare your fetched raw data into the format expected by Chart.js (e.g., `labels` array and `datasets` array).",
            "Start with basic chart types: Line Chart for time-series data (e.g., daily sales), Bar Chart for comparisons (e.g., sales by product), and Pie/Doughnut Chart for distributions (e.g., product categories).",
            "Experiment with basic Chart.js options like titles, legends, and tooltips to make charts more informative."
          ]
        }
      },
      {
        "title": "Dynamic Filters & Interactive Charts",
        "description": "Add interactive elements to filter the displayed data and charts. Implement features like date range selection (e.g., 'Last 7 days', 'Last 30 days', custom range), category filtering, or sorting options. Ensure charts and tabular data dynamically update based on these filters.",
        "hints": {
          "GUIDED": [
            "Implement `useState` to manage filter parameters (e.g., `startDate`, `endDate`, `selectedCategory`, `sortOrder`).",
            "Create utility functions or a custom hook that takes the raw data and current filter parameters, returning the filtered dataset.",
            "Integrate UI components for filters, such as `<select>` dropdowns for categories, input fields for text search, or a date picker library (e.g., `react-datepicker`) for date ranges.",
            "Ensure that whenever a filter changes, the data processing logic re-runs, and the Chart.js components (and tables) re-render with the updated, filtered data."
          ]
        }
      },
      {
        "title": "Dashboard Enhancements & Polish",
        "description": "Enhance the dashboard with features like loading states, error handling, responsive design for various screen sizes, and potentially more complex visualizations (e.g., a radar chart for product metrics, a combined bar/line chart). Focus on improving the overall user experience and robustness.",
        "hints": {
          "GUIDED": [
            "Implement `isLoading` and `isError` states during data fetching to provide user feedback (e.g., displaying a loading spinner or an error message).",
            "Refine your CSS or styling framework usage to ensure the dashboard layout and charts are responsive across different screen sizes (mobile, tablet, desktop).",
            "Explore advanced Chart.js options for customization, such as custom tooltips, animations, or combining different chart types (e.g., a Line-Bar chart).",
            "Add small UX improvements like clear button states, hover effects, or even a simple dark/light mode toggle for an improved user experience."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.INTERMEDIATE
  },
  {
    "title": "E-Commerce REST API",
    "slug": "ecommerce-rest-api",
    "description": "Develop a Node.js API with Express and MongoDB for product management",
    "technologies": [
      "Node.js",
      "Express",
      "MongoDB"
    ],
    "categories": [
      "Backend",
      "API Development"
    ],
    "estimatedTime": "16-20 hours",
    "learningObjectives": [
      "RESTful API design",
      "Database modeling",
      "Authentication"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "course",
        "title": "Node.js Fundamentals"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/E-Commerce%20REST%20API%20Node.js%20Express%20MongoDB%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "API Foundation & Database Link",
        "description": "Initialize the Node.js project, set up a basic Express server, and establish a connection to a MongoDB database. Create a simple health check route (`/api/status`).",
        "hints": {
          "GUIDED": [
            "Start by running `npm init -y` and installing `express`, `mongoose`, and `dotenv`.",
            "Create an `app.js` or `server.js` file to configure your Express server.",
            "Use `mongoose.connect()` within an `async` function to establish the database connection.",
            "Remember to use environment variables (e.g., from a `.env` file) for your MongoDB connection URI and port."
          ]
        }
      },
      {
        "title": "Product Schema & Basic CRUD (Create/Read All)",
        "description": "Define the Mongoose schema for a `Product` (e.g., name, description, price, category, stock). Implement API endpoints to create a new product (`POST /api/products`) and retrieve all products (`GET /api/products`).",
        "hints": {
          "GUIDED": [
            "Design your `Product` schema with relevant data types and validation rules (e.g., `name: { type: String, required: true }`).",
            "For creating a product, use `Product.create(req.body)` inside your POST route handler.",
            "For retrieving all products, use `Product.find({})` inside your GET route handler.",
            "Ensure your routes are modularized, perhaps in a `routes/productRoutes.js` file."
          ]
        }
      },
      {
        "title": "Comprehensive Product Management & Error Handling",
        "description": "Implement endpoints for retrieving a single product by ID (`GET /api/products/:id`), updating an existing product (`PUT /api/products/:id`), and deleting a product (`DELETE /api/products/:id`). Add basic error handling for 'product not found' scenarios.",
        "hints": {
          "GUIDED": [
            "Use `Product.findById(req.params.id)` to find a single product.",
            "For updates, consider `Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })`.",
            "For deletion, `Product.findByIdAndDelete(req.params.id)` is the method.",
            "Implement a `try-catch` block in your route handlers and send appropriate HTTP status codes (e.g., 404 for not found, 500 for server errors)."
          ]
        }
      },
      {
        "title": "Input Validation & Advanced Querying",
        "description": "Implement input validation for product creation and updates to ensure data integrity (e.g., using `express-validator` or `Joi`). Enhance the `GET /api/products` endpoint with support for pagination and basic filtering (e.g., by category or price range).",
        "hints": {
          "GUIDED": [
            "Choose an input validation library like `express-validator` and define validation chains for your product fields.",
            "For pagination, use `req.query.page` and `req.query.limit` with Mongoose methods like `.skip()` and `.limit()`.",
            "For filtering, modify `Product.find()` to accept query parameters (e.g., `Product.find({ category: req.query.category })`).",
            "Consider adding sorting functionality (e.g., by `price` or `createdAt`) using `.sort()`."
          ]
        }
      },
      {
        "title": "Secure Product Endpoints (Authentication/Authorization)",
        "description": "Implement user registration and login functionality using JSON Web Tokens (JWT) for authentication. Protect product creation, update, and deletion routes, ensuring only authenticated and authorized users can perform these actions.",
        "hints": {
          "GUIDED": [
            "Create a `User` Mongoose model with fields like `email`, `password`, `role`.",
            "Use `bcrypt.js` to hash user passwords before saving them to the database.",
            "Install `jsonwebtoken` to generate tokens upon successful login and verify them for protected routes.",
            "Develop middleware functions (`authMiddleware.js`) to check for a valid JWT and optionally for user roles (`admin`, `user`)."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.INTERMEDIATE
  },
  {
    "title": "Social Media Dashboard",
    "slug": "social-media-dashboard",
    "description": "Build real-time dashboard with React, GraphQL and WebSockets",
    "technologies": [
      "React",
      "GraphQL",
      "WebSockets"
    ],
    "categories": [
      "Full-stack",
      "Real-time"
    ],
    "estimatedTime": "24-32 hours",
    "learningObjectives": [
      "GraphQL subscriptions",
      "Real-time data",
      "Advanced state management"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "video",
        "title": "GraphQL Subscriptions"
      }
    ],
    "featured": true,
    "coverImage": "https://image.pollinations.ai/prompt/Social%20Media%20Dashboard%20React%20GraphQL%20WebSockets%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Foundation & Static Layout",
        "description": "Set up the React project boilerplate, configure basic routing (e.g., React Router), and design the core dashboard layout. Display mock social media data within various components to establish the UI/UX foundation, focusing on component structure and responsiveness.",
        "hints": {
          "GUIDED": [
            "Use Vite or Create React App for rapid project initialization and basic tooling.",
            "Consider a popular component library (e.g., Material-UI, Chakra UI, Ant Design) for accelerating UI development and ensuring consistent styling.",
            "Define a clear and modular component hierarchy (e.g., DashboardLayout, Sidebar, MainContent, FeedCard, MetricWidget, ChartContainer).",
            "Create a `data/mockData.js` file to simulate diverse social media posts, user statistics, engagement metrics, and historical data for initial UI population."
          ]
        }
      },
      {
        "title": "GraphQL API Backend & Data Persistence",
        "description": "Develop a robust GraphQL server (e.g., using Apollo Server with Express) capable of serving complex social media data. Define your comprehensive GraphQL schema, implement resolvers for queries (fetching posts, users, metrics) and mutations (e.g., 'like' a post, 'add' a comment). Integrate this API with the React frontend using Apollo Client to fetch, display, and interact with dynamic content.",
        "hints": {
          "GUIDED": [
            "Set up an Apollo Server instance with a robust HTTP server (e.g., Express or Fastify) and define your GraphQL schema using GraphQL SDL or code-first approaches.",
            "Define comprehensive GraphQL types for core entities like `User`, `Post`, `Comment`, `Tag`, and `AggregatedMetric` in your schema, including relationships.",
            "Implement resolvers for `Query` operations to fetch lists of posts, individual post details, user profiles, and aggregated metrics.",
            "Integrate a production-ready database (e.g., PostgreSQL with Prisma ORM, MongoDB with Mongoose) to persist and manage your social media data.",
            "Use `@apollo/client` in your React application, specifically `useQuery` for data fetching and `useMutation` for actions like creating posts, liking, or commenting, ensuring proper cache updates."
          ]
        }
      },
      {
        "title": "Real-time Data Flow with WebSockets & Subscriptions",
        "description": "Extend your GraphQL server to incorporate WebSockets and GraphQL Subscriptions for real-time data delivery. Implement instant updates for critical social media events such as new posts appearing, likes being added, or comments being made. Push these changes instantly to the connected React dashboard using `useSubscription` for a truly live and responsive user experience.",
        "hints": {
          "GUIDED": [
            "Integrate a WebSocket server into your Apollo Server setup (e.g., using Apollo's `ws` package or `graphql-ws` for newer protocol).",
            "Define subscription types in your GraphQL schema (e.g., `postAdded`, `postLiked`, `commentAdded`, `userJoined`) and their corresponding resolvers.",
            "Utilize a production-grade PubSub mechanism (e.g., Redis-backed `PubSubEngine` from `graphql-subscriptions` for distributed environments) to publish events from your resolvers.",
            "Configure your `ApolloClient` in React to use a `WebSocketLink` or `split` link for subscriptions, ensuring it can connect to your WebSocket endpoint and handle protocol upgrades.",
            "Employ the `useSubscription` hook in your React components to listen for real-time events and dynamically update the UI (e.g., prepend new posts to a feed, increment like counts without manual refresh, display live notifications)."
          ]
        }
      },
      {
        "title": "Interactive Dashboard & Advanced Data Visualization",
        "description": "Develop highly interactive data visualization components to display aggregated social media metrics effectively. Implement dynamic charts and graphs (e.g., engagement rates over time, follower growth, sentiment analysis trends, hashtag popularity). Add sophisticated user interaction features like customizable date range selectors, multi-level filters, and advanced sorting options to enable deep data exploration and analysis.",
        "hints": {
          "GUIDED": [
            "Choose a powerful charting library for React that supports interactivity and diverse chart types (e.g., Recharts, Nivo, Chart.js with React-Chartjs-2, D3.js for custom visualizations).",
            "Design complex GraphQL queries to fetch aggregated metrics for your charts, possibly including arguments for time ranges, filters, and grouping.",
            "Implement robust client-side state management (e.g., React Context API, Redux Toolkit, Zustand) for managing user selections like date ranges, filters, and chart configurations.",
            "Add advanced UI controls (date range pickers, multi-select dropdowns, sliders, search inputs) to allow users to dynamically modify chart data and views.",
            "Consider implementing data caching strategies (e.g., Apollo Client's normalized cache, manual in-memory cache) for frequently accessed aggregated data to improve performance.",
            "Optimize data fetching for visualizations by implementing techniques like debouncing or throttling for filter inputs and partial data loading."
          ]
        }
      },
      {
        "title": "Authentication, Performance Optimization & Deployment",
        "description": "Implement robust user authentication (e.g., JWT-based) to secure sensitive API endpoints and dashboard sections, managing user roles and permissions. Focus on comprehensive performance optimizations such as lazy loading components, pagination for large data feeds, efficient data fetching strategies, and server-side rendering (optional). Finally, strategize and prepare for a production-grade deployment of both the React frontend and the GraphQL/WebSocket backend to a scalable cloud platform.",
        "hints": {
          "GUIDED": [
            "Integrate a robust JWT (JSON Web Token) authentication flow into your GraphQL server, validating tokens in the Apollo context for every protected resolver.",
            "Implement a complete user authentication flow in React (login, logout, registration, persistent sessions) and enforce protected routes using React Router.",
            "Consider implementing cursor-based or offset-based pagination for social media feeds and other large lists to improve initial load times and memory usage.",
            "Utilize React's `lazy` and `Suspense` for code-splitting and lazy loading dashboard components, improving initial bundle size and load performance.",
            "Implement effective caching strategies (e.g., HTTP caching, CDN caching for static assets, Apollo Client's cache configuration) to reduce redundant data fetches.",
            "Research and plan a scalable deployment strategy: Vercel/Netlify for the React frontend, and platforms like AWS AppSync (for managed GraphQL), AWS Fargate/Lambda, Google Cloud Run, or Kubernetes for your GraphQL/WebSocket backend.",
            "Implement comprehensive error handling on both client and server, providing user-friendly feedback for API failures, network issues, and authentication errors."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.ADVANCED
  },
  {
    "title": "Portfolio Website",
    "slug": "portfolio-website",
    "description": "Create a personal portfolio with Next.js and Tailwind CSS",
    "technologies": [
      "Next.js",
      "Tailwind CSS"
    ],
    "categories": [
      "Frontend",
      "Web Design"
    ],
    "estimatedTime": "8-10 hours",
    "learningObjectives": [
      "Next.js basics",
      "Tailwind CSS",
      "Portfolio best practices"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "video",
        "title": "Portfolio Best Practices"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/Portfolio%20Website%20Next.js%20Tailwind%20CSS%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Milestone 1: Project Setup & Core Layout",
        "description": "Initialize your Next.js project, integrate Tailwind CSS, and establish a basic layout with a navigation bar and a main content area. This lays the foundation for your portfolio.",
        "hints": {
          "GUIDED": [
            "Use `npx create-next-app@latest my-portfolio` to start your project.",
            "Follow the official Next.js documentation for integrating Tailwind CSS (it usually involves `npx tailwindcss init -p` and configuring `tailwind.config.js`).",
            "Create a `components/Layout.js` file to define a consistent header/footer/navbar that wraps your page content.",
            "Design a simple navigation bar in your `Layout` component with placeholder links (e.g., Home, About, Projects, Contact)."
          ]
        }
      },
      {
        "title": "Milestone 2: Crafting Core Content Sections",
        "description": "Develop the main content for your portfolio, including an 'About Me' section, a 'Projects' section, and a 'Contact Me' section. Focus on getting the text and basic elements in place.",
        "hints": {
          "GUIDED": [
            "Decide if you want a single-page portfolio (sections on `pages/index.js`) or multi-page (`pages/about.js`, `pages/projects.js`, etc.). For beginner, single-page can be simpler.",
            "For the 'About Me' section, include a heading, a short introductory paragraph, and a placeholder for your profile picture.",
            "For the 'Projects' section, add a heading and a few `div` elements as placeholders for individual project cards.",
            "For the 'Contact Me' section, include a heading and simple contact information or links (e.g., email address, LinkedIn profile link)."
          ]
        }
      },
      {
        "title": "Milestone 3: Styling with Tailwind & Basic Responsiveness",
        "description": "Apply Tailwind CSS utility classes to style your content, ensuring a visually appealing design. Implement basic responsive design principles to make your site look good on different screen sizes.",
        "hints": {
          "GUIDED": [
            "Experiment with Tailwind classes like `text-2xl`, `font-bold`, `bg-gray-900`, `text-white`, `p-8`, `mx-auto`, `max-w-screen-lg` for general styling.",
            "Use padding (`p-`), margin (`m-`), and gap (`gap-`) utilities to create visual separation and spacing between elements.",
            "Apply basic responsive classes using prefixes like `md:` and `lg:` (e.g., `md:flex`, `lg:grid-cols-3`) to adjust layout for medium and large screens.",
            "Focus on typography (font sizes, weights, colors) and consistent color palettes using Tailwind's default colors or by extending them in `tailwind.config.js`."
          ]
        }
      },
      {
        "title": "Milestone 4: Reusable Components & Dynamic Content",
        "description": "Create reusable components, such as a 'Project Card', to display your work efficiently. Integrate dummy data (e.g., an array of project objects) to populate these components dynamically.",
        "hints": {
          "GUIDED": [
            "Create a new component file, e.g., `components/ProjectCard.js`. It should accept `props` like `title`, `description`, `imageUrl`, `githubLink`, `liveDemoLink`.",
            "Define an array of JavaScript objects (e.g., `const projects = [...]`) in your `pages/projects.js` or `pages/index.js` (if single-page), where each object represents a project with its data.",
            "Use the `map()` method to iterate over your `projects` array and render a `ProjectCard` component for each project, passing the project data as props.",
            "Ensure your navigation links (if multi-page) are using Next.js's `<Link>` component for client-side routing."
          ]
        }
      },
      {
        "title": "Milestone 5: Final Touches & Deployment",
        "description": "Polish your portfolio by refining styles, adding smooth scrolling (if single-page), and ensuring all links are functional. Finally, deploy your website to a live hosting service.",
        "hints": {
          "GUIDED": [
            "Review your website for consistency in spacing, typography, and color across all sections and pages.",
            "Add subtle hover effects to buttons, links, or project cards using Tailwind's `hover:` utility classes (e.g., `hover:bg-blue-600`, `hover:scale-105`).",
            "Test all internal and external links to ensure they navigate correctly.",
            "For deployment, consider Vercel (the creators of Next.js) for easy integration: commit your code to GitHub, then connect your repository to Vercel via their CLI (`vercel`) or dashboard."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.BEGINNER
  },
  {
    "title": "Authentication System",
    "slug": "authentication-system",
    "description": "Implement OAuth 2.0 flow with Node.js and Passport.js",
    "technologies": [
      "Node.js",
      "Passport.js"
    ],
    "categories": [
      "Backend",
      "Security"
    ],
    "estimatedTime": "20-24 hours",
    "learningObjectives": [
      "OAuth 2.0",
      "JWT tokens",
      "Security best practices"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "course",
        "title": "Web Security Fundamentals"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/Authentication%20System%20Node.js%20Passport.js%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Project Setup and Base Server",
        "description": "Initialize a Node.js project, set up an Express server, and configure basic routing (e.g., home, login page with a button). Integrate environment variable management (e.g., `dotenv`) for sensitive information like port numbers and API keys.",
        "hints": {
          "GUIDED": [
            "Use `npm init -y` to quickly initialize your project.",
            "Install `express` and `dotenv`.",
            "Create an `app.js` or `server.js` file with an Express instance and `app.listen()`.",
            "Set up a basic `/` route that renders a placeholder or simple HTML.",
            "Use `.env` file to store `PORT` and load it with `require('dotenv').config()`."
          ]
        }
      },
      {
        "title": "Passport.js & Single OAuth Strategy Integration",
        "description": "Install Passport.js and a specific OAuth 2.0 strategy (e.g., `passport-google-oauth20` or `passport-github`). Configure Passport middleware. Set up the 'auth' route to initiate the OAuth flow and the 'callback' route to handle the provider's response. Obtain necessary Client ID and Client Secret from your chosen OAuth provider (e.g., Google Developer Console, GitHub OAuth Apps).",
        "hints": {
          "GUIDED": [
            "Install `passport` and your chosen strategy (e.g., `passport-google-oauth20`).",
            "Configure the strategy with `new GoogleStrategy({ clientID: ..., clientSecret: ..., callbackURL: ... }, verifyCallback)`.",
            "Add `app.use(passport.initialize())` to your Express app.",
            "Create an authentication route like `app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }))`.",
            "Implement the callback route: `app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => { res.redirect('/profile'); })`."
          ]
        }
      },
      {
        "title": "Session Management and User Persistence",
        "description": "Integrate `express-session` for managing user sessions. Implement Passport's `serializeUser` and `deserializeUser` methods to store and retrieve user data (typically just the user ID) from the session. Create a basic User model (e.g., using Mongoose for MongoDB or Sequelize for PostgreSQL) to persist user profiles obtained from the OAuth provider in your database after successful authentication.",
        "hints": {
          "GUIDED": [
            "Install `express-session` and a session store (e.g., `connect-mongo` for MongoDB).",
            "Configure `app.use(session({ secret: '...', resave: false, saveUninitialized: false, store: ... }))`.",
            "Add `app.use(passport.session())` after `passport.initialize()` and `express-session`.",
            "Implement `passport.serializeUser((user, done) => done(null, user.id))`.",
            "Implement `passport.deserializeUser(async (id, done) => { const user = await User.findById(id); done(null, user); })`.",
            "Define a `User` schema (e.g., `name`, `email`, `providerId`) and use `User.findOrCreate` logic within your OAuth strategy's `verifyCallback`."
          ]
        }
      },
      {
        "title": "Protected Routes, Logout, and Error Handling",
        "description": "Implement middleware (`isAuthenticated`) to protect specific routes, ensuring only authenticated users can access sensitive pages (e.g., a user profile dashboard). Add a logout mechanism that effectively clears the user's session. Implement basic error handling for authentication failures and other common server-side errors, providing user-friendly feedback.",
        "hints": {
          "GUIDED": [
            "Create a middleware function: `const isAuthenticated = (req, res, next) => { if (req.isAuthenticated()) { return next(); } res.redirect('/login'); }`.",
            "Apply the middleware to protected routes: `app.get('/profile', isAuthenticated, (req, res) => { res.render('profile', { user: req.user }); })`.",
            "Implement a logout route: `app.get('/logout', (req, res) => { req.logout(err => { if (err) { return next(err); } res.redirect('/'); }); })` (Note: `req.logout` now requires a callback in newer Passport versions).",
            "Add flash messages (e.g., using `connect-flash`) to provide feedback on login/logout success or failure.",
            "Implement a generic error handling middleware `app.use((err, req, res, next) => { ... })`."
          ]
        }
      },
      {
        "title": "Multiple OAuth Providers Integration",
        "description": "Extend the system to support a second OAuth 2.0 provider (e.g., GitHub if Google was used initially, or vice versa). Refactor the user model and authentication logic to seamlessly handle and potentially link user accounts from different providers to a single internal user profile.",
        "hints": {
          "GUIDED": [
            "Install another Passport strategy (e.g., `passport-github2`).",
            "Configure the new strategy similar to the first one, adding its own 'auth' and 'callback' routes.",
            "Modify your `User` schema to accommodate multiple provider IDs (e.g., `googleId`, `githubId`) and associated profile data.",
            "In your `verifyCallback` functions, implement logic to either find an existing user by the provider ID, create a new user, or if a user is already logged in, link the new provider to their existing account.",
            "Ensure `serializeUser` and `deserializeUser` can handle users coming from different providers."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.ADVANCED
  },
  {
    "title": "Mobile Recipe App",
    "slug": "mobile-recipe-app",
    "description": "Build cross-platform recipe manager with React Native",
    "technologies": [
      "React Native"
    ],
    "categories": [
      "Mobile",
      "Frontend"
    ],
    "estimatedTime": "18-22 hours",
    "learningObjectives": [
      "React Native basics",
      "Mobile navigation",
      "API integration"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "video",
        "title": "React Native Navigation Tutorial"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/Mobile%20Recipe%20App%20React%20Native%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Initial Setup & Static Recipe List",
        "description": "Set up a new React Native project. Display a basic app header and a hardcoded list of recipe titles (e.g., an array of strings) on the main screen using a scrollable list component.",
        "hints": {
          "GUIDED": [
            "Use `npx react-native init MobileRecipeApp` to create your project.",
            "Create a `src/data/recipes.js` file with a simple array of recipe objects (e.g., `{ id: '1', name: 'Pasta' }`).",
            "Utilize the `FlatList` component from `react-native` to render the list of recipe titles.",
            "Ensure each item in the `FlatList` has a unique `keyExtractor`."
          ]
        }
      },
      {
        "title": "Navigation & Recipe Detail View",
        "description": "Implement screen navigation using `React Navigation`. Tapping on a recipe title in the list should navigate to a dedicated 'Recipe Detail' screen, displaying more comprehensive (still hardcoded) details for that specific recipe, such as ingredients and instructions.",
        "hints": {
          "GUIDED": [
            "Install `react-navigation/native` and `react-navigation/stack` (or `BottomTabs` if you prefer).",
            "Wrap your `App` component with `NavigationContainer`.",
            "Create a `StackNavigator` with two screens: `RecipeList` and `RecipeDetail`.",
            "Pass the selected recipe's ID or data as a parameter to the `RecipeDetail` screen using `navigation.navigate('RecipeDetail', { recipeId: item.id })`.",
            "On the `RecipeDetail` screen, use `route.params` to access the passed data and display the corresponding hardcoded recipe details."
          ]
        }
      },
      {
        "title": "Recipe Creation & Local Storage",
        "description": "Add a new screen or modal for users to input and save new recipe details (name, ingredients, instructions). Implement local data persistence using `AsyncStorage` to store these user-added recipes, ensuring they persist across app launches and reloads.",
        "hints": {
          "GUIDED": [
            "Install `@react-native-async-storage/async-storage`.",
            "Create a 'New Recipe' screen with `TextInput` components for recipe name, ingredients, and instructions.",
            "Use `useState` hooks to manage the input field values.",
            "On form submission, create a new recipe object and save it to `AsyncStorage` (e.g., `await AsyncStorage.setItem('recipes', JSON.stringify(updatedRecipes))`).",
            "Use `useEffect` on your `RecipeList` screen to load existing recipes from `AsyncStorage` when the component mounts.",
            "Ensure recipes are parsed `JSON.parse()` when loaded and stringified `JSON.stringify()` when saved."
          ]
        }
      },
      {
        "title": "Manage & Modify Recipes",
        "description": "Enhance the 'Recipe Detail' screen to include options for editing and deleting recipes. When editing, pre-populate the new recipe form with the existing recipe's data. Ensure all changes (edits and deletions) are correctly updated in local storage and reflected in the recipe list.",
        "hints": {
          "GUIDED": [
            "Add an 'Edit' button to your `RecipeDetail` screen that navigates to your 'New Recipe' form, passing the existing recipe's data as parameters.",
            "Modify your 'New Recipe' screen to detect if it's in 'edit' mode (e.g., by checking for `route.params.recipeToEdit`). Pre-populate the `TextInput` fields if a recipe is being edited.",
            "Implement logic to update an existing recipe in your `AsyncStorage` array when in edit mode (find by ID and replace).",
            "Add a 'Delete' button to the `RecipeDetail` screen. Implement a confirmation prompt before deleting a recipe from `AsyncStorage` and navigating back to the list."
          ]
        }
      },
      {
        "title": "Search Your Cookbook",
        "description": "Implement a search bar on the main recipe list screen. Allow users to dynamically filter the displayed recipes based on keywords present in the recipe name or ingredients. The list should update in real-time as the user types.",
        "hints": {
          "GUIDED": [
            "Add a `TextInput` component at the top of your `RecipeList` screen to serve as the search bar.",
            "Use a `useState` hook to manage the search query text.",
            "Implement a filtering function that takes the full list of recipes and the search query. It should return a new array of recipes that match the criteria.",
            "Apply this filtering function to your `FlatList` data source. Ensure the search is case-insensitive (e.g., `toLowerCase()`).",
            "Consider debouncing the search input for better performance on larger datasets (e.g., using `setTimeout` to delay filtering until the user pauses typing)."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.INTERMEDIATE
  },
  {
    "title": "CMS Platform",
    "slug": "cms-platform",
    "description": "Headless CMS with Next.js and Sanity.io",
    "technologies": [
      "Next.js",
      "Sanity.io"
    ],
    "categories": [
      "Full-stack",
      "CMS"
    ],
    "estimatedTime": "28-36 hours",
    "learningObjectives": [
      "Headless CMS",
      "Content modeling",
      "Next.js ISR"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "article",
        "title": "Sanity Studio Customization"
      }
    ],
    "featured": true,
    "coverImage": "https://image.pollinations.ai/prompt/CMS%20Platform%20Next.js%20Sanity.io%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Core Infrastructure Setup & Sanity Schema Definition",
        "description": "Establish a monorepo (e.g., using pnpm workspaces or TurboRepo) containing both the Next.js frontend and the Sanity Studio backend. Initialize the Sanity project, defining advanced content schemas such as 'post' (with Portable Text for rich content, embedded images, and custom blocks), 'author', 'category', and 'page'. Configure Sanity Studio locally to ensure all defined content models are correctly rendered and editable.",
        "hints": {
          "GUIDED": [
            "Consider `pnpm workspaces` or `nx` for monorepo management.",
            "When defining schemas, leverage `references` for relationships between documents (e.g., post to author/category).",
            "Implement custom Portable Text serializers for advanced rendering needs (e.g., custom components within rich text).",
            "Explore Sanity's 'vision' tool for testing GROQ queries against your local dataset during schema development."
          ]
        }
      },
      {
        "title": "Sanity Studio Deployment & Data Population",
        "description": "Deploy the Sanity Studio to Sanity's hosting service. Populate the CMS with a substantial amount of realistic sample data across all defined schemas. Configure Sanity Studio's advanced features like custom document actions, desk structure customizations (e.g., grouping documents by type, creating singletons), and user roles/permissions to simulate a real-world content management environment.",
        "hints": {
          "GUIDED": [
            "Use `sanity deploy` to push your Studio to a hosted environment.",
            "Familiarize yourself with `structureBuilder` (S.js) to customize the Sanity Studio's navigation and layout.",
            "Implement a custom 'Publish & Deploy' document action that triggers a Next.js revalidation via a webhook.",
            "Define granular access control roles for different user types (e.g., admin, editor, reviewer) within Sanity."
          ]
        }
      },
      {
        "title": "Next.js Integration & Global Content Overview",
        "description": "Initialize the Next.js application within the monorepo. Configure `@sanity/client` with environment variables for API keys and project IDs. Implement a robust data fetching strategy using `getStaticProps` with `revalidate` (ISR) to display a paginated list of content items (e.g., blog posts) on the homepage. Handle dynamic content filtering (e.g., by category) and initial basic client-side search functionality.",
        "hints": {
          "GUIDED": [
            "Configure `@sanity/client` with `apiVersion` and potentially `useCdn` for optimized fetching.",
            "Master advanced GROQ queries for filtering, sorting, and projecting specific fields for your content lists.",
            "Implement `getStaticProps` with `revalidate` to ensure fresh data without full rebuilds.",
            "Consider a shared `lib/sanity.ts` file for your client instance and common GROQ queries."
          ]
        }
      },
      {
        "title": "Dynamic Content Routing & Single Content Display",
        "description": "Implement dynamic routing in Next.js (e.g., `pages/blog/[slug].tsx`) to display individual content pages. Utilize `getStaticPaths` to pre-render common routes and `fallback: 'blocking'` or `'true'` for on-demand generation of new content. Render complex Portable Text content using a custom React component that intelligently handles different block types, inline marks, and custom components defined in Sanity.",
        "hints": {
          "GUIDED": [
            "Effectively use `getStaticPaths` to generate static pages for known slugs at build time.",
            "Develop a robust Portable Text renderer using `@portabletext/react` or similar, ensuring custom components and marks are properly serialized.",
            "Implement basic SEO meta tags (title, description, image) using Next.js `Head` for each content page, sourcing data from Sanity.",
            "Ensure your GROQ queries for single content pages fetch all necessary related data (e.g., author details, categories)."
          ]
        }
      },
      {
        "title": "Real-time Previews & Enhanced Authoring Workflow",
        "description": "Integrate Sanity's real-time preview capabilities into the Next.js application, allowing content authors to see live changes as they type in the Sanity Studio before publishing. Implement a secure preview mode in Next.js using `setPreviewData` and `clearPreviewData`, ensuring authenticated access to unpublished drafts. Explore and potentially implement Sanity's Visual Editing or a custom iframe-based solution for a more seamless authoring experience.",
        "hints": {
          "GUIDED": [
            "Utilize `@sanity/preview-kit` for enabling live queries in your Next.js application.",
            "Secure your preview route with a token or password-based authentication.",
            "Configure CORS settings in Sanity to allow your Next.js preview URL.",
            "Implement a 'Preview' button in the Sanity Studio using `documentActions` that opens the Next.js preview page for the current draft."
          ]
        }
      },
      {
        "title": "Advanced Features, SEO & Production Deployment",
        "description": "Implement advanced features such as full-text search across multiple content types using Sanity's `match` operator and potentially a dedicated search index (e.g., Algolia, Meilisearch). Optimize SEO further by generating a sitemap and RSS feed. Finally, deploy the Next.js frontend to a production-grade hosting platform (e.g., Vercel) and ensure all integrations (Sanity webhooks for revalidation, preview mode, etc.) are fully functional and secure.",
        "hints": {
          "GUIDED": [
            "Design advanced GROQ queries using `match` for full-text search across specific fields and document types.",
            "Implement a debounce mechanism for client-side search input to optimize API calls.",
            "Dynamically generate `sitemap.xml` and `rss.xml` using `getServerSideProps` or a build script.",
            "Configure Vercel environment variables securely and ensure webhooks for Sanity revalidation are correctly set up on Vercel and Sanity."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.ADVANCED
  },
  {
    "title": "AI Chat Interface",
    "slug": "ai-chat-interface",
    "description": "Build GPT-4 chatbot with streaming responses",
    "technologies": [
      "GPT-4",
      "Streaming"
    ],
    "categories": [
      "AI/ML",
      "Full-stack"
    ],
    "estimatedTime": "24-30 hours",
    "learningObjectives": [
      "LLM integration",
      "Streaming responses",
      "Chat UX"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "course",
        "title": "LLM Integration Patterns"
      }
    ],
    "featured": true,
    "coverImage": "https://image.pollinations.ai/prompt/AI%20Chat%20Interface%20GPT-4%20Streaming%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "API Connection & Basic Static Chat",
        "description": "Set up your development environment, connect to the GPT-4 API, and make your first non-streaming request. Display the static response in a simple UI. This validates your API key and basic request/response flow.",
        "hints": {
          "GUIDED": [
            "Choose a backend framework (e.g., Node.js with Express, Python with FastAPI/Flask) to handle API calls securely, keeping your API key server-side.",
            "Use the official `openai` library. For non-streaming, call `client.chat.completions.create(...)` with your prompt.",
            "A minimal frontend can be a simple HTML file with vanilla JavaScript or a lightweight framework to send the request to your backend and display the received text."
          ]
        }
      },
      {
        "title": "Interactive Chat Interface",
        "description": "Develop a basic interactive chat interface. Users should be able to type a message, send it, and see both their message and the chatbot's static response displayed in a conversation log. Focus on the core UI interaction.",
        "hints": {
          "GUIDED": [
            "Implement an input field (e.g., `<textarea>`) and a 'Send' button.",
            "Store messages in an array in your frontend application state (e.g., React `useState`, Vue `data`). Each message should include `role` (user/assistant) and `content`.",
            "Render the message array dynamically, displaying user and assistant messages with distinct styling.",
            "Ensure the input field clears after a message is sent and optionally auto-scrolls the chat window to the bottom."
          ]
        }
      },
      {
        "title": "Real-time Streaming Chat",
        "description": "Refactor your API interaction to leverage streaming responses. The chatbot's reply should appear word by word or token by token, rather than waiting for the entire response to be generated, significantly enhancing user experience.",
        "hints": {
          "GUIDED": [
            "On the backend, set `stream=True` in your OpenAI API call (e.g., `client.chat.completions.create(..., stream=True)`).",
            "Implement a server-sent events (SSE) endpoint or WebSockets on your backend to push text chunks from OpenAI to your frontend.",
            "On the frontend, open a connection to your streaming endpoint. As chunks arrive, append them to the *current* assistant message being displayed, rather than creating new messages for each chunk.",
            "Manage the state of the streaming message carefully: initialize it when streaming starts and finalize it when the stream ends."
          ]
        }
      },
      {
        "title": "Maintaining Conversation History",
        "description": "Implement logic to store and send the full conversation history (user and assistant messages) with each subsequent API request to GPT-4. This is crucial for the chatbot to maintain context throughout the conversation.",
        "hints": {
          "GUIDED": [
            "Before making an API call, construct an array of message objects, where each object has a `role` ('user' or 'assistant') and `content`.",
            "Include the system message (e.g., `{'role': 'system', 'content': 'You are a helpful AI assistant.'}`) as the first message in the history.",
            "Pass this array of message objects to the `messages` parameter in your OpenAI API call.",
            "Be mindful of the token limit for GPT-4. For very long conversations, consider strategies like summarization or truncating older messages (an advanced optimization)."
          ]
        }
      },
      {
        "title": "Robustness & User Experience Enhancements",
        "description": "Enhance the user experience by adding visual feedback for loading states, clear error messages for API failures, and a 'Reset Chat' functionality. Improve the display of bot responses with basic markdown rendering.",
        "hints": {
          "GUIDED": [
            "Implement a loading indicator (e.g., a spinner, 'Bot is typing...' message) that appears while waiting for an API response and disappears when streaming starts or finishes.",
            "Implement robust error handling: catch network errors, API errors (e.g., rate limits, invalid API key), and display user-friendly error messages in the chat interface.",
            "Add a 'Reset Chat' button that clears the entire conversation history from both the frontend state and any backend session storage.",
            "Integrate a markdown rendering library (e.g., `marked.js` for JavaScript, `react-markdown` for React) to properly display formatted text, code blocks, and lists from the bot's responses."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.ADVANCED
  },
  {
    "title": "Serverless API Gateway",
    "slug": "serverless-api-gateway",
    "description": "Create REST API using AWS Lambda & API Gateway",
    "technologies": [
      "AWS Lambda",
      "API Gateway"
    ],
    "categories": [
      "Backend",
      "Cloud"
    ],
    "estimatedTime": "20-26 hours",
    "learningObjectives": [
      "Serverless architecture",
      "AWS services",
      "API design"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "article",
        "title": "AWS Serverless Patterns"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/Serverless%20API%20Gateway%20AWS%20Lambda%20API%20Gateway%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Initial Serverless Endpoint",
        "description": "Deploy a simple AWS Lambda function that returns a 'Hello World' message. Integrate it with API Gateway to create a public HTTP endpoint accessible via a GET request.",
        "hints": {
          "GUIDED": [
            "Start by creating a basic Lambda function (e.g., Python or Node.js) that returns a JSON object. Focus on the core handler logic.",
            "In API Gateway, create a new REST API. Define a resource (e.g., '/') and a GET method. Configure this method to use Lambda Proxy Integration with your function.",
            "After deploying the API Gateway stage, test the generated invoke URL using a browser or `curl` to ensure your Lambda is triggered.",
            "Consider using Lambda's test event feature to simulate an API Gateway request before deploying API Gateway itself for quicker iteration."
          ]
        }
      },
      {
        "title": "Dynamic Data API with DynamoDB",
        "description": "Enhance the API to perform CRUD (Create, Read, Update, Delete) operations on a backend data store, such as Amazon DynamoDB. Implement multiple HTTP methods (POST, GET, PUT, DELETE) for different resources (e.g., `/items`, `/items/{id}`).",
        "hints": {
          "GUIDED": [
            "Create a DynamoDB table with a suitable primary key. Define the IAM permissions required for your Lambda function to interact with this table (read/write).",
            "Design your API Gateway resources to reflect a typical RESTful pattern (e.g., `/items` for POST/GET all, `/items/{id}` for GET/PUT/DELETE specific item).",
            "Implement separate Lambda functions or a single function with conditional logic to handle different HTTP methods and paths.",
            "Utilize API Gateway's request parameters (path, query string) and body to pass data to your Lambda functions, ensuring proper parsing within Lambda."
          ]
        }
      },
      {
        "title": "Securing the Serverless API",
        "description": "Implement robust security measures for your API. Integrate an authentication mechanism such as AWS Cognito User Pools for user management and JWT-based authorization, or API Gateway API Keys for simpler access control.",
        "hints": {
          "GUIDED": [
            "Explore AWS Cognito User Pools. Create a User Pool, App Client, and understand how to obtain an ID Token for authorization.",
            "Configure an API Gateway Custom Authorizer (Lambda Authorizer) or a Cognito User Pool Authorizer. Understand the difference and when to use each.",
            "Apply the chosen authorizer to specific API Gateway methods or resources that require authentication. Test with valid and invalid tokens/keys.",
            "Consider how to handle authorization errors gracefully and return appropriate HTTP status codes (e.g., 401 Unauthorized, 403 Forbidden)."
          ]
        }
      },
      {
        "title": "Automated Deployment with IaC",
        "description": "Refactor the entire serverless application using Infrastructure as Code (IaC) tools like AWS Serverless Application Model (SAM) or AWS Cloud Development Kit (CDK). Implement a basic CI/CD pipeline for automated deployments.",
        "hints": {
          "GUIDED": [
            "Choose between SAM and CDK. SAM is generally quicker for purely serverless applications, while CDK offers more programmatic control and broader AWS resource support.",
            "Migrate your Lambda functions, DynamoDB tables, API Gateway configurations, and IAM roles into a single IaC template.",
            "Set up a basic CI/CD pipeline using AWS CodePipeline and CodeBuild. Your pipeline should pull code from a repository (e.g., CodeCommit, GitHub), build/package the application, and deploy it.",
            "Ensure your IaC templates allow for easy deployment to different environments (e.g., `dev`, `prod`) by using parameters or context variables."
          ]
        }
      },
      {
        "title": "Advanced API Management & Monitoring",
        "description": "Implement advanced API Gateway features such as request/response transformations, caching, throttling, and custom domain names. Integrate comprehensive monitoring, logging, and tracing using AWS CloudWatch and X-Ray.",
        "hints": {
          "GUIDED": [
            "Configure API Gateway request/response mapping templates (VTL) to transform payloads between the client and Lambda, or vice-versa, for specific use cases.",
            "Enable API Gateway caching to improve performance for frequently accessed data. Experiment with different cache settings and invalidation strategies.",
            "Set up a custom domain name for your API Gateway endpoint using Route 53 and ACM (AWS Certificate Manager).",
            "Enable AWS X-Ray for your Lambda functions and API Gateway stages to gain end-to-end visibility into request flows and performance bottlenecks. Configure CloudWatch Alarms for critical metrics.",
            "Implement proper structured logging within your Lambda functions to aid in debugging and monitoring via CloudWatch Logs."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.ADVANCED
  },
  {
    "title": "E-commerce Product Search",
    "slug": "ecommerce-product-search",
    "description": "Implement search functionality with Algolia",
    "technologies": [
      "Algolia"
    ],
    "categories": [
      "Frontend",
      "Search"
    ],
    "estimatedTime": "16-20 hours",
    "learningObjectives": [
      "Search algorithms",
      "Algolia integration",
      "Search UX"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "course",
        "title": "Search Engine Optimization"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/E-commerce%20Product%20Search%20Algolia%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Milestone 1: Core Algolia Indexing & Schema Definition",
        "description": "Set up your Algolia application and create an initial index. Programmatically push a comprehensive dataset of e-commerce products (e.g., ~1000-5000 items) to Algolia. Define crucial index settings such as `searchableAttributes`, `attributesForFaceting`, `customRanking` (e.g., by popularity/revenue), and `replicas` for future sorting needs.",
        "hints": {
          "GUIDED": [
            "Choose an appropriate backend language (Node.js, Python, Ruby, PHP) and use its Algolia client library to manage the index. Ensure robust error handling during the indexing process.",
            "Design a rich product schema. Beyond basic fields (name, price), include `categories` (array), `brand`, `description`, `SKU`, `inventory`, `image_url`, `product_url`, `rating`, and `popularity_score`.",
            "Experiment with the order of `searchableAttributes` (e.g., `name, description, brand`) to influence relevance. Define `attributesForFaceting` for all filterable attributes.",
            "Create replica indices for sorting (e.g., 'products_price_asc', 'products_price_desc') by configuring their `customRanking` to leverage different attributes like `asc(price)` or `desc(price)`."
          ]
        }
      },
      {
        "title": "Milestone 2: Frontend Integration & Real-time Search UI",
        "description": "Integrate Algolia's InstantSearch.js library (or build a custom UI with the raw Algolia search client) into your chosen frontend framework (e.g., React, Vue, Angular). Implement a search input that displays real-time results as the user types, rendering basic product cards with essential information (image, name, price). Focus on a responsive and performant initial UI.",
        "hints": {
          "GUIDED": [
            "Decide between using InstantSearch.js for a declarative, widget-based approach or directly using the `algoliasearch` client for maximal control. InstantSearch offers faster development, while the raw client provides more flexibility.",
            "Implement proper debouncing on the search input to avoid excessive API calls and improve perceived performance.",
            "Design and implement a reusable 'Product Card' component that clearly displays product image, name, price, and potentially a brief description or rating.",
            "Ensure the search input and results area adhere to accessibility standards (ARIA attributes, keyboard navigation)."
          ]
        }
      },
      {
        "title": "Milestone 3: Dynamic Faceting & Advanced Filtering",
        "description": "Implement dynamic faceting for multiple product attributes such as categories (hierarchical), brands, and price ranges. Allow users to apply multiple filters simultaneously across different facets. Clearly display active filters and provide functionality to remove individual filters or clear all filters.",
        "hints": {
          "GUIDED": [
            "Utilize the `RefinementList` widget for categories and brands. For categories, explore InstantSearch's `HierarchicalMenu` widget or implement custom logic for a nested category structure.",
            "Implement a `RangeSlider` or custom numerical input for price range filtering. Consider using a `toggleRefinement` for boolean attributes like 'In Stock'.",
            "Use InstantSearch's `CurrentRefinements` widget or build a custom component to visualize and manage active filters, allowing users to remove them easily.",
            "Ensure that selecting filters updates the search results instantly without requiring a page reload."
          ]
        }
      },
      {
        "title": "Milestone 4: Sorting, Pagination & Query Suggestions",
        "description": "Add functionality for users to sort search results by different criteria (e.g., relevance, price low-to-high, price high-to-low). Implement either infinite scrolling or traditional pagination for result navigation. Additionally, integrate Algolia's Query Suggestions or build a custom autocomplete experience for the search input.",
        "hints": {
          "GUIDED": [
            "Use InstantSearch's `SortBy` widget, leveraging the replica indices configured in Milestone 1, to provide various sorting options.",
            "Choose and implement either the `InfiniteHits` widget for an infinite scroll experience or the `Pagination` widget for traditional numbered page navigation. Ensure a clear 'Load More' button if using `InfiniteHits`.",
            "For query suggestions, explore Algolia's dedicated Query Suggestions feature (which requires a separate Algolia index) or build a custom solution using the `algoliasearch` client to query a 'queries' index.",
            "Implement a 'No results found' state with helpful suggestions or alternative actions for the user."
          ]
        }
      },
      {
        "title": "Milestone 5: Personalization, Analytics & Production Optimization",
        "description": "Implement basic search personalization (e.g., boosting items from recently viewed categories or brands) using Algolia's Personalization API or custom logic. Integrate Algolia's Insights API to track user behavior (clicks on search results, conversions) and demonstrate how this data feeds into Algolia Analytics. Discuss and implement strategies for production deployment, robust error handling, and performance optimization for large datasets.",
        "hints": {
          "GUIDED": [
            "For personalization, explore Algolia's Personalization API. Define an `event-driven` strategy (e.g., based on recent clicks) or custom segments. Alternatively, implement basic custom boosting based on user local storage history.",
            "Integrate the `algoliasearch-helper` or directly use `algoliasearch` to send `click` and `conversion` events to Algolia Insights. Ensure you capture `objectID`, `queryID`, and `position` for click events.",
            "Discuss and implement production-ready optimizations: client-side caching (if not using InstantSearch.js's built-in), lazy loading images, proper error boundaries for React/Vue components, and handling network failures gracefully.",
            "Review Algolia's rate limits and cost considerations for high-traffic applications. Implement proper API key management (search-only keys for frontend, admin keys for backend indexing)."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.ADVANCED
  },
  {
    "title": "Data Visualization Dashboard",
    "slug": "data-visualization-dashboard",
    "description": "Create analytics dashboard with D3.js",
    "technologies": [
      "D3.js"
    ],
    "categories": [
      "Frontend",
      "Data Visualization"
    ],
    "estimatedTime": "14-18 hours",
    "learningObjectives": [
      "D3.js fundamentals",
      "Data visualization",
      "Interactive charts"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "article",
        "title": "D3.js Essentials"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/Data%20Visualization%20Dashboard%20D3.js%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Environment Setup & First Static Chart",
        "description": "Set up your project environment (e.g., using `http-server` or a simple Node.js server). Load sample data (e.g., from a CSV or JSON file) using D3's data loading functions. Render a basic static bar chart or scatter plot, demonstrating data binding and fundamental SVG element creation with D3.",
        "hints": {
          "GUIDED": [
            "Think about how to serve your local files so `d3.csv()` or `d3.json()` can access them. A simple `http-server` npm package is a good start.",
            "Start by defining an SVG container in your HTML and selecting it with `d3.select()`. Remember to set its width and height.",
            "Use `d3.csv('data.csv', d3.autoType)` or `d3.json('data.json')` to load your data. Consider using `d3.autoType` for automatic type conversion.",
            "For a bar chart, append `rect` elements to your SVG. For a scatter plot, append `circle` elements. Map your data to their `x`, `y`, `width`, and `height` (or `cx`, `cy`, `r`) attributes."
          ]
        }
      },
      {
        "title": "Scales, Axes & Basic Tooltips",
        "description": "Implement D3 scales (`d3.scaleLinear`, `d3.scaleBand`, etc.) for both x and y axes based on your data's domain and the chart's visual range. Add properly formatted and labeled axes to your chart. Introduce basic interactivity like a tooltip that appears on hover, displaying relevant data points for a selected element.",
        "hints": {
          "GUIDED": [
            "Choose appropriate scales based on your data types: `d3.scaleLinear` for quantitative data, `d3.scaleBand` or `d3.scalePoint` for ordinal categories.",
            "Set the `domain` of your scales to the min/max of your data and the `range` to the pixel dimensions of your chart area (considering margins).",
            "Use `d3.axisBottom()` and `d3.axisLeft()` to generate axes. Remember to `call()` them on a `g` element that's translated to the correct position.",
            "Create a `div` element in your HTML to serve as the tooltip. Use D3 `selection.on('mouseover')`, `selection.on('mousemove')`, and `selection.on('mouseout')` events to show, update, and hide the tooltip."
          ]
        }
      },
      {
        "title": "Multi-Chart Layout & Cross-Filtering",
        "description": "Extend your dashboard to include at least two different chart types (e.g., a bar chart and a line chart, or a pie chart and a scatter plot). Implement a basic filtering mechanism where selecting an element in one chart (e.g., clicking a bar) filters or highlights the data displayed in another chart.",
        "hints": {
          "GUIDED": [
            "Use CSS Grid or Flexbox to create a responsive layout for multiple charts on your dashboard.",
            "Encapsulate each chart's drawing logic into its own reusable function, taking data and configuration as arguments.",
            "When an element in a 'master' chart is clicked, update a global state variable that holds the filtered data.",
            "Trigger an 'update' function for the 'detail' chart, passing the newly filtered data. You might need to add or remove elements, or change their styles (e.g., opacity) based on the filter."
          ]
        }
      },
      {
        "title": "Dynamic Data Updates & Advanced Interactivity",
        "description": "Implement smooth D3 transitions for data updates, ensuring a fluid user experience when data changes (e.g., after filtering or when a new dataset is loaded). Add a UI element (e.g., dropdown menu, slider) to dynamically change a parameter or switch datasets that affect one or more charts. Introduce a brush interaction for zooming or selecting a specific range of data.",
        "hints": {
          "GUIDED": [
            "Utilize `selection.transition()` with `duration()` and `ease()` for smooth animations when elements enter, update, or exit.",
            "Master the D3 `data().join()` pattern to efficiently handle element creation, updating, and removal when your dataset changes.",
            "Add HTML `<select>` or `<input type=\"range\">` elements. Attach event listeners (`.on('change', function(){...})`) to these elements to trigger data updates and redraw your charts.",
            "`d3.brushX()` or `d3.brushY()` can be used to create brush interactions. Listen for `brush` events (`.on('end', event => {...})`) to capture the selected range and update your scales or filtered data accordingly."
          ]
        }
      },
      {
        "title": "Dashboard Integration & UI/UX Refinement",
        "description": "Integrate all charts, interactive elements, and UI controls into a single, cohesive dashboard layout. Apply consistent styling using CSS to enhance the visual appeal and user experience. Ensure the dashboard is responsive and accessible, and add clear titles, legends, and basic descriptions for each chart to improve clarity.",
        "hints": {
          "GUIDED": [
            "Pay attention to a consistent color palette across all charts and UI elements. Use a CSS preprocessor like Sass or Less if you feel comfortable, or simply well-organized CSS.",
            "Use CSS media queries (`@media`) to adjust layout and chart sizes for different screen dimensions, making your dashboard responsive.",
            "Ensure all interactive elements (buttons, dropdowns, brush) are clearly discoverable and have appropriate feedback (e.g., hover states).",
            "Add legends to charts that use color to encode categories or values. Use a text element or separate HTML for chart titles and descriptions."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.INTERMEDIATE
  },
  {
    "title": "E-commerce Mobile App",
    "slug": "e-commerce-mobile-app",
    "description": "build an E-commerce mobile App",
    "technologies": [
      "React Native",
      "Expo Go",
      "Android"
    ],
    "categories": [
      "Frontend",
      "Mobile"
    ],
    "estimatedTime": "20-30",
    "learningObjectives": [
      "React Native fundamentals",
      "Expo Go",
      "Tailwindcss"
    ],
    "resourceLinks": [
      {
        "url": "https://huggingface.co/blog/ngxson/make-your-own-rag",
        "type": "article",
        "title": "How to develop an app with React Native"
      }
    ],
    "featured": false,
    "coverImage": "https://res.cloudinary.com/dxpf48evk/image/upload/v1767054272/pounded%20yam.png.webp",
    "milestones": [
      {
        "title": "Milestone 1: Project Setup & Core Navigation",
        "description": "Initialize the React Native project using Expo CLI. Set up the foundational navigation structure for the app, including screens for Home, Product Listing, and Shopping Cart. Implement a basic header and footer component for consistent UI.",
        "hints": {
          "GUIDED": [
            "Use `npx create-expo-app my-ecommerce-app` to start your project.",
            "Install `@react-navigation/native` and `@react-navigation/stack` (or `@react-navigation/bottom-tabs` for a tab-based navigation).",
            "Define your main navigator in `App.js` or a dedicated `navigation/index.js` file.",
            "Create simple placeholder components for your Home, ProductList, and Cart screens to test navigation."
          ]
        }
      },
      {
        "title": "Milestone 2: Product Catalog & Detail View",
        "description": "Develop the Product Listing screen to display a grid or list of mock products. Each product should have an image, name, and price. Implement a Product Detail screen that shows more comprehensive information when a product card is tapped.",
        "hints": {
          "GUIDED": [
            "Use `FlatList` for efficient rendering of product lists, especially with many items.",
            "Create a reusable `ProductCard` component to display individual product details within the list.",
            "Pass product data as parameters when navigating from the Product List to the Product Detail screen (e.g., `navigation.navigate('ProductDetails', { product: item })`).",
            "On the Product Detail screen, access the passed data using `route.params`."
          ]
        }
      },
      {
        "title": "Milestone 3: Interactive Shopping Cart",
        "description": "Implement 'Add to Cart' functionality on the Product Detail screen. Create a dedicated Cart screen where users can view selected items, adjust quantities, and remove items. Calculate and display the subtotal and total prices dynamically.",
        "hints": {
          "GUIDED": [
            "Consider using React Context API for global state management to manage the cart items across different screens.",
            "The cart state should be an array of objects, where each object includes product details and its selected quantity.",
            "Implement functions such as `addToCart`, `removeFromCart`, and `updateQuantity` within your cart context or state management.",
            "On the Cart screen, use `map` to display each cart item and its associated quantity controls and delete button."
          ]
        }
      },
      {
        "title": "Milestone 4: Checkout Flow & Local Persistence",
        "description": "Develop a basic Checkout screen where the user can review their cart and 'place an order' (simulated with a confirmation message). Integrate `AsyncStorage` to persist the shopping cart items, ensuring that the cart state is maintained even after the app is closed and reopened.",
        "hints": {
          "GUIDED": [
            "Install `@react-native-async-storage/async-storage`.",
            "Use `useEffect` hooks in your main app component or cart context to load cart data from AsyncStorage when the app starts.",
            "Similarly, use `useEffect` to save cart data to AsyncStorage whenever the cart state changes.",
            "Implement a simple 'Order Confirmation' modal or navigate to a confirmation screen after the 'Place Order' button is pressed, and then clear the cart."
          ]
        }
      },
      {
        "title": "Milestone 5: Dynamic Data & Basic Search",
        "description": "Replace static/mock product data with data fetched from a local JSON file or a simple mock API (e.g., using `json-server`). Implement a basic search bar on the Product Listing screen to filter products by name or category.",
        "hints": {
          "GUIDED": [
            "Create a `products.json` file in your project's assets or set up `json-server` (`npm install -g json-server`, then `json-server --watch db.json`) to serve your product data.",
            "Use the native `fetch` API or `axios` to retrieve product data in your Product Listing screen's `useEffect` hook upon component mount.",
            "Store the fetched data in your component's local state.",
            "Implement a `TextInput` for the search bar and filter the `FlatList` data based on the user's search query."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.INTERMEDIATE
  },
  {
    "title": "Landing Page Template",
    "slug": "landing-page-template",
    "description": "Build a responsive landing page with modern design principles",
    "technologies": [
      "HTML",
      "CSS"
    ],
    "categories": [
      "Frontend",
      "Web Design"
    ],
    "estimatedTime": "4-6 hours",
    "learningObjectives": [
      "Responsive design",
      "CSS Flexbox/Grid",
      "Modern UI patterns"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "video",
        "title": "HTML & CSS Crash Course"
      }
    ],
    "featured": true,
    "coverImage": "https://image.pollinations.ai/prompt/Landing%20Page%20Template%20HTML%20CSS%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Project Setup & Basic HTML Structure",
        "description": "Initialize the project by creating `index.html` and `style.css` files. Build the foundational HTML structure including `<!DOCTYPE html>`, `<html>`, `<head>`, `<body>`, and link your CSS file. Add main semantic sections like `<header>`, `<main>`, and `<footer>`, populating them with placeholder text or basic headings.",
        "hints": {
          "GUIDED": [
            "Start with an empty `index.html` file and an empty `style.css` file in the same directory.",
            "Remember to include `<!DOCTYPE html>` at the very top of your `index.html`.",
            "Inside the `<head>` tag, link your `style.css` file using `<link rel='stylesheet' href='style.css'>`.",
            "Use semantic HTML tags like `<header>`, `<main>`, and `<footer>` for your main page sections.",
            "Add a simple `<h1>` inside the `<header>` and a `<p>` inside the `<footer>` to see something on the page."
          ]
        }
      },
      {
        "title": "Global Styling & Navigation Basics",
        "description": "Apply general CSS styles such as setting a default `font-family`, `font-size`, and `line-height` for the `body`. Style your header, including a site title/logo and a simple navigation menu using `<ul>` and `<li>` elements. Use Flexbox to align header elements horizontally.",
        "hints": {
          "GUIDED": [
            "In `style.css`, target the `body` selector to set global typography properties like `font-family`, `font-size`, and `color`.",
            "For your header, add `display: flex;` to the header container to arrange its children (e.g., title and nav) side-by-side.",
            "For the navigation links (inside the `<ul>`), use `list-style: none;` to remove bullet points and `margin` or `padding` to space them out horizontally.",
            "Consider using `justify-content: space-between;` on the header to push the title to one side and the navigation to the other."
          ]
        }
      },
      {
        "title": "Designing the Hero Area",
        "description": "Create a prominent hero section directly below the header. This section should feature a main headline (`<h1>`), a descriptive sub-text (`<p>`), and a clear call-to-action button (`<button>` or `<a>` styled as a button). Implement a background image or color for visual appeal, ensuring text is readable.",
        "hints": {
          "GUIDED": [
            "Use a specific class for your hero section, e.g., `<section class='hero'>`.",
            "To center text and buttons vertically and horizontally within the hero, apply `display: flex; flex-direction: column; align-items: center; justify-content: center;` to the hero container.",
            "Set a `min-height` on the hero (e.g., `min-height: 70vh;`) to give it sufficient vertical space.",
            "For the background, key CSS properties are `background-image: url('path/to/image.jpg'); background-size: cover; background-position: center;`.",
            "Style your call-to-action button with `padding`, `background-color`, `color`, `border`, `border-radius`, and `cursor: pointer;`."
          ]
        }
      },
      {
        "title": "Structuring Content & Features",
        "description": "Develop one or more feature/content sections below the hero. Each section should display multiple items (e.g., service cards, product features). Use CSS Grid or Flexbox to arrange these items in a visually appealing grid or row layout. Include titles, descriptions, and placeholder images/icons for each item.",
        "hints": {
          "GUIDED": [
            "Wrap your feature items in a container, e.g., `<div class='features-grid'>`.",
            "If using CSS Grid for the feature container: `display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px;` (for three equal columns with spacing).",
            "If using Flexbox: `display: flex; flex-wrap: wrap; justify-content: space-around;`.",
            "For individual feature items, consider applying `text-align: center;` and adding some `padding`.",
            "Ensure images within features have `max-width: 100%; height: auto;` to prevent them from overflowing their containers."
          ]
        }
      },
      {
        "title": "Mobile-First Responsiveness",
        "description": "Make your landing page responsive. Use media queries to adjust the layout, font sizes, and component spacing for different screen sizes, specifically targeting mobile devices (smaller screens) and larger desktops. Ensure the navigation menu and feature sections are usable and look good on mobile.",
        "hints": {
          "GUIDED": [
            "Start by thinking mobile-first: design your default styles for small screens, then use media queries for larger screens to override them.",
            "A common breakpoint for mobile is `@media (max-width: 768px) { ... }` to target screens up to 768 pixels wide.",
            "Inside your media query for mobile, change `grid-template-columns` to `1fr` for feature sections to stack them vertically.",
            "Adjust `font-size` on `<h1>` or `<h2>` within media queries to make text readable on smaller screens.",
            "Test your responsiveness by resizing your browser window or using developer tools' device emulation mode."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.BEGINNER
  },
  {
    "title": "React Todo App with Firebase",
    "slug": "react-todo-firebase",
    "description": "Create a collaborative todo application with real-time sync",
    "technologies": [
      "React",
      "Firebase"
    ],
    "categories": [
      "Frontend",
      "Real-time"
    ],
    "estimatedTime": "10-14 hours",
    "learningObjectives": [
      "Firebase integration",
      "Real-time sync",
      "CRUD operations"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "article",
        "title": "Firebase Realtime Database Guide"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/React%20Todo%20App%20with%20Firebase%20React%20Firebase%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Milestone 1: Project Setup & Static UI",
        "description": "Initialize a new React project and design the basic, static user interface for the Todo application. This includes an input field for new todos, an 'Add' button, and a placeholder list area to display future todos. No functionality or data persistence is required yet.",
        "hints": {
          "GUIDED": [
            "Use `npx create-react-app todo-app` to set up your React project.",
            "Break down the UI into logical components: `App.js` (main container), `TodoForm.js` (input and button), `TodoList.js` (list container), and `TodoItem.js` (single todo entry).",
            "Use basic HTML structure and CSS for styling. Consider using a simple CSS framework if preferred (e.g., Tailwind CSS, Bootstrap components)."
          ]
        }
      },
      {
        "title": "Milestone 2: Local Todo State Management",
        "description": "Implement the core Todo application functionality using React's local state. Users should be able to add new todos, mark them as complete/incomplete, and delete them. All data will reside in the component's state and will not persist upon page refresh.",
        "hints": {
          "GUIDED": [
            "Use the `useState` hook in your main component (e.g., `App.js`) to manage an array of todo objects (e.g., `[{ id: '1', text: 'Learn React', completed: false }]`).",
            "Create functions like `addTodo`, `toggleComplete`, and `deleteTodo` within your main component.",
            "Pass these functions and the `todos` array as props down to the relevant child components (`TodoForm`, `TodoList`, `TodoItem`) to enable interaction.",
            "Remember to use immutable methods for updating state arrays (e.g., `map`, `filter`, spread operator `...`)."
          ]
        }
      },
      {
        "title": "Milestone 3: Firebase Firestore Integration & CRUD",
        "description": "Integrate Firebase Firestore to store and retrieve todo items. Modify the existing functionality so that adding, marking complete, and deleting todos perform corresponding Create, Update, and Delete operations in Firestore. On app load, todos should be fetched from Firestore.",
        "hints": {
          "GUIDED": [
            "Set up a new Firebase project, enable Firestore, and install the `firebase` npm package (`npm install firebase`).",
            "Initialize Firebase in your React application (e.g., in a `firebase.js` file) and import necessary Firestore functions (`getFirestore`, `collection`, `addDoc`, `getDocs`, `updateDoc`, `deleteDoc`).",
            "For adding todos: Use `addDoc(collection(db, 'todos'), newTodoData)`. Ensure `newTodoData` includes relevant fields like `text`, `completed`, `createdAt`.",
            "For fetching todos: Use `useEffect` with an empty dependency array to fetch todos once on component mount using `getDocs` and `query`.",
            "For updating/deleting todos: Get a reference to the specific document using `doc(db, 'todos', todoId)` and then use `updateDoc` or `deleteDoc`."
          ]
        }
      },
      {
        "title": "Milestone 4: Real-time Sync & Basic Authentication",
        "description": "Leverage Firebase Firestore's real-time capabilities to ensure the UI updates automatically when data changes in the database. Implement basic user authentication (e.g., Google Sign-in) to allow multiple users to have their own separate, persistent todo lists.",
        "hints": {
          "GUIDED": [
            "Replace your `getDocs` fetching logic with `onSnapshot` to listen for real-time updates from Firestore. Remember to unsubscribe when the component unmounts using the cleanup function in `useEffect`.",
            "Enable Authentication in your Firebase project (e.g., Google provider).",
            "Implement user sign-in/sign-out functionality using `signInWithPopup` (e.g., `GoogleAuthProvider`) and `signOut` from `firebase/auth`.",
            "Use `onAuthStateChanged` to track the current user's authentication status and update your React state accordingly.",
            "Modify your Firestore queries (`query`, `where`) to filter todos based on the currently authenticated user's ID (`user.uid`), ensuring each user sees only their own todos."
          ]
        }
      },
      {
        "title": "Milestone 5: UI/UX Enhancements & Deployment",
        "description": "Enhance the user experience by adding features like filtering todos (all, active, completed) and sorting options. Implement loading states and error handling. Finally, prepare the application for production and deploy it to a web hosting service.",
        "hints": {
          "GUIDED": [
            "Add UI elements (buttons, dropdowns) and corresponding state to manage the current filter (e.g., 'all', 'active', 'completed'). Apply this filter to your displayed `todos` array.",
            "Implement basic error handling using `try-catch` blocks around Firebase operations and display user-friendly messages.",
            "Show loading indicators (e.g., a simple 'Loading...' text or a spinner) while data is being fetched from Firebase.",
            "Explore adding a 'Clear Completed' button or an 'Edit Todo' feature for individual items.",
            "For deployment: Run `npm run build` to create a production-ready build. Then, use Firebase Hosting (`firebase init`, `firebase deploy`) or a service like Netlify/Vercel to host your application."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.INTERMEDIATE
  },
  {
    "title": "Real-time Chat Application",
    "slug": "realtime-chat-app",
    "description": "Build chat app with Socket.io and React",
    "technologies": [
      "Socket.io",
      "React"
    ],
    "categories": [
      "Full-stack",
      "Real-time"
    ],
    "estimatedTime": "14-18 hours",
    "learningObjectives": [
      "WebSocket protocol",
      "Real-time messaging",
      "Chat features"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "video",
        "title": "WebSocket Fundamentals"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/Real-time%20Chat%20Application%20Socket.io%20React%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Milestone 1: Foundation & First Handshake",
        "description": "Set up the basic Node.js server with Express and integrate Socket.io. Create a minimal React client application. Establish the initial connection between the client and the server using Socket.io and confirm successful communication.",
        "hints": {
          "GUIDED": [
            "Initialize your Node.js project (`npm init -y`) and install `express` and `socket.io`.",
            "Create an `index.js` for your server: set up an Express app, create an HTTP server, and integrate Socket.io with it. Listen on a port (e.g., 3001).",
            "For the React client, use `create-react-app` or a similar setup. Install `socket.io-client`.",
            "In a React component (e.g., `App.js`), import `io` from `socket.io-client`. Use a `useEffect` hook to establish a connection to your server's Socket.io instance.",
            "On connection, have the client emit a simple 'hello' event. On the server, listen for this 'hello' event and log a message. Similarly, have the server emit a 'welcome' event to the connecting client, and log it on the client side to confirm the two-way handshake."
          ]
        }
      },
      {
        "title": "Milestone 2: One-to-Many Communication",
        "description": "Implement the core chat functionality: users can type messages on the client, send them to the server, and the server broadcasts these messages to all connected clients. Display the received messages in a chat window on the client side.",
        "hints": {
          "GUIDED": [
            "On the client, create an input field and a 'Send' button. Use React state to manage the current message input.",
            "When the 'Send' button is clicked, emit a `sendMessage` Socket.io event from the client to the server, passing the message content.",
            "On the server, listen for the `sendMessage` event. Upon receiving a message, use `io.emit('receiveMessage', messageContent)` to broadcast it to all connected clients.",
            "On the client, listen for the `receiveMessage` event. When a message is received, update a React state array (e.g., `messages`) and render these messages in a scrollable `div` or `ul`."
          ]
        }
      },
      {
        "title": "Milestone 3: User Identification & Message History",
        "description": "Enhance the chat experience by allowing users to specify a username when they join. Associate each message with its sender's username. Implement a basic message history so new users see recent messages upon connecting.",
        "hints": {
          "GUIDED": [
            "**Usernames:** Before connecting to the chat, prompt the user to enter a username (e.g., with a modal or dedicated input). Store this username in React state and send it to the server when connecting or joining.",
            "On the server, store the username associated with each `socket.id` (e.g., in an object `users[socket.id] = username`).",
            "When a client emits a `sendMessage` event, include the username along with the message content. The server should then broadcast the message object containing both `username` and `text`.",
            "**Message History:** On the server, maintain an in-memory array (e.g., `chatHistory`) of the last N messages. Add each new message to this array.",
            "When a new client connects, after they've set their username, emit a specific `loadHistory` event to *only that specific socket* (`socket.emit('loadHistory', chatHistory)`)."
          ]
        }
      },
      {
        "title": "Milestone 4: Multiple Chat Rooms",
        "description": "Extend the application to support multiple chat rooms. Users should be able to join and switch between different rooms, and messages should only be broadcast within the joined room.",
        "hints": {
          "GUIDED": [
            "On the client, add UI elements (e.g., buttons, dropdown, or input) to allow users to select or create a room. Emit a `joinRoom` event to the server, passing the desired `roomName`.",
            "On the server, listen for the `joinRoom` event. When received, use `socket.join(roomName)`. Also, consider making the user leave their previous room if they were in one (`socket.leave(previousRoomName)`). Store which room each `socket.id` is currently in.",
            "When sending messages from the client, emit the `sendMessage` event with both the message content and the `currentRoom`.",
            "On the server, when broadcasting a message, instead of `io.emit()`, use `io.to(roomName).emit('receiveMessage', message)` to send the message only to clients within that specific room.",
            "Update the message history logic to be room-specific. The server could store a history for each room."
          ]
        }
      },
      {
        "title": "Milestone 5: Real-time Presence",
        "description": "Implement 'X is typing...' indicators to show when other users in the same room are typing. Also, notify users when someone connects to or disconnects from a room.",
        "hints": {
          "GUIDED": [
            "**Typing Indicators:** On the client, when the message input field changes (e.g., `onChange`), emit a `typing` event to the server. Include the `username` and `currentRoom`. Use a debounce function to limit how often this event is sent.",
            "On the server, listen for the `typing` event. Broadcast a `userTyping` event to all other clients *in the same room* (`socket.to(roomName).emit('userTyping', username)`).",
            "On the client, listen for `userTyping` events. Maintain a state that lists users currently typing. Display this information (e.g., 'John is typing...'). Implement a timeout to automatically clear a user from the 'typing' list if no new `typing` event is received from them within a few seconds.",
            "**Connection/Disconnection Notifications:** On the server, use `socket.on('connect', ...)` and `socket.on('disconnect', ...)` handlers. When a user connects or disconnects, broadcast an event (e.g., `userJoinedRoom`, `userLeftRoom`) to all clients in the affected room, including the username. This might require storing the user's room at the socket level.",
            "On the client, listen for `userJoinedRoom` and `userLeftRoom` events and display a system message in the chat window (e.g., 'Sarah joined the room.', 'Mike left the room.')."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.INTERMEDIATE
  },
  {
    "title": "Mobile Payment Integration",
    "slug": "mobile-payment-integration",
    "description": "Add Stripe payments to React Native app",
    "technologies": [
      "React Native",
      "Stripe"
    ],
    "categories": [
      "Mobile",
      "Payments"
    ],
    "estimatedTime": "18-24 hours",
    "learningObjectives": [
      "Payment processing",
      "Stripe API",
      "Mobile security"
    ],
    "resourceLinks": [
      {
        "url": "#",
        "type": "video",
        "title": "Mobile Payment Systems"
      }
    ],
    "featured": false,
    "coverImage": "https://image.pollinations.ai/prompt/Mobile%20Payment%20Integration%20React%20Native%20Stripe%20programming%20web%20development?width=1080&height=720&nologo=true",
    "milestones": [
      {
        "title": "Milestone 1: Project Setup & Backend Gateway",
        "description": "Initialize the React Native project and install the `@stripe/stripe-react-native` SDK. Set up a secure, minimal backend server (e.g., Node.js with Express, Python with Flask, Ruby on Rails) that will act as a payment gateway, securely holding your Stripe secret key and exposing endpoints for client-server communication.",
        "hints": {
          "GUIDED": [
            "Ensure your backend uses environment variables for Stripe secret keys, never hardcode them.",
            "Implement basic routes for testing connectivity between your React Native app and the backend.",
            "Use `npx expo init` or `react-native init` to set up the app, then install `@stripe/stripe-react-native`.",
            "Wrap your main App component with `<StripeProvider publishableKey='YOUR_PUBLISHABLE_KEY'>`."
          ]
        }
      },
      {
        "title": "Milestone 2: Secure PaymentIntent Creation",
        "description": "Implement a backend endpoint that securely creates a Stripe `PaymentIntent`. This endpoint should receive payment details (like amount, currency) from the React Native client, call the Stripe API to create the `PaymentIntent`, and return its `client_secret` (and potentially other details like `ephemeralKey` for saved cards, though not explicitly required for this scope) back to the React Native app without exposing any sensitive API keys.",
        "hints": {
          "GUIDED": [
            "Use the official Stripe server-side library for your chosen backend language (e.g., `stripe` for Node.js).",
            "The `client_secret` is crucial for confirming payments on the client side.",
            "Consider adding basic input validation to the backend endpoint for amount and currency.",
            "Return a JSON object containing the `client_secret` from your backend endpoint."
          ]
        }
      },
      {
        "title": "Milestone 3: Client-Side Card Input & Confirmation",
        "description": "Integrate a secure card input UI component (e.g., `CardField` or `PaymentSheet` from `@stripe/stripe-react-native`) in your React Native app. Once card details are collected, use the `client_secret` obtained from your backend to confirm the `PaymentIntent` on the client side, handling both successful payments and necessary authentication flows (e.g., 3D Secure) by displaying appropriate UI feedback.",
        "hints": {
          "GUIDED": [
            "Utilize the `useStripe` hook to access methods like `confirmPayment`.",
            "Handle various `PaymentIntent` statuses (e.g., `succeeded`, `requires_action`, `requires_payment_method`).",
            "Display a loading indicator while the payment is being processed.",
            "Provide clear error messages to the user if the payment fails or requires additional authentication."
          ]
        }
      },
      {
        "title": "Milestone 4: Wallet Payment Integration (Apple Pay / Google Pay)",
        "description": "Extend the payment functionality to support mobile wallet payments like Apple Pay (iOS) and Google Pay (Android). This involves configuring platform-specific requirements (e.g., merchant IDs, capabilities in Xcode/Android Manifest) and integrating the respective SDK methods to present the payment sheet and confirm the `PaymentIntent` using the wallet tokens.",
        "hints": {
          "GUIDED": [
            "For Apple Pay, set up a Merchant ID in your Apple Developer account and enable Apple Pay capability in Xcode.",
            "For Google Pay, configure your `AndroidManifest.xml` and ensure `isGooglePaySupported` returns true.",
            "Use `presentPaymentSheet` (Stripe's unified payment sheet) or `confirmPlatformPay` with appropriate parameters for wallet payments.",
            "Ensure your backend `PaymentIntent` creation is flexible enough to handle different payment methods."
          ]
        }
      },
      {
        "title": "Milestone 5: Webhook Processing & Order Fulfillment",
        "description": "Develop a robust webhook endpoint on your backend server to asynchronously receive and process Stripe events, particularly `payment_intent.succeeded` and `payment_intent.payment_failed`. Implement logic to verify webhook signatures and update your application's state (e.g., fulfill an order, send confirmation emails, update user subscriptions) based on these events, ensuring idempotency to prevent duplicate processing.",
        "hints": {
          "GUIDED": [
            "Use `stripe listen` command or `ngrok` for local development and testing of webhooks.",
            "Implement webhook signature verification using `stripe.webhooks.constructEvent` to ensure event authenticity.",
            "Design your webhook handler to be idempotent; store processed event IDs to avoid processing the same event multiple times.",
            "Focus on `payment_intent.succeeded` for successful order fulfillment and `payment_intent.payment_failed` for handling declines/failures."
          ]
        }
      }
    ],
    "difficultyLevel": Difficulty.ADVANCED
  }
];

async function main() {
  console.log("Start seeding...");

  const hashedPassword = await argon2.hash("password123");

  // Create a default user if not exists
  const user = await prisma.user.upsert({
    where: { email: "admin@devresource.com" },
    update: {
      password: hashedPassword,
    },
    create: {
      email: "admin@devresource.com",
      firstName: "Admin",
      lastName: "User",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Created user with id: ${user.id}`);

  for (const projectData of projects) {
    const { milestones, ...project } = projectData as any;

    const createdProject = await prisma.project.upsert({
      where: { slug: project.slug },
      update: {
        ...project,
        createdById: user.id,
        milestones: {
          deleteMany: {},
          create: milestones?.map((m: any, index: number) => ({
            milestoneNumber: index + 1,
            title: m.title,
            description: m.description,
            hints: m.hints || {},
          })),
        },
      },
      create: {
        ...project,
        createdById: user.id,
        milestones: {
          create: milestones?.map((m: any, index: number) => ({
            milestoneNumber: index + 1,
            title: m.title,
            description: m.description,
            hints: m.hints || {},
          })),
        },
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
