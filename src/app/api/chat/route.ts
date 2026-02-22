import { openai } from "@ai-sdk/openai";
import {
  convertToModelMessages,
  streamText,
  tool,
  type UIMessage,
  InferUITools,
  UIDataTypes,
  stepCountIs,
} from "ai";
import { z } from "zod";
import { searchDocuments } from "@/lib/search";

// all the tools are defined here
const tools = {
  searchKnowledgeBase: tool({
    description: "search the knowledge base for relevant documents",
    inputSchema: z.object({
      query: z.string().describe("The search query to fins relevant documents"),
    }),
    execute: async ({ query }) => {
      const results = await searchDocuments(query, 5, 0.4);

      if (results.length === 0) {
        return "No relevant information found in the database";
      }

      // format the results into string with index
      const formattedResult = results
        .map((result, index) => `[${index + 1}] ${result.content}`)
        .join("\n\n");

      return formattedResult;
    },
  }),
};

// types
export type ChatTools = InferUITools<typeof tools>;
export type ChatMessage = UIMessage<never, UIDataTypes, ChatTools>;

export async function POST(req: Request) {
  // get  messages
  const { messages = [] }: { messages: ChatMessage[] } = await req.json();

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
      model: openai("gpt-4.1-mini"),
      messages: await convertToModelMessages(messages),
      tools,
      stopWhen: stepCountIs(2),
      system: `You are a helpful assistant with access to a knowledge base. 
          When users ask questions, search the knowledge base for relevant information.
          Always search before answering if the question might relate to uploaded documents.
          Base your answers on the search results when available. Give concise answers that correctly answer what the user is asking for. Do not flood them with all the information from the search results.`,
    });

    // usage
    result.usage.then((usage) => {
      console.log(usage);
    });

    return result.toUIMessageStreamResponse();
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
