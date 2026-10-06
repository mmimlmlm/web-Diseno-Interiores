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
}

main()
