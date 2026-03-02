'use client'
import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { CheckCircle, XCircle, FileText, Building, Calendar, Zap } from 'lucide-react'
import { publicApi } from '@/services/api'
import { formatCurrency, formatDate, statusLabel, statusClass } from '@/lib/utils'
import type { Proposal } from '@/types'
import Button from '@/components/ui/Button'
import Modal from '@/components/ui/Modal'

export default function PublicProposalPage() {
  const params = useParams()
  const token = params?.token as string
  const [proposal, setProposal] = useState<Proposal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [rejectOpen, setRejectOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [actionDone, setActionDone] = useState<'approved' | 'rejected' | null>(null)

  useEffect(() => {
    if (!token) return
    publicApi.getProposal(token)
      .then(r => setProposal(r.data))
      .catch(() => setError('Proposta não encontrada ou link inválido.'))
      .finally(() => setLoading(false))
  }, [token])

  const handleApprove = async () => {
    try {
      await publicApi.approve(token)
      setActionDone('approved')
      setProposal(prev => prev ? { ...prev, status: 'approved' } : prev)
    } catch {}
  }

  const handleReject = async () => {
    try {
      await publicApi.reject(token, rejectReason)
      setActionDone('rejected')
      setRejectOpen(false)
      setProposal(prev => prev ? { ...prev, status: 'rejected' } : prev)
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc]">
        <div className="animate-spin w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fc]">
        <div className="text-center max-w-md px-4">
          <FileText size={48} className="text-slate-200 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-slate-800 mb-2">Proposta não encontrada</h1>
          <p className="text-slate-500 text-sm">{error || 'Este link pode estar expirado ou inválido.'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f0f4f8]">
      {/* Header */}
      <header className="bg-white border-b border-slate-100 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
              <Zap size={14} className="text-white" />
            </div>
            <p className="text-slate-700 font-semibold text-sm">Proposta Flex</p>
          </div>
          <span className={`badge ${statusClass(proposal.status)}`}>{statusLabel(proposal.status)}</span>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        {/* Action Done Banner */}
        {actionDone === 'approved' && (
          <div className="bg-teal-50 border border-teal-200 rounded-2xl p-6 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} className="text-teal-600" />
            </div>
            <div>
              <h3 className="font-bold text-teal-800">Proposta aprovada!</h3>
              <p className="text-teal-600 text-sm mt-0.5">O fornecedor foi notificado. Entraremos em contato em breve.</p>
            </div>
          </div>
        )}
        {actionDone === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
              <XCircle size={24} className="text-red-500" />
            </div>
            <div>
              <h3 className="font-bold text-red-800">Proposta recusada</h3>
              <p className="text-red-600 text-sm mt-0.5">O fornecedor foi notificado.</p>
            </div>
          </div>
        )}

        {/* Proposal Card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden mb-4">
          {/* Title section */}
          <div className="bg-gradient-to-br from-[#1a2236] to-[#2d3b55] px-8 py-8">
            <p className="text-teal-400 text-xs font-semibold uppercase tracking-widest mb-2">Proposta Comercial #{proposal.number}</p>
            <h1 className="text-2xl font-bold text-white mb-1">{proposal.title}</h1>
            <p className="text-slate-400 text-sm">Preparada especialmente para você</p>
          </div>

          {/* Client + Info */}
          <div className="grid grid-cols-2 gap-0 border-b border-slate-100">
            <div className="px-8 py-5 border-r border-slate-100">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Cliente</p>
              <p className="font-semibold text-slate-800">{proposal.client?.name || '—'}</p>
              {proposal.client?.company && (
                <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Building size={12} />
                  {proposal.client.company}
                </p>
              )}
            </div>
            <div className="px-8 py-5">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wide mb-1">Válida até</p>
              <p className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar size={14} className="text-slate-400" />
                {formatDate(proposal.valid_until)}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="px-8 py-6">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">Itens</p>
            <div className="space-y-3">
              {proposal.items.map((item, i) => (
                <div key={i} className="flex items-start justify-between py-3 border-b border-slate-50 last:border-0">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{item.product_name}</p>
                    {item.description && <p className="text-sm text-slate-400 mt-0.5">{item.description}</p>}
                    <p className="text-xs text-slate-400 mt-1">
                      {item.quantity} × {formatCurrency(item.unit_price)}
                    </p>
                  </div>
                  <p className="font-semibold text-slate-700 ml-4">{formatCurrency(item.total)}</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="bg-teal-50 rounded-xl px-5 py-4 mt-4 flex items-center justify-between">
              <p className="font-semibold text-teal-800">Total</p>
              <p className="text-2xl font-bold text-teal-700">{formatCurrency(proposal.total)}</p>
            </div>
          </div>

          {/* Notes */}
          {proposal.notes && (
            <div className="px-8 pb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Observações</p>
              <p className="text-sm text-slate-600 bg-slate-50 rounded-xl p-4 leading-relaxed">{proposal.notes}</p>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        {proposal.status === 'sent' && !actionDone && (
          <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
            <p className="text-sm text-slate-600 mb-4 text-center">Você gostaria de aceitar esta proposta?</p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setRejectOpen(true)}
                className="flex-1 border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
              >
                <XCircle size={16} /> Recusar
              </Button>
              <Button onClick={handleApprove} className="flex-1">
                <CheckCircle size={16} /> Aceitar Proposta
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-xs text-slate-400 mt-6">
          Proposta gerada por Proposta Flex · {new Date().getFullYear()}
        </p>
      </main>

      {/* Reject Modal */}
      <Modal open={rejectOpen} onClose={() => setRejectOpen(false)} title="Recusar proposta" size="sm">
        <p className="text-sm text-slate-600 mb-4">Deseja compartilhar o motivo da recusa? (opcional)</p>
        <textarea
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Motivo da recusa..."
          rows={3}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400/20 focus:border-red-400 resize-none mb-4"
        />
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setRejectOpen(false)} className="flex-1">Cancelar</Button>
          <Button variant="danger" onClick={handleReject} className="flex-1">Confirmar recusa</Button>
        </div>
      </Modal>
    </div>
  )
}
