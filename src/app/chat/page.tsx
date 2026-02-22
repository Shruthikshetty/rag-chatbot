"use client";

import { useChat } from "@ai-sdk/react";
import { Bot } from "lucide-react";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageContent,
  MessageResponse,
} from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import StarterMessage from "@/components/StarterMessage";
import { Spinner } from "@/components/ui/spinner";

export default function ChatPage() {
  const [input, setInput] = useState("");
  // hook to manage the chat state
  const { messages, sendMessage, status } = useChat();

  // handles the submit
  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) return;
    sendMessage({
      text: message.text,
    });
    // clear our input
    setInput("");
  };

  return (
    <div className="max-w-4xl mx-auto  p-6 relative size-full h-[calc(100vh-5rem)] ">
      <div className="flex flex-col h-full">
        {messages.length === 0 ? <StarterMessage /> : null}
        {/* all the chat conversations */}
        <Conversation className="h-full">
          <ConversationContent>
            {messages.map((message) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  {message.role === "assistant" ? (
                    <Bot className="text-foreground" />
                  ) : null}
                  {message.parts.map((part, index) => {
                    switch (part.type) {
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
                </MessageContent>
              </Message>
            ))}
            {status === "streaming" || status === "submitted" ? (
              <Spinner />
            ) : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        {/* User input area */}
        <PromptInput className="mt-4" onSubmit={handleSubmit}>
          <PromptInputBody>
            <PromptInputTextarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <PromptInputTools>
              {/* Model selector , web search etc */}
            </PromptInputTools>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
