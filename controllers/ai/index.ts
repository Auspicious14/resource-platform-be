import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { getGeminiResponse } from "../../utils/gemini";

export const chatWithAI = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { message, projectId } = req.body;

  try {
    // Fetch project context if projectId is provided
    let projectContext = "";
    let difficultyMode: string | null = null;

    if (projectId) {
      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          milestones: true,
          userProjects: { where: { userId } },
        },
      });
      if (project) {
        difficultyMode =
          project.userProjects?.[0]?.difficultyModeChosen || "STANDARD";
        projectContext = `The user is working on the project: "${
          project.title
        }". 
        Description: ${project.description}.
        Difficulty Level: ${project.difficultyLevel}.
        User's chosen mode: ${difficultyMode}.
        Milestones: ${project.milestones
          .map((m) => `${m.milestoneNumber}. ${m.title}`)
          .join(", ")}.`;
      }
    }

    // Fetch chat history from DB
    const history = await prisma.chatMessage.findMany({
      where: { userId, projectId: projectId || null },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const geminiHistory = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    let modeInstruction = "";
    if (difficultyMode === "GUIDED") {
      modeInstruction =
        "The user is in GUIDED mode. Be very helpful, provide detailed explanations, and don't hesitate to give small code snippets if they are stuck.";
    } else if (difficultyMode === "HARDCORE") {
      modeInstruction =
        "The user is in HARDCORE mode. Be very brief, provide only high-level conceptual hints, and never provide code solutions.";
    } else {
      modeInstruction =
        "The user is in STANDARD mode. Provide balanced guidance, focus on concepts, and only provide code as a last resort.";
    }

    const systemPrompt = `You are an AI Guide for a project-based learning platform. 
    Your goal is to help students learn by providing guidance, not just giving away answers.
    ${projectContext}
    ${modeInstruction}
    Keep your responses concise and educational.`;

    const fullPrompt = `${systemPrompt}\n\nUser: ${message}`;
    const aiResponse = await getGeminiResponse(fullPrompt, geminiHistory);

    // Save messages to DB
    await prisma.chatMessage.createMany({
      data: [
        {
          userId,
          projectId: projectId || null,
          role: "user",
          content: message,
        },
        {
          userId,
          projectId: projectId || null,
          role: "assistant",
          content: aiResponse,
        },
      ],
    });

    res.json({ success: true, data: aiResponse });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllChatMessages = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;

  try {
    const messages = await prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, data: messages });
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
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, data: history });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const requestHint = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { projectId, milestoneNumber, difficultyMode } = req.body;

  try {
    const milestone = await prisma.projectMilestone.findUnique({
      where: { projectId_milestoneNumber: { projectId, milestoneNumber } },
      include: { project: true },
    });

    if (!milestone)
      return res
        .status(404)
        .json({ success: false, message: "Milestone not found" });

    let modeInstruction = "";
    if (difficultyMode === "GUIDED") {
      modeInstruction =
        "The user is in GUIDED mode. Be very helpful and detailed.";
    } else {
      modeInstruction =
        "The user is in STANDARD mode. Provide a balanced, conceptual hint.";
    }

    const modeHintsForPrompt = Array.isArray(milestone.hints)
      ? milestone.hints
      : (milestone.hints as any)?.[difficultyMode] || [];

    const prompt = `The user is stuck on Milestone ${milestoneNumber} ("${
      milestone.title
    }") of the project "${milestone.project.title}".
    Milestone description: ${milestone.description}.
    Difficulty Mode: ${difficultyMode}.
    ${modeInstruction}
    Existing hints: ${modeHintsForPrompt.join(", ")}.
    Please provide a new, progressive hint that helps them move forward without revealing the full solution. 
    Format the response as a single, clear hint string.`;

    const hint = await getGeminiResponse(prompt);

    // Persist the hint by mode in the JSON object
    const existingHints = (milestone.hints as any) || {};
    const modeHints = existingHints[difficultyMode] || [];
    modeHints.push(hint);

    await prisma.projectMilestone.update({
      where: { id: milestone.id },
      data: {
        hints: {
          ...existingHints,
          [difficultyMode]: modeHints,
        },
      },
    });

    res.json({ success: true, data: hint });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
