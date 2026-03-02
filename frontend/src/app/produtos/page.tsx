'use client'
import { useState, useEffect, useCallback } from 'react'
import { Plus, Search, Pencil, Trash2, Package } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Modal from '@/components/ui/Modal'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { getApiErrorMessage, productsApi } from '@/services/api'
import { formatCurrency, formatDate } from '@/lib/utils'
import type { Product } from '@/types'
import { useForm } from 'react-hook-form'

interface ProductForm {
  name: string
  description: string
  price: number
  unit: string
}

export default function ProdutosPage() {
  useAuthGuard()
  const [products, setProducts] = useState<Product[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editProduct, setEditProduct] = useState<Product | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ProductForm>()

  const load = useCallback(async () => {
    try {
      const res = await productsApi.list(search || undefined)
      setProducts(res.data)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => { load() }, [load])

  const openCreate = () => {
    setErrorMsg('')
    setEditProduct(null)
    reset({ name: '', description: '', price: 0, unit: 'un' })
    setModalOpen(true)
  }

  const openEdit = (p: Product) => {
    setErrorMsg('')
    setEditProduct(p)
    reset({ name: p.name, description: p.description || '', price: p.price, unit: p.unit || 'un' })
    setModalOpen(true)
  }

  const onSubmit = async (data: ProductForm) => {
    try {
      setErrorMsg('')
      if (editProduct) {
        await productsApi.update(editProduct.id, data)
      } else {
        await productsApi.create(data)
      }
      setModalOpen(false)
      load()
    } catch (e: any) {
      setErrorMsg(getApiErrorMessage(e, 'Erro ao salvar produto'))
    }
  }

  const handleDelete = async () => {
    if (!deleteId) return
    try {
      await productsApi.delete(deleteId)
      setDeleteId(null)
      load()
    } catch {}
  }

  return (
    <AppLayout>
      <div className="p-8">
        <PageHeader
          title="Produtos e Serviços"
          subtitle={`${products.length} itens cadastrados`}
          action={
            <Button onClick={openCreate}>
              <Plus size={15} /> Novo Produto
            </Button>
          }
        />

        <Card>
          <div className="px-5 py-4 border-b border-slate-50">
            <div className="relative w-full max-w-sm">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="py-16 text-center text-slate-400">Carregando...</div>
            ) : products.length === 0 ? (
              <div className="py-16 text-center">
                <Package size={32} className="text-slate-200 mx-auto mb-3" />
                <p className="text-slate-400 text-sm">Nenhum produto encontrado</p>
                <Button onClick={openCreate} variant="outline" size="sm" className="mt-4">
                  <Plus size={14} /> Adicionar produto
                </Button>
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-50">
                    {['Nome', 'Descrição', 'Preço', 'Unidade', 'Criado em', 'Ações'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-medium text-slate-400 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-b border-slate-50 hover:bg-slate-50/60 group">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Package size={13} className="text-blue-500" />
                          </div>
                          <span className="font-medium text-slate-700">{p.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-500 max-w-xs truncate">{p.description || '—'}</td>
                      <td className="px-5 py-3.5 font-semibold text-teal-700">{formatCurrency(p.price)}</td>
                      <td className="px-5 py-3.5 text-slate-500">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs">{p.unit || 'un'}</span>
                      </td>
                      <td className="px-5 py-3.5 text-slate-400 text-xs">{formatDate(p.created_at)}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openEdit(p)} className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-teal-600">
                            <Pencil size={13} />
                          </button>
                          <button onClick={() => setDeleteId(p.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editProduct ? 'Editar Produto' : 'Novo Produto'}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
              {errorMsg}
            </div>
          )}
          <Input label="Nome *" placeholder="Nome do produto ou serviço" error={errors.name?.message} {...register('name', { required: 'Nome obrigatório' })} />
          <Textarea label="Descrição" placeholder="Descreva o produto ou serviço..." rows={3} {...register('description')} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Preço *" type="number" step="0.01" min="0" placeholder="0,00" error={errors.price?.message}
              {...register('price', { required: 'Preço obrigatório', min: { value: 0, message: 'Deve ser positivo' } })} />
            <Input label="Unidade" placeholder="un, h, kg, m²..." {...register('unit')} />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="button" variant="outline" onClick={() => setModalOpen(false)} className="flex-1">Cancelar</Button>
            <Button type="submit" className="flex-1" loading={isSubmitting}>
              {editProduct ? 'Salvar' : 'Criar Produto'}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={deleteId !== null} onClose={() => setDeleteId(null)} title="Confirmar exclusão" size="sm">
        <p className="text-sm text-slate-600 mb-6">Tem certeza que deseja excluir este produto?</p>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setDeleteId(null)} className="flex-1">Cancelar</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Excluir</Button>
        </div>
      </Modal>
    </AppLayout>
  )
}
