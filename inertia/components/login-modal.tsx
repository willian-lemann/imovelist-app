import { Dialog, DialogClose, DialogContent, DialogTrigger } from '../components/ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { XIcon } from 'lucide-react'
import { router } from '@inertiajs/react'
import { FormEvent, useState, type PropsWithChildren } from 'react'
import axios from 'axios'

type LoginModalProps = PropsWithChildren<{
  onOpenChange?: (open: boolean) => void
}>

export function LoginModal({ children, onOpenChange }: LoginModalProps) {
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  })
  const [loginErrors, setLoginErrors] = useState<Record<string, string>>({})
  const [isLoginProcessing, setIsLoginProcessing] = useState(false)

  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    password_confirmation: '',
  })
  const [signupErrors, setSignupErrors] = useState<Record<string, string>>({})
  const [isSignupProcessing, setIsSignupProcessing] = useState(false)

  const handleOpenChange = (open: boolean) => {
    if (onOpenChange) {
      onOpenChange(open)
    }
    // Reset forms when modal closes
    if (!open) {
      setLoginData({ email: '', password: '' })
      setLoginErrors({})
      setSignupData({ email: '', password: '', password_confirmation: '' })
      setSignupErrors({})
    }
  }

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoginProcessing(true)
    setLoginErrors({})

    try {
      await axios.post('/api/signin', loginData)
      handleOpenChange(false)
      router.reload()
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setLoginErrors(error.response.data.errors)
      } else {
        setLoginErrors({ general: 'An error occurred. Please try again.' })
      }
      console.error('Login error:', error)
    } finally {
      setIsLoginProcessing(false)
    }
  }

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault()
    setIsSignupProcessing(true)
    setSignupErrors({})

    try {
      await axios.post('/api/signup', signupData)
      handleOpenChange(false)
      router.reload()
    } catch (error: any) {
      if (error.response?.data?.errors) {
        setSignupErrors(error.response.data.errors)
      } else {
        setSignupErrors({ general: 'An error occurred. Please try again.' })
      }
      console.error('Signup error:', error)
    } finally {
      setIsSignupProcessing(false)
    }
  }

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Sign in or create account</h2>
          <DialogClose asChild>
            <Button variant="ghost" size="icon">
              <XIcon className="w-5 h-5" />
            </Button>
          </DialogClose>
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          <TabsContent value="login">
            <form className="space-y-4" onSubmit={handleLogin}>
              {loginErrors.general && <p className="text-sm text-red-500">{loginErrors.general}</p>}
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
                {loginErrors.email && <p className="text-sm text-red-500">{loginErrors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  required
                />
                {loginErrors.password && (
                  <p className="text-sm text-red-500">{loginErrors.password}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isLoginProcessing}>
                {isLoginProcessing ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </TabsContent>
          <TabsContent value="signup">
            <form className="space-y-4" onSubmit={handleSignup}>
              {signupErrors.general && (
                <p className="text-sm text-red-500">{signupErrors.general}</p>
              )}
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  value={signupData.email}
                  onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  required
                />
                {signupErrors.email && <p className="text-sm text-red-500">{signupErrors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="Create a password"
                  value={signupData.password}
                  onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                  required
                />
                {signupErrors.password && (
                  <p className="text-sm text-red-500">{signupErrors.password}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password-confirm">Confirm Password</Label>
                <Input
                  id="signup-password-confirm"
                  type="password"
                  placeholder="Confirm your password"
                  value={signupData.password_confirmation}
                  onChange={(e) =>
                    setSignupData({ ...signupData, password_confirmation: e.target.value })
                  }
                  required
                />
                {signupErrors.password_confirmation && (
                  <p className="text-sm text-red-500">{signupErrors.password_confirmation}</p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isSignupProcessing}>
                {isSignupProcessing ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
