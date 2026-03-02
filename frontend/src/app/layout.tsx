import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Proposta Flex',
  description: 'Sistema de gestão de propostas comerciais',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
