import { LLM, Provider } from "./types";

export const RENDER_MODELS: Record<LLM, { model: string; provider: Provider }> =
  {
    // OpenRouter free models
    default: {
      model: "mistralai/mistral-7b-instruct:free",
      provider: "openrouter",
    },
    premium: {
      model: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
      provider: "openrouter",
    },
    mistral: {
      model: "mistralai/mistral-7b-instruct:free",
      provider: "openrouter",
    },
    grok: {
      model: "xai/grok-1:free",
      provider: "openrouter",
    },
    cinematika: {
      model: "openrouter/cinematika-7b:free",
      provider: "openrouter",
    },
    "nous-capybara": {
      model: "nousresearch/nous-capybara-7b:free",
      provider: "openrouter",
    },
    "command-r": {
      model: "cohere/command-r:free",
      provider: "openrouter",
    },
    dolphin: {
      model: "cognitivecomputations/dolphin3.0-r1-mistral-24b:free",
      provider: "openrouter",
    },
    microsoft: {
      model: "microsoft/phi-2:free",
      provider: "openrouter",
    },
    qwen: {
      model: "qwen/qwen3-4b:free",
      provider: "openrouter",
    },
    deepseek: {
      model: "deepseek/deepseek-v3-base:free",
      provider: "openrouter",
    },
    // Note: The following models are not free and have been removed
    gemini: {
      model: "google/gemini-2.5-pro-exp-03-25",
      provider: "openrouter",
    },
    amazon: {
      model: "amazon/nova-micro-v1",
      provider: "openrouter",
    },
    "gpt-4": {
      model: "openai/gpt-4.1-nano",
      provider: "openrouter",
    },
    llama3: {
      model: "llama3-70b-8192",
      provider: "groq",
    },
    gemma: {
      model: "gemma-7b-it",
      provider: "groq",
    },
  };
