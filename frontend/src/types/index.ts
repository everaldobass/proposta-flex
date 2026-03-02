export interface User {
  id: number
  name: string
  email: string
  company?: string
  phone?: string
  whatsapp_template?: string
  created_at: string
}

export interface Client {
  id: number
  name: string
  email?: string
  phone?: string
  company?: string
  document?: string
  address?: string
  notes?: string
  created_at: string
}

export interface Product {
  id: number
  name: string
  description?: string
  price: number
  unit?: string
  created_at: string
}

export interface ProposalItem {
  id?: number
  product_id?: number
  product_name: string
  description?: string
  quantity: number
  unit_price: number
  total: number
}

export type ProposalStatus = 'draft' | 'sent' | 'approved' | 'rejected' | 'expired'

export interface Proposal {
  id: number
  number: string
  title: string
  client_id: number
  client?: Client
  status: ProposalStatus
  valid_until?: string
  notes?: string
  items: ProposalItem[]
  total: number
  public_token?: string
  public_url?: string
  followup_date?: string
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  total_proposals: number
  approved_proposals: number
  pending_proposals: number
  total_revenue: number
  conversion_rate: number
  avg_proposal_value: number
}

export interface ChartData {
  month: string
  proposals: number
  approved: number
  revenue: number
}
