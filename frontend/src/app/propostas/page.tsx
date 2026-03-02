'use client'
import { useState, useEffect, useCallback } from 'react'
import {
  Plus, Search, Pencil, Trash2, FileText, Send, ExternalLink,
  MessageSquare, Copy
} from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'
import PageHeader from '@/components/ui/PageHeader'
import ProposalForm from '@/components/proposals/ProposalForm'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { proposalsApi, clientsApi } from '@/services/api'
import { formatCurrency, formatDate, statusLabel, statusClass, cn } from '@/lib/utils'
import type { Proposal, Client } from '@/types'
import { getUser } from '@/lib/auth'

const STATUS_FILTERS = [
  { value: '', label: 'Todas' },
  { value: 'draft', label: 'Rascunho' },
  { value: 'sent', label: 'Enviadas' },
  { value: 'approved', label: 'Aprovadas' },
  { value: 'rejected', label: 'Reprovadas' },
  { value: 'expired', label: 'Expiradas' },
]

export default function PropostasPage() {
  useAuthGuard()
  const [proposals, setProposals] = useState<Proposal[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editProposal, setEditProposal] = useState<Proposal | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [sendId, setSendId] = useState<number | null>(null)
  const [copiedId, setCopiedId] = useState<number | null>(null)
  const [sendMode, setSendMode] = useState<'send' | 'resend'>('send')

  const load = useCallback(async () => {
    try {
      const [pRes, cRes] = await Promise.all([
        proposalsApi.list({ status: statusFilter || undefined }),
        clientsApi.list(),
      ])
      setProposals(pRes.data)
      setClients(cRes.data)
    } catch {
      setProposals([])
    } finally {
      setLoading(false)
    }
  }, [statusFilter])

  useEffect(() => { load() }, [load])

  const filtered = proposals.filter((p) => {
    const matchStatus = !statusFilter || p.status === statusFilter
    const matchSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      (p.client?.name || clients.find((c) => c.id === p.client_id)?.name || '')
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      p.number?.includes(search)
    return matchStatus && matchSearch
  })

  const handleDelete = async () => {
    if (!deleteId) return
    await proposalsApi.delete(deleteId)
    setDeleteId(null)
    load()
  }

  const handleSend = async () => {
    if (!sendId) return
    try {
      await proposalsApi.send(sendId)
      setSendId(null)
      load()
    } catch {}
  }

  const copyPublicLink = async (p: Proposal) => {
    if (!p.public_token) return
    const url = `${window.location.origin}/proposta/${p.public_token}`
    await navigator.clipboard.writeText(url)
    setCopiedId(p.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const openWhatsApp = (p: Proposal) => {
    const user = getUser()
    const resolvedClient = p.client || clients.find((c) => c.id === p.client_id)
    const phone = resolvedClient?.phone?.replace(/\D/g, '')
    let msg = user?.whatsapp_template || 'Olá {cliente}, segue sua proposta: {link}'
    const link = p.public_token ? `${window.location.origin}/proposta/${p.public_token}` : ''
    msg = msg
      .replace('{cliente}', resolvedClient?.name || '')
      .replace('{proposta}', p.title)
      .replace('{valor}', formatCurrency(p.total))
      .replace('{link}', link)
    const waUrl = phone
      ? `https://wa.me/55${phone}?text=${encodeURIComponent(msg)}`
      : `https://wa.me/?text=${encodeURIComponent(msg)}`
    window.open(waUrl, '_blank')
  }

  return (
    <AppLayout>
      <div className="p-8">
        <PageHeader
          title="Propostas"
          subtitle={`${proposals.length} propostas`}
          action={
            <Button onClick={() => { setEditProposal(null); setFormOpen(true) }}>
              <Plus size={15} /> Nova Proposta
            </Button>
          }
        />

        <Card>
          {/* Filters */}
          <div className="px-5 py-4 border-b border-slate-50 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar propostas..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {STATUS_FILTERS.map((sf) => (
                <button
                  key={sf.value}
                  onClick={() => setStatusFilter(sf.value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
                    statusFilter === sf.value
                      ? 'bg-teal-600 text-white'
                      : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                  )}
                >
                  {sf.label}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-slate-400">Carregando...</div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center">
                <FileText size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Nenhuma proposta encontrada</p>
                <Button onClick={() => { setEditProposal(null); setFormOpen(true) }} variant="outline" size="sm" className="mt-4">
                  <Plus size={14} /> Nova proposta
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50">
                    {['#', 'Título', 'Cliente', 'Valor Total', 'Validade', 'Status', 'Ações'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => {
                    const resolvedClient = p.client || clients.find((c) => c.id === p.client_id)
                    return (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 group">
                      <td className="px-5 py-3.5 text-slate-400 text-xs font-mono">#{p.number}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-medium text-slate-700">{p.title}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">{resolvedClient?.name || '—'}</td>
                      <td className="px-5 py-3.5 font-semibold text-slate-700">{formatCurrency(p.total)}</td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(p.valid_until)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`badge ${statusClass(p.status)}`}>{statusLabel(p.status)}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          {/* Edit */}
                          <button
                            onClick={() => { setEditProposal(p); setFormOpen(true) }}
                            title="Editar"
                            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-teal-600 transition-colors"
                          >
                            <Pencil size={13} />
                          </button>
                          {/* Send */}
                          <button
                            onClick={() => {
                              setSendId(p.id)
                              setSendMode(p.status === 'draft' ? 'send' : 'resend')
                            }}
                            title={p.status === 'draft' ? 'Enviar proposta' : 'Reenviar proposta'}
                            className="p-1.5 hover:bg-blue-50 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                          >
                            <Send size={13} />
                          </button>
                          {/* Copy link */}
                          {p.public_token && (
                            <button
                              onClick={() => copyPublicLink(p)}
                              title="Copiar link público"
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              {copiedId === p.id ? <span className="text-teal-500 text-[10px] font-semibold">OK!</span> : <Copy size={13} />}
                            </button>
                          )}
                          {/* WhatsApp */}
                          {p.status !== 'draft' && (
                            <button
                              onClick={() => openWhatsApp(p)}
                              title="Enviar por WhatsApp"
                              className="p-1.5 hover:bg-green-50 rounded-lg text-slate-400 hover:text-green-600 transition-colors"
                            >
                              <MessageSquare size={13} />
                            </button>
                          )}
                          {/* View public */}
                          {p.public_token && (
                            <a
                              href={`/proposta/${p.public_token}`}
                              target="_blank"
                              title="Ver proposta pública"
                              className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                            >
                              <ExternalLink size={13} />
                            </a>
                          )}
                          {/* Delete */}
                          <button
                            onClick={() => setDeleteId(p.id)}
                            className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    )
                  })}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Proposal Form Modal */}
      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editProposal ? 'Editar Proposta' : 'Nova Proposta'} size="xl">
        <ProposalForm
          proposal={editProposal}
          clients={clients}
          onSuccess={() => { setFormOpen(false); load() }}
          onCancel={() => setFormOpen(false)}
        />
      </Modal>

      {/* Send Modal */}
      <Modal open={sendId !== null} onClose={() => setSendId(null)} title={sendMode === 'send' ? 'Enviar Proposta' : 'Reenviar Proposta'} size="sm">
        <p className="text-sm text-slate-600 mb-6">
          {sendMode === 'send'
            ? 'Ao enviar, o status da proposta será alterado para "Enviada" e um link público será gerado para o cliente aprovar ou reprovar.'
            : 'Ao reenviar, a proposta voltará para "Enviada" para permitir nova aprovação/reprovação pelo cliente.'}
        </p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setSendId(null)} className="flex-1">Cancelar</Button>
          <Button onClick={handleSend} className="flex-1">
            <Send size={14} /> {sendMode === 'send' ? 'Enviar' : 'Reenviar'}
          </Button>
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Excluir Proposta" size="sm">
        <p className="text-sm text-slate-600 mb-6">Tem certeza que deseja excluir esta proposta?</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Excluir</Button>
        </div>
      </Modal>
    </AppLayout>
  )
}
