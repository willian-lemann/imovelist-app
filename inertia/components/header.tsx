import { Button } from './ui/button'
import { Link } from '@inertiajs/react'

import { Logo } from './logo'
import { LoginModal } from './login-modal'

type HeaderProps = {
  currentUser?: any
}

export function Header({ currentUser }: HeaderProps = {}) {
  return (
    <header className="bg-background shadow-xs py-0">
      <div className="container py-4 flex items-center justify-between px-4 md:px-0">
        <Logo />

        <div className="flex items-center gap-4">
          {/* {currentUser ? (
            <Button type="button" variant="outline">
              <Link to="/dashboard">Minha area</Link>
            </Button>
          ) : (
            <LoginModal>
              <Button variant="outline">Entrar</Button>
            </LoginModal>
          )} */}

          {/* <a href="/announce" className="btn">
                Anunciar
              </a> */}

          {/* <Button variant="outline">Login</Button> */}

          {/* <a href="/login" className="btn">
                Sou corretor
              </a> */}
        </div>
      </div>
    </header>
  )
}
