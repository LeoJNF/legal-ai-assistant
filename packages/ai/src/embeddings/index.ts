import { Pinecone } from '@pinecone-database/pinecone';
import { getEmbeddingsModel } from '../langchain/config';

let pineconeClient: Pinecone | null = null;

function getPineconeClient(): Pinecone {
  if (!pineconeClient) {
    pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY || '',
    });
  }
  return pineconeClient;
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = getEmbeddingsModel();
  const embeddings = await model.embedQuery(text);
  return embeddings;
}

export async function upsertDocumentEmbedding(
  documentId: string,
  text: string,
  metadata: Record<string, string>
): Promise<void> {
  const client = getPineconeClient();
  const index = client.index(process.env.PINECONE_INDEX || 'legal-documents');

  const embedding = await generateEmbedding(text);

  await index.upsert([
    {
      id: documentId,
      values: embedding,
      metadata,
    },
  ]);
}

export async function searchSimilarDocuments(
  query: string,
  topK = 5
): Promise<Array<{ id: string; score: number; metadata: Record<string, string> }>> {
  const client = getPineconeClient();
  const index = client.index(process.env.PINECONE_INDEX || 'legal-documents');

  const queryEmbedding = await generateEmbedding(query);

  const results = await index.query({
    vector: queryEmbedding,
    topK,
    includeMetadata: true,
  });

  return (results.matches || []).map((match) => ({
    id: match.id,
    score: match.score || 0,
    metadata: (match.metadata as Record<string, string>) || {},
  }));
}
