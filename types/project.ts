export interface IProject {
  featured?: boolean;
  title: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  description: string;
  requirements?: string[];
  resources: Array<{
    type: "video" | "article" | "course";
    url: string;
    title: string;
  }>;
  author?: string; // Full name of the author
  coverImage?: string; // URL to the cover image
}
