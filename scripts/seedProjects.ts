// import mongoose from "mongoose";
// import { Project } from "../models/project";
// import dotenv from "dotenv";
// import path from "path";
// import fs from "fs";
// import axios from "axios";

// dotenv.config();

// const MONGODB_URL = process.env.MONGODB_URL || "";

// // Path to the frontend data file
// const dataPath = path.resolve(
//   __dirname,
//   "../../resource-platform-fe/src/modules/projects/data.ts"
// );

// function parseProjectsData(raw: string) {
//   const match = raw.match(/export const projects = (\[.*\]);/s);
//   if (!match) throw new Error("Could not parse projects array");
//   return eval(match[1]);
// }

// async function searchResourceUrl(query: string, type: string): Promise<string> {
//   console.log({ type, query });
//   try {
//     if (type === "video") {
//       const res = await axios.get(
//         `https://www.googleapis.com/youtube/v3/search`,
//         {
//           params: {
//             part: "snippet",
//             q: query,
//             type: "video",
//             maxResults: 1,
//             key: process.env.YOUTUBE_API_KEY || "",
//           },
//         }
//       );
//       const items = res.data.items;
//       console.log(items, "youtube items");
//       if (items && items.length > 0) {
//         return `https://www.youtube.com/watch?v=${items[0].id.videoId}`;
//       }
//     } else if (type === "article") {
//       // Use DuckDuckGo Instant Answer API for articles
//       const encodedQuery = encodeURIComponent(
//         query.trim().replace(/\s+/g, "+")
//       );
//       const res = await axios.get(`https://api.duckduckgo.com/`, {
//         params: {
//           q: encodedQuery,
//           format: "json",
//           no_redirect: 1,
//           no_html: 1,
//         },
//       });
//       if (
//         res.data &&
//         res.data.RelatedTopics &&
//         res.data.RelatedTopics.length > 0
//       ) {
//         const first = res.data.RelatedTopics.find((t: any) => t.FirstURL);
//         if (first && first.FirstURL) return first.FirstURL;
//       }
//     } else if (type === "course") {
//       // Use DuckDuckGo for courses (Coursera, Udemy, etc.)
//       const encodedQuery = encodeURIComponent(
//         (query + " course").trim().replace(/\s+/g, "+")
//       );
//       const res = await axios.get(`https://api.duckduckgo.com/`, {
//         params: {
//           q: encodedQuery,
//           format: "json",
//           no_redirect: 1,
//           no_html: 1,
//         },
//       });
//       if (
//         res.data &&
//         res.data.RelatedTopics &&
//         res.data.RelatedTopics.length > 0
//       ) {
//         const first = res.data.RelatedTopics.find(
//           (t: any) =>
//             t.FirstURL &&
//             /coursera|udemy|edx|pluralsight|codecademy|freecodecamp/i.test(
//               t.FirstURL
//             )
//         );
//         if (first && first.FirstURL) return first.FirstURL;
//         // fallback to any link
//         const any = res.data.RelatedTopics.find((t: any) => t.FirstURL);
//         if (any && any.FirstURL) return any.FirstURL;
//       }
//     }
//   } catch (e) {
//     console.error("Resource search failed", e);
//   }
//   // Try a secondary Google search as a last resort
//   try {
//     const googleRes = await axios.get(
//       "https://www.googleapis.com/customsearch/v1",
//       {
//         params: {
//           q: query + (type === "course" ? " course" : ""),
//           cx: process.env.GOOGLE_CSE_ID || "",
//           key: process.env.GOOGLE_API_KEY || "",
//           num: 1,
//         },
//       }
//     );
//     if (
//       googleRes.data.items &&
//       googleRes.data.items.length > 0 &&
//       googleRes.data.items[0].link
//     ) {
//       return googleRes.data.items[0].link;
//     }
//   } catch (e) {
//     console.error("Google fallback failed", e);
//   }
//   // If all else fails, return a DuckDuckGo search result page for the query
//   const encodedQuery = encodeURIComponent(query.trim().replace(/\s+/g, "+"));
//   return `https://duckduckgo.com/?q=${encodedQuery}`;
// }

