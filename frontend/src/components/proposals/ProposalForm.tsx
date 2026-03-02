'use client'
import { useState, useEffect } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { Plus, Trash2, Package } from 'lucide-react'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'
import { getApiErrorMessage, proposalsApi, productsApi } from '@/services/api'
import { formatCurrency } from '@/lib/utils'
import type { Proposal, Client, Product } from '@/types'

interface ProposalFormProps {
  proposal: Proposal | null
  clients: Client[]
  onSuccess: () => void
  onCancel: () => void
}

interface FormData {
  title: string
  client_id: number
  valid_until: string
  notes: string
  followup_date: string
  items: {
    product_id?: number
    product_name: string
    description: string
    quantity: number
    unit_price: number
    total: number
  }[]
}

export default function ProposalForm({ proposal, clients, onSuccess, onCancel }: ProposalFormProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [errorMsg, setErrorMsg] = useState('')

  const { register, control, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({
    defaultValues: proposal ? {
      title: proposal.title,
      client_id: proposal.client_id,
      valid_until: proposal.valid_until ? proposal.valid_until.split('T')[0] : '',
      notes: proposal.notes || '',
      followup_date: proposal.followup_date ? proposal.followup_date.split('T')[0] : '',
      items: proposal.items.map(i => ({ ...i, description: i.description || '' })),
    } : {
      title: '',
      client_id: undefined,
      valid_until: '',
      notes: '',
      followup_date: '',
      items: [{ product_name: '', description: '', quantity: 1, unit_price: 0, total: 0 }],
    }
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'items' })
  const items = watch('items')
  const total = items?.reduce((acc, item) => acc + (Number(item.quantity) * Number(item.unit_price)), 0) || 0

  useEffect(() => {
    productsApi.list().then(r => setProducts(r.data)).catch(() => {})
  }, [])

  const handleProductSelect = (index: number, productId: number) => {
    const p = products.find(p => p.id === productId)
    if (!p) return
    setValue(`items.${index}.product_id`, p.id)
    setValue(`items.${index}.product_name`, p.name)
    setValue(`items.${index}.description`, p.description || '')
    setValue(`items.${index}.unit_price`, p.price)
    const qty = Number(items[index]?.quantity) || 1
    setValue(`items.${index}.total`, p.price * qty)
  }

  const updateItemTotal = (index: number) => {
    const qty = Number(items[index]?.quantity) || 0
    const price = Number(items[index]?.unit_price) || 0
    setValue(`items.${index}.total`, qty * price)
  }

  const onSubmit = async (data: FormData) => {
    setErrorMsg('')
    const followupDate = data.followup_date?.trim()
      ? `${data.followup_date}T00:00:00`
      : undefined

    const normalizedItems = data.items.map((item) => ({
      product_id: item.product_id || undefined,
      description: item.description?.trim() || item.product_name?.trim() || 'Item',
      quantity: Number(item.quantity),
      unit_value: Number(item.unit_price),
    }))

    if (!Number(data.client_id) || Number(data.client_id) <= 0) {
      setErrorMsg('Selecione um cliente válido')
      return
    }

    if (normalizedItems.some((item) => !item.description || item.quantity <= 0 || item.unit_value <= 0)) {
      setErrorMsg('Preencha os itens com descrição, quantidade e preço unitário válidos')
      return
    }

    const payload = {
      title: data.title,
      client_id: Number(data.client_id),
      notes: data.notes || undefined,
      followup_date: followupDate,
      items: normalizedItems,
    }
    try {
      if (proposal) {
        await proposalsApi.update(proposal.id, payload)
      } else {
        await proposalsApi.create(payload)
      }
      onSuccess()
    } catch (e: any) {
      setErrorMsg(getApiErrorMessage(e, 'Erro ao salvar proposta'))
    }
  }

  const clientOptions = [
    { value: '', label: 'Selecione o cliente' },
    ...clients.map(c => ({ value: c.id, label: c.name }))
  ]

  const productOptions = [
    { value: '', label: 'Selecionar produto...' },
    ...products.map(p => ({ value: p.id, label: `${p.name} — ${formatCurrency(p.price)}` }))
  ]

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
          {errorMsg}
        </div>
      )}
      {/* Header info */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Input
            label="Título da proposta *"
            placeholder="Ex: Desenvolvimento de Website"
            error={errors.title?.message}
            {...register('title', { required: 'Título obrigatório' })}
          />
        </div>
        <Select
          label="Cliente *"
          error={errors.client_id?.message}
          options={clientOptions}
          {...register('client_id', {
            required: 'Cliente obrigatório',
            valueAsNumber: true,
            validate: (value) => value > 0 || 'Cliente obrigatório',
          })}
        />
        <Input label="Válida até" type="date" {...register('valid_until')} />
        <Input label="Follow-up em" type="date" {...register('followup_date')} />
      </div>

      {/* Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Itens da Proposta</p>
        </div>

        <div className="border border-slate-100 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-3 py-2 text-xs font-medium text-slate-500">Produto / Serviço</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 w-24">Qtd</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 w-32">Preço Unit.</th>
                <th className="text-left px-3 py-2 text-xs font-medium text-slate-500 w-28">Total</th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field, index) => (
                <tr key={field.id} className="border-t border-slate-50">
                  <td className="px-3 py-2">
                    <div className="space-y-1.5">
                      <select
                        onChange={(e) => handleProductSelect(index, Number(e.target.value))}
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                      >
                        {productOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                      </select>
                      <input
                        placeholder="Nome do item"
                        className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                        {...register(`items.${index}.product_name`, { required: true })}
                      />
                      <input
                        placeholder="Descrição (opcional)"
                        className="w-full px-2 py-1.5 text-xs border border-slate-100 rounded-lg focus:outline-none text-slate-500 placeholder:text-slate-300"
                        {...register(`items.${index}.description`)}
                      />
                    </div>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="1"
                      step="1"
                      className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-center"
                      {...register(`items.${index}.quantity`, {
                        required: true,
                        valueAsNumber: true,
                        min: 1,
                      })}
                      onBlur={() => updateItemTotal(index)}
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      className="w-full px-2 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                      {...register(`items.${index}.unit_price`, {
                        required: true,
                        valueAsNumber: true,
                        min: 0.01,
                      })}
                      onBlur={() => updateItemTotal(index)}
                    />
                  </td>
                  <td className="px-3 py-2 font-semibold text-teal-700 text-xs whitespace-nowrap">
                    {formatCurrency((Number(items[index]?.quantity) || 0) * (Number(items[index]?.unit_price) || 0))}
                  </td>
                  <td className="px-2 py-2">
                    {fields.length > 1 && (
                      <button type="button" onClick={() => remove(index)} className="p-1 hover:bg-red-50 rounded text-slate-300 hover:text-red-400 transition-colors">
                        <Trash2 size={13} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-3 py-2 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <button
              type="button"
              onClick={() => append({ product_name: '', description: '', quantity: 1, unit_price: 0, total: 0 })}
              className="flex items-center gap-1.5 text-xs text-teal-600 font-medium hover:text-teal-700"
            >
              <Plus size={13} /> Adicionar item
            </button>
            <div className="text-sm font-bold text-slate-800">
              Total: <span className="text-teal-700">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      <Textarea label="Observações" placeholder="Termos, condições, informações adicionais..." rows={3} {...register('notes')} />

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">Cancelar</Button>
        <Button type="submit" className="flex-1" loading={isSubmitting}>
          {proposal ? 'Salvar Proposta' : 'Criar Proposta'}
        </Button>
      </div>
    </form>
  )
}
