"use client";

import { useChat } from "@ai-sdk/react";
import { memo, useCallback, useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent } from "@/components/ai-elements/message";
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
import StarterMessage from "@/components/starter-message";
import { Spinner } from "@/components/ui/spinner";
import type { ChatMessage } from "../api/chat/route";
import {
  ModelSelector,
  ModelSelectorContent,
  ModelSelectorEmpty,
  ModelSelectorGroup,
  ModelSelectorInput,
  ModelSelectorItem,
  ModelSelectorList,
  ModelSelectorLogo,
  ModelSelectorLogoGroup,
  ModelSelectorName,
  ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import { CheckIcon } from "lucide-react";

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

  // const ModelItem = memo(({ model, selectedModel, onSelect }: any) => {
  //   const handleSelect = useCallback(
  //     () => onSelect(model.id),
  //     [onSelect, model.id],
  //   );
  //   return (
  //     <ModelSelectorItem
  //       key={model.id}
  //       onSelect={handleSelect}
  //       value={model.id}
  //     >
  //       <ModelSelectorLogo provider={model.chefSlug} />
  //       <ModelSelectorName>{model.name}</ModelSelectorName>
  //       <ModelSelectorLogoGroup>
  //         {model.providers.map((provider: string) => (
  //           <ModelSelectorLogo key={provider} provider={provider} />
  //         ))}
  //       </ModelSelectorLogoGroup>
  //       {selectedModel === model.id ? (
  //         <CheckIcon className="ml-auto size-4" />
  //       ) : (
  //         <div className="ml-auto size-4" />
  //       )}
  //     </ModelSelectorItem>
  //   );
  // });

  // ModelItem.displayName = "ModelItem";

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
              {/* <ModelSelector
              // onOpenChange={setModelSelectorOpen}
              // open={modelSelectorOpen}
              >
                <ModelSelectorTrigger asChild>
                  <PromptInputButton>
                    <ModelSelectorLogo provider={models[0].chefSlug} />

                    {models[0].name && (
                      <ModelSelectorName>{models[0].name}</ModelSelectorName>
                    )}
                  </PromptInputButton>
                </ModelSelectorTrigger>
                <ModelSelectorContent>
                  <ModelSelectorInput placeholder="Search models..." />
                  <ModelSelectorList>
                    <ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
                    {["OpenAI", "Anthropic", "Google"].map((chef) => (
                      <ModelSelectorGroup heading={chef} key={chef}>
                        {models
                          .filter((m) => m.chef === chef)
                          .map((m) => (
                            <ModelItem
                              key={m.id}
                              m={m}
                              // onSelect={handleModelSelect}
                              // selectedModel={model}
                            />
                          ))}
                      </ModelSelectorGroup>
                    ))}
                  </ModelSelectorList>
                </ModelSelectorContent>
              </ModelSelector> */}
              {/* Model selector , web search etc */}
            </PromptInputTools>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
}
