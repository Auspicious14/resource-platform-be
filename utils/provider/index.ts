import { OpenAI } from "openai";

const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
});

const client = openRouter;
export const aiProvider = async (
  messages: Array<{ role: "system" | "user" | "assistant"; content: string }>
) => {
  const completion = await client.chat.completions.create({
    model: "xai/grok-1:free",
    messages: messages as Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }>,
  });

  return completion.choices[0].message.content ?? "";
};

export const refinePrompt = async (userInput: string) => {
  const systemPrompt = `You are an expert AI career and project advisor. Refine the user's input to be clear, specific, and optimized for accurate responses about tech career guidance or realistic project ideas. Include relevant keywords (e.g., frontend, backend, React, APIs), clarify user goals or skill level if implied, and remove ambiguity. Return a single, concise prompt in plain text (max 100 words), ready for AI processing.`;

  const response = await client.chat.completions.create({
    model: "xai/grok-1:free",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userInput },
    ],
  });

  return response.choices[0].message.content ?? "";
};
