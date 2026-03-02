'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  Users,
  Package,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { removeToken, getUser } from '@/lib/auth'

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/propostas', icon: FileText, label: 'Propostas' },
  { href: '/clientes', icon: Users, label: 'Clientes' },
  { href: '/produtos', icon: Package, label: 'Produtos' },
]

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    setUser(getUser())
  }, [])

  const handleLogout = () => {
    removeToken()
    router.replace('/login')
  }

  return (
    <aside className="w-56 bg-[#1a2236] flex flex-col h-screen fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center shadow-lg">
            <Zap size={16} className="text-white" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm leading-none">Proposta</p>
            <p className="text-teal-400 font-semibold text-sm leading-none">Flex</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">{user?.name || 'Usuário'}</p>
            <p className="text-slate-400 text-[11px] truncate">{user?.email || ''}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="text-slate-500 text-[10px] font-semibold uppercase tracking-widest px-2 mb-3">
          Menu
        </p>
        {navItems.map((item) => {
          const active = pathname.startsWith(item.href)
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium group',
                active
                  ? 'bg-teal-600/20 text-teal-400'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              )}
            >
              <item.icon
                size={16}
                className={cn(
                  'flex-shrink-0 transition-colors',
                  active ? 'text-teal-400' : 'text-slate-500 group-hover:text-white'
                )}
              />
              <span className="flex-1">{item.label}</span>
              {active && <ChevronRight size={12} className="text-teal-500" />}
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-5 space-y-0.5 border-t border-white/5 pt-3">
        <Link
          href="/configuracoes"
          className={cn(
            'sidebar-item flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium group',
            pathname.startsWith('/configuracoes')
              ? 'bg-teal-600/20 text-teal-400'
              : 'text-slate-400 hover:text-white hover:bg-white/5'
          )}
        >
          <Settings size={16} className="flex-shrink-0" />
          Configurações
        </Link>
        <button
          onClick={handleLogout}
          className="sidebar-item w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
        >
          <LogOut size={16} className="flex-shrink-0" />
          Sair
        </button>
      </div>
    </aside>
  )
}
