import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { getGeminiResponse } from "../../utils/gemini";

export const chatWithAI = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { message, projectId } = req.body;

  try {
    // Fetch project context if projectId is provided
    let projectContext = "";
    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: { milestones: true }
      });
      if (project) {
        projectContext = `The user is working on the project: "${project.title}". 
        Description: ${project.description}.
        Milestones: ${project.milestones.map(m => `${m.milestoneNumber}. ${m.title}`).join(", ")}.`;
      }
    }

    // Fetch chat history from DB
    const history = await prisma.chatMessage.findMany({
      where: { userId, projectId: projectId || null },
      orderBy: { createdAt: "asc" },
      take: 20
    });

    const geminiHistory = history.map(msg => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }]
    }));

    const systemPrompt = `You are an AI Guide for a project-based learning platform. 
    Your goal is to help students learn by providing guidance, not just giving away answers.
    ${projectContext}
    Keep your responses concise and educational.`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
    const aiResponse = await getGeminiResponse(fullPrompt, geminiHistory);

    // Save messages to DB
    await prisma.chatMessage.createMany({
      data: [
        { userId, projectId: projectId || null, role: "user", content: message },
        { userId, projectId: projectId || null, role: "assistant", content: aiResponse }
      ]
    });

    res.json({ success: true, data: aiResponse });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getChatHistory = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { projectId } = req.params;

  try {
    const history = await prisma.chatMessage.findMany({
      where: { userId, projectId: projectId === "null" ? null : projectId },
      orderBy: { createdAt: "asc" }
    });

    res.json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestHint = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { projectId, milestoneNumber } = req.body;

  try {
    const milestone = await prisma.projectMilestone.findUnique({
      where: { projectId_milestoneNumber: { projectId, milestoneNumber } },
      include: { project: true }
    });

    if (!milestone) return res.status(404).json({ success: false, message: "Milestone not found" });

    const prompt = `The user is stuck on Milestone ${milestoneNumber} ("${milestone.title}") of the project "${milestone.project.title}".
    Milestone description: ${milestone.description}.
    Existing hints: ${milestone.hints.join(", ")}.
    Please provide a new, progressive hint that helps them move forward without revealing the full solution.`;

    const hint = await getGeminiResponse(prompt);

    res.json({ success: true, data: hint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
