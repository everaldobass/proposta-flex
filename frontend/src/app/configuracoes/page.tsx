'use client'
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { User, Lock, MessageSquare, CheckCircle } from 'lucide-react'
import AppLayout from '@/components/layout/AppLayout'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import PageHeader from '@/components/ui/PageHeader'
import { useAuthGuard } from '@/hooks/useAuthGuard'
import { authApi, getApiErrorMessage } from '@/services/api'
import { getUser, setUser } from '@/lib/auth'

export default function ConfiguracoesPage() {
  useAuthGuard()
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'whatsapp'>('profile')
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  const profileForm = useForm<any>()
  const passwordForm = useForm<any>()
  const whatsappForm = useForm<any>()

  useEffect(() => {
    const user = getUser()
    if (user) {
      profileForm.reset({ name: user.name, email: user.email, company: user.company || '', phone: user.phone || '' })
      whatsappForm.reset({ whatsapp_template: user.whatsapp_template || 'Olá {cliente}, segue sua proposta: {link}' })
    }
  }, [])

  const showSuccess = (msg: string) => {
    setSuccessMsg(msg)
    setErrorMsg('')
    setTimeout(() => setSuccessMsg(''), 3000)
  }

  const onProfileSubmit = async (data: any) => {
    try {
      const res = await authApi.updateProfile(data)
      setUser(res.data)
      showSuccess('Perfil atualizado com sucesso!')
    } catch (e: any) {
      setErrorMsg(getApiErrorMessage(e, 'Erro ao atualizar perfil'))
    }
  }

  const onPasswordSubmit = async (data: any) => {
    if (data.new_password !== data.confirm_password) {
      setErrorMsg('Senhas não conferem')
      return
    }
    try {
      await authApi.changePassword({ current_password: data.current_password, new_password: data.new_password })
      passwordForm.reset()
      showSuccess('Senha alterada com sucesso!')
    } catch (e: any) {
      setErrorMsg(getApiErrorMessage(e, 'Senha atual incorreta'))
    }
  }

  const onWhatsappSubmit = async (data: any) => {
    try {
      const res = await authApi.updateProfile(data)
      setUser(res.data)
      showSuccess('Template salvo com sucesso!')
    } catch {
      setErrorMsg('Erro ao salvar template')
    }
  }

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'security', label: 'Segurança', icon: Lock },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare },
  ] as const

  return (
    <AppLayout>
      <div className="p-8 max-w-3xl">
        <PageHeader title="Configurações" subtitle="Gerencie seu perfil e preferências" />

        {/* Tabs */}
        <div className="flex gap-1 bg-slate-100 p-1 rounded-xl mb-6 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSuccessMsg(''); setErrorMsg('') }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 text-teal-700 text-sm px-4 py-3 rounded-xl mb-4">
            <CheckCircle size={15} />
            {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl mb-4">
            {errorMsg}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <Card title="Informações do Perfil">
            <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input label="Nome completo" {...profileForm.register('name', { required: true })} />
                <Input label="Email" type="email" {...profileForm.register('email', { required: true })} />
                <Input label="Empresa" placeholder="Nome da sua empresa" {...profileForm.register('company')} />
                <Input label="Telefone" placeholder="(11) 99999-0000" {...profileForm.register('phone')} />
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={profileForm.formState.isSubmitting}>Salvar Perfil</Button>
              </div>
            </form>
          </Card>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <Card title="Alterar Senha">
            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="p-5 space-y-4">
              <Input label="Senha atual" type="password" placeholder="••••••••" {...passwordForm.register('current_password', { required: true })} />
              <Input label="Nova senha" type="password" placeholder="Mínimo 8 caracteres"
                {...passwordForm.register('new_password', { required: true, minLength: { value: 8, message: 'Mínimo 8 caracteres' } })} />
              <Input label="Confirmar nova senha" type="password" placeholder="Repita a nova senha"
                {...passwordForm.register('confirm_password', { required: true })} />
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={passwordForm.formState.isSubmitting}>Alterar Senha</Button>
              </div>
            </form>
          </Card>
        )}

        {/* WhatsApp Tab */}
        {activeTab === 'whatsapp' && (
          <Card title="Template de Mensagem WhatsApp" subtitle="Personalize a mensagem enviada ao cliente com o link da proposta">
            <form onSubmit={whatsappForm.handleSubmit(onWhatsappSubmit)} className="p-5 space-y-4">
              <Textarea
                label="Template da mensagem"
                rows={5}
                {...whatsappForm.register('whatsapp_template')}
              />
              <div className="bg-blue-50 rounded-xl p-4 text-xs text-blue-700 space-y-1">
                <p className="font-semibold">Variáveis disponíveis:</p>
                <p><code className="bg-blue-100 px-1 rounded">{'{cliente}'}</code> — Nome do cliente</p>
                <p><code className="bg-blue-100 px-1 rounded">{'{proposta}'}</code> — Título da proposta</p>
                <p><code className="bg-blue-100 px-1 rounded">{'{valor}'}</code> — Valor total</p>
                <p><code className="bg-blue-100 px-1 rounded">{'{link}'}</code> — Link público da proposta</p>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" loading={whatsappForm.formState.isSubmitting}>Salvar Template</Button>
              </div>
            </form>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