// async function seed() {
//   await mongoose.connect(MONGODB_URL);
//   const raw = fs.readFileSync(dataPath, "utf-8");
//   let projects = parseProjectsData(raw);
//   // Remove _id field from each project to avoid ObjectId cast error
//   projects = projects.map((p: any) => {
//     const { _id, ...rest } = p;
//     return rest;
//   });
//   // Validate and fix resources
//   for (const p of projects) {
//     // Ensure requirements array is present and populated
//     if (
//       !p.requirements ||
//       !Array.isArray(p.requirements) ||
//       p.requirements.length === 0
//     ) {
//       p.requirements = inferRequirements(p);
//     }
//     for (const r of p.resources || []) {
//       if (!r.url || r.url === "#" || !r.url.startsWith("http")) {
//         // Compose a search query
//         let query = p.title;
//         if (p.requirements && Array.isArray(p.requirements)) {
//           query += " " + p.requirements.join(" ");
//         }
//         if (r.title) query += " " + r.title;
//         r.url = await searchResourceUrl(query, r.type);
//         console.log({ query, url: r.url });
//       }
//     }
//   }
//   //   await Project.deleteMany({});
//   //   const data = await Project.insertMany(projects);
//   //   console.log({ data });
//   console.log("Seeded projects successfully");
//   process.exit(0);
// }

// seed().catch((e) => {
//   console.error(e);
//   process.exit(1);
// });

// // Add this helper function to infer requirements based on project title/description
// function inferRequirements(project: any) {
//   const reqs = [];
//   const title = (project.title || "").toLowerCase();
//   const desc = (project.description || "").toLowerCase();
//   const text = title + " " + desc;
//   if (/auth|authentication|login|register|user/i.test(text)) {
//     reqs.push("nodejs", "expressjs", "mongodb", "javascript", "typescript");
//   }
//   if (/api|rest|graphql/i.test(text)) {
//     reqs.push("nodejs", "expressjs", "mongodb", "rest api", "graphql");
//   }
//   if (/dashboard|admin|panel/i.test(text)) {
//     reqs.push("react", "javascript", "css", "html");
//   }
//   if (/chat|messag|socket/i.test(text)) {
//     reqs.push("socket.io", "nodejs", "expressjs");
//   }
//   if (/ecommerce|shop|cart|product/i.test(text)) {
//     reqs.push("nodejs", "expressjs", "mongodb", "react");
//   }
//   if (/blog|cms|content/i.test(text)) {
//     reqs.push("nodejs", "expressjs", "mongodb", "react");
//   }
//   if (/portfolio|resume|cv/i.test(text)) {
//     reqs.push("react", "javascript", "css", "html");
//   }
//   if (/typescript/i.test(text)) {
//     reqs.push("typescript");
//   }
//   if (/stripe|paystack|ecommerce/i.test(text)) {
//     reqs.push("javascript", "react", "stripe", "paystack");
//   }
//   if (/python|django|flask/i.test(text)) {
//     reqs.push("python", "django", "flask");
//   }
//   if (/ml|machine learning|ai|artificial intelligence/i.test(text)) {
//     reqs.push("python", "scikit-learn", "pandas", "numpy");
//   }
//   // Always dedupe
//   return Array.from(new Set(reqs));
// }

import mongoose from "mongoose";
import { Project } from "../models/project";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import axios from "axios";

dotenv.config();

const MONGODB_URL = process.env.MONGODB_URL || "";
const POLLINATIONS_URL = process.env.POLLINATIONS_API_URL || "";

// Path to the frontend data file
const dataPath = path.resolve(
  __dirname,
  "../../resource-platform-fe/src/modules/projects/data.ts"
);

function parseProjectsData(raw: string) {
  const match = raw.match(/export const projects = (\[.*\]);/s);
  if (!match) throw new Error("Could not parse projects array");
  return eval(match[1]);
}

function buildSearchQuery(project: any, resource: any) {
  const keywords = new Set<string>();

  if (project.title) keywords.add(project.title);
  if (resource.title) keywords.add(resource.title);
  if (Array.isArray(project.requirements)) {
    project.requirements.forEach((req: string) => {
      // Only include short & relevant terms
      if (req.length < 30 && /^[a-z0-9\s\.\-\+]+$/i.test(req)) {
        keywords.add(req.toLowerCase());
      }
    });
  }

  // Turn set into a proper readable query
  return Array.from(keywords).join(" ");
}

