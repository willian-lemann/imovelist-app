import { ListFilterIcon } from 'lucide-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Capitalize } from '@/lib/utils'
import { useGroupTypes } from '~/hooks/use-listings'

type FilterPropertyType = {
  onFilter(type: string): void
  currentType?: string | null
}

export function DropdownType({ onFilter, currentType }: FilterPropertyType) {
  const { data: groupTypesData = [] } = useGroupTypes()

  const types = groupTypesData.map((type) => ({
    value: type,
    label: Capitalize(type),
  }))

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="default" className="gap-1">
          <ListFilterIcon className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            {Capitalize(currentType!) || 'Tipo de imóvel'}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {types.map((type) => (
          <DropdownMenuCheckboxItem
            key={type.value}
            checked={currentType === type.value}
            onClick={() => onFilter(type.value)}
            className="px-2"
          >
            {type.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
