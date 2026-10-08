import { NextResponse } from 'next/server'
import { createSocialContent, type ContentFormat } from '../../../lib/openai'

export const runtime = 'nodejs'
const formats: ContentFormat[] = ['publicación', 'historia', 'reel']

export async function POST(request: Request) {
  try {
    const body = await request.json() as Record<string, unknown>
    const format = body.format as ContentFormat
    const topic = typeof body.topic === 'string' ? body.topic.trim().slice(0, 300) : ''
    const audience = typeof body.audience === 'string' ? body.audience.trim().slice(0, 160) : ''
    const tone = typeof body.tone === 'string' ? body.tone.trim().slice(0, 120) : ''
    if (!formats.includes(format) || !topic) return NextResponse.json({ error: 'Indica un formato y un tema.' }, { status: 400 })
    const content = await createSocialContent({ format, topic, audience: audience || 'personas que buscan transformar su espacio', tone: tone || 'premium, cercano y claro' })
    return NextResponse.json(content)
  } catch {
    return NextResponse.json({ error: 'No pudimos generar contenido en este momento.' }, { status: 500 })
  }
}
