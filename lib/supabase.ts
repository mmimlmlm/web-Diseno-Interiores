const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

function config() {
  if (!url || !serviceRoleKey) throw new Error('Supabase server credentials are not configured')
  return { url, key: serviceRoleKey }
}

export async function supabaseRpc<T>(name: string, body: Record<string, unknown>): Promise<T> {
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: 'POST',
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase RPC failed: ${response.status}`)
  return response.json() as Promise<T>
}

export async function ensureConversation(id: string) {
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/doma_conversations`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({ id }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase conversation failed: ${response.status}`)
}

export async function insertConversationMessage(input: {
  conversationId: string
  role: 'user' | 'assistant'
  content: string
}) {
  const { url, key } = config()
  const response = await fetch(`${url}/rest/v1/doma_conversation_messages`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify({ conversation_id: input.conversationId, role: input.role, content: input.content }),
    cache: 'no-store',
  })
  if (!response.ok) throw new Error(`Supabase insert failed: ${response.status}`)
}

export function createConversationId(value: unknown) {
  return typeof value === 'string' && /^[a-zA-Z0-9_-]{8,100}$/.test(value) ? value : crypto.randomUUID()
}

export function supabaseIsConfigured() {
  return Boolean(url && serviceRoleKey)
}

export function safeLog(event: string, fields: Record<string, unknown> = {}) {
  console.info(`[doma] ${event}`, fields)
}

export function safeError(event: string) {
  console.error(`[doma] ${event}`)
}
