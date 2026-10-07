import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function loadEnvLocal() {
  const file = path.join(root, '.env.local')
  return Object.fromEntries(
    fs
      .readFileSync(file, 'utf8')
      .split(/\r?\n/)
      .filter((line) => line && !line.startsWith('#'))
      .map((line) => {
        const index = line.indexOf('=')
        return [line.slice(0, index), line.slice(index + 1)]
      }),
  )
}

async function main() {
  const env = loadEnvLocal()
  const url = env.SUPABASE_URL?.replace(/\/$/, '')
  const key = env.SUPABASE_SERVICE_ROLE_KEY
  const rpc = await fetch(`${url}/rest/v1/rpc/match_doma_knowledge`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query_embedding: Array.from({ length: 1536 }, () => 0),
      match_threshold: 0.99,
      match_count: 1,
    }),
  })
  console.log('match_doma_knowledge:', rpc.status, rpc.statusText)
  if (!rpc.ok) throw new Error(`No se pudo consultar la búsqueda: ${await rpc.text()}`)
  const conv = await fetch(`${url}/rest/v1/doma_conversations`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=ignore-duplicates,return=minimal',
    },
    body: JSON.stringify({ id: 'schema-check-12345678' }),
  })
  console.log('doma_conversations:', conv.status, conv.statusText)
  if (!conv.ok) throw new Error(`No se pudo crear la conversación de prueba: ${await conv.text()}`)

  const lead = await fetch(`${url}/rest/v1/doma_leads?on_conflict=conversation_id`, {
    method: 'POST',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
      Prefer: 'resolution=merge-duplicates,return=minimal',
    },
    body: JSON.stringify({
      conversation_id: 'schema-check-12345678',
      name: 'Prueba de esquema',
      project_type: 'paisajismo',
    }),
  })
  console.log('doma_leads:', lead.status, lead.statusText)
  if (!lead.ok) throw new Error(`No se pudo crear el cliente de prueba: ${await lead.text()}`)

  const cleanup = await fetch(`${url}/rest/v1/doma_conversations?id=eq.schema-check-12345678`, {
    method: 'DELETE',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      Prefer: 'return=minimal',
    },
  })
  if (!cleanup.ok) throw new Error(`No se pudo limpiar la prueba: ${await cleanup.text()}`)
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
