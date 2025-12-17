import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../components/ui/dialog'
import { Button } from './ui/button'
import { XIcon } from 'lucide-react'

import type { PropsWithChildren } from 'react'

type LoginModalProps = PropsWithChildren<{
  onOpenChange?: (open: boolean) => void
}>

export function LoginModal({ children, onOpenChange }: LoginModalProps) {
  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogClose>
          <Button className="absolute right-3 w-fit h-fit bg-transparent hover:bg-transparent px-0 py-0 top-3 z-50">
            <XIcon className=" text-primary z-[9999] w-4 h-4 cursor-pointer" />
          </Button>
        </DialogClose>

        {/* Add your login form component here */}
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Login</h2>
          <p>Login form goes here</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
