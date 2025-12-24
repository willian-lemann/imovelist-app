import { Head, Link } from '@inertiajs/react'
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

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter no mínimo 6 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  })

type SignupFormData = z.infer<typeof signupSchema>

type SignupProps = {
  errors?: {
    email?: string
    fullName?: string
    password?: string
  }
}

export default function Signup({ errors: serverErrors }: SignupProps) {
  const [processing, setProcessing] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
  } = useReactHookForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupFormData) => {
    const { confirmPassword, ...submitData } = data
    setProcessing(true)
    try {
      await axios.post('/api/signup', submitData)
    } catch (error: any) {
      if (error.response?.data?.errors) {
        const serverErrors = error.response.data.errors
        if (serverErrors.email) {
          setError('email', { message: serverErrors.email })
        }
        if (serverErrors.fullName) {
          setError('fullName', { message: serverErrors.fullName })
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
      <Head title="Criar conta - Imovelist" />

      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="w-full max-w-md">
          <div className="mb-8 flex justify-center">
            <Link href="/">
              <Logo />
            </Link>
          </div>

          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
              <CardDescription>Preencha os dados abaixo para criar sua conta</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nome completo</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="João Silva"
                    {...register('fullName')}
                    disabled={processing}
                  />
                  {(errors.fullName || serverErrors?.fullName) && (
                    <p className="text-sm text-destructive">
                      {errors.fullName?.message || serverErrors?.fullName}
                    </p>
                  )}
                </div>

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
                  {(errors.password || serverErrors?.password) && (
                    <p className="text-sm text-destructive">
                      {errors.password?.message || serverErrors?.password}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register('confirmPassword')}
                    disabled={processing}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={processing}>
                  {processing ? 'Criando conta...' : 'Criar conta'}
                </Button>
              </form>

              <div className="mt-4 text-center text-sm">
                Já tem uma conta?{' '}
                <Link href="/signin" className="text-primary hover:underline">
                  Entrar
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
