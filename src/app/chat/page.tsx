"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputBody,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import MessageParts from "@/components/message-parts";
import StarterMessage from "@/components/starter-message";
import { Spinner } from "@/components/ui/spinner";
import { ChatMessage } from "../api/chat/route";

export default function ChatPage() {
  const [input, setInput] = useState("");
  // hook to manage the chat state
  const { messages, sendMessage, status } = useChat<ChatMessage>();

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
            {messages.map((message, index) => (
              <Message key={message.id} from={message.role}>
                <MessageContent>
                  <MessageParts
                    message={message}
                    isStreaming={status === "streaming"}
                    isLastMessage={index === messages.length - 1}
                  />
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
