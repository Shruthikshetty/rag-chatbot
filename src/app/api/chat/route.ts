import { streamText, UIMessage, convertToModelMessages, tool } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  // get  messages
  const { messages = [] }: { messages: UIMessage[] } = await req.json();

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
