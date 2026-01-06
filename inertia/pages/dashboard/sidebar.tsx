import { FileText, User, LogOut, Stars, Images, Sparkles, ChevronLeft, Home } from 'lucide-react'
import { Link } from '@inertiajs/react'
import { cn } from '~/lib/utils'
import { Badge } from '~/components/ui/badge'
import { Button } from '~/components/ui/button'
import { Logo } from '~/components/logo'

export const tabMap = {
  LISTINGS: 'listings',
  CREATE_LISTING: 'create-listing',
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
      id: tabMap.LISTINGS,
      label: 'Meus Anúncios',
      icon: FileText,
      premium: false,
    },
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
          <Link
            href="/"
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100"
          >
            <Home className="h-5 w-5" />
            Página Inicial
          </Link>

          <div className="my-4 border-t" />

          {navItems.map((item) => {
            const isActive = activeTab === item.id
            const isLocked = item.premium && !isPremium

            return (
              <button
                key={item.id}
                onClick={() => !isLocked && setActiveTab(item.id)}
                disabled={isLocked}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-100',
                  isLocked && 'cursor-not-allowed opacity-60'
                )}
              >
                <item.icon className={cn('h-5 w-5', isActive && 'text-primary')} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.premium && (
                  <Badge
                    variant="outline"
                    className={cn(
                      'text-xs',
                      isPremium
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-amber-200 bg-amber-50 text-amber-700'
                    )}
                  >
                    {isPremium ? 'Ativo' : 'Premium'}
                  </Badge>
                )}
              </button>
            )
          })}
        </nav>

        {/* User section */}
        {currentUser && (
          <div className="border-t p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-gray-900">{currentUser.name}</p>
                <p className="truncate text-xs text-gray-500">{currentUser.email}</p>
              </div>
            </div>
            <Link
              href="/logout"
              method="post"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              <LogOut className="h-4 w-4" />
              Sair
            </Link>
          </div>
        )}

        {/* Premium upgrade banner */}
        {!isPremium && (
          <div className="m-4 rounded-lg bg-linear-to-r from-amber-50 to-orange-50 p-4">
            <div className="flex items-center gap-2">
              <Stars className="h-5 w-5 text-amber-500" />
              <span className="text-sm font-semibold text-amber-800">Seja Premium</span>
            </div>
            <p className="mt-1 text-xs text-amber-700">
              Desbloqueie a Galeria e o Gerador de Páginas IA
            </p>
            <Button size="sm" className="mt-3 w-full" variant="default">
              Fazer Upgrade
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}
