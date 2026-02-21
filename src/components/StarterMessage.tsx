"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const StarterMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto px-4">
      <h1 className="text-4xl font-extrabold text-foreground mb-4 text-center tracking-tight">
        Chat with your data
      </h1>

      <p className="text-muted-foreground text-center mb-8 text-lg">
        Upload your PDF documents to start asking questions and uncovering
        insights in seconds.
      </p>

      <Link href="/upload">
        <Button
          size="lg"
          className="gap-2 text-md font-semibold px-8 shadow-sm transition-all hover:shadow-md"
        >
          Upload PDF
          <ArrowRight className="w-5 h-5" />
        </Button>
      </Link>
    </div>
  );
};

export default StarterMessage;
