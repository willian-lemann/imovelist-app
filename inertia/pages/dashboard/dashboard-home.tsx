import { Link } from '@inertiajs/react'
import { FileText, Zap, Stars, ChevronRight, Plus, File } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'

type DashboardHomeProps = {
  userName?: string
  listingsCount?: number
  plan?: string
  isPremium?: boolean
  onCreateListing: () => void
}

export function DashboardHome({
  userName = 'Usuário',
  listingsCount = 0,
  plan = 'Gratuito',
  isPremium = false,
  onCreateListing,
}: DashboardHomeProps) {
  return (
    <div className="space-y-6">
      {/* Header with greeting and CTA */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Olá, {userName}! <span className="ml-1">👋</span>
          </h1>
          <p className="mt-1 text-gray-500">Gerencie seus anúncios e acompanhe seu desempenho.</p>
        </div>
        <Button onClick={onCreateListing} className="gradient">
          <Plus className="mr-2 h-4 w-4" />
          Novo Anúncio
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* Anúncios Gerados */}
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Anúncios Gerados</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{listingsCount}</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-2">
                <FileText className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plano */}
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">Plano</p>
                <p className="mt-2 text-2xl font-bold text-gray-900">{plan}</p>
              </div>
              <div className="rounded-xl bg-primary/10 p-2">
                <Zap className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Upgrade Card */}
        {!isPremium && (
          <Card className="border-0 bg-linear-to-r from-primary to-cyan-500 text-white shadow-sm">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-white/20 p-2">
                  <Stars className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold">Upgrade</p>
                  <p className="mt-1 text-sm opacity-90">Anúncios ilimitados</p>
                  <Link
                    href="/planos"
                    className="mt-3 inline-flex items-center text-sm font-medium hover:underline"
                  >
                    Ver Planos <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Advanced Filters Accordion - Placeholder */}
      <Card className="border-gray-100 shadow-sm">
        <CardContent className="p-4">
          <button className="flex w-full items-center justify-between text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <svg
                className="h-5 w-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filtros Avançados
            </div>
            <ChevronRight className="h-5 w-5 text-gray-400" />
          </button>
        </CardContent>
      </Card>

      {/* Anúncios Recentes */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">Anúncios Recentes</h2>
        <Card className="border-gray-100 shadow-sm">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="mb-4 rounded-xl bg-gray-100 p-4">
              <File className="h-10 w-10 text-gray-400" />
            </div>
            <p className="mb-6 text-gray-500">Você ainda não gerou nenhum anúncio.</p>
            <Button
              onClick={onCreateListing}
              className="bg-linear-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-400/90"
            >
              <Plus className="mr-2 h-4 w-4" />
              Criar Primeiro Anúncio
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
