import {
  Tooltip as TooltipComponent,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '~/components/ui/tooltip'

type TooltipProps = {
  children: React.ReactNode
  content?: string
}

export function Tooltip({ children, content }: TooltipProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <TooltipComponent>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="dark px-2 py-1 text-xs" showArrow={true}>
          {content}
        </TooltipContent>
      </TooltipComponent>
    </TooltipProvider>
  )
}
