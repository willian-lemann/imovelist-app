import { useState, useEffect } from 'react'
import { Slider } from '~/components/ui/slider'
import { CardContent, CardHeader, CardTitle } from '~/components/ui/card'

interface RangeFilterProps {
  title: string
  min: number
  max: number
  step?: number
  defaultValue?: [number, number]
  formatValue?: (value: number) => string
  unit?: string
  onChange?: (range: [number, number]) => void
  className?: string
}

export function RangeFilter({
  title,
  min,
  max,
  step = 1,
  defaultValue = [min, max],
  formatValue,
  unit = '',
  onChange,
  className = '',
}: RangeFilterProps) {
  const [range, setRange] = useState<[number, number]>(defaultValue)
  const [inputValues, setInputValues] = useState({
    min: defaultValue[0].toString(),
    max: defaultValue[1].toString(),
  })

  useEffect(() => {
    onChange?.(range)
  }, [range])

  const handleSliderChange = (values: number[]) => {
    const newRange: [number, number] = [values[0], values[1]]
    setRange(newRange)
    setInputValues({
      min: values[0].toString(),
      max: values[1].toString(),
    })
  }

  const handleInputChange = (type: 'min' | 'max', value: string) => {
    setInputValues((prev) => ({ ...prev, [type]: value }))

    const numValue = Number.parseFloat(value)
    if (!Number.isNaN(numValue)) {
      const newRange: [number, number] =
        type === 'min'
          ? [Math.max(min, Math.min(numValue, range[1])), range[1]]
          : [range[0], Math.min(max, Math.max(numValue, range[0]))]

      setRange(newRange)
    }
  }

  const formatDisplayValue = (value: number) => {
    if (formatValue) {
      return formatValue(value)
    }
    return `${value.toLocaleString()}${unit}`
  }

  return (
    <div>
      <CardHeader className="pb-3 px-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 px-0">
        {/* Range Display */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{formatDisplayValue(range[0])}</span>
          <span>-</span>
          <span>{formatDisplayValue(range[1])}</span>
        </div>

        {/* Slider */}
        <div>
          <Slider
            value={range}
            onValueChange={handleSliderChange}
            min={min}
            max={max}
            step={step}
            className="w-full"
          />
        </div>
      </CardContent>
    </div>
  )
}
