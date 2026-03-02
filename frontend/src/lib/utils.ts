import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return '—'
  return new Intl.DateTimeFormat('pt-BR').format(new Date(date))
}

export function statusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: 'Rascunho',
    sent: 'Enviada',
    approved: 'Aprovada',
    rejected: 'Reprovada',
    expired: 'Expirada',
  }
  return map[status] || status
}

export function statusClass(status: string): string {
  const map: Record<string, string> = {
    draft: 'badge-draft',
    sent: 'badge-sent',
    approved: 'badge-approved',
    rejected: 'badge-rejected',
    expired: 'badge-expired',
  }
  return map[status] || 'badge-draft'
}
