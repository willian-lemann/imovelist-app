import { useState } from 'react'
import { Images, Upload, X, Lock, Trash2, GripVertical } from 'lucide-react'

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
import { useListings } from '~/hooks/use-listings'
import {
  useGalleryPhotos,
  useUploadGalleryPhotos,
  useDeleteGalleryPhoto,
  type GalleryPhoto,
} from '~/hooks/use-gallery'
import { toast } from 'sonner'
import { usePage } from '@inertiajs/react'
import GalleryUpload from '~/components/file-upload/gallery-upload'

type GallerySectionProps = {
  isPremium?: boolean
}
type NewPhoto = { file: File; preview: string }

export function GallerySection({ isPremium = false }: GallerySectionProps) {
  const { currentUser } = usePage<{
    currentUser: { id: number }
  }>().props

  const { data, isLoading } = useListings({ page: 1, userId: currentUser?.id })

  const [selectedListingId, setSelectedListingId] = useState<string>('')

  console.log('Selected Listing ID:', selectedListingId)
  const [newPhotos, setNewPhotos] = useState<NewPhoto[]>([])

  const { data: galleryPhotos = [], isLoading: isLoadingGallery } = useGalleryPhotos(
    selectedListingId ? Number(selectedListingId) : null
  )

  const uploadMutation = useUploadGalleryPhotos()
  const deleteMutation = useDeleteGalleryPhoto()

  const listings = Array.isArray(data?.listings) ? data.listings : []

  const selectedListing = listings.find((l) => l.id === Number(selectedListingId))

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPremium) return

    const files = event.target.files
    if (!files) return

    const fileArray = Array.from(files)
    const newPhotoObjs = fileArray.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }))

    setNewPhotos((prev) => [...prev, ...newPhotoObjs])

    event.target.value = ''
  }

  const handleRemoveNewPhoto = (index: number) => {
    setNewPhotos((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDeletePhoto = async (photo: GalleryPhoto) => {
    if (!selectedListingId || !isPremium) return

    try {
      await deleteMutation.mutateAsync({
        photoId: photo.id,
        listingId: Number(selectedListingId),
      })
      toast.success('Foto removida com sucesso!')
    } catch {
      toast.error('Erro ao remover foto')
    }
  }

  const handleSavePhotos = async () => {
    if (!selectedListingId || !isPremium || newPhotos.length === 0) return

    try {
      await uploadMutation.mutateAsync({
        listingId: Number(selectedListingId),
        files: newPhotos.map((p) => p.file),
      })

      // Clean up object URLs
      newPhotos.forEach((p) => URL.revokeObjectURL(p.preview))
      setNewPhotos([])
      toast.success('Fotos enviadas com sucesso!')
    } catch {
      toast.error('Erro ao enviar fotos')
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

        <div className="rounded-xl border border-amber-200 bg-amber-50 p-6">
          <div className="flex items-start gap-4">
            <div className="rounded-full bg-amber-100 p-3">
              <Lock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-semibold text-amber-800">Recurso Premium</h3>
              <p className="mt-1 text-sm text-amber-700">
                Gerencie a galeria de fotos de seus imóveis de forma profissional. Adicione, remova
                e organize as fotos de cada anúncio. As fotos são armazenadas em nuvem de alta
                disponibilidade.
              </p>
              <Button size="sm" className="mt-4">
                Fazer Upgrade
              </Button>
            </div>
          </div>
        </div>

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
                  className="aspect-square bg-gray-100 rounded-xl flex items-center justify-center"
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
        {/* <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
          Premium Ativo
        </Badge> */}
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

      {selectedListing && galleryPhotos.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Fotos atuais</CardTitle>
            <CardDescription>
              {isLoadingGallery ? 'Carregando...' : `${galleryPhotos.length} foto(s) no imóvel`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingGallery ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="aspect-square w-full rounded-xl" />
                ))}
              </div>
            ) : galleryPhotos.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {galleryPhotos.map((photo) => (
                  <div key={photo.id} className="relative group">
                    <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
                      <div className="bg-white/80 rounded p-1">
                        <GripVertical className="h-4 w-4 text-gray-600" />
                      </div>
                    </div>
                    <img
                      src={photo.url}
                      alt={`Foto ${photo.order + 1}`}
                      className="aspect-square w-full object-cover rounded-xl"
                    />
                    <button
                      onClick={() => handleDeletePhoto(photo)}
                      disabled={deleteMutation.isPending}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    {photo.size && (
                      <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                        {(photo.size / 1024).toFixed(0)} KB
                      </div>
                    )}
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
      )}

      <Card>
        <CardHeader>
          <CardTitle>Adicionar novas fotos</CardTitle>
          <CardDescription>As fotos serão enviadas para o armazenamento em nuvem </CardDescription>
        </CardHeader>
        <CardContent>
          <GalleryUpload
            maxFiles={20}
            maxSize={10 * 1024 * 1024}
            accept="image/*"
            multiple
            onFilesChange={(files) => {
              const newPhotoObjs = files
                .filter((f) => f.file instanceof File)
                .map((f) => ({
                  file: f.file as File,
                  preview: f.preview || '',
                }))
              setNewPhotos(newPhotoObjs)
            }}
          />

          {newPhotos.length > 0 && (
            <div className="mt-4 flex justify-end">
              <Button onClick={handleSavePhotos} disabled={uploadMutation.isPending}>
                {uploadMutation.isPending ? 'Enviando...' : `Enviar ${newPhotos.length} foto(s)`}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
