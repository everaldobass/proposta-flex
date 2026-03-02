'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Zap } from 'lucide-react'
import { authApi, getApiErrorMessage } from '@/services/api'
import { setToken, setUser } from '@/lib/auth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface RegisterForm {
  name: string
  email: string
  password: string
  confirm_password: string
}

export default function CadastroPage() {
  const router = useRouter()
  const [error, setError] = useState('')
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<RegisterForm>()
  const password = watch('password')

  const onSubmit = async (data: RegisterForm) => {
    setError('')
    try {
      await authApi.register({ name: data.name, email: data.email, password: data.password })
      const res = await authApi.login(data.email, data.password)
      setToken(res.data.access_token)
      const meRes = await authApi.me()
      setUser(meRes.data)
      router.replace('/dashboard')
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Erro ao criar conta'))
    }
  }

  return (
    <div className="min-h-screen flex bg-[#f7f8fc]">
      {/* Left panel */}
      <div className="hidden lg:flex w-[420px] bg-[#1a2236] flex-col justify-between p-10">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-teal-500 flex items-center justify-center">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">Proposta</p>
            <p className="text-teal-400 font-bold text-lg leading-none">Flex</p>
          </div>
        </div>
        <div>
          <div className="mb-8">
            <div className="w-12 h-1 bg-teal-500 rounded-full mb-6" />
            <h2 className="text-white text-3xl font-bold leading-tight mb-4">
              Comece a criar propostas incríveis hoje
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Cadastre-se gratuitamente e tenha acesso a todas as ferramentas para fechar mais negócios.
            </p>
          </div>
          <ul className="space-y-3">
            {[
              'Propostas ilimitadas',
              'Link público para aprovação',
              'Dashboard com métricas',
              'Gestão de clientes e produtos',
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-slate-300 text-sm">
                <div className="w-5 h-5 rounded-full bg-teal-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                {item}
              </li>
            ))}
          </ul>
        </div>
        <p className="text-slate-600 text-xs">© 2024 Proposta Flex</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Criar sua conta</h1>
            <p className="text-slate-500 text-sm">Preencha os dados abaixo para começar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Nome completo"
              placeholder="Seu nome"
              error={errors.name?.message}
              {...register('name', { required: 'Nome obrigatório' })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email obrigatório' })}
            />
            <Input
              label="Senha"
              type="password"
              placeholder="Mínimo 8 caracteres"
              error={errors.password?.message}
              {...register('password', {
                required: 'Senha obrigatória',
                minLength: { value: 8, message: 'Mínimo 8 caracteres' },
              })}
            />
            <Input
              label="Confirmar senha"
              type="password"
              placeholder="Repita a senha"
              error={errors.confirm_password?.message}
              {...register('confirm_password', {
                required: 'Confirmação obrigatória',
                validate: (v) => v === password || 'Senhas não conferem',
              })}
            />

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-2" size="lg" loading={isSubmitting}>
              Criar conta
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-teal-600 font-medium hover:text-teal-700">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
