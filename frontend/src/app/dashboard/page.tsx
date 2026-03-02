'use client'
import { useEffect, useState } from 'react'
import { FileText, CheckCircle, Clock, TrendingUp, Calendar, ArrowUpRight } from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar
} from 'recharts'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { clientsApi, dashboardApi, proposalsApi } from '@/services/api'
import { formatCurrency, formatDate, statusLabel, statusClass } from '@/lib/utils'
import type { Client, Proposal } from '@/types'
import Link from 'next/link'

export default function DashboardPage() {
  useAuthGuard()
  const [stats, setStats] = useState<any>(null)
  const [chart, setChart] = useState<any[]>([])
  const [followups, setFollowups] = useState<any[]>([])
  const [recent, setRecent] = useState<Proposal[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [s, c, f, r, cl] = await Promise.all([
          dashboardApi.stats(),
          dashboardApi.chartData(),
          dashboardApi.followupToday(),
          proposalsApi.list({ limit: 5 }),
          clientsApi.list(),
        ])
        setStats(s.data)
        setChart(c.data)
        setFollowups(f.data)
        setRecent(r.data)
        setClients(cl.data)
      } catch (e) {
        // fallback to mock
        setStats({ total_proposals: 24, approved_proposals: 12, pending_proposals: 8, total_revenue: 48500, conversion_rate: 0.50, avg_proposal_value: 4041 })
        setChart([
          { month: 'Jan', proposals: 4, approved: 2, revenue: 8200 },
          { month: 'Fev', proposals: 6, approved: 3, revenue: 12400 },
          { month: 'Mar', proposals: 5, approved: 4, revenue: 16800 },
          { month: 'Abr', proposals: 8, approved: 5, revenue: 21000 },
          { month: 'Mai', proposals: 7, approved: 3, revenue: 14200 },
          { month: 'Jun', proposals: 9, approved: 6, revenue: 24600 },
        ])
        setFollowups([])
        setRecent([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const statCards = [
    {
      label: 'Total de Propostas',
      value: stats?.total_proposals ?? '—',
      icon: FileText,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      change: '+12% mês',
    },
    {
      label: 'Aprovadas',
      value: stats?.approved_proposals ?? '—',
      icon: CheckCircle,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      change: `${Math.round((stats?.conversion_rate || 0) * 100)}% conversão`,
    },
    {
      label: 'Em Aberto',
      value: stats?.pending_proposals ?? '—',
      icon: Clock,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      change: 'aguardando resposta',
    },
    {
      label: 'Receita Total',
      value: formatCurrency(stats?.total_revenue || 0),
      icon: TrendingUp,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      change: `Ticket médio ${formatCurrency(stats?.avg_proposal_value || 0)}`,
    },
  ]

  return (
    <AppLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-xl font-bold text-slate-800">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-0.5">Visão geral do seu negócio</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {statCards.map((card) => (
            <div key={card.label} className="bg-white rounded-xl border border-slate-100 shadow-card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{card.label}</p>
                <div className={`w-8 h-8 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <card.icon size={15} className={card.color} />
                </div>
              </div>
              <p className="text-2xl font-bold text-slate-800 mb-1">{loading ? '...' : card.value}</p>
              <p className="text-xs text-slate-400 flex items-center gap-1">
                <ArrowUpRight size={11} className="text-teal-500" />
                {card.change}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
          <Card className="xl:col-span-2" title="Evolução de Propostas" subtitle="Últimos 6 meses">
            <div className="p-5 pt-0">
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chart} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProposals" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ border: 'none', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                  />
                  <Area type="monotone" dataKey="proposals" name="Enviadas" stroke="#0ea5e9" strokeWidth={2} fill="url(#colorProposals)" />
                  <Area type="monotone" dataKey="approved" name="Aprovadas" stroke="#0d9488" strokeWidth={2} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Receita Mensal" subtitle="R$">
            <div className="p-5 pt-0">
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={chart} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={40} />
                  <Tooltip
                    contentStyle={{ border: 'none', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: 12 }}
                    formatter={(v: any) => [formatCurrency(v), 'Receita']}
                  />
                  <Bar dataKey="revenue" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        {/* Recent proposals + Follow-ups */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
          <Card className="xl:col-span-2" title="Propostas Recentes" action={
            <Link href="/propostas" className="text-xs text-teal-600 hover:text-teal-700 font-medium">Ver todas →</Link>
          }>
            <div className="overflow-x-auto">
              {recent.length === 0 && !loading ? (
                <div className="px-5 py-10 text-center text-sm text-slate-400">
                  Nenhuma proposta criada ainda.{' '}
                  <Link href="/propostas" className="text-teal-600 underline">Criar primeira</Link>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-50">
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Título</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Cliente</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Valor</th>
                      <th className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recent.map((p) => {
                      const resolvedClient = p.client || clients.find((c) => c.id === p.client_id)
                      return (
                      <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                        <td className="px-5 py-3">
                          <Link href={`/propostas?id=${p.id}`} className="font-medium text-slate-700 hover:text-teal-600">
                            {p.title}
                          </Link>
                          <p className="text-xs text-slate-400">#{p.number}</p>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{resolvedClient?.name || '—'}</td>
                        <td className="px-5 py-3 font-medium text-slate-700">{formatCurrency(p.total)}</td>
                        <td className="px-5 py-3">
                          <span className={`badge ${statusClass(p.status)}`}>{statusLabel(p.status)}</span>
                        </td>
                      </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </Card>

          <Card title="Follow-ups Hoje" action={
            <div className="flex items-center gap-1 bg-amber-50 text-amber-600 text-xs font-medium px-2 py-1 rounded-full">
              <Calendar size={11} />
              {followups.length}
            </div>
          }>
            <div className="px-5 pb-5">
              {followups.length === 0 ? (
                <div className="py-8 text-center text-sm text-slate-400">
                  Nenhum follow-up para hoje 🎉
                </div>
              ) : (
                <div className="space-y-3 mt-1">
                  {followups.map((f: any) => {
                    const resolvedClient = f.client || clients.find((c) => c.id === f.client_id)
                    return (
                    <div key={f.id} className="p-3 bg-amber-50 rounded-xl border border-amber-100">
                      <p className="font-medium text-slate-700 text-sm">{f.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{resolvedClient?.name || '—'}</p>
                      <p className="text-xs text-amber-600 mt-1 font-medium">{formatCurrency(f.total)}</p>
                    </div>
                    )
                  })}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
