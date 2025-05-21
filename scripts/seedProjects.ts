import mongoose from "mongoose";
import { Project } from "../models/project";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import axios from "axios";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "";

// Path to the frontend data file
const dataPath = path.resolve(
  __dirname,
  "../../resource-platform-fe/src/modules/projects/data.ts"
);

function parseProjectsData(raw: string) {
  // Extract the array from the export statement
  const match = raw.match(/export const projects = (\[.*\]);/s);
  if (!match) throw new Error("Could not parse projects array");
  // Use eval in a sandboxed way (safe here since it's local dev data)
  // Replace all placeholder URLs with example URLs
  let arrStr = match[1].replace(/url: "#"/g, (m, idx) => {
    // Generate a fake but plausible URL for each resource
    return `url: "https://example.com/resource/${idx}"`;
  });
  // eslint-disable-next-line no-eval
  return eval(arrStr);
}

async function searchResourceUrl(query: string, type: string): Promise<string> {
  try {
    if (type === "video") {
      // Use YouTube Search API (no key required)
      const res = await axios.get(
        `https://www.googleapis.com/youtube/v3/search`,
        {
          params: {
            part: "snippet",
            q: query,
            type: "video",
            maxResults: 1,
            key: process.env.YOUTUBE_API_KEY || "",
          },
        }
      );
      const items = res.data.items;
      if (items && items.length > 0) {
        return `https://www.youtube.com/watch?v=${items[0].id.videoId}`;
      }
    } else if (type === "article") {
      // Use DuckDuckGo Instant Answer API for articles
      const res = await axios.get(`https://api.duckduckgo.com/`, {
        params: {
          q: query,
          format: "json",
          no_redirect: 1,
          no_html: 1,
        },
      });
      if (
        res.data &&
        res.data.RelatedTopics &&
        res.data.RelatedTopics.length > 0
      ) {
        const first = res.data.RelatedTopics.find((t: any) => t.FirstURL);
        if (first && first.FirstURL) return first.FirstURL;
      }
    } else if (type === "course") {
      // Use DuckDuckGo for courses (Coursera, Udemy, etc.)
      const res = await axios.get(`https://api.duckduckgo.com/`, {
        params: {
          q: query + " course",
          format: "json",
          no_redirect: 1,
          no_html: 1,
        },
      });
      if (
        res.data &&
        res.data.RelatedTopics &&
        res.data.RelatedTopics.length > 0
      ) {
        const first = res.data.RelatedTopics.find(
          (t: any) =>
            t.FirstURL &&
            /coursera|udemy|edx|pluralsight|codecademy|freecodecamp/i.test(
              t.FirstURL
            )
        );
        if (first && first.FirstURL) return first.FirstURL;
        // fallback to any link
        const any = res.data.RelatedTopics.find((t: any) => t.FirstURL);
        if (any && any.FirstURL) return any.FirstURL;
      }
    }
  } catch (e) {
    console.error("Resource search failed", e);
  }
  return "https://example.com/resource/" + encodeURIComponent(query);
}

async function seed() {
  await mongoose.connect(MONGODB_URL);
  const raw = fs.readFileSync(dataPath, "utf-8");
  let projects = parseProjectsData(raw);
  // Remove _id field from each project to avoid ObjectId cast error
  projects = projects.map((p: any) => {
    const { _id, ...rest } = p;
    return rest;
  });
  // Validate and fix resources
  for (const p of projects) {
    // Ensure requirements array is present and populated
    if (
      !p.requirements ||
      !Array.isArray(p.requirements) ||
      p.requirements.length === 0
    ) {
      p.requirements = inferRequirements(p);
    }
    for (const r of p.resources || []) {
      if (!r.url || r.url === "#" || !r.url.startsWith("http")) {
        // Compose a search query
        let query = p.title;
        if (p.requirements && Array.isArray(p.requirements)) {
          query += " " + p.requirements.join(" ");
        }
        if (r.title) query += " " + r.title;
        r.url = await searchResourceUrl(query, r.type);
      }
    }
  }
  await Project.deleteMany({});
  const data = await Project.insertMany(projects);
  //   console.log({ data });
  console.log("Seeded projects successfully");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

// Add this helper function to infer requirements based on project title/description
function inferRequirements(project: any) {
  const reqs = [];
  const title = (project.title || "").toLowerCase();
  const desc = (project.description || "").toLowerCase();
  const text = title + " " + desc;
  if (/auth|authentication|login|register|user/i.test(text)) {
    reqs.push("nodejs", "expressjs", "mongodb", "javascript", "typescript");
  }
  if (/api|rest|graphql/i.test(text)) {
    reqs.push("nodejs", "expressjs", "mongodb", "rest api", "graphql");
  }
  if (/dashboard|admin|panel/i.test(text)) {
    reqs.push("react", "javascript", "css", "html");
  }
  if (/chat|messag|socket/i.test(text)) {
    reqs.push("socket.io", "nodejs", "expressjs");
  }
  if (/ecommerce|shop|cart|product/i.test(text)) {
    reqs.push("nodejs", "expressjs", "mongodb", "react");
  }
  if (/blog|cms|content/i.test(text)) {
    reqs.push("nodejs", "expressjs", "mongodb", "react");
  }
  if (/portfolio|resume|cv/i.test(text)) {
    reqs.push("react", "javascript", "css", "html");
  }
  if (/typescript/i.test(text)) {
    reqs.push("typescript");
  }
  if (/stripe|paystack|ecommerce/i.test(text)) {
    reqs.push("javascript", "react", "stripe", "paystack");
  }
  if (/python|django|flask/i.test(text)) {
    reqs.push("python", "django", "flask");
  }
  if (/ml|machine learning|ai|artificial intelligence/i.test(text)) {
    reqs.push("python", "scikit-learn", "pandas", "numpy");
  }
  // Always dedupe
  return Array.from(new Set(reqs));
}
