import { ListFilterIcon } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Capitalize } from '@/lib/utils'

type FilterPropertyFilter = {
  onFilter(filter: string): void
  currentFilter?: string | null
}

export function DropdownFilter({ onFilter, currentFilter }: FilterPropertyFilter) {
  const filtersPropertyType = [
    { label: 'Aluguel', value: 'aluguel' },
    { label: 'Venda', value: 'venda' },
  ]

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default" className="gap-1">
          <ListFilterIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {Capitalize(currentFilter) || 'Finalidade'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {filtersPropertyType.map((filter) => (
          <DropdownMenuCheckboxItem
            checked={currentFilter === filter.value}
            key={filter.value}
            className="flex-1/2"
            onClick={() => onFilter(filter.value)}
          >
            {filter.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
