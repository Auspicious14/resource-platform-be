import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { getGeminiResponse } from "../../utils/gemini";
import axios from "axios";

export const analyzeCode = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { repoUrl, projectId } = req.body;

  try {
    // 1. Fetch code from GitHub (simplified: fetch README or a few files for demo)
    // In a real app, you'd use a GitHub App or User Token to clone or fetch via API
    const repoPath = repoUrl.replace("https://github.com/", "");
    const [owner, repo] = repoPath.split("/");

    // Fetch repo info as a placeholder for analysis
    const githubApiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    const repoInfo = await axios.get(githubApiUrl);

    // 2. Automated analysis (simulated)
    const metrics = {
      complexity: "Medium",
      securityIssues: 0,
      lintErrors: 0
    };

    // 3. AI-powered feedback
    const prompt = `Please review this GitHub repository: ${repoUrl}.
    Owner: ${owner}
    Repo: ${repo}
    Description: ${repoInfo.data.description}
    Provide constructive feedback on the project structure and suggest improvements for a student.`;

    const feedback = await getGeminiResponse(prompt);

    // 4. Store review results
    const submission = await prisma.submission.create({
      data: {
        userId,
        projectId,
        repoUrl,
        feedback,
        score: 85 // Simulated score
      }
    });

    res.json({ success: true, data: submission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubmissionReview = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const submission = await prisma.submission.findUnique({
      where: { id },
      include: {
        project: { select: { title: true } },
        user: { select: { firstName: true, lastName: true } }
      }
    });

    if (!submission) return res.status(404).json({ success: false, message: "Submission not found" });

    res.json({ success: true, data: submission });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
