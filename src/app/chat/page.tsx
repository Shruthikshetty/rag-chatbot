"use client";

import { useChat } from "@ai-sdk/react";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
  Message,
  MessageAction,
  MessageActions,
  MessageContent,
} from "@/components/ai-elements/message";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
  PromptInput,
  PromptInputBody,
  PromptInputButton,
  PromptInputFooter,
  type PromptInputMessage,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import MessageParts from "@/components/message-parts";
import ModelItem from "@/components/model-item";
import StarterMessage from "@/components/starter-message";
import { Spinner } from "@/components/ui/spinner";
import { chefList, modelList } from "../api/chat/model";
import type { ChatMessage } from "../api/chat/route";
import { CopyIcon, GlobeIcon, RefreshCcwIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState(modelList[0]);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [knowledgeSearch, setKnowledgeSearch] = useState(true);
  // hook to manage the chat state
  const { messages, sendMessage, status, stop, error } = useChat<ChatMessage>();

  // handles the submit
  const handleSubmit = (message: PromptInputMessage) => {
    if (!message.text.trim()) return;
    sendMessage(
      {
        text: message.text,
      },
      {
        body: {
          model,
          search: knowledgeSearch,
        },
      },
    );
    // clear our input
    setInput("");
  };

  // handles the copy of a message response
  const handleCopy = (message: ChatMessage) => {
    const textToCopy = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n");
    try {
      navigator.clipboard.writeText(textToCopy);
    } catch {
      console.error("failed to copy");
    }
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
                {message.role === "assistant" && (
                  <MessageActions className="w-full justify-end">
                    <MessageAction
                      className="active:scale-95 group"
                      label="Copy"
                      onClick={() => handleCopy(message)}
                      tooltip="Copy to clipboard"
                    >
                      <CopyIcon className="transition-colors group-active:fill-foreground" />
                    </MessageAction>
                  </MessageActions>
                )}
              </Message>
            ))}
            {status === "streaming" || status === "submitted" ? (
              <Spinner />
            ) : null}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>
        {error ? (
          <p className="text-red-500 text-center">{error.message}</p>
        ) : null}

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
              {/* knowledge base search button */}
              <PromptInputButton
                className={cn(
                  "border",
                  knowledgeSearch ? "text-foreground" : "",
                )}
                onClick={() => setKnowledgeSearch(!knowledgeSearch)}
              >
                <GlobeIcon size={16} />
                <span>Search</span>
              </PromptInputButton>
              {/* model selector */}
              <ModelSelector
                onOpenChange={setModelSelectorOpen}
                open={modelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <PromptInputButton className="border">
                    <ModelSelectorLogo provider={model.chefSlug} />

                    {model.name && (
                      <ModelSelectorName>{model.name}</ModelSelectorName>
                    )}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {chefList.map((chef) => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {modelList
                          .filter((m) => m.chef === chef)
                          .map((m) => (
                            <ModelItem
                              key={m.id}
                              model={m}
                              onSelect={setModel}
                              selectedModel={model}
                            />
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector>
            </PromptInputTools>
            <PromptInputSubmit
              disabled={status === "submitted"}
              status={status}
              onStop={() => {
                stop();
              }}
            />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
