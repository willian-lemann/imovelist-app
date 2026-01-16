import {
  FileText,
  User,
  LogOut,
  Stars,
  Images,
  Sparkles,
  ChevronLeft,
  LayoutDashboard,
  PlusCircle,
  BadgeCheckIcon,
} from 'lucide-react'
import { Link } from '@inertiajs/react'
import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Logo } from '~/components/logo'

export const tabMap = {
  DASHBOARD: 'dashboard',
  CREATE_LISTING: 'create-listing',
  PROFILE: 'profile',
  LISTINGS: 'listings',
  GALLERY: 'gallery',
  AI_PAGE_GENERATOR: 'ai-page-generator',
}

type SidebarProps = {
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentUser?: {
    name: string
    email: string
  }
  isPremium?: boolean
}

export function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  currentUser,
  isPremium = false,
}: SidebarProps) {
  const navItems = [
    {
      id: tabMap.DASHBOARD,
      label: 'Dashboard',
      icon: LayoutDashboard,
      premium: false,
    },
    {
      id: tabMap.CREATE_LISTING,
      label: 'Criar Anúncio',
      icon: PlusCircle,
      premium: false,
    },
    {
      id: tabMap.PROFILE,
      label: 'Meu Perfil',
      icon: User,
      premium: false,
    },
  ]

  const premiumNavItems = [
    {
      id: tabMap.GALLERY,
      label: 'Galeria',
      icon: Images,
      premium: false,
    },
    {
      id: tabMap.AI_PAGE_GENERATOR,
      label: 'Gerar Página IA',
      icon: Sparkles,
      premium: true,
    },
  ]

  return (
    <>
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-white shadow-lg transition-transform duration-300 ease-in-out',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          'md:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link href="/">
            <Logo />
          </Link>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(false)}
            className="md:hidden"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {navItems.map((item) => {
            const isActive = activeTab === item.id

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-3.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            )
          })}

          <div className="my-4 border-t" />

          {premiumNavItems.map((item) => {
            const isActive = activeTab === item.id
            const isLocked = item.premium && !isPremium

            return (
              <button
                key={item.id}
                onClick={() => !isLocked && setActiveTab(item.id)}
                disabled={isLocked}
                className={cn(
                  'flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100',
                  isLocked && 'cursor-not-allowed opacity-60'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.premium && (
                  <Badge variant="secondary" className="bg-primary text-white hover:bg-primary">
                    {isPremium ? 'Ativo' : 'Premium'}
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>

        {/* User section */}
        <div className="border-t p-4">
          {/* Premium upgrade banner */}
          {!isPremium && (
            <div className="mb-4 rounded-xl bg-linear-to-r from-primary to-cyan-500 p-4 text-white">
              <div className="flex items-center gap-2">
                <Stars className="h-5 w-5" />
                <span className="text-sm font-semibold">Upgrade</span>
              </div>
              <p className="mt-1 text-xs opacity-90">Anúncios ilimitados</p>
              <Link
                href="/planos"
                className="mt-2 flex items-center text-xs font-medium hover:underline"
              >
                Ver Planos →
              </Link>
            </div>
          )}

          {/* Logout button */}
          <Link
            href="/logout"
            method="post"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </Link>
        </div>
      </aside>
    </>
  )
}
