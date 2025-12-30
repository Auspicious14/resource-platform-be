import { Request, Response } from "express";
import prisma from "../../prisma/client";
import axios from "axios";

export const linkRepository = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { projectId, repoUrl } = req.body;

  try {
    if (!repoUrl.includes("github.com")) {
      return res.status(400).json({
        success: false,
        message: "Invalid GitHub repository URL",
      });
    }

    // Extract owner and repo from URL
    const repoPath = repoUrl
      .replace("https://github.com/", "")
      .replace(".git", "");
    const [owner, repo] = repoPath.split("/");

    // Verify repository exists (optional - requires GitHub token)
    try {
      const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
      await axios.get(githubApiUrl);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: "Repository not found or not accessible",
      });
    }

    // Update user project with repo URL
    const userProject = await prisma.userProject.findFirst({
      where: {
        userId,
        projectId,
      },
    });

    if (!userProject) {
      return res.status(404).json({
        success: false,
        message: "Project not started by user",
      });
    }

    const updated = await prisma.userProject.update({
      where: { id: userProject.id },
      data: { repoUrl },
    });

    res.json({ success: true, data: updated });
  } catch (error: any) {
    console.error("Link repository error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRepositoryCommits = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { projectId } = req.params;

  try {
    const userProject = await prisma.userProject.findFirst({
      where: {
        userId,
        projectId,
      },
    });

    if (!userProject || !userProject.repoUrl) {
      return res.status(404).json({
        success: false,
        message: "No repository linked",
      });
    }

    // Extract owner and repo
    const repoPath = userProject.repoUrl
      .replace("https://github.com/", "")
      .replace(".git", "");
    const [owner, repo] = repoPath.split("/");

    // Fetch commits from GitHub API
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}/commits`;
    const response = await axios.get(githubApiUrl, {
      params: { per_page: 10 },
      headers: {
        // Add GitHub token if available for higher rate limits
        Authorization: `token ${process.env.GITHUB_TOKEN}`,
      },
    });

    const commits = response.data.map((commit: any) => ({
      id: commit.sha,
      message: commit.commit.message,
      author: commit.commit.author.name,
      date: commit.commit.author.date,
      url: commit.html_url,
    }));

    res.json({ success: true, data: commits });
  } catch (error: any) {
    console.error("Get commits error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
