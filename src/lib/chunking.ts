import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 150, // mean each chunk will be 150 characters
  chunkOverlap: 20, // mean each chunk will overlap with the previous chunk by 20 characters
  separators: [" "],
});

// split the content into chunks
export async function chunkContent(content: string) {
  return textSplitter.splitText(content.trim());
}
