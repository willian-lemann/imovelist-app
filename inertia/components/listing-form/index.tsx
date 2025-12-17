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
import { useForm } from '@inertiajs/react'
import { useToast } from '../ui/use-toast'
import { FormEventHandler } from 'react'

export function ListingForm() {
  const { toast } = useToast()

  const { data, setData, post, processing, errors } = useForm({
    photos: [] as string[],
    name: '',
    type: '',
    address: '',
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    ref: '',
    price: 0,
    content: '',
    forSale: false,
  })

  const handleSubmit: FormEventHandler = (e) => {
    e.preventDefault()
    post('/listings', {
      onSuccess: () => {
        toast({ title: 'Anúncio publicado com sucesso!' })
      },
      onError: () => {
        Object.values(errors).forEach((error) =>
          toast({ title: error as string, variant: 'destructive' })
        )
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl flex flex-col mx-auto pt-10 pb-20">
      <Button className="ml-auto" type="submit" disabled={processing}>
        {processing ? 'Publicando...' : 'Publicar anúncio'}
      </Button>

      <div>
        <Label htmlFor="photos">Fotos</Label>
        {/* <UploadImages /> - Component needs to be adapted for Inertia */}
        <p className="text-sm text-muted-foreground">Image upload component needs implementation</p>
      </div>

      <div>
        <Label htmlFor="name">Código ou Ref do Imóvel</Label>
        <Input
          id="ref"
          name="ref"
          placeholder="Ref ou código do imóvel"
          type="text"
          value={data.ref}
          onChange={(e) => setData('ref', e.target.value)}
        />
        {errors.ref && <p className="text-sm text-red-500 mt-1">{errors.ref}</p>}
      </div>

      <div>
        <Label htmlFor="name">Título do imóvel</Label>
        <Input
          id="name"
          name="name"
          placeholder="Nome do imovel para aparecer na listagem"
          type="text"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
      </div>

      <div>
        <Label htmlFor="type">Tipo do imóvel</Label>
        <Select name="type" value={data.type} onValueChange={(value: string) => setData('type', value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo do imóvel" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Apartamento">Apartamento</SelectItem>
            <SelectItem value="Casa">Casa</SelectItem>
            <SelectItem value="Terreno">Terreno</SelectItem>
          </SelectContent>
        </Select>
        {errors.type && <p className="text-sm text-red-500 mt-1">{errors.type}</p>}
      </div>

      <div>
        <Label htmlFor="address">Endereço</Label>
        <Input
          id="address"
          name="address"
          placeholder="eg. Rua manoel araujo"
          type="text"
          value={data.address}
          onChange={(e) => setData('address', e.target.value)}
        />
        {errors.address && <p className="text-sm text-red-500 mt-1">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-4">
          <Label htmlFor="bedrooms">Quartos</Label>
          <Input
            id="bedrooms"
            name="bedrooms"
            placeholder="Número de quartos"
            type="number"
            value={data.bedrooms}
            onChange={(e) => setData('bedrooms', parseInt(e.target.value) || 0)}
          />
          {errors.bedrooms && <p className="text-sm text-red-500 mt-1">{errors.bedrooms}</p>}
        </div>

        <div className="col-span-4">
          <Label htmlFor="bathrooms">Banheiros</Label>
          <Input
            id="bathrooms"
            name="bathrooms"
            placeholder="Número de banheiros"
            type="number"
            value={data.bathrooms}
            onChange={(e) => setData('bathrooms', parseInt(e.target.value) || 0)}
          />
          {errors.bathrooms && <p className="text-sm text-red-500 mt-1">{errors.bathrooms}</p>}
        </div>

        <div className="col-span-4">
          <Label htmlFor="area">Area (m²)</Label>
          <Input
            id="area"
            name="area"
            placeholder="Area em metros quadrados"
            type="number"
            value={data.area}
            onChange={(e) => setData('area', parseInt(e.target.value) || 0)}
          />
          {errors.area && <p className="text-sm text-red-500 mt-1">{errors.area}</p>}
        </div>
      </div>

      <div>
        <Label htmlFor="price">Preço</Label>
        <Input
          id="price"
          name="price"
          placeholder="e.g. 1000000.00"
          type="number"
          value={data.price}
          onChange={(e) => setData('price', parseFloat(e.target.value) || 0)}
        />
        {errors.price && <p className="text-sm text-red-500 mt-1">{errors.price}</p>}
      </div>

      <div>
        <Label htmlFor="content">Descrição do imóvel</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Coloque uma breve descrição do imóvel"
          className="resize-none"
          value={data.content}
          onChange={(e) => setData('content', e.target.value)}
        />
        {errors.content && <p className="text-sm text-red-500 mt-1">{errors.content}</p>}
      </div>
    </form>
  )
}
