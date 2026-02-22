"use server";

import { PDFParse } from "pdf-parse";
import { chunkContent } from "@/lib/chunking";
import { db } from "@/lib/db.config";
import { documents } from "@/lib/db.schema";
import { generateEmbeddings } from "@/lib/embeddings";

// used to process pdf files its important to split pd data into chunks
export async function processPDF(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;

    // array buffer
    const bytes = await file.arrayBuffer();
    // uint8 array
    const uint8Array = new Uint8Array(bytes);
    const parser = new PDFParse(uint8Array);
    // pdf parse
    const data = await parser.getText();

    if (!data.text || data.text.trim().length === 0) {
      return { success: false, error: "PDF is empty" };
    }

    // generate chunks
    const chunks = await chunkContent(data.text);
    // generate embeddings
    const embeddings = await generateEmbeddings(chunks);

    const records = chunks.map((chunk, index) => ({
      content: chunk,
      embedding: embeddings[index],
    }));

    // insert all records
    await db.insert(documents).values(records);

    return {
      success: true,
      message: `PDF processed successfully chunks ${records.length}`,
    };
  } catch (error) {
    console.error("Error processing PDF:", error);
    return { success: false, error: "Failed to process PDF" };
  }
}
