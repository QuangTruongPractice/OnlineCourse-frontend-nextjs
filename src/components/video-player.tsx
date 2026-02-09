"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "./ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"


interface VideoPlayerProps {
  url: string | null
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onComplete?: () => void
  onManualProgress?: (percentage: number) => void
  showProgress?: boolean
}

export function VideoPlayer({ url, onTimeUpdate, onComplete, onManualProgress, showProgress = true }: VideoPlayerProps) {
  const [isYouTube, setIsYouTube] = useState(false)
  const [videoId, setVideoId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (url) {
      // Check if it's a YouTube URL
      const youtubeRegex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
      const match = url.match(youtubeRegex)

      if (match) {
        setIsYouTube(true)
        setVideoId(match[1])
      } else {
        setIsYouTube(false)
        setVideoId(null)
      }
    }
  }, [url])

  const handleTimeUpdate = () => {
    if (videoRef.current && onTimeUpdate) {
      onTimeUpdate(videoRef.current.currentTime, videoRef.current.duration)
    }
  }
  const handleEnded = () => {
    if (onComplete) {
      onComplete()
    }
  }

  const handleManualProgress = (percentage: number) => {
    setCurrentProgress(percentage)
    if (onManualProgress) {
      onManualProgress(percentage)
    }
  }

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
    if (isPlaying) {
      handleManualProgress(Math.min(currentProgress + 10, 100))
    }
  }

  const handleReset = () => {
    setCurrentProgress(0)
    setIsPlaying(false)
    if (onManualProgress) {
      onManualProgress(0)
    }
  }

  if (!url) return null

  if (isYouTube && videoId) {
    return (
      <div className="relative w-full aspect-video group overflow-hidden rounded-2xl shadow-2xl bg-slate-900 border-none">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?modestbranding=1&rel=0`}
          title="Video Player"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
        <div className="absolute top-4 left-4 z-10">
          <span className="bg-red-600/90 backdrop-blur-md text-white text-[10px] md:text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg shadow-lg">
            LIVE • MIỄN PHÍ
          </span>
        </div>

        {/* Manual Progress Controls for YouTube - Only shows on hover on desktop, or always on mobile if expanded */}
        {showProgress && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 lg:p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-white bg-blue-600 p-1.5 rounded-lg">
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </span>
                  <div className="flex flex-col">
                    <span className="text-white text-xs font-bold uppercase tracking-wider">Tiến độ bài học</span>
                    <span className="text-blue-200 text-[10px] sm:text-xs">{currentProgress}% Đã hoàn thành</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handlePlayPause}
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={handleReset}
                    className="h-8 w-8 text-white hover:bg-white/20 rounded-lg"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {[25, 50, 75, 100].map((pct) => (
                  <Button
                    key={pct}
                    size="sm"
                    variant="outline"
                    onClick={() => handleManualProgress(pct)}
                    className={`h-8 sm:h-9 text-[10px] sm:text-xs font-bold transition-all ${currentProgress >= pct
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                      }`}
                  >
                    {pct === 100 ? "Xong" : `${pct}%`}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // For direct video files
  return (
    <div className="relative w-full h-auto">
      <video
        ref={videoRef}
        src={url}
        controls
        className="w-full h-auto rounded-xl object-cover border-1"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />
      <span className="absolute top-2 right-2 bg-red-600 text-white text-xs md:text-sm font-semibold px-3 py-1 rounded-lg shadow-lg">
        Video miễn phí
      </span>
    </div>
  )
}
