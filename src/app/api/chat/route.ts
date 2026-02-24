import {
  convertToModelMessages,
  type InferUITools,
  stepCountIs,
  streamText,
  tool,
  type UIDataTypes,
  type UIMessage,
} from "ai";
import { z } from "zod";
import { searchDocuments } from "@/lib/search";
import {
  customProviderRegistry,
  type ModelType,
  modelList,
  nonToolModels,
} from "./model";

// all the tools are defined here
const tools = {
  searchKnowledgeBase: tool({
    description: "search the knowledge base for relevant documents",
    inputSchema: z.object({
      query: z.string().describe("The search query to fins relevant documents"),
    }),
    execute: async ({ query }) => {
      try {
        const results = await searchDocuments(query, 5, 0.4);

        if (results.length === 0) {
          return "No relevant information found in the database";
        }

        // format the results into string with index
        const formattedResult = results
          .map((result, index) => `[${index + 1}] ${result.content}`)
          .join("\n\n");

        return formattedResult;
      } catch (error) {
        console.error("Knowledge base search error:", error);
        return "Failed to search knowledge base due to a database error.";
      }
    },
  }),
};

// types
export type ChatMetadata = {
  totalTokens?: number;
};
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<ChatMetadata, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  // get  messages
  const {
    messages = [],
    model,
    search = true,
  }: { messages: ChatMessage[]; model: ModelType } = await req.json();

  // check if messages are empty
  if (messages.length === 0) {
    return Response.json(
      {
        message: "Please provide messages",
        success: false,
      },
      {
        status: 404,
      },
    );
  }

  try {
    // stream text
    const result = streamText({
      model: customProviderRegistry.languageModel(
        (model?.id || modelList[0].id) as Parameters<
          typeof customProviderRegistry.languageModel
        >[0],
      ),
      messages: await convertToModelMessages(messages),
      ...(search ? tools : {}),
      stopWhen: stepCountIs(3),
      system: `You are a helpful assistant with access to a knowledge base. 
          When users ask questions, search the knowledge base for relevant information.
          Always search before answering if the question might relate to uploaded documents.
          Base your answers on the search results when available. Give concise answers that correctly answer what the user is asking for. Do not flood them with all the information from the search results.
          try to be efficient in framing the query by providing more rated info and do not call the search tool more than twice
          if no relevant information is found in the knowledge base, say so`,
    });

    return result.toUIMessageStreamResponse({
      sendReasoning: true,
      onError(error: any) {
        if (error && typeof error === "object" && error.responseBody) {
          try {
            const parsed = JSON.parse(error.responseBody);
            if (parsed.error) return parsed.error;
          } catch {
            return String(error.responseBody);
          }
        }
        return error instanceof Error ? error.message : "Something went wrong";
      },
      // attach some usage info to the message
      messageMetadata: ({ part }) => {
        if (part.type === "finish") {
          return {
            totalTokens: part?.totalUsage?.totalTokens,
          };
        }
      },
    });
  } catch (error) {
    console.log(error);
    return Response.json(
      {
        message:
          (error as Error)?.message ?? "Something went wrong try again later",
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
