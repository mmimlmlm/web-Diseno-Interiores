const apiKey = process.env.OPENAI_API_KEY

function getKey() {
  if (!apiKey) throw new Error('OPENAI_API_KEY is not configured')
  return apiKey
}

async function openai<T>(path: string, body: Record<string, unknown>): Promise<T> {
  const response = await fetch(`https://api.openai.com/v1/${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${getKey()}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`OpenAI request failed: ${response.status}`)
  return response.json() as Promise<T>
}

export async function createEmbedding(input: string) {
  const result = await openai<{ data: Array<{ embedding: number[] }> }>('embeddings', {
    model: 'text-embedding-3-small', input,
  })
  return result.data[0].embedding
}

export async function createChatCompletion(messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>) {
  const result = await openai<{ choices: Array<{ message: { content: string } }> }>('chat/completions', {
    model: 'gpt-4o-mini', messages, temperature: 0.35, max_tokens: 600,
  })
  return result.choices[0]?.message.content?.trim() ?? ''
}

export function openAiIsConfigured() { return Boolean(apiKey) }
