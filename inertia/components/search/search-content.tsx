import { SearchIcon } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { router } from '@inertiajs/react'
import { useCallback, useEffect, useState } from 'react'
import { useDebounce } from '~/hooks/use-debounce'
import { isMobile } from '~/helpers/mobile'
import { DropdownType } from './dropdown-type'
import { DropdownFilter } from './dropdown-filter'
import { AdvancedFilters, initialFilters } from './advanced-filters'

type SearchContentProps = {
  q?: string
  currentFilter?: string
  currentPropertyType?: string
  isLoading?: boolean
}

export function SearchContent({
  q = '',
  currentFilter,
  currentPropertyType,
  isLoading = false,
}: SearchContentProps) {
  const [filters, setFilters] = useState(initialFilters)
  const [searchValue, setSearchValue] = useState(q || '')
  const debouncedSearchValue = useDebounce(searchValue, 300)

  const handleSetFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }, [])

  const buildSearchParams = useCallback(() => {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)

    if (filters.bedrooms.length > 0) {
      params.set('bedrooms', filters.bedrooms)
    }
    if (filters.bathrooms.length > 0) {
      params.set('bathrooms', filters.bathrooms)
    }
    if (filters.parking.length > 0) {
      params.set('parking', filters.parking)
    }
    if (currentPropertyType) {
      params.set('property_type', currentPropertyType)
    }
    if (currentFilter) {
      params.set('filter', currentFilter)
    }
    if (
      filters.priceRange.length > 0 &&
      filters.priceRange[0] !== 0 &&
      filters.priceRange[1] !== 0
    ) {
      params.set('price_range', filters.priceRange.join(','))
    }
    if (filters.areaRange.length > 0 && filters.areaRange[0] !== 0 && filters.areaRange[1] !== 0) {
      params.set('area_range', filters.areaRange.join(','))
    }
    if (debouncedSearchValue.trim() !== '') {
      params.set('q', debouncedSearchValue)
    }

    return params
  }, [filters, debouncedSearchValue, currentFilter, currentPropertyType])

  const handleApplyFilters = useCallback(() => {
    const params = buildSearchParams()
    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
    })
  }, [buildSearchParams])

  function handleFilter(filter: string) {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)

    if (filter !== currentFilter) {
      params.set('filter', filter)
      params.set('page', '1')
    } else {
      params.delete('filter')
    }

    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
    })
  }

  function handleType(type: string) {
    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)

    if (type !== currentPropertyType) {
      params.set('property_type', type)
      params.set('page', '1')
    } else {
      params.delete('property_type')
    }

    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
    })
  }

  function clearFilters() {
    router.visit(window.location.pathname, { preserveState: true })
    setFilters(initialFilters)
    setSearchValue('')
  }

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    setSearchValue(value)
  }

  useEffect(() => {
    if (!q) {
      setSearchValue('')
    }
  }, [q])

  useEffect(() => {
    if (debouncedSearchValue.trim() === '') {
      const url = new URL(window.location.href)
      const params = new URLSearchParams(url.search)
      params.delete('q')
      router.visit(`${window.location.pathname}?${params.toString()}`, {
        preserveState: true,
        preserveScroll: true,
      })
      return
    }

    const url = new URL(window.location.href)
    const params = new URLSearchParams(url.search)
    params.set('q', debouncedSearchValue)

    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
    })
  }, [debouncedSearchValue])

  return (
    <div className="flex flex-1/2">
      <div className="flex flex-1/2 gap-2 mr-2">
        <div className="relative flex-1 max-w-2xl flex">
          <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />

          <Input
            id="q"
            name="q"
            type="search"
            value={searchValue}
            onChange={handleChange}
            autoComplete="off"
            placeholder={
              isMobile() ? 'Nome, endereço ou ref' : 'Pesquise pelo nome, endereço ou ref'
            }
            className="w-full py-3 pl-12 pr-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <AdvancedFilters
          isFetching={isLoading}
          filters={filters}
          currentFilter={currentFilter}
          onFilters={handleSetFilters}
          onApply={handleApplyFilters}
          onReset={clearFilters}
        />

        <div className="md:flex hidden">
          <DropdownType onFilter={handleType} currentType={currentPropertyType} />
        </div>

        <div className="md:flex hidden">
          <DropdownFilter onFilter={handleFilter} currentFilter={currentFilter} />
        </div>
      </div>
    </div>
  )
}
