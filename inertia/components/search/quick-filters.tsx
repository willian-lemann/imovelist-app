import { router } from '@inertiajs/react'
import { Button } from '../ui/button'
import { XIcon } from 'lucide-react'
import { Capitalize, formatMoney } from '@/lib/utils'
import { useEffect, useState } from 'react'

type QuickFilter = {
  label: string
  key: string
}

type QuickFiltersProps = {
  filters?: Record<string, string>
}

export function QuickFilters({ filters = {} }: QuickFiltersProps) {
  const searchParams = new URLSearchParams(filters)
  const [quickFilters, setQuickFilters] = useState<{
    [key: string]: QuickFilter
  }>({})

  const hasFilters =
    searchParams.has('filter') ||
    searchParams.has('property_type') ||
    searchParams.has('q') ||
    searchParams.has('area_range') ||
    searchParams.has('price_range') ||
    searchParams.has('bedrooms') ||
    searchParams.has('bathrooms') ||
    searchParams.has('parking')

  const handleRemoveFilter = (key: string) => {
    const url = new URL(window.location.href)
    url.searchParams.delete(key)
    router.visit(url.pathname + url.search, { preserveState: true })
  }

  const handleClearAll = () => {
    router.visit(window.location.pathname, { preserveState: true })
  }

  useEffect(() => {
    const newFilters: { [key: string]: QuickFilter } = {}

    if (searchParams.has('q')) {
      const value = searchParams.get('q')
      newFilters.query = {
        label: `Busca: ${value}`,
        key: 'q',
      }
    }

    if (searchParams.has('filter')) {
      const value = Capitalize(searchParams.get('filter') || '')
      newFilters.filter = {
        label: `Finalidade: ${value}`,
        key: 'filter',
      }
    }

    if (searchParams.has('property_type')) {
      const value = Capitalize(searchParams.get('property_type') || '')
      newFilters.property_type = {
        label: `Tipo: ${value}`,
        key: 'property_type',
      }
    }

    if (searchParams.has('price_range')) {
      const value = searchParams.get('price_range')?.split(',').map(Number)
      if (value && value.length === 2) {
        newFilters.price_range = {
          label: `Preço: ${formatMoney(value[0])} - ${formatMoney(value[1])}`,
          key: 'price_range',
        }
      }
    }

    if (searchParams.has('bedrooms')) {
      const value = searchParams.get('bedrooms')
      newFilters.bedrooms = {
        label: `Quartos: ${value}`,
        key: 'bedrooms',
      }
    }

    if (searchParams.has('bathrooms')) {
      const value = searchParams.get('bathrooms')
      newFilters.bathrooms = {
        label: `Banheiros: ${value}`,
        key: 'bathrooms',
      }
    }

    if (searchParams.has('parking')) {
      const value = searchParams.get('parking')
      newFilters.parking = {
        label: `Vagas: ${value}`,
        key: 'parking',
      }
    }

    setQuickFilters(newFilters)
  }, [filters])

  if (!hasFilters) {
    return null
  }

  const quickFilterArray = Object.values(quickFilters)

  return (
    <div className="flex flex-wrap gap-2 items-center">
      {quickFilterArray.map((filter) => (
        <Button
          key={filter.key}
          variant="secondary"
          size="sm"
          className="flex items-center gap-1 bg-muted text-muted-foreground hover:bg-muted/80"
        >
          {filter.label}
          <XIcon
            className="h-3.5 w-3.5 cursor-pointer"
            onClick={() => handleRemoveFilter(filter.key)}
          />
        </Button>
      ))}
      {quickFilterArray.length > 1 && (
        <Button
          variant="outline"
          size="sm"
          className="text-sm cursor-pointer"
          onClick={handleClearAll}
        >
          Limpar todos
        </Button>
      )}
    </div>
  )
}
