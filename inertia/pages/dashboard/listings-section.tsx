import { BathIcon, BedIcon, Car, RulerIcon, Upload, Pencil, Trash2 } from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent } from '~/components/ui/card'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { useListings, useDeleteListing, useUpdateListing } from '~/hooks/use-listings'
import type { ListingType } from '~/types/listing'
import { toast } from 'sonner'
import { Capitalize } from '~/lib/utils'
import { usePage } from '@inertiajs/react'

type ListingsSectionProps = {
  onEdit: (listingId: number) => void
  onCreateNew: () => void
}

function formatPrice(price: number | null, forSale: boolean | null): string {
  if (!price) return 'Preço não informado'
  const formatted = price.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
  return forSale ? formatted : `${formatted}/mês`
}

export function ListingsSection({ onEdit, onCreateNew }: ListingsSectionProps) {
  const { currentUser } = usePage<{ currentUser: { id: number } }>().props

  const { data, isLoading, error } = useListings({ page: 1, userId: currentUser.id })
  console.log(data)
  const deleteMutation = useDeleteListing()
  const updateMutation = useUpdateListing()

  const listings = Array.isArray(data?.listings) ? data.listings : []

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este anúncio?')) return

    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Anúncio excluído com sucesso!')
    } catch {
      toast.error('Erro ao excluir anúncio')
    }
  }

  const handleTogglePublish = async (listing: ListingType) => {
    try {
      await updateMutation.mutateAsync({
        id: listing.id,
        published: !listing.published,
      })
      toast.success(listing.published ? 'Anúncio despublicado!' : 'Anúncio publicado!')
    } catch {
      toast.error('Erro ao atualizar anúncio')
    }
  }

  if (error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <p className="text-red-800">Erro ao carregar anúncios. Tente novamente.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Meus Anúncios</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={onCreateNew}>
            Novo Anúncio
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Skeleton className="h-24 w-32 rounded-md" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Upload className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum anúncio encontrado</h3>
            <p className="text-gray-500 text-center mb-4">
              Você ainda não possui anúncios cadastrados. Comece criando seu primeiro anúncio.
            </p>
            <Button onClick={onCreateNew}>Criar Primeiro Anúncio</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {listings.map((listing) => (
            <Card key={listing.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <img
                    src={listing.image || '/placeholder.svg'}
                    alt={listing.name || 'Imóvel'}
                    className="h-24 w-32 rounded-md object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{listing.name || 'Sem nome'}</h3>
                        <p className="text-sm text-gray-600 mb-2">
                          {listing.address || 'Endereço não informado'}
                        </p>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500">
                          {listing.type && (
                            <Badge variant="secondary">{Capitalize(listing.type)}</Badge>
                          )}
                          {listing.area && (
                            <span className="flex items-center gap-1">
                              <RulerIcon className="h-4 w-4" />
                              {listing.area}
                            </span>
                          )}
                          {listing.bedrooms !== null && (
                            <span className="flex items-center gap-1">
                              <BedIcon className="h-4 w-4" />
                              {listing.bedrooms} quartos
                            </span>
                          )}
                          {listing.bathrooms !== null && (
                            <span className="flex items-center gap-1">
                              <BathIcon className="h-4 w-4" />
                              {listing.bathrooms} banheiros
                            </span>
                          )}
                          {listing.parking !== null && (
                            <span className="flex items-center gap-1">
                              <Car className="h-4 w-4" />
                              {listing.parking} vagas
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-primary">
                          {formatPrice(listing.price, listing.forSale)}
                        </p>
                        {listing.ref && <p className="text-xs text-gray-500">REF: {listing.ref}</p>}
                      </div>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-2">
                        <Badge variant={listing.published ? 'default' : 'secondary'}>
                          {listing.published ? 'Publicado' : 'Rascunho'}
                        </Badge>
                        {listing.forSale !== null && (
                          <Badge variant="outline">{listing.forSale ? 'Venda' : 'Aluguel'}</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleTogglePublish(listing)}
                          disabled={updateMutation.isPending}
                        >
                          {listing.published ? 'Despublicar' : 'Publicar'}
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => onEdit(listing.id)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(listing.id)}
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
