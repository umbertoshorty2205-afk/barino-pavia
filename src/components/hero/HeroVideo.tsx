'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

interface HeroVideoProps {
  poster?: string
  mp4?: string
  webm?: string
  className?: string
}

export function HeroVideo({ poster, mp4, webm, className }: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const playPromise = video.play()
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false)
          video.muted = true
          video.play().catch(() => setHasError(true))
        })
    }

    return () => {
      video.pause()
    }
  }, [])

  if (hasError || (!mp4 && !webm)) {
    return poster ? (
      <div
        className={cn('absolute inset-0 z-0', className)}
        style={{ backgroundImage: `url(${poster})` }}
        aria-hidden="true"
      />
    ) : null
  }

  return (
    <video
      ref={videoRef}
      className={cn('absolute inset-0 w-full h-full object-cover z-0', className)}
      autoPlay
      muted
      loop
      playsInline
      poster={poster}
      preload="metadata"
      aria-hidden="true"
    >
      {webm && <source src={webm} type="video/webm" />}
      {mp4 && <source src={mp4} type="video/mp4" />}
    </video>
  )
}