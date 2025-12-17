import { House } from 'lucide-react'
import { Link } from '@inertiajs/react'

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2">
      <House />
      <span className="font-bold text-lg">Imovelist</span>
    </Link>
  )
}
