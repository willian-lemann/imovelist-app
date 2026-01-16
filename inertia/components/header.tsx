import { Button } from './ui/button'
import { Link, usePage } from '@inertiajs/react'

import { Logo } from './logo'
import { LoginModal } from './login-modal'
import { LogOut, LayoutDashboard } from 'lucide-react'

export function Header() {
  const { isLogged } = usePage().props

  return (
    <header className="bg-background shadow-xs py-0">
      <div className="mx-auto max-w-[1350px] py-4 flex items-center justify-between px-4 md:px-0">
        <Logo />

        {/* <div className="flex items-center gap-4">
          {isLogged ? (
            <>
              <Link href="/dashboard">
                <Button variant="outline" className="gap-2 gradient">
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/logout" method="post" className="flex items-center gap-2">
                <Button variant="ghost" className="">
                  Sair
                  <LogOut className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </>
          ) : (
            <LoginModal>
              <Button variant="outline" className="">
                Entrar
              </Button>
            </LoginModal>
          )}
        </div> */}
      </div>
    </header>
  )
}
