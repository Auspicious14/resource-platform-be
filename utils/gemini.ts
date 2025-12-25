import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const getGeminiResponse = async (
  prompt: string,
  history: { role: string; parts: { text: string }[] }[] = []
) => {
  const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

  const chat = model.startChat({
    history: history,
  });

  const result = await chat.sendMessage(prompt);
  const response = await result.response;
  return response.text();
};
