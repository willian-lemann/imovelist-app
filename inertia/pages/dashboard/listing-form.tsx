import { ChevronLeft } from 'lucide-react'
import { useEffect } from 'react'
import { useForm, type SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'

import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Textarea } from '~/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import { useListing, useCreateListing, useUpdateListing } from '~/hooks/use-listings'

const listingSchema = z.object({
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  type: z.string().min(1, 'Selecione o tipo de imóvel'),
  price: z.number().min(1, 'Informe o preço'),
  area: z.string().optional(),
  address: z.string().min(5, 'Informe o endereço'),
  bedrooms: z.number().min(0).optional(),
  bathrooms: z.number().min(0).optional(),
  parking: z.number().min(0).optional(),
  forSale: z.boolean(),
  content: z.string().optional(),
  ref: z.string().optional(),
})

type ListingFormData = z.infer<typeof listingSchema>

type ListingFormProps = {
  listingId: number | null
  onCancel: () => void
  onSuccess: () => void
}

const propertyTypes = [
  { value: 'apartamento', label: 'Apartamento' },
  { value: 'casa', label: 'Casa' },
  { value: 'terreno', label: 'Terreno' },
  { value: 'comercial', label: 'Comercial' },
  { value: 'cobertura', label: 'Cobertura' },
  { value: 'studio', label: 'Studio' },
]

export function ListingForm({ listingId, onCancel, onSuccess }: ListingFormProps) {
  const isEditing = listingId !== null
  const { data: listing, isLoading: isLoadingListing } = useListing(listingId ?? 0)
  const createMutation = useCreateListing()
  const updateMutation = useUpdateListing()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema) as any,
    defaultValues: {
      name: '',
      type: '',
      price: 0,
      area: '',
      address: '',
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      forSale: true,
      content: '',
      ref: '',
    },
  })

  // Load existing listing data when editing
  useEffect(() => {
    if (isEditing && listing) {
      reset({
        name: listing.name ?? '',
        type: listing.type ?? '',
        price: listing.price ?? 0,
        area: listing.area ?? '',
        address: listing.address ?? '',
        bedrooms: listing.bedrooms ?? 0,
        bathrooms: listing.bathrooms ?? 0,
        parking: listing.parking ?? 0,
        forSale: listing.forSale ?? true,
        content: listing.content ?? '',
        ref: listing.ref ?? '',
      })
    }
  }, [isEditing, listing, reset])

  const onSubmit = async (data: ListingFormData) => {
    try {
      if (isEditing && listingId) {
        await updateMutation.mutateAsync({ id: listingId, ...data })
        toast.success('Anúncio atualizado com sucesso!')
      } else {
        await createMutation.mutateAsync(data)
        toast.success('Anúncio criado com sucesso!')
      }
      onSuccess()
    } catch {
      toast.error('Erro ao salvar anúncio. Tente novamente.')
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending

  if (isEditing && isLoadingListing) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    )
  }

  const submitHandler: SubmitHandler<ListingFormData> = onSubmit

  return (
    <form onSubmit={handleSubmit(submitHandler)} className="grid gap-6">
      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold tracking-tight">
          {isEditing ? 'Editar Anúncio' : 'Novo Anúncio'}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Informações Básicas</CardTitle>
            <CardDescription>Adicione as informações principais do imóvel</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome do imóvel</Label>
              <Input
                id="name"
                placeholder="Ex: Apartamento 3 quartos - Centro"
                {...register('name')}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de imóvel</Label>
              <Select value={watch('type')} onValueChange={(value) => setValue('type', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.type && <p className="text-sm text-red-500">{errors.type.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input
                id="price"
                type="number"
                placeholder="Ex: 450000"
                {...register('price', { valueAsNumber: true })}
              />
              {errors.price && <p className="text-sm text-red-500">{errors.price.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Área (m²)</Label>
              <Input id="area" placeholder="Ex: 120m²" {...register('area')} />
            </div>

            <div className="space-y-2">
              <Label>Tipo de negócio</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="true"
                    checked={watch('forSale') === true}
                    onChange={() => setValue('forSale', true)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Venda</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="false"
                    checked={watch('forSale') === false}
                    onChange={() => setValue('forSale', false)}
                    className="h-4 w-4"
                  />
                  <span className="text-sm">Aluguel</span>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Location & Details */}
        <Card>
          <CardHeader>
            <CardTitle>Localização e Detalhes</CardTitle>
            <CardDescription>Informações sobre localização e características</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                placeholder="Ex: Rua das Flores, 123 - Centro"
                {...register('address')}
              />
              {errors.address && <p className="text-sm text-red-500">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Quartos</Label>
                <Input
                  id="bedrooms"
                  type="number"
                  min="0"
                  {...register('bedrooms', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="bathrooms">Banheiros</Label>
                <Input
                  id="bathrooms"
                  type="number"
                  min="0"
                  {...register('bathrooms', { valueAsNumber: true })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="parking">Vagas</Label>
                <Input
                  id="parking"
                  type="number"
                  min="0"
                  {...register('parking', { valueAsNumber: true })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ref">Referência</Label>
              <Input id="ref" placeholder="Ex: AP-001" {...register('ref')} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Descrição</Label>
              <Textarea
                id="content"
                placeholder="Descreva o imóvel..."
                rows={4}
                {...register('content')}
              />
            </div>
          </CardContent>
        </Card>

        {/* Photos Info */}
        <Card>
          <CardHeader>
            <CardTitle>Fotos</CardTitle>
            <CardDescription>Gerencie as fotos do imóvel</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm text-blue-800">
                {isEditing ? (
                  <>
                    <strong>Dica:</strong> Para adicionar ou remover fotos deste imóvel, utilize a
                    seção <strong>"Galeria"</strong> no menu lateral após salvar as alterações.
                  </>
                ) : (
                  <>
                    <strong>Dica:</strong> Após criar o anúncio, você poderá adicionar fotos através
                    da seção <strong>"Galeria"</strong> no menu lateral.
                  </>
                )}
              </p>
              {isEditing && listing?.photos && listing.photos.length > 0 && (
                <p className="text-sm text-blue-700 mt-2">
                  Este imóvel possui {listing.photos.length} foto(s) cadastrada(s).
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar Anúncio'}
        </Button>
      </div>
    </form>
  )
}
