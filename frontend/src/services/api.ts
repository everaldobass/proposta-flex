import axios from 'axios'
import { getToken, removeToken } from '@/lib/auth'
import type { ProposalStatus } from '@/types'

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      removeToken()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api

export const getApiErrorMessage = (error: any, fallback: string): string => {
  const detail = error?.response?.data?.detail

  if (typeof detail === 'string') return detail

  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === 'string') return item
        if (item && typeof item.msg === 'string') return item.msg
        return ''
      })
      .filter(Boolean)

    if (messages.length) return messages.join(', ')
  }

  if (detail && typeof detail === 'object') {
    if (typeof detail.msg === 'string') return detail.msg
    return fallback
  }

  return fallback
}

type BackendProduct = {
  id: number
  user_id: number
  type: 'produto' | 'servico'
  description: string
  value: number | string
  created_at?: string | null
}

type ProductPayload = {
  name: string
  description?: string
  price: number
  unit?: string
}

type BackendProposalItem = {
  id?: number
  proposal_id?: number
  product_id?: number | null
  description: string
  quantity: number | string
  unit_value: number | string
  total_value?: number | string
}

type BackendProposal = {
  id: number
  user_id: number
  client_id: number
  proposal_number: number
  title: string
  total_value: number | string
  status: string
  proposal_date: string
  followup_date?: string | null
  public_token?: string | null
  notes?: string | null
  items: BackendProposalItem[]
  client?: any
}

type BackendPublicProposal = {
  id: number
  proposal_number: number
  title: string
  total_value: number | string
  status: string
  proposal_date: string
  notes?: string | null
  items: BackendProposalItem[]
  client_name: string
  company_name?: string | null
}

type BackendDashboardStats = {
  total_clients: number
  total_proposals: number
  approved_proposals: number
  pending_proposals: number
  total_approved_value: number
}

type BackendFollowupProposal = {
  id: number
  title: string
  client_id: number
  total_value: number | string
  status: string
  followup_date?: string | null
  client?: any
}

type BackendChartPoint = {
  month: string
  proposals: number
  approved: number
  revenue: number
}

const mapBackendProductToFrontend = (product: BackendProduct) => {
  const [namePart, ...descriptionParts] = product.description.split(' - ')
  const extraDescription = descriptionParts.join(' - ')

  return {
    id: product.id,
    name: namePart || product.description,
    description: extraDescription || (product.type === 'servico' ? 'Serviço' : 'Produto'),
    price: Number(product.value),
    unit: product.type === 'servico' ? 'h' : 'un',
    created_at: product.created_at || '',
  }
}

const mapFrontendProductToBackend = (data: ProductPayload) => ({
  type: data.unit === 'h' ? 'servico' : 'produto',
  description: data.description?.trim()
    ? `${data.name} - ${data.description.trim()}`
    : data.name,
  value: Number(data.price),
})

const mapProposalStatusToFrontend = (status: string): ProposalStatus => {
  const normalized = status.toLowerCase()
  if (normalized === 'rascunho') return 'draft'
  if (normalized === 'enviado') return 'sent'
  if (normalized === 'aprovado') return 'approved'
  if (normalized === 'reprovado') return 'rejected'
  if (normalized === 'expirado') return 'expired'
  return 'draft'
}

const mapBackendProposalToFrontend = (proposal: BackendProposal) => ({
  id: proposal.id,
  number: String(proposal.proposal_number),
  title: proposal.title,
  client_id: proposal.client_id,
  client: proposal.client,
  status: mapProposalStatusToFrontend(proposal.status),
  valid_until: proposal.followup_date || proposal.proposal_date,
  notes: proposal.notes || undefined,
  items: (proposal.items || []).map((item) => ({
    id: item.id,
    product_id: item.product_id || undefined,
    product_name: item.description,
    description: item.description,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_value),
    total: Number(item.total_value ?? Number(item.quantity) * Number(item.unit_value)),
  })),
  total: Number(proposal.total_value),
  public_token: proposal.public_token || undefined,
  public_url: proposal.public_token ? `/proposta/${proposal.public_token}` : undefined,
  followup_date: proposal.followup_date || undefined,
  created_at: proposal.proposal_date,
  updated_at: proposal.proposal_date,
})

const mapBackendPublicProposalToFrontend = (proposal: BackendPublicProposal) => ({
  id: proposal.id,
  number: String(proposal.proposal_number),
  title: proposal.title,
  client_id: 0,
  client: {
    id: 0,
    name: proposal.client_name,
    company: proposal.company_name || undefined,
    created_at: proposal.proposal_date,
  },
  status: mapProposalStatusToFrontend(proposal.status),
  valid_until: proposal.proposal_date,
  notes: proposal.notes || undefined,
  items: (proposal.items || []).map((item) => ({
    id: item.id,
    product_id: item.product_id || undefined,
    product_name: item.description,
    description: item.description,
    quantity: Number(item.quantity),
    unit_price: Number(item.unit_value),
    total: Number(item.total_value ?? Number(item.quantity) * Number(item.unit_value)),
  })),
  total: Number(proposal.total_value),
  public_token: undefined,
  public_url: undefined,
  followup_date: undefined,
  created_at: proposal.proposal_date,
  updated_at: proposal.proposal_date,
})

