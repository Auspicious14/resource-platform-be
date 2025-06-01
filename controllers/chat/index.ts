import { Request, Response } from "express";
import { v6 as uuidv6 } from "uuid";

import { handleErrors } from "../../middlewares/errorHandler";
import userAuth from "../../models/auth";
import { aiProvider, refinePrompt } from "../../utils/provider";
import chatModel from "../../models/chat";

export const createChat = async (req: Request, res: Response) => {
  const { question } = req.body;
  const userId = (req as any).user?.id;
  try {
    if (!userId)
      res.json({
        success: false,
        message: "Unauthenticated. Please Login to continue",
      });

    const user = await userAuth.findById(userId);
    if (user?._id.toString() !== userId)
      res.json({ success: false, message: "Unauthorised" });

    const response = await aiProvider(question);
    const newChat = await chatModel.create({
      user: userId,
      question,
      response,
    });

    res.json({ success: true, data: newChat });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ success: false, errors });
  }
};

export const updateChat = async (req: Request, res: Response) => {
  const { question } = req.body;
  const userId = (req as any).user?.id;
  try {
    const user = await userAuth.findById(userId);
    if (user?._id.toString() !== userId)
      res.json({ success: false, message: "Unauthorised" });

    const chats = await chatModel.find({ user: userId });

    const response = await aiProvider(question);
    const updatedChat = await chatModel.findByIdAndUpdate(
      req.params.id,
      { question, response },
      { new: true }
    );

    res.json({ success: true, data: updatedChat });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ success: false, errors });
  }
};

export const getChats = async (req: Request, res: Response) => {
  const userId = (req as any).user?.id;
  try {
    const user = await userAuth.findById(userId);
    if (user?._id.toString() !== userId)
      res.json({ success: false, message: "Unauthorised" });

    const chats = await chatModel.find({ user: userId });

    res.json({ success: true, data: chats });
  } catch (error) {
    const errors = handleErrors(error);
    res.status(500).json({ success: false, errors });
  }
};

export const chatWithAI = async (req: Request, res: Response) => {
  const { question, chatId } = req.body;

  const userId = (req as any).user?.id;
  try {
    if (!userId) {
      return res.json({
        success: false,
        message: "Unauthenticated. Please Login to continue",
      });
    }

    const user = await userAuth.findById(userId);
    if (!user || user._id.toString() !== userId) {
      return res.json({
        success: false,
        message: "Unauthorized. Please Login to continue",
      });
    }

    let conversationId = chatId;

    if (!conversationId) {
      conversationId = uuidv6();
    }
    // const refinedQuestion = await refinePrompt(question);

    await chatModel.create({
      user: userId,
      chatId: conversationId,
      content: question,
      role: "user",
    });

    const history = await chatModel
      .find({ chatId: conversationId })
      .sort({ createdAt: 1 });

    const messages: Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }> = [
      {
        role: "system",
        content:
          "You are an expert tech mentor helping users with career guidance and realistic project ideas in software development.",
      },
      ...history.map((msg) => ({
        role: msg.role,
        content: msg.content,
      })),
    ];

    const aiResponse = await aiProvider(messages);
    const assistantMessage = await chatModel.create({
      user: userId,
      chatId: conversationId,
      content: aiResponse,
      role: "assistant",
    });

    res.setHeader("Content-Type", "text/plain");

    const words = aiResponse.split(" ");
    let i = 0;

    const interval = setInterval(() => {
      if (i >= words.length) {
        clearInterval(interval);
        return res.end();
      }
      res.write(words[i] + " ");
      i++;
    }, 50);

    // res.json({
    //   success: true,
    //   chatId: conversationId,
    //   messages: [history[history.length - 1], assistantMessage],
    // });
  } catch (error) {
    console.log({ error });
    const errors = handleErrors(error);
    res.status(500).json({ success: false, errors });
  }
};
