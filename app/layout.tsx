import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://domusjulia.cl'),
  title: 'Constructora DOMA | Arquitectura, construcción y remodelación en Concepción',
  description: 'Constructora DOMA diseña, construye y remodela espacios en Concepción y la Región del Biobío. Arquitectura, diseño de interiores, paisajismo, cámaras de seguridad y proyectos personalizados.',
  keywords: [
    'constructora en Concepción',
    'arquitectura en Concepción',
    'diseño de interiores en Concepción',
    'diseño de espacios Concepción',
    'remodelaciones en Concepción',
    'empresa de remodelaciones Concepción',
    'paisajismo en Concepción',
    'cámaras de seguridad Concepción',
    'remodelación de casas en Concepción',
    'interiorismo en Concepción Chile',
    'decoración de interiores Concepción',
    'diseño de ambientes Concepción',
    'arquitectura interior Concepción',
    'proyectos de remodelación Biobío',
    'constructora en Concepción',
    'construcción de casas en Concepción',
    'domótica en Concepción',
    'automatización de casas Concepción',
    'seguridad para casas Concepción',
  ],
  authors: [{ name: 'Constructora DOMA' }],
  creator: 'Constructora DOMA',
  publisher: 'Constructora DOMA',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Constructora DOMA | Arquitectura, construcción y remodelación en Concepción',
    description: 'Arquitectura, remodelación, diseño de interiores, paisajismo y cámaras de seguridad en Concepción y la Región del Biobío. Conoce Constructora DOMA.',
    url: 'https://domusjulia.cl',
    siteName: 'Constructora DOMA',
    locale: 'es_CL',
    type: 'website',
  },
  robots: { index: true, follow: true },
}
export const viewport: Viewport = { width: 'device-width', initialScale: 1, maximumScale: 1, themeColor: '#f4f2ed' }
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="es"><body>{children}</body></html> }
