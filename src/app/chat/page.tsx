"use client";

import { useChat } from "@ai-sdk/react";
import {
  CopyIcon,
  GlobeIcon,
  Mic2,
  RefreshCcwIcon,
  Speaker,
  Volume2,
} from "lucide-react";
import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { chefList, modelList } from "../api/chat/model";
import type { ChatMessage } from "../api/chat/route";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const [model, setModel] = useState(modelList[0]);
  const [modelSelectorOpen, setModelSelectorOpen] = useState(false);
  const [knowledgeSearch, setKnowledgeSearch] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  // hook to manage the chat state
  const { messages, sendMessage, status, stop, error } = useChat<ChatMessage>();

  //clean up
  useEffect(() => {
    // This runs when the component unmounts
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

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
    // Extract text from parts
    const textToCopy = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n");

    try {
      // Copy to clipboard
      navigator.clipboard.writeText(textToCopy);
    } catch {
      console.error("failed to copy");
    }
  };

  // handle read messages
  const handleReadAloud = (message: ChatMessage) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }
    // Extract text from parts
    const textToRead = message.parts
      .filter((part) => part.type === "text")
      .map((part) => part.text)
      .join("\n\n");

    // Cancel any ongoing speech so they don't overlap
    window.speechSynthesis.cancel();

    // Create the "Utterance"
    const utterance = new SpeechSynthesisUtterance(textToRead);

    // Optional: Customize the voice
    utterance.rate = 1.0; // Speed (0.1 to 10)
    utterance.pitch = 1.0; // Pitch (0 to 2)
    utterance.volume = 1.0; // Volume (0 to 1)

    // Set the onstart, onend, and onerror handlers
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // Speak
    window.speechSynthesis.speak(utterance);
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
                      className="active:scale-95 transition-all"
                      label="Copy"
                      onClick={() => handleCopy(message)}
                      tooltip="Copy to clipboard"
                    >
                      <CopyIcon />
                    </MessageAction>
                    <MessageAction
                      className="active:scale-95 transition-all"
                      label={isSpeaking ? "Stop" : "Read Aloud"}
                      tooltip={isSpeaking ? "Stop speaking" : "Read aloud"}
                      onClick={() => handleReadAloud(message)}
                    >
                      <Volume2
                        className={cn(
                          "size-4",
                          isSpeaking ? "text-red-500" : "",
                        )}
                      />
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
