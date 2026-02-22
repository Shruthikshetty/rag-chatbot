import { cosineDistance, desc, gt, sql } from "drizzle-orm";
import { db } from "./db.config";
import { documents } from "./db.schema";
import { generateEmbedding } from "./embeddings";

/**
 *
 * @param query the text that user is searching for
 * @param limit the number of results to return
 * @param threshold the min threshold for the similarity
 */
export async function searchDocuments(
  query: string,
  limit: number = 5,
  threshold: number = 0.5,
) {
  // convert search query to embedding
  const embedding = await generateEmbedding(query);
  // get the similarity of this embedding with the embeddings from our db (cosineDistance  calculates disimailarities hence we do 1 - cosineDistance)
  const similarity = sql<number>`1 - ${cosineDistance(documents.embedding, embedding)}`; // sql fro raw sql

  const similarDocuments = await db
    .select({
      id: documents.id,
      content: documents.content,
      similarity,
    })
    .from(documents)
    .where(gt(similarity, threshold)) // above 0.5 similarity
    .orderBy(desc(similarity))
    .limit(limit);

  return similarDocuments;
}
