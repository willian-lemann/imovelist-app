import { ImageOff } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type PhotoCarouselItemProps = {
  href: string
  blurImage: string
  isFirst: boolean
}

export function PhotoCarouselItem({ href, blurImage }: PhotoCarouselItemProps) {
  const [hasError, setHasError] = useState(false)
  const [imageSrc, setImageSrc] = useState(blurImage)

  if (hasError) {
    return (
      <div className="object-cover md:rounded-lg flex items-center justify-center h-full w-full bg-secondary">
        <ImageOff />
      </div>
    )
  }

  useEffect(() => {
    // Create a new image element to load the high-resolution image in the background
    const highResImage = new Image()
    highResImage.src = href

    // When the high-resolution image is fully loaded, update the state
    highResImage.onload = () => {
      setImageSrc(href)
    }
  }, [href])

  const isPlaceholder = imageSrc !== blurImage

  return (
    <>
      <link as="image" rel="preload" href={href} fetchPriority="high" />
      <img
        src={imageSrc}
        alt="Property Image"
        className={cn('object-cover rounded-lg h-full w-full', {
          'blur-sm': isPlaceholder,
        })}
        loading="lazy"
        fetchPriority="high"
        decoding="async"
        onError={() => setHasError(true)}
      />
    </>
  )
}
