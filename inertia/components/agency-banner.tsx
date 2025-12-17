import { ArrowRightIcon } from 'lucide-react'
import { Link } from '@inertiajs/react'

type AgencyBannerProps = {
  agency: string
  listingURL: string
}

export function AgencyBanner({ agency, listingURL }: AgencyBannerProps) {
  return (
    <div className="bg-black text-muted px-4 py-3">
      <p className="flex justify-center text-sm">
        <Link href={listingURL} className="group">
          <span className="me-1 text-base leading-none">✨</span>
          Esse imóvel pertence a imobiliária <strong>{agency}</strong>
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
