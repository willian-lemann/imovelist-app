import { useState } from 'react'
import { Sparkles, Lock, Copy, ExternalLink, Loader2 } from 'lucide-react'

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
import { Textarea } from '~/components/ui/textarea'
import { useListings } from '~/hooks/use-listings'
import { toast } from 'sonner'

type AiPageGeneratorProps = {
  isPremium?: boolean
}

export function AiPageGenerator({ isPremium = false }: AiPageGeneratorProps) {
  const { data, isLoading } = useListings({ page: 1 })
  const [selectedListingId, setSelectedListingId] = useState<string>('')
  const [generatedContent, setGeneratedContent] = useState<string>('')
  const [isGenerating, setIsGenerating] = useState(false)

  const listings = Array.isArray(data?.listings) ? data.listings : []
  const selectedListing = listings.find((l) => l.id === Number(selectedListingId))

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent)
    toast.success('Conteúdo copiado!')
  }

  // Mock generation for demo (when API is not available)
  const handleMockGenerate = () => {
    if (!selectedListing) return

    setGeneratedContent('')
    setIsGenerating(true)

    const mockContent = `
# 🏠 ${selectedListing.name || 'Imóvel Exclusivo'}

## ✨ Visão Geral

${selectedListing.type ? `Este maravilhoso **${selectedListing.type}**` : 'Este imóvel exclusivo'} está localizado em uma das melhores regiões da cidade. Com acabamentos de primeira linha e uma planta inteligente, oferece o máximo de conforto para você e sua família.

## 🌟 Características Principais

- **Área total:** ${selectedListing.area || 'Sob consulta'}
- **Quartos:** ${selectedListing.bedrooms || 0} (sendo suítes com closet)
- **Banheiros:** ${selectedListing.bathrooms || 0} (com acabamento premium)
- **Vagas:** ${selectedListing.parking || 0} (garagem coberta)

## 📍 Localização Privilegiada

${selectedListing.address ? `Situado em **${selectedListing.address}**,` : 'Com localização privilegiada,'} você estará próximo a:
- 🏫 Escolas e universidades renomadas
- 🏥 Hospitais e clínicas
- 🛒 Supermercados e shopping centers
- 🌳 Parques e áreas de lazer

## 💰 Investimento

**${selectedListing.price ? `R$ ${selectedListing.price.toLocaleString('pt-BR')}` : 'Valor sob consulta'}**

${selectedListing.forSale === false ? '*(valor do aluguel mensal)*' : ''}

## 📞 Entre em Contato

Não perca esta oportunidade única! Agende sua visita hoje mesmo e conheça pessoalmente este imóvel incrível.

---
*Referência: ${selectedListing.ref || `#${selectedListing.id}`}*
    `.trim()

    // Simulate typing effect
    let i = 0
    const interval = setInterval(() => {
      setGeneratedContent(mockContent.slice(0, i))
      i += 10
      if (i > mockContent.length) {
        clearInterval(interval)
        setGeneratedContent(mockContent)
        setIsGenerating(false)
        toast.success('Página gerada com sucesso!')
      }
    }, 20)
  }

  // Locked state for non-premium users
  if (!isPremium) {
    return (
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Gerar Página com IA</h2>
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
                Use inteligência artificial para gerar páginas de apresentação profissionais para
                seus imóveis. Textos persuasivos e otimizados para conversão.
              </p>
              <Button size="sm" className="mt-4">
                Fazer Upgrade
              </Button>
            </div>
          </div>
        </div>

        {/* Preview of locked feature */}
        <div className="grid gap-6 lg:grid-cols-2 opacity-60">
          <Card>
            <CardHeader>
              <CardTitle>Selecione um imóvel</CardTitle>
              <CardDescription>Escolha o imóvel para gerar a página</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um imóvel" />
                </SelectTrigger>
              </Select>
              <Button disabled className="w-full gap-2">
                <Sparkles className="h-4 w-4" />
                Gerar Página
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Prévia da Página</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 bg-gray-100 rounded-xl flex items-center justify-center">
                <Sparkles className="h-12 w-12 text-gray-300" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Gerar Página com IA</h2>
        <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700">
          Premium Ativo
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Controls */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações</CardTitle>
            <CardDescription>Selecione o imóvel e gere a página</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      {listing.name || `Imóvel #${listing.id}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {selectedListing && (
              <div className="rounded-xl border bg-gray-50 p-4 space-y-2">
                <h4 className="font-medium">{selectedListing.name}</h4>
                <p className="text-sm text-gray-600">{selectedListing.address}</p>
                <div className="flex gap-2 flex-wrap">
                  {selectedListing.type && (
                    <Badge variant="secondary">{selectedListing.type}</Badge>
                  )}
                  {selectedListing.bedrooms && (
                    <Badge variant="outline">{selectedListing.bedrooms} quartos</Badge>
                  )}
                  {selectedListing.price && (
                    <Badge variant="outline">
                      R$ {selectedListing.price.toLocaleString('pt-BR')}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            <Button
              onClick={handleMockGenerate}
              disabled={!selectedListingId || isGenerating}
              className="w-full gap-2"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Gerando...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Gerar Página com IA
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Generated Content */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Conteúdo Gerado</CardTitle>
              {generatedContent && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    <Copy className="h-4 w-4 mr-1" />
                    Copiar
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4 mr-1" />
                    Visualizar
                  </Button>
                </div>
              )}
            </div>
            <CardDescription>O conteúdo gerado aparecerá aqui</CardDescription>
          </CardHeader>
          <CardContent>
            {generatedContent ? (
              <Textarea
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                className="min-h-[400px] font-mono text-sm"
              />
            ) : (
              <div className="min-h-[400px] bg-gray-50 rounded-xl flex flex-col items-center justify-center text-gray-400">
                <Sparkles className="h-12 w-12 mb-4" />
                <p className="text-center">
                  Selecione um imóvel e clique em
                  <br />
                  "Gerar Página com IA" para começar
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
