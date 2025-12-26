# Learning Journey: Building a Project-Based Learning Platform

This document serves as a comprehensive guide to the architectural changes and new technologies introduced in this project. We've shifted from a traditional MongoDB setup to a high-performance, structured backend using PostgreSQL, Prisma, and Redis.

---

## 🚀 The Core Tech Stack

### 1. PostgreSQL (The Database)

**What it is:** A powerful, open-source **Relational Database (RDBMS)**.
**Why we used it:** Unlike MongoDB (which is NoSQL/Document-based), PostgreSQL excels at handling complex relationships between data (e.g., a User has many Projects, a Project has many Milestones). It ensures "Data Integrity" through schemas and constraints.

### 2. Prisma ORM (The Bridge)

**What it is:** **Prisma** is a next-generation Node.js and TypeScript ORM (Object-Relational Mapper).
**Why we used it:**

- **Type Safety:** It generates a TypeScript client based on your schema. If you try to query a field that doesn't exist, your code won't compile.
- **Auto-migrations:** Instead of writing manual SQL, we define our models in `schema.prisma`, and Prisma handles the database structure.
- **Visual Exploration:** You can use `npx prisma studio` to view and edit your data in a browser.

### 3. Redis (The Speedster)

**What it is:** An in-memory data structure store, used as a database, cache, and message broker. We use the **`ioredis`** library, which is the industry standard for robust Redis connections in Node.js.

**How to get the URL:**
The connection URL is stored in the `REDIS_URL` environment variable.

- **Local Development:** Usually `redis://localhost:6379`.
- **Production:** A secure URL provided by your hosting provider (e.g., Upstash, Redis Labs).

- **Ephemeral Data:** For things like OTP (One-Time Passwords) that expire quickly, writing to a disk-based database is slow and creates "trash" data.
- **Performance:** Redis stores data in RAM, making it incredibly fast for short-term storage.
- **Caching:** We use Redis to cache the global **Leaderboard** (`leaderboard:top20`). Instead of querying the database every time someone views the leaderboard, we serve the result in milliseconds from memory.

---

## 🛠 Step-by-Step Implementation

### Phase 1: Authentication & Identity

**Goal:** Securely manage user access and state.

1.  **User Schema**: We defined a `User` model with roles (`STUDENT`, `ADMIN`, `CONTRIBUTOR`) and skill levels.
2.  **Argon2 Hashing**: Instead of plain text, we use `argon2` for industry-standard password hashing.
3.  **JWT Strategy**: Upon login, we generate a JSON Web Token (JWT) with a 7-day expiry. This token is stored in an `httpOnly` cookie for security against XSS.
4.  **OTP via Redis**: For "Forgot Password", we generate a 6-digit OTP, store it in Redis with a 1-hour TTL (`redis.setex`), and email it using `nodemailer`. This avoids database bloat for temporary data.

### Phase 2: The Project Engine

**Goal:** Create a structured environment for project-based learning.

1.  **Hierarchical Data**: Projects are linked to multiple `ProjectMilestone` records. Each milestone acts as a step in the learning journey.
2.  **Multi-Mode Progression**: Users can choose between `GUIDED`, `STANDARD`, or `HARDCORE` modes. This is stored in the `UserProject` join table.
3.  **Milestone Tracking**: As users complete steps, we create `UserMilestone` records. This allows the frontend to show a granular progress bar.
4.  **Contextual Metadata**: Projects store `technologies`, `categories`, and `learningObjectives` as arrays, enabling powerful filtering in the `getProjects` API.

### Phase 3: AI Mentorship (Gemini 1.5)

**Goal:** Provide 24/7 personalized guidance without giving away answers.

1.  **Context Injection**: Every chat request to `/api/ai/chat` fetches the current project's title, description, and all milestones.
2.  **Mode-Specific Prompts**:
    - **Guided**: AI is instructed to be helpful and provide small code snippets.
    - **Hardcore**: AI is instructed to be brief and only provide conceptual hints.
3.  **Chat Persistence**: Every message is saved to the `ChatMessage` table, allowing the AI to maintain a conversation history even if the user refreshes the page.
4.  **On-Demand Hints**: The `/api/ai/hint` endpoint uses Gemini to generate a _new_ hint based on the milestone's description and existing hints, ensuring students don't get stuck.

### Phase 4: Gamification & Performance

**Goal:** Keep users motivated through progress visualization.

1.  **XP Awarding**: Completing milestones triggers the `awardXP` utility, which increments the user's `xp` field in PostgreSQL.
2.  **Redis-Backed Leaderboard**:
    - To avoid heavy `ORDER BY xp DESC` queries on every page load, we cache the Top 20 users in Redis (`leaderboard:top20`).
    - **Cache Invalidation**: Whenever someone earns XP, we run `redis.del(LEADERBOARD_CACHE_KEY)` to ensure the next viewer sees updated rankings.
3.  **Achievement Engine**: We use the `UserAchievement` model to link users to specific milestones (e.g., "First Project Completed").

### Phase 5: Community & Collaboration

**Goal:** Enable peer-to-peer learning and social validation.

1.  **Submissions & Feedback**: Users "publish" their work via `Submission`. This records their repo URL and AI-generated feedback.
2.  **Voting System**: A `Vote` model (Up/Down) allows the community to surface high-quality solutions.
3.  **Discussion Threads**: The `Comment` model supports nested conversations on projects and submissions.
4.  **Team Formation**: The `Team` and `TeamMember` models allow users to group up, sharing the same project progress and milestones.

### Phase 6: Automated Code Review

**Goal:** Bridge the gap between coding and professional feedback.

1.  **GitHub API Integration**: When a user submits a repo URL, the backend uses `axios` to hit the GitHub API, fetching repo metadata (stars, description, primary language).
2.  **AI Code Analysis**: We send the repository context to Gemini to act as a "Senior Developer," providing constructive feedback on project structure and best practices.
3.  **Scoring Logic**: A simulated scoring system provides immediate gratification and a baseline for improvement.

---

## 💡 New Concepts to Master

### 1. Migrations

When you change the `schema.prisma` file, you need to sync it with your database.

- Command: `npx prisma migrate dev --name init`
- This creates a SQL file and updates your database structure.

### 2. Global Error Handling

We moved away from individual `try/catch` blocks sending responses. Instead, we use a central middleware:

1. Controller catches error.
2. Calls `next(error)`.
3. `middlewares/errorHandler.ts` formats the error and sends a consistent JSON response.

### 3. Progressive Scaffolding

The "Tutorial Hell" killer. Instead of a single "Build this" instruction, projects are broken into `ProjectMilestone`. Each milestone has its own:

- **Validation Criteria:** What the user must achieve.
- **Hints:** Step-by-step clues.
- **AI Context:** The AI Guide specifically focuses on the current milestone number.

### 4. Aggregations & Analytics

We use Prisma's `groupBy` and `_count` features to generate user and admin dashboards (e.g., counting total submissions, calculating project completion rates).

---

## 🛠 Useful Commands for Learning

- `npx prisma generate`: Re-generates the TypeScript types (run this after changing the schema).
- `npx prisma studio`: Opens a GUI to see your PostgreSQL data.
- `npx tsc --noEmit`: Checks your whole project for TypeScript errors.

---

## 🎯 Next Steps for You

1. **Explore the Schema:** Look at `prisma/schema.prisma` and try adding a new field (like `twitterHandle` to the User model).
2. **Check the Logs:** Run the server and watch the terminal to see how Redis connects.
3. **Test an API:** Use Postman or Insomnia to hit `POST /api/ai/chat` and see how the AI responds based on the project context.
