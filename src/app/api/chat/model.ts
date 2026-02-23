import {
  createProviderRegistry,
  customProvider,
  defaultSettingsMiddleware,
  wrapLanguageModel,
} from "ai";
import { openai, OpenAIChatLanguageModelOptions } from "@ai-sdk/openai";
import { ollama, OllamaCompletionProviderOptions } from "ollama-ai-provider-v2";

//create a custom provider for openai
export const customOpenapi = customProvider({
  languageModels: {
    fast: openai.chat("gpt-5-nano"),
    smart: openai.chat("gpt-5-mini"),
    turbo: openai.chat("gpt-5"),
    reasoning: wrapLanguageModel({
      model: openai("gpt-5-mini"),
      providerId: "openai",
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            openai: {
              reasoningEffort: "high",
              reasoningSummary: "auto",
            } as OpenAIChatLanguageModelOptions,
          },
        },
      }),
    }),
  },
});

export const customOllama = customProvider({
  languageModels: {
    fast: ollama.chat("qwen2.5:1.5b"),
    roleplay: ollama("HammerAI/mythomax-l2:latest"),
    reasoning: wrapLanguageModel({
      model: ollama("deepseek-r1:14b"),
      providerId: "ollama",
      middleware: defaultSettingsMiddleware({
        settings: {
          providerOptions: {
            ollama: {
              think: true,
            } as OllamaCompletionProviderOptions,
          },
        },
      }),
    }),
  },
});

export const customProviderRegistry = createProviderRegistry({
  ollama: customOllama,
  openai: customOpenapi,
});
// provider list
export const chefList = ["OpenAI", "Ollama"];

// export model list
export const modelList = [
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "openai:fast",
    name: "gpt:fast",
    providers: ["openai"],
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "openai:smart",
    name: "gpt:smart",
    providers: ["openai"],
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "openai:turbo",
    name: "gpt:turbo",
    providers: ["openai"],
  },
  {
    chef: "OpenAI",
    chefSlug: "openai",
    id: "openai:reasoning",
    name: "gpt:reasoning",
    providers: ["openai"],
  },
  {
    chef: "Ollama",
    chefSlug: "ollama",
    id: "ollama:fast",
    name: "ollama:fast",
    providers: ["ollama"],
  },
  {
    chef: "Ollama",
    chefSlug: "ollama",
    id: "ollama:roleplay",
    name: "ollama:roleplay",
    providers: ["ollama"],
  },
  {
    chef: "Ollama",
    chefSlug: "ollama",
    id: "ollama:reasoning",
    name: "ollama:reasoning",
    providers: ["ollama"],
  },
];

export const nonToolModels = ["ollama:roleplay", "ollama:reasoning"];

export type ModelType = (typeof modelList)[0];