// Auth
export const authApi = {
  login: (email: string, password: string) =>
    api.post(
      '/api/auth/login',
      new URLSearchParams({
        username: email,
        password,
      }),
      {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      }
    ),
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/api/auth/register', data),
  me: () => api.get('/api/auth/me'),
  updateProfile: (data: any) => api.put('/api/auth/me', data),
  changePassword: (data: { current_password: string; new_password: string }) =>
    api.put('/api/auth/password', data),
}

// Clients
export const clientsApi = {
  list: (search?: string) => api.get('/api/clients', { params: { search } }),
  get: (id: number) => api.get(`/api/clients/${id}`),
  create: (data: any) => api.post('/api/clients', data),
  update: (id: number, data: any) => api.put(`/api/clients/${id}`, data),
  delete: (id: number) => api.delete(`/api/clients/${id}`),
}

// Products
export const productsApi = {
  list: async (search?: string) => {
    const res = await api.get('/api/products')
    const mapped = (res.data as BackendProduct[]).map(mapBackendProductToFrontend)
    const normalizedSearch = search?.trim().toLowerCase()
    const filtered = !normalizedSearch
      ? mapped
      : mapped.filter((p) => p.name.toLowerCase().includes(normalizedSearch))
    return { ...res, data: filtered }
  },
  get: async (id: number) => {
    const res = await api.get(`/api/products/${id}`)
    return { ...res, data: mapBackendProductToFrontend(res.data as BackendProduct) }
  },
  create: (data: ProductPayload) => api.post('/api/products', mapFrontendProductToBackend(data)),
  update: (id: number, data: ProductPayload) =>
    api.put(`/api/products/${id}`, mapFrontendProductToBackend(data)),
  delete: (id: number) => api.delete(`/api/products/${id}`),
}

// Proposals
export const proposalsApi = {
  list: async (params?: any) => {
    const statusToBackend: Record<string, string> = {
      draft: 'draft',
      sent: 'sent',
      approved: 'approved',
      rejected: 'rejected',
    }
    const normalizedParams = {
      ...params,
      status: params?.status ? statusToBackend[params.status] : undefined,
    }
    const res = await api.get('/api/proposals', { params: normalizedParams })
    return { ...res, data: (res.data as BackendProposal[]).map(mapBackendProposalToFrontend) }
  },
  get: async (id: number) => {
    const res = await api.get(`/api/proposals/${id}`)
    return { ...res, data: mapBackendProposalToFrontend(res.data as BackendProposal) }
  },
  create: async (data: any) => {
    const res = await api.post('/api/proposals', data)
    return { ...res, data: mapBackendProposalToFrontend(res.data as BackendProposal) }
  },
  update: async (id: number, data: any) => {
    const res = await api.put(`/api/proposals/${id}`, data)
    return { ...res, data: mapBackendProposalToFrontend(res.data as BackendProposal) }
  },
  delete: (id: number) => api.delete(`/api/proposals/${id}`),
  send: async (id: number) => {
    const res = await api.post(`/api/proposals/${id}/send`)
    return { ...res, data: mapBackendProposalToFrontend(res.data as BackendProposal) }
  },
}

// Dashboard
export const dashboardApi = {
  stats: async () => {
    const res = await api.get('/api/dashboard/stats')
    const stats = res.data as BackendDashboardStats
    const totalRevenue = Number(stats.total_approved_value || 0)
    const totalProposals = Number(stats.total_proposals || 0)
    const approvedProposals = Number(stats.approved_proposals || 0)
    const conversionRate = totalProposals > 0 ? approvedProposals / totalProposals : 0
    const avgProposalValue = totalProposals > 0 ? totalRevenue / totalProposals : 0

    return {
      ...res,
      data: {
        total_clients: Number(stats.total_clients || 0),
        total_proposals: totalProposals,
        approved_proposals: approvedProposals,
        pending_proposals: Number(stats.pending_proposals || 0),
        total_revenue: totalRevenue,
        conversion_rate: conversionRate,
        avg_proposal_value: avgProposalValue,
      },
    }
  },
  followupToday: async () => {
    const res = await api.get('/api/dashboard/followup-today')
    const data = (res.data as BackendFollowupProposal[]).map((proposal) => ({
      id: proposal.id,
      title: proposal.title,
      total: Number(proposal.total_value),
      status: mapProposalStatusToFrontend(proposal.status),
      client: proposal.client || undefined,
      client_id: proposal.client_id,
      followup_date: proposal.followup_date || undefined,
    }))
    return { ...res, data }
  },
  chartData: async () => {
    const res = await api.get('/api/dashboard/chart-data')
    if (Array.isArray(res.data)) {
      return { ...res, data: res.data as BackendChartPoint[] }
    }
    return { ...res, data: [] }
  },
}

// Public
export const publicApi = {
  getProposal: async (token: string) => {
    const res = await api.get(`/api/public/proposal/${token}`)
    return { ...res, data: mapBackendPublicProposalToFrontend(res.data as BackendPublicProposal) }
  },
  approve: (token: string) => api.post(`/api/public/proposal/${token}/approve`),
  reject: (token: string, reason?: string) =>
    api.post(`/api/public/proposal/${token}/reject`, { reason }),
}
