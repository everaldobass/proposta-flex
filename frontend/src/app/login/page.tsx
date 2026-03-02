'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { authApi, getApiErrorMessage } from '@/services/api'
import { setToken, setUser } from '@/lib/auth'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface LoginForm {
  email: string
  password: string
}

export default function LoginPage() {
  const router = useRouter()
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>()

  const onSubmit = async (data: LoginForm) => {
    setError('')
    try {
      const res = await authApi.login(data.email, data.password)
      setToken(res.data.access_token)
      const meRes = await authApi.me()
      setUser(meRes.data)
      router.replace('/dashboard')
    } catch (err: any) {
      setError(getApiErrorMessage(err, 'Email ou senha inválidos'))
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
              Propostas profissionais em minutos
            </h2>
            <p className="text-slate-400 text-base leading-relaxed">
              Crie, envie e gerencie propostas comerciais com agilidade. Acompanhe aprovações em tempo real.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Propostas criadas', value: '+2.400' },
              { label: 'Taxa de aprovação', value: '68%' },
              { label: 'Tempo médio', value: '2 min' },
              { label: 'Clientes ativos', value: '+180' },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                <p className="text-teal-400 text-xl font-bold">{stat.value}</p>
                <p className="text-slate-400 text-xs mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <p className="text-slate-600 text-xs">© 2024 Proposta Flex. Todos os direitos reservados.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <p className="text-slate-800 font-bold text-lg">Proposta Flex</p>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Bem-vindo de volta</h1>
            <p className="text-slate-500 text-sm">Entre na sua conta para continuar</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              placeholder="seu@email.com"
              error={errors.email?.message}
              {...register('email', { required: 'Email obrigatório' })}
            />
            <div className="relative">
              <Input
                label="Senha"
                type={showPass ? 'text' : 'password'}
                placeholder="••••••••"
                error={errors.password?.message}
                {...register('password', { required: 'Senha obrigatória' })}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-7 text-slate-400 hover:text-slate-600"
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full mt-6" size="lg" loading={isSubmitting}>
              Entrar
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Não tem conta?{' '}
            <Link href="/cadastro" className="text-teal-600 font-medium hover:text-teal-700">
              Criar conta grátis
            </Link>
          </p>

          <div className="mt-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
            <p className="text-xs text-slate-400 text-center font-medium">Credenciais demo</p>
            <p className="text-xs text-slate-500 text-center mt-1">
              admin@admin.com / admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
