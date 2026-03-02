'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, User, Mail, Phone, Building } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { clientsApi } from '@/services/api'
import { formatDate } from '@/lib/utils'
import type { Client } from '@/types'
import { useForm } from 'react-hook-form'

interface ClientForm {
  name: string
  email: string
  phone: string
  company: string
  document: string
  address: string
  notes: string
}

export default function ClientesPage() {
  useAuthGuard()
  const [clients, setClients] = useState<Client[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editClient, setEditClient] = useState<Client | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ClientForm>()

  const load = useCallback(async () => {
    try {
      const res = await clientsApi.list(search || undefined)
      setClients(res.data)
    } catch (e) {
      setClients([])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setEditClient(null)
    reset({})
    setModalOpen(true)
  }

  const openEdit = (c: Client) => {
    setEditClient(c)
    reset({ name: c.name, email: c.email || '', phone: c.phone || '', company: c.company || '', document: c.document || '', address: c.address || '', notes: c.notes || '' })
    setModalOpen(true)
  }

  const onSubmit = async (data: ClientForm) => {
    try {
      if (editClient) {
        await clientsApi.update(editClient.id, data)
      } else {
        await clientsApi.create(data)
      }
      setModalOpen(false)
      load()
    } catch (e) {}
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await clientsApi.delete(deleteId)
      setDeleteId(null)
      load()
    } catch (e) {}
  }

  return (
    <AppLayout>
      <div className="p-8">
        <PageHeader
          title="Clientes"
          subtitle={`${clients.length} clientes cadastrados`}
          action={
            <Button onClick={openCreate}>
              <Plus size={15} /> Novo Cliente
            </Button>
          }
        />

        <Card>
          {/* Search */}
          <div className="px-5 py-4 border-b border-slate-50">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar clientes..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-slate-400">Carregando...</div>
            ) : clients.length === 0 ? (
              <div className="py-16 text-center">
                <User size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Nenhum cliente encontrado</p>
                <Button onClick={openCreate} variant="outline" size="sm" className="mt-4">
                  <Plus size={14} /> Adicionar cliente
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50">
                    {['Nome', 'Email', 'Telefone', 'Empresa', 'Criado em', 'Ações'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clients.map((c) => (
                    <tr key={c.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-xs font-semibold flex-shrink-0">
                            {c.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-700">{c.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {c.email ? (
                          <span className="flex items-center gap-1.5"><Mail size={12} className="text-slate-300" />{c.email}</span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {c.phone ? (
                          <span className="flex items-center gap-1.5"><Phone size={12} className="text-slate-300" />{c.phone}</span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-500">
                        {c.company ? (
                          <span className="flex items-center gap-1.5"><Building size={12} className="text-slate-300" />{c.company}</span>
                        ) : '—'}
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(c.created_at)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(c)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-teal-600 transition-colors">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteId(c.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>
      </div>

      {/* Create/Edit Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editClient ? 'Editar Cliente' : 'Novo Cliente'} size="lg">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Input label="Nome *" placeholder="Nome do cliente" error={errors.name?.message} {...register('name', { required: 'Nome obrigatório' })} />
            </div>
            <Input label="Email" type="email" placeholder="email@exemplo.com" {...register('email')} />
            <Input label="Telefone / WhatsApp" placeholder="(11) 99999-0000" {...register('phone')} />
            <Input label="Empresa" placeholder="Nome da empresa" {...register('company')} />
            <Input label="CPF / CNPJ" placeholder="000.000.000-00" {...register('document')} />
            <div className="col-span-2">
              <Input label="Endereço" placeholder="Rua, número, cidade" {...register('address')} />
            </div>
            <div className="col-span-2">
              <Textarea label="Observações" placeholder="Notas sobre o cliente..." rows={3} {...register('notes')} />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1" loading={isSubmitting}>
              {editClient ? 'Salvar' : 'Criar Cliente'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmar exclusão" size="sm">
        <p className="text-sm text-slate-600 mb-6">Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Excluir</Button>
        </div>
      </Modal>
    </AppLayout>
  )
}
