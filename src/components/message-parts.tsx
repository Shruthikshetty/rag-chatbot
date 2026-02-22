"use client";
import { Bot } from "lucide-react";
import { MessageResponse } from "./ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "./ai-elements/reasoning";
import { ChatMessage } from "@/app/api/chat/route";
import { Fragment } from "react";
import { Shimmer } from "./ai-elements/shimmer";

const MessageParts = ({
  message,
  isLastMessage,
  isStreaming,
}: {
  message: ChatMessage;
  isLastMessage: boolean;
  isStreaming: boolean;
}) => {
  // consolidate all the reasoning
  const reasoning = message.parts.filter((part) => part.type === "reasoning");
  // get the reasoning text
  const reasoningText = reasoning.map((part) => part.text).join("\n\n");
  const hasReasoning = reasoningText.trim()?.length > 0;
  // Check if reasoning is still streaming (last part is reasoning on last message)
  const lastPart = message.parts.at(-1);
  const isReasoningStreaming =
    isLastMessage && isStreaming && lastPart?.type === "reasoning";
  return (
    <>
      {/* role based icon */}
      {message.role === "assistant" ? (
        <Bot className="text-foreground" />
      ) : null}

      {/* reasoning */}
      {hasReasoning ? (
        <Reasoning className="w-full" isStreaming={isReasoningStreaming}>
          <ReasoningTrigger />
          <ReasoningContent>{reasoningText}</ReasoningContent>
        </Reasoning>
      ) : null}

      {/*rest of the message parts */}
      {message.parts.map((part, index) => {
        switch (part.type) {
          case "tool-searchKnowledgeBase":
            switch (part.state) {
              case "input-available":
              case "input-streaming":
                return (
                  <Shimmer key={`${message.id}-${index}`}>
                    searching knowledge base...
                  </Shimmer>
                );
              default:
                return null;
            }
          case "text":
            return (
              <MessageResponse key={`${message.id}-${index}`}>
                {part.text}
              </MessageResponse>
            );
          default:
            return null;
        }
      })}
    </>
  );
};

export default MessageParts;
