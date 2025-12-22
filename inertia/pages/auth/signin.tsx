import { Head, Link, router } from '@inertiajs/react'
import { useForm as useReactHookForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import axios from 'axios'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { Logo } from '~/components/logo'

const signinSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
})

type SigninFormData = z.infer<typeof signinSchema>

type SigninProps = {
  errors?: {
    email?: string
    password?: string
  }
}

export default function Signin({ errors: serverErrors }: SigninProps) {
  const [processing, setProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useReactHookForm<SigninFormData>({
    resolver: zodResolver(signinSchema),
  })

  const onSubmit = async (data: SigninFormData) => {
    setProcessing(true)

    try {
      await axios.post('/api/signin', data)
      router.visit('/')
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors
        if (serverErrors.email) {
          setError('email', { message: serverErrors.email })
        }
        if (serverErrors.password) {
          setError('password', { message: serverErrors.password })
        }
      }
    } finally {
      setProcessing(false)
    }
  }

  return (
    <>
      <Head title="Entrar - Imovelist" />

      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Entrar</CardTitle>
              <CardDescription>Entre com seu email e senha para acessar sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    {...register('email')}
                    disabled={processing}
                  />
                  {(errors.email || serverErrors?.email) && (
                    <p className="text-sm text-destructive">
                      {errors.email?.message || serverErrors?.email}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register('password')}
                    disabled={processing}
                  />
                  {errors.password && (
                    <p className="text-sm text-destructive">{errors.password.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? 'Entrando...' : 'Entrar'}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                Não tem uma conta?{' '}
                <Link href="/signup" className="text-primary hover:underline">
                  Criar conta
                </Link>
              </div>
            </CardContent>
          </Card>

          <div className="mt-4 text-center text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              ← Voltar para página inicial
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
