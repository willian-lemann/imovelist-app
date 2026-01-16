import { useState } from 'react'
import { useForm } from '@inertiajs/react'
import {
  Globe,
  Link as LinkIcon,
  Camera,
  Image,
  Star,
  Instagram,
  HelpCircle,
  User,
  Phone,
  Palette,
} from 'lucide-react'
import { Button } from '~/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'

type ProfileProps = {
  user?: {
    id: number
    fullName: string | null
    email: string
    profilePhoto?: string | null
    whatsapp?: string | null
    profileUrl?: string | null
    logo?: string | null
  }
}

export function Profile({ user }: ProfileProps) {
  const [profilePhoto, setProfilePhoto] = useState<string | null>(user?.profilePhoto ?? null)
  const [logo, setLogo] = useState<string | null>(user?.logo ?? null)

  const { data, setData, post, processing } = useForm({
    fullName: user?.fullName || '',
    whatsapp: user?.whatsapp || '',
    profileUrl: user?.profileUrl || '',
  })

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogo(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const formatWhatsapp = (value: string) => {
    const numbers = value.replace(/\D/g, '')
    if (numbers.length <= 2) return `(${numbers}`
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`
  }

  const handleWhatsappChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatWhatsapp(e.target.value)
    setData('whatsapp', formatted)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Configurações de Perfil</h1>
        <p className="mt-1 text-gray-500">
          Gerencie sua identidade digital e aumente sua credibilidade.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Main Content - Left Side */}
        <div className="space-y-6 lg:col-span-2">
          {/* Profile Photo & Basic Info */}
          <Card className="border-gray-100 shadow-md">
            <CardContent className="p-6">
              <div className="flex flex-col items-start gap-6 sm:flex-row">
                {/* Profile Photo */}
                <div className="flex flex-col items-center">
                  <div className="relative h-32 w-32 overflow-hidden rounded-xl bg-gray-100">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Foto de perfil"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <User className="h-16 w-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <label className="mt-3 cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                    <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                      <Camera className="h-4 w-4" />
                      Trocar Foto
                    </span>
                  </label>
                </div>

                {/* Form Fields */}
                <div className="flex-1 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Nome Profissional</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="fullName"
                        value={data.fullName}
                        onChange={(e) => setData('fullName', e.target.value)}
                        placeholder="Seu nome"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp para Contato</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <Input
                        id="whatsapp"
                        value={data.whatsapp}
                        onChange={handleWhatsappChange}
                        placeholder="(00) 00000-0000"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Digital Identity */}
          <Card className="border-gray-100 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-gray-900">Identidade Digital</h3>
              </div>
              <p className="mb-4 text-sm text-gray-500">
                Personalize seu link exclusivo para sua vitrine profissional.
              </p>

              <div className="space-y-2">
                <Label htmlFor="profileUrl">URL do Perfil (Único)</Label>
                <div className="flex overflow-hidden rounded-xl border border-gray-200 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                  <span className="flex items-center bg-gray-50 px-4 text-sm text-gray-500">
                    imovelist.com/agent/
                  </span>
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                      id="profileUrl"
                      value={data.profileUrl}
                      onChange={(e) =>
                        setData(
                          'profileUrl',
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                        )
                      }
                      placeholder="seu-nome"
                      className="w-full border-0 py-2.5 pl-10 pr-4 text-sm outline-none"
                    />
                  </div>
                </div>
                <p className="text-xs text-gray-400">Apenas letras minúsculas, números e hifens.</p>
              </div>
            </CardContent>
          </Card>

          {/* Portfolio Design */}
          <Card className="border-gray-100 shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-center gap-2">
                <Palette className="h-5 w-5 text-primary" />
                <h3 className="font-semibold text-gray-900">Design do Portfólio</h3>
              </div>
              <p className="mb-4 text-sm text-gray-500">
                Personalize a aparência das suas páginas públicas.
              </p>

              <div className="space-y-4">
                <Label>Logo da Imobiliária/Sua Logo</Label>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
                    {logo ? (
                      <img
                        src={logo}
                        alt="Logo"
                        className="h-full w-full rounded-xl object-cover"
                      />
                    ) : (
                      <Image className="h-8 w-8 text-gray-300" />
                    )}
                  </div>
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleLogoChange}
                    />
                    <span className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
                      <Camera className="h-4 w-4" />
                      Trocar Logo
                    </span>
                  </label>
                </div>
              </div>

              {/* Portfolio Preview */}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-xs font-medium uppercase tracking-wider text-gray-500">
                      Pré-visualização do Portfólio
                    </span>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-green-600">
                    <span className="h-2 w-2 rounded-full bg-green-500" />
                    Ao Vivo
                  </span>
                </div>
                <div className="overflow-hidden rounded-xl border border-gray-200 bg-linear-to-b from-gray-800 to-gray-900">
                  <div className="p-6 text-center text-white">
                    <h4 className="text-lg font-semibold">{data.fullName || 'Seu Nome'}</h4>
                    <p className="mt-1 text-sm text-gray-400">
                      Confira meu portfólio exclusivo de oportunidades selecionadas especialmente
                      para você.
                    </p>
                  </div>
                  <div className="bg-white p-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-xl bg-gray-100">
                        {profilePhoto ? (
                          <img src={profilePhoto} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <User className="h-6 w-6 text-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-500">Imóveis em Destaque</p>
                        <p className="text-xs text-gray-400">
                          Explore as propriedades disponíveis.
                        </p>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-2">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-1">
                          <div className="h-16 rounded bg-gray-100" />
                          <p className="text-[10px] text-gray-500">Apartamento {i}</p>
                          <p className="text-[10px] font-medium text-primary">
                            R$ {(600000 + i * 100000).toLocaleString('pt-BR')}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Save Button */}
          <Button
            onClick={() => post('/api/profile')}
            disabled={processing}
            className="w-full bg-linear-to-r from-primary to-cyan-500 hover:from-primary/90 hover:to-cyan-500/90 sm:w-auto"
          >
            Salvar Alterações
          </Button>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* QR Code Card */}
          <Card className="border-gray-100 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Cartão de Visitas Digital</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-xl bg-gray-100">
                <LinkIcon className="h-10 w-10 text-gray-300" />
              </div>
              <p className="mt-4 text-center text-sm text-gray-500">
                Defina sua <strong>URL</strong> para ativar seu QR Code.
              </p>
            </CardContent>
          </Card>

          {/* Instagram Business Card */}
          <Card className="border-gray-100 shadow-md">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2">
                <div className="rounded-xl bg-linear-to-br from-purple-500 via-pink-500 to-orange-500 p-2">
                  <Instagram className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900">Instagram Business</h3>
              </div>
              <p className="mb-4 text-sm text-gray-500">
                Conecte sua conta para postar anúncios automaticamente.
              </p>
              <Button variant="outline" className="w-full" disabled>
                <Instagram className="mr-2 h-4 w-4" />
                Conectar Instagram
              </Button>
              <p className="mt-3 text-xs text-gray-400">
                * Requer conta Business/Creator vinculada a uma página no Facebook.
              </p>
              <a
                href="#"
                className="mt-2 flex items-center gap-1 text-xs text-primary hover:underline"
              >
                <HelpCircle className="h-3 w-3" />
                Como configurar meu Instagram?
              </a>
            </CardContent>
          </Card>

          {/* Boost Sales Card */}
          <Card className="border-0 bg-linear-to-r from-primary to-cyan-500 text-white shadow-md">
            <CardContent className="p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <Star className="h-5 w-5" />
              </div>
              <h3 className="font-semibold">Impulsione suas Vendas</h3>
              <p className="mt-2 text-sm opacity-90">
                Um perfil completo passa segurança aos compradores. Publique seus imóveis para
                aparecerem na sua vitrine pública!
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
