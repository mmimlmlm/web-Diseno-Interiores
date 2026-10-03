import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LUMEN — Interiorismo, decoración y seguridad',
  description: 'LUMEN diseña espacios con carácter e integra soluciones de seguridad discretas para hogares, oficinas y comercios en Chile.',
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#f4f2ed' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html> }
