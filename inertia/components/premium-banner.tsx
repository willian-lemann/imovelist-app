import { ArrowRightIcon } from 'lucide-react'
import { Link } from '@inertiajs/react'

export function PremiumBanner() {
  return (
    <div className="dark bg-muted text-foreground px-4 py-3">
      <p className="flex justify-center text-sm">
        <Link href="/precos" className="group">
          <span className="me-1 text-base leading-none">✨</span>
          Recurso exclusivo para usuários premium
          <ArrowRightIcon
            className="ms-2 -mt-0.5 inline-flex opacity-60 transition-transform group-hover:translate-x-0.5"
            size={16}
            aria-hidden="true"
          />
        </Link>
      </p>
    </div>
  )
}
