import { embed, embedMany } from "ai";
import { openai } from "@ai-sdk/openai";

// used for embedding a single text
export async function generateEmbedding(text: string) {
  const input = text.replace("\n", " ");

  const { embedding } = await embed({
    model: openai.embedding("text-embedding-3-small"),
    value: input,
  });

  return embedding;
}

// used for batched embeddings
export async function generateEmbeddings(texts: string[]) {
  const inputs = texts.map((text) => text.replace("\n", " "));

  const { embeddings } = await embedMany({
    model: openai.embedding("text-embedding-3-small"),
    values: inputs,
    maxParallelCalls: 2,
  });

  return embeddings;
}
