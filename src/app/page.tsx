"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Bot, ArrowRight } from "lucide-react";
import Logo from "./icon.svg";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-5rem)] p-6 bg-background">
      <div className="flex flex-col items-center text-center space-y-6 max-w-lg">
        {/* Placeholder for the bot logo we created */}
        <div className="p-4 bg-primary/10 rounded-full">
          <Image src={Logo} alt="Logo" width={64} height={64} />
        </div>

        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Welcome to RAG Chatbot
        </h1>

        <p className="text-lg text-muted-foreground">
          Your intelligent assistant powered by Retrieval-Augmented Generation.
          Ask questions, get insights, and explore your data interactively.
        </p>

        <div className="pt-4 flex gap-4">
          <Link href="/upload">
            <Button size="lg" className="gap-2 text-md font-medium">
              Upload PDF
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
          <Link href="/chat">
            <Button size="lg" className="gap-2 text-md font-medium">
              Start Chat
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
