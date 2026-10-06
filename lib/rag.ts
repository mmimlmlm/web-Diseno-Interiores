import { createEmbedding } from './openai'
import { supabaseRpc } from './supabase'

export type KnowledgeMatch = {
  chunk_id: string
  content: string
  metadata: Record<string, unknown>
  similarity: number
}

export async function retrieveKnowledge(query: string) {
  try {
    const embedding = await createEmbedding(query)
    return await supabaseRpc<KnowledgeMatch[]>('match_doma_knowledge', {
      query_embedding: embedding,
      match_threshold: 0.72,
      match_count: 6,
    })
  } catch {
    return []
  }
}

export function formatKnowledgeContext(matches: KnowledgeMatch[]) {
  if (!matches.length) return 'No se recuperó información relevante desde la base de conocimiento de DOMA.'
  return matches.map((match, index) => {
    const metadata = Object.entries(match.metadata ?? {}).map(([key, value]) => `${key}: ${String(value)}`).join('; ')
    return `[Fuente ${index + 1} | similitud ${match.similarity.toFixed(3)} | ${metadata}]\n${match.content}`
  }).join('\n\n')
}
