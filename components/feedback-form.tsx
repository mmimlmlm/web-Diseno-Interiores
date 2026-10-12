'use client'

import { ChangeEvent, FormEvent, useRef, useState } from 'react'
import { Check, ImagePlus, Loader2, Send, X } from 'lucide-react'

const MAX_FILES = 5

export function FeedbackForm() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  function chooseFiles(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? [])
    setFiles((current) => [...current, ...selected].slice(0, MAX_FILES))
    event.target.value = ''
  }

  function removeFile(index: number) {
    setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (status === 'loading') return
    setStatus('loading')
    setError('')
    const body = new FormData()
    body.append('name', name)
    body.append('comment', comment)
    files.forEach((file) => body.append('photos', file))

    try {
      const response = await fetch('/api/feedback', { method: 'POST', body })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error)
      setStatus('success')
      setName('')
      setComment('')
      setFiles([])
    } catch (submissionError) {
      setStatus('error')
      setError(submissionError instanceof Error ? submissionError.message : 'No pudimos enviar tu comentario.')
    }
  }

  if (status === 'success') return <div className="flex min-h-72 flex-col items-center justify-center border border-[#c9a879]/50 bg-[#f4f2ed] p-8 text-center"><span className="mb-5 flex size-14 items-center justify-center rounded-full bg-[#1e1e1b] text-[#c9a879]"><Check size={24} /></span><h3 className="font-display text-3xl tracking-[-.04em]">Gracias por compartir.</h3><p className="mt-3 max-w-sm text-sm leading-6 text-[#68665f]">Recibimos tu comentario y las fotos de tu espacio. Nos inspira conocer tu experiencia.</p><button type="button" onClick={() => setStatus('idle')} className="mt-7 min-h-11 border-b border-[#1e1e1b] pb-2 text-xs uppercase tracking-[.18em]">Dejar otro comentario</button></div>

  return <form onSubmit={submit} className="border border-[#c9c2b7] bg-[#f4f2ed] p-5 md:p-8"><div className="grid gap-5 md:grid-cols-2"><label className="flex flex-col gap-2 text-xs uppercase tracking-[.15em]">Tu nombre <input value={name} onChange={(event) => setName(event.target.value)} maxLength={120} placeholder="Nombre (opcional)" className="min-h-12 border-b border-[#c9c2b7] bg-transparent px-0 text-base normal-case tracking-normal outline-none placeholder:text-[#9b978e] focus:border-[#1e1e1b]" /></label><label className="flex flex-col gap-2 text-xs uppercase tracking-[.15em]">Tu experiencia <textarea required value={comment} onChange={(event) => setComment(event.target.value)} minLength={10} maxLength={2000} rows={4} placeholder="¿Cómo fue trabajar con DOMA?" className="resize-none border-b border-[#c9c2b7] bg-transparent px-0 py-2 text-base normal-case tracking-normal outline-none placeholder:text-[#9b978e] focus:border-[#1e1e1b] md:col-span-2" /></label></div><div className="mt-7 flex flex-col gap-4"><input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={chooseFiles} className="sr-only" /><button type="button" onClick={() => inputRef.current?.click()} className="flex min-h-14 items-center justify-center gap-3 border border-dashed border-[#c9a879] px-4 text-xs uppercase tracking-[.15em] transition-colors hover:bg-[#ebe7df]"><ImagePlus size={18} /> Agregar fotos <span className="text-[#8a8880]">({files.length}/{MAX_FILES})</span></button>{files.length > 0 && <ul className="flex flex-wrap gap-2" aria-label="Fotos seleccionadas">{files.map((file, index) => <li key={`${file.name}-${index}`} className="flex max-w-full items-center gap-2 bg-[#ebe7df] px-3 py-2 text-xs"><span className="max-w-[190px] truncate">{file.name}</span><button type="button" onClick={() => removeFile(index)} aria-label={`Quitar ${file.name}`} className="flex size-7 shrink-0 items-center justify-center"><X size={14} /></button></li>)}</ul>}</div>{error && <p role="alert" className="mt-4 text-sm text-[#9a4e3f]">{error}</p>}<button type="submit" disabled={status === 'loading'} className="mt-7 flex min-h-12 w-full items-center justify-center gap-3 bg-[#1e1e1b] px-5 text-xs uppercase tracking-[.2em] text-[#f4f2ed] transition-opacity hover:opacity-80 disabled:opacity-50">{status === 'loading' ? <><Loader2 className="animate-spin" size={16} /> Enviando</> : <>Enviar comentario <Send size={16} /></>}</button><p className="mt-4 text-center text-[11px] leading-5 text-[#8a8880]">JPG, PNG o WebP · hasta 5 fotos de 8 MB cada una</p></form>
}
