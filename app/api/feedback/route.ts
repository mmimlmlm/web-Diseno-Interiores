import { NextResponse } from 'next/server'

const MAX_FILES = 5
const MAX_FILE_SIZE = 8 * 1024 * 1024
const allowedTypes = new Set(['image/jpeg', 'image/png', 'image/webp'])

function getConfig() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, '')
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Supabase server credentials are not configured')
  return { url, key }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const name = String(formData.get('name') ?? '').trim()
    const comment = String(formData.get('comment') ?? '').trim()
    const files = formData.getAll('photos').filter((value): value is File => value instanceof File && value.size > 0)

    if (comment.length < 10 || comment.length > 2000) {
      return NextResponse.json({ error: 'El comentario debe tener entre 10 y 2.000 caracteres.' }, { status: 400 })
    }
    if (name.length > 120) return NextResponse.json({ error: 'El nombre es demasiado largo.' }, { status: 400 })
    if (files.length > MAX_FILES) return NextResponse.json({ error: `Puedes subir hasta ${MAX_FILES} fotos.` }, { status: 400 })
    if (files.some((file) => !allowedTypes.has(file.type) || file.size > MAX_FILE_SIZE)) {
      return NextResponse.json({ error: 'Usa fotos JPG, PNG o WebP de hasta 8 MB cada una.' }, { status: 400 })
    }

    const { url, key } = getConfig()
    const headers = { apikey: key, Authorization: `Bearer ${key}` }
    const photoPaths: string[] = []

    for (const file of files) {
      const path = `${crypto.randomUUID()}-${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
      const upload = await fetch(`${url}/storage/v1/object/doma-feedback/${path}`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': file.type, 'x-upsert': 'false' },
        body: await file.arrayBuffer(),
      })
      if (!upload.ok) throw new Error(`Photo upload failed: ${upload.status}`)
      photoPaths.push(path)
    }

    const insert = await fetch(`${url}/rest/v1/doma_feedback`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json', Prefer: 'return=minimal' },
      body: JSON.stringify({ name: name || null, comment, photo_paths: photoPaths }),
    })
    if (!insert.ok) throw new Error(`Feedback insert failed: ${insert.status}`)

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[doma] feedback submission failed', error)
    return NextResponse.json({ error: 'No pudimos guardar tu comentario. Inténtalo nuevamente.' }, { status: 500 })
  }
}
