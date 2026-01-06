import { ListFilterIcon } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Capitalize } from '@/lib/utils'
import { router } from '@inertiajs/react'

type FilterPropertyFilter = {
  onFilter(filter: string): void
  onFilterPrefetch?(): void
  currentFilter?: string | null
}

export function DropdownFilter({
  onFilter,

  currentFilter,
}: FilterPropertyFilter) {
  const filtersPropertyType = [
    { label: 'Aluguel', value: 'aluguel' },
    { label: 'Venda', value: 'venda' },
  ]

  function handlePrefetchFilter(filter: string) {
    router.prefetch(`${window.location.pathname}?filter=${filter}`, {
      only: ['listings'],
    })
  }

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default" className="gap-1">
          <ListFilterIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {Capitalize(currentFilter!) || 'Finalidade'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {filtersPropertyType.map((filter) => (
          <DropdownMenuCheckboxItem
            checked={currentFilter === filter.value}
            key={filter.value}
            className=" px-2"
            onMouseOver={() => handlePrefetchFilter(filter.value)}
            onClick={() => onFilter(filter.value)}
          >
            {filter.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