async function searchResourceUrl(query: string, type: string): Promise<string> {
  console.log({ type, query });
  try {
    if (type === "video") {
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
      const encodedQuery = encodeURIComponent(query.trim());
      const res = await axios.get(`https://api.duckduckgo.com/`, {
        params: {
          q: encodedQuery,
          format: "json",
          no_redirect: 1,
          no_html: 1,
        },
      });
      if (res.data?.RelatedTopics?.length) {
        const first = res.data.RelatedTopics.find((t: any) => t.FirstURL);
        if (first?.FirstURL) return first.FirstURL;
      }
    } else if (type === "course") {
      const encodedQuery = encodeURIComponent(`${query} course`);
      const res = await axios.get(`https://api.duckduckgo.com/`, {
        params: {
          q: encodedQuery,
          format: "json",
          no_redirect: 1,
          no_html: 1,
        },
      });
      if (res.data?.RelatedTopics?.length) {
        const first = res.data.RelatedTopics.find(
          (t: any) =>
            t.FirstURL &&
            /coursera|udemy|edx|pluralsight|codecademy|freecodecamp/i.test(
              t.FirstURL
            )
        );
        if (first?.FirstURL) return first.FirstURL;
        const fallback = res.data.RelatedTopics.find((t: any) => t.FirstURL);
        if (fallback?.FirstURL) return fallback.FirstURL;
      }
    }
  } catch (e) {
    console.error("Primary resource search failed", e);
  }

  // Google fallback
  //   try {
  //     const googleRes = await axios.get(
  //       "https://www.googleapis.com/customsearch/v1",
  //       {
  //         params: {
  //           q: query + (type === "course" ? " course" : ""),
  //           cx: process.env.GOOGLE_CSE_ID || "",
  //           key: process.env.GOOGLE_API_KEY || "",
  //           num: 1,
  //         },
  //       }
  //     );
  //     if (googleRes.data?.items?.[0]?.link) {
  //       return googleRes.data.items[0].link;
  //     }
  //   } catch (e) {
  //     console.error("Google fallback failed", e);
  //   }

  // Final fallback: DuckDuckGo search page
  const fallbackQuery = encodeURIComponent(query.trim());
  return `https://duckduckgo.com/?q=${fallbackQuery}`;
}

async function seed() {
  await mongoose.connect(MONGODB_URL);
  const raw = fs.readFileSync(dataPath, "utf-8");
  let projects = parseProjectsData(raw);

  projects = await Promise.all(
    projects.map(async (p: any) => {
      const { _id, ...rest } = p;

      const prompt = `A beautiful, modern illustration representing the project: ${p.title}`;
      const coverImage = await generateImage(prompt);
      return {
        ...rest,
        author: p.author || "Abdulganiyu Uthman",
        coverImage,
      };
    })
  );

  for (const project of projects) {
    if (
      !project.requirements ||
      !Array.isArray(project.requirements) ||
      project.requirements.length === 0
    ) {
      project.requirements = inferRequirements(project);
    }

    for (const resource of project.resources || []) {
      if (
        !resource.url ||
        resource.url === "#" ||
        !resource.url.startsWith("http")
      ) {
        const query = buildSearchQuery(project, resource);
        resource.url = await searchResourceUrl(query, resource.type);
        // console.log({ query, url: resource.url });
      }
    }
  }

  // Optional DB seed (uncomment if needed)
  await Project.deleteMany({});
  const data = await Project.insertMany(projects);
  // console.log({ data });

  console.log("Seeded projects successfully");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});

// Infer requirements based on project context
function inferRequirements(project: any) {
  const reqs = new Set<string>();
  const text = (
    (project.title || "") +
    " " +
    (project.description || "")
  ).toLowerCase();

  if (/auth|authentication|login|register|user/i.test(text)) {
    reqs
      .add("nodejs")
      .add("expressjs")
      .add("mongodb")
      .add("javascript")
      .add("typescript");
  }
  if (/api|rest|graphql/i.test(text)) {
    reqs.add("rest api").add("graphql").add("expressjs");
  }
  if (/dashboard|admin|panel/i.test(text)) {
    reqs.add("react").add("javascript").add("css").add("html");
  }
  if (/chat|messag|socket/i.test(text)) {
    reqs.add("socket.io").add("nodejs").add("expressjs");
  }
  if (/ecommerce|shop|cart|product/i.test(text)) {
    reqs.add("react").add("nodejs").add("mongodb");
  }
  if (/blog|cms|content/i.test(text)) {
    reqs.add("nodejs").add("react").add("mongodb");
  }
  if (/portfolio|resume|cv/i.test(text)) {
    reqs.add("react").add("javascript").add("css").add("html");
  }
  if (/typescript/i.test(text)) {
    reqs.add("typescript");
  }
  if (/stripe|paystack|payment/i.test(text)) {
    reqs.add("stripe").add("paystack").add("javascript");
  }
  if (/python|django|flask/i.test(text)) {
    reqs.add("python").add("django").add("flask");
  }
  if (/ml|machine learning|ai|artificial intelligence/i.test(text)) {
    reqs.add("python").add("scikit-learn").add("pandas").add("numpy");
  }

  return Array.from(reqs);
}

const generateImage = async (prompt: string) => {
  const params = {
    model: "flux",
    height: "1024",
    width: "1024",
    seed: 42,
    nologo: true,
    enhance: true,
  };

  const imageUrl = `${POLLINATIONS_URL}${encodeURIComponent(prompt)}?model=${
    params.model
  }&width=${params.width}&height=${params.height}&seed=${params.seed}&nologo=${
    params.nologo
  }&enhance=${params.enhance}`;

  return imageUrl;
};
