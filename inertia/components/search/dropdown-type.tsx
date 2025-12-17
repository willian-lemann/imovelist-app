import { ListFilterIcon } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Capitalize } from '@/lib/utils'

type FilterPropertyType = {
  onFilter(type: string): void
  currentType?: string | null
}

export function DropdownType({ onFilter, currentType }: FilterPropertyType) {
  const types = [
    { label: 'Apartamento', value: 'apartamento' },
    { label: 'Comercial', value: 'comercial' },
    { label: 'Residencial', value: 'residencial' },
  ]

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default" className="gap-1">
          <ListFilterIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {Capitalize(currentType) || 'Tipo de imóvel'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {types.map((type) => (
          <DropdownMenuCheckboxItem
            key={type.value}
            checked={currentType === type.value}
            onClick={() => onFilter(type.value)}
          >
            {type.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
