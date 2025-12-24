import { useState } from 'react'
import { Images, Upload, X, Lock, Trash2 } from 'lucide-react'

import { Button } from '~/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Badge } from '~/components/ui/badge'
import { Skeleton } from '~/components/ui/skeleton'
import { useListings, useUpdateListing } from '~/hooks/use-listings'
import { toast } from 'sonner'

type GallerySectionProps = {
  isPremium?: boolean
}

export function GallerySection({ isPremium = false }: GallerySectionProps) {
  const { data, isLoading } = useListings({ page: 1 })
  const updateMutation = useUpdateListing()

  const [selectedListingId, setSelectedListingId] = useState<string>('')
  const [newPhotos, setNewPhotos] = useState<string[]>([])

  const listings = Array.isArray(data?.listings) ? data.listings : []
  const selectedListing = listings.find((l) => l.id === Number(selectedListingId))

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium) return

    const files = event.target.files
    if (!files) return

    const fileArray = Array.from(files)
    const readers = fileArray.map(
      (file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (e) => resolve(e.target?.result as string)
          reader.onerror = reject
          reader.readAsDataURL(file)
        })
    )

    Promise.all(readers).then((images) => {
      setNewPhotos((prev) => [...prev, ...images])
    })

    event.target.value = ''
  }

  const handleRemoveNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveExistingPhoto = async (photoUrl: string) => {
    if (!selectedListing || !isPremium) return

    const updatedPhotos = (selectedListing.photos || []).filter((p) => p !== photoUrl)

    try {
      await updateMutation.mutateAsync({
        id: selectedListing.id,
        photos: updatedPhotos,
      })
      toast.success('Foto removida com sucesso!')
    } catch {
      toast.error('Erro ao remover foto')
    }
  }

  const handleSavePhotos = async () => {
    if (!selectedListing || !isPremium || newPhotos.length === 0) return

    const updatedPhotos = [...(selectedListing.photos || []), ...newPhotos]

    try {
      await updateMutation.mutateAsync({
        id: selectedListing.id,
        photos: updatedPhotos,
      })
      setNewPhotos([])
      toast.success('Fotos adicionadas com sucesso!')
    } catch {
      toast.error('Erro ao salvar fotos')
    }
  }

  // Locked state for non-premium users
  if (!isPremium) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Galeria</h2>
          <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">
            Premium
          </Badge>
        </div>

        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-amber-100 p-3">
              <Lock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Recurso Premium</h3>
              <p className="mt-1 text-sm text-amber-700">
                Gerencie a galeria de fotos de seus imóveis de forma profissional. Adicione, remova
                e organize as fotos de cada anúncio.
              </p>
              <Button size="sm" className="mt-4">
                Fazer Upgrade
              </Button>
            </div>
          </div>
        </div>

        {/* Preview of locked feature */}
        <Card className="opacity-60">
          <CardHeader>
            <CardTitle>Selecione um imóvel</CardTitle>
            <CardDescription>Escolha um imóvel para gerenciar suas fotos</CardDescription>
          </CardHeader>
          <CardContent>
            <Select disabled>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um imóvel" />
              </SelectTrigger>
            </Select>
          </CardContent>
        </Card>

        <Card className="opacity-60">
          <CardHeader>
            <CardTitle>Fotos do imóvel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                >
                  <Images className="h-8 w-8 text-gray-300" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Galeria</h2>
        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
          Premium Ativo
        </Badge>
      </div>

      {/* Listing Selector */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione um imóvel</CardTitle>
          <CardDescription>Escolha um imóvel para gerenciar suas fotos</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select value={selectedListingId} onValueChange={setSelectedListingId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um imóvel" />
              </SelectTrigger>
              <SelectContent>
                {listings.map((listing) => (
                  <SelectItem key={listing.id} value={String(listing.id)}>
                    {listing.name || `Imóvel #${listing.id}`} - {listing.address || 'Sem endereço'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {/* Gallery */}
      {selectedListing && (
        <>
          {/* Current Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Fotos atuais</CardTitle>
              <CardDescription>
                {selectedListing.photos?.length || 0} fotos no imóvel
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedListing.photos && selectedListing.photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {selectedListing.photos.map((photo, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={photo}
                        alt={`Foto ${index + 1}`}
                        className="aspect-square w-full object-cover rounded-lg"
                      />
                      <button
                        onClick={() => handleRemoveExistingPhoto(photo)}
                        disabled={updateMutation.isPending}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Images className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">Nenhuma foto cadastrada</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Upload New Photos */}
          <Card>
            <CardHeader>
              <CardTitle>Adicionar novas fotos</CardTitle>
              <CardDescription>Faça upload de novas fotos para este imóvel</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <label className="block">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors">
                  <Upload className="h-10 w-10 mx-auto text-gray-400 mb-3" />
                  <p className="text-sm text-gray-600 font-medium">Clique para selecionar fotos</p>
                  <p className="text-xs text-gray-400 mt-1">PNG, JPG até 10MB cada</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>

              {/* Preview of new photos */}
              {newPhotos.length > 0 && (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {newPhotos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={photo}
                          alt={`Nova foto ${index + 1}`}
                          className="aspect-square w-full object-cover rounded-lg"
                        />
                        <button
                          onClick={() => handleRemoveNewPhoto(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button onClick={handleSavePhotos} disabled={updateMutation.isPending}>
                      {updateMutation.isPending
                        ? 'Salvando...'
                        : `Salvar ${newPhotos.length} foto(s)`}
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
