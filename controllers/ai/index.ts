import { Request, Response } from "express";
import prisma from "../../prisma/client";
import { getGeminiResponse } from "../../utils/gemini";

export const chatWithAI = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  const { message, projectId } = req.body;

  try {
    let projectContext = "";
    let difficultyMode: string | null = null;

    // 1. Fetch project context if projectId is provided
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
        projectContext = `
You are helping a student with the following project:
Project Title: ${project.title}
Description: ${project.description}
Difficulty Level: ${project.difficultyLevel}
Technologies: ${project.technologies.join(", ")}
Estimated Time: ${project.estimatedTime}
Chosen Difficulty Mode: ${difficultyMode}

Milestones:
${project.milestones
  .sort((a, b) => a.milestoneNumber - b.milestoneNumber)
  .map((m) => `${m.milestoneNumber}. ${m.title}: ${m.description}`)
  .join("\n")}

Learning Objectives:
${project.learningObjectives.map((obj, i) => `${i + 1}. ${obj}`).join("\n")}
`;
      }
    }

    // 2. Define mode-specific instructions
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

    // 3. Build System Prompt
    const systemPrompt = `You are an AI Guide for a project-based learning platform. 
Your goal is to help students learn by providing guidance, not just giving away answers.
${projectContext}
${modeInstruction}
Keep your responses concise and educational. Always respond in markdown format.`;

    // 4. Fetch chat history
    const history = await prisma.chatMessage.findMany({
      where: { userId, projectId: projectId || null },
      orderBy: { createdAt: "asc" },
      take: 20,
    });

    const geminiHistory = history.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    // 5. Get AI Response
    const aiResponse = await getGeminiResponse(
      `${systemPrompt}\n\nUser Question: ${message}`,
      geminiHistory
    );

    // 6. Persist Conversation
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

    // 7. Stream response (simulated streaming)
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const words = aiResponse.split(" ");
    for (let i = 0; i < words.length; i++) {
      res.write(words[i] + " ");
      await new Promise((resolve) => setTimeout(resolve, 20));
    }

    res.end();
  } catch (error: any) {
    console.error("Chat error:", error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: error.message });
    } else {
      res.end();
    }
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

export const getChatHistory = async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const userId = (req as any).user?.id;

  try {
    const messages = await prisma.chatMessage.findMany({
      where: {
        userId,
        projectId: projectId || null,
      },
      orderBy: { createdAt: "asc" },
    });

    res.json({ success: true, data: messages });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
