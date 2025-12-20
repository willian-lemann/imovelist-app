import { SearchIcon } from 'lucide-react'
import { Input } from '~/components/ui/input'
import { router } from '@inertiajs/react'
import { useCallback, useEffect, useState, useRef } from 'react'
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
  const debouncedSearchValue = useDebounce(searchValue, 500)
  const isInitialMount = useRef(true)

  const handleSetFilters = useCallback((newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
    }))
  }, [])

  const navigateWithFilters = useCallback((params: URLSearchParams) => {
    router.visit(`${window.location.pathname}?${params.toString()}`, {
      preserveState: true,
      preserveScroll: true,
      replace: true, // Don't pollute browser history
      only: ['listings', 'count', 'filters'], // Only reload these props
    })
  }, [])

  const buildSearchParams = useCallback(() => {
    const params = new URLSearchParams(window.location.search)

    // Clear page when filters change
    params.delete('page')

    if (filters.bedrooms.length > 0) {
      params.set('bedrooms', filters.bedrooms)
    } else {
      params.delete('bedrooms')
    }

    if (filters.bathrooms.length > 0) {
      params.set('bathrooms', filters.bathrooms)
    } else {
      params.delete('bathrooms')
    }

    if (filters.parking.length > 0) {
      params.set('parking', filters.parking)
    } else {
      params.delete('parking')
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
    } else {
      params.delete('price_range')
    }

    if (filters.areaRange.length > 0 && filters.areaRange[0] !== 0 && filters.areaRange[1] !== 0) {
      params.set('area_range', filters.areaRange.join(','))
    } else {
      params.delete('area_range')
    }

    if (debouncedSearchValue.trim() !== '') {
      params.set('q', debouncedSearchValue)
    } else {
      params.delete('q')
    }

    return params
  }, [filters, debouncedSearchValue, currentFilter, currentPropertyType])

  const handleApplyFilters = useCallback(() => {
    const params = buildSearchParams()
    navigateWithFilters(params)
  }, [buildSearchParams, navigateWithFilters])

  const handleFilter = useCallback(
    (filter: string) => {
      const params = new URLSearchParams(window.location.search)
      params.delete('page')

      if (filter !== currentFilter) {
        params.set('filter', filter)
      } else {
        params.delete('filter')
      }

      navigateWithFilters(params)
    },
    [currentFilter, navigateWithFilters]
  )

  const handleType = useCallback(
    (type: string) => {
      const params = new URLSearchParams(window.location.search)
      params.delete('page')

      if (type !== currentPropertyType) {
        params.set('property_type', type)
      } else {
        params.delete('property_type')
      }

      navigateWithFilters(params)
    },
    [currentPropertyType, navigateWithFilters]
  )

  const clearFilters = useCallback(() => {
    router.visit(window.location.pathname, {
      preserveState: true,
      replace: true,
      only: ['listings', 'count', 'filters'],
    })
    setFilters(initialFilters)
    setSearchValue('')
  }, [])

  const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearchValue(value)
  }, [])

  // Sync URL search param with local state
  useEffect(() => {
    if (!q) {
      setSearchValue('')
    }
  }, [q])

  // Handle debounced search navigation
  useEffect(() => {
    // Skip on initial mount to avoid unnecessary request
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    const params = new URLSearchParams(window.location.search)
    params.delete('page') // Reset to page 1 on search

    if (debouncedSearchValue.trim() === '') {
      params.delete('q')
    } else {
      params.set('q', debouncedSearchValue)
    }

    navigateWithFilters(params)
  }, [debouncedSearchValue, navigateWithFilters])

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
