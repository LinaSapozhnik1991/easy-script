import React, { useEffect, useRef } from 'react'
import { Play } from '../../../shared/assets/icons'
import styles from './Feedback.module.scss'

interface VideoPlayerProps {
  videoSrc: string
  imageSrc: string
  isPlaying: boolean
  onPlay: () => void
  onPause: () => void
  currentTime: number
  setCurrentTime: (time: number) => void
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoSrc,
  imageSrc,
  isPlaying,
  onPlay,
  onPause,
  currentTime,
  setCurrentTime
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = currentTime
      if (isPlaying) {
        videoRef.current.play()
      } else {
        videoRef.current.pause()
      }
    }
  }, [currentTime, isPlaying])

  const handlePause = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
      videoRef.current.pause()
    }
    onPause()
  }

  return (
    <div
      className={styles.videoContainer}
      style={{ backgroundImage: `url(${imageSrc})`, position: 'relative' }}>
      {!isPlaying ? (
        <div
          className={styles.videoOverlay}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0
          }}>
          <button className={styles.playButton} onClick={onPlay}>
            <Play />
          </button>
        </div>
      ) : (
        <video
          ref={videoRef}
          width="830"
          height="506"
          controls
          onPause={handlePause}
          onEnded={() => setCurrentTime(0)}>
          <source src={videoSrc} type="video/webm" />
          Ваш браузер не поддерживает видео.
        </video>
      )}
    </div>
  )
}

export default VideoPlayer
