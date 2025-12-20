import { Button } from './ui/button'
import { Link } from '@inertiajs/react'

import { Logo } from './logo'
import { LoginModal } from './login-modal'
import { LogOut } from 'lucide-react'

type HeaderProps = {
  currentUser?: any
}

export function Header({ currentUser }: HeaderProps = {}) {
  return (
    <header className="bg-background shadow-xs py-0">
      <div className="mx-auto max-w-[1350px] py-4 flex items-center justify-between px-4 md:px-0">
        <Logo />

        <div className="flex items-center gap-4">
          {currentUser ? (
            <Link href="/logout" method="post" className="flex items-center gap-2">
              Sair
              <LogOut className="h-4 w-4" />
            </Link>
          ) : (
            <LoginModal>
              <Button variant="outline">Entrar</Button>
            </LoginModal>
          )}
        </div>
      </div>
    </header>
  )
}
