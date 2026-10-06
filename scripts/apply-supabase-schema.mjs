import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postgres from 'postgres'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function loadEnvLocal() {
  const file = path.join(root, '.env.local')
  if (!fs.existsSync(file)) return {}
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

function connectionString(env) {
  if (env.DATABASE_URL) return env.DATABASE_URL
  const password = env.SUPABASE_DB_PASSWORD
  const url = env.SUPABASE_URL?.replace(/\/$/, '')
  if (!password || !url) return null
  const ref = new URL(url).hostname.split('.')[0]
  return `postgresql://postgres:${encodeURIComponent(password)}@db.${ref}.supabase.co:5432/postgres`
}

async function main() {
  const env = loadEnvLocal()
  const connection = connectionString(env)
  if (!connection) {
    console.error(
      'Falta DATABASE_URL o SUPABASE_DB_PASSWORD en .env.local (Settings → Database → Database password en Supabase).',
    )
    process.exit(1)
  }

  const sqlText = fs.readFileSync(path.join(root, 'supabase', 'schema.sql'), 'utf8')
  const sql = postgres(connection, { ssl: 'require', max: 1 })
  try {
    await sql.unsafe(sqlText)
    console.log('Esquema aplicado correctamente en Supabase.')
  } finally {
    await sql.end({ timeout: 5 })
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
