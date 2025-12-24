import { Button } from '~/components/ui/button'
import { ListFilterPlusIcon } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { RangeFilter } from '../range-filter'
import { formatMoney } from '@/lib/utils'
import { useMemo, useState } from 'react'

export type Filters = {
  bathrooms: string
  bedrooms: string
  parking: string
  property_type: string
  priceRange: [number, number]
  areaRange: [number, number]
}

type AdvancedFiltersProps = {
  filters: Filters
  isFetching: boolean
  currentFilter?: string | null
  onFilters: (filters: Partial<Filters>) => void
  onApply: () => void
  onReset: () => void
}

export const initialFilters: Filters = {
  bathrooms: '',
  bedrooms: '',
  parking: '',
  property_type: '',
  priceRange: [0, 0],
  areaRange: [0, 0],
}

export function AdvancedFilters({
  filters,
  isFetching,
  currentFilter,
  onFilters,
  onApply,
  onReset,
}: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const isRent = currentFilter?.toLowerCase() === 'aluguel'

  const defaultRangeFilter = useMemo(() => {
    let defaultValue: [number, number] = [10000, 2000000]
    let step = 100000
    let max = 5000000

    if (isRent) {
      step = 500
      max = 10000
      defaultValue = [0, 10000]
    }

    return {
      max,
      step,
      defaultValue,
    }
  }, [isRent])

  return (
    <DropdownMenu
      modal={false}
      open={isOpen}
      onOpenChange={(value) => {
        setIsOpen(value)
      }}
    >
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default" className="gap-1">
          <ListFilterPlusIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">Mais filtros</span>
        </Button>
      </DropdownMenuTrigger>
      {isOpen && (
        <DropdownMenuContent
          align="center"
          className="px-2 mx-[7px] md:max-w-md md:min-w-md -translate-x-[0.5px] -translate-y-2 flex flex-col mt-4 shadow-2xl"
        >
          <DropdownMenuLabel className="px-0">Filtros</DropdownMenuLabel>

          <DropdownMenuSeparator />

          <div className="space-y-2 pb-10">
            <div className="px-0">
              <RangeFilter
                title="Preço"
                min={0}
                max={defaultRangeFilter.max}
                step={defaultRangeFilter.step}
                defaultValue={defaultRangeFilter.defaultValue}
                formatValue={formatMoney}
                onChange={(priceRange) => {
                  onFilters({ priceRange })
                }}
              />
            </div>

            <DropdownMenuSeparator />

            {/* <div className="px-0">
              <RangeFilter
                title="Area (m²)"
                min={0}
                max={1000}
                step={100}
                defaultValue={[0, 1000]}
                formatValue={formatMoney}
                onChange={(areaRange) => {
                  onFilters({
                    areaRange,
                  });
                }}
              />
            </div> */}

            <DropdownMenuSeparator />

            <div className="flex space-x-4">
              <div className="flex-1">
                <DropdownMenuLabel className="px-0">Quartos</DropdownMenuLabel>
                <Select
                  value={filters.bedrooms}
                  onValueChange={(value) => onFilters({ ...filters, bedrooms: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent className="z-50">
                    <SelectItem value="1">1 quarto</SelectItem>
                    <SelectItem value="2">2 quartos</SelectItem>
                    <SelectItem value="3">3 quartos</SelectItem>
                    <SelectItem value="4">4 quartos</SelectItem>
                    <SelectItem value="5">5+ quartos</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <DropdownMenuLabel className="px-0">Banheiros</DropdownMenuLabel>
                <Select
                  value={filters.bathrooms}
                  onValueChange={(value) => onFilters({ ...filters, bathrooms: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 banheiro</SelectItem>
                    <SelectItem value="2">2 banheiros</SelectItem>
                    <SelectItem value="3">3 banheiros</SelectItem>
                    <SelectItem value="4">4+ banheiros</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <DropdownMenuLabel className="px-0">Garagem</DropdownMenuLabel>
                <Select
                  value={filters.parking}
                  onValueChange={(value) => onFilters({ ...filters, parking: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 vaga</SelectItem>
                    <SelectItem value="2">2 vagas</SelectItem>
                    <SelectItem value="3">3 vagas</SelectItem>
                    <SelectItem value="4">4+ vagas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex gap-2 self-end">
            <Button className="mb-4" variant="outline" onClick={onReset}>
              Limpar
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false)
                onApply()
              }}
              disabled={isFetching}
              className="mb-4 disabled:opacity-20"
            >
              Pesquisar
            </Button>
          </div>
        </DropdownMenuContent>
      )}
    </DropdownMenu>
  )
}
