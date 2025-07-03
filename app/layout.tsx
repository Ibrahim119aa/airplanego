import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Airplane go',
  description: 'Created with v0',
  generator: 'Airplane go',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
