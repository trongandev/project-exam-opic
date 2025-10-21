import { useState, useRef, useEffect } from 'react'
import { Button } from '../ui/button'
import { Loader2, Mic, SquareStop } from 'lucide-react'
import SpeechRecognition from 'react-speech-recognition'

interface SpeakButtonProps {
    index: number
    title: string
    variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary'
    size?: 'sm' | 'default' | 'lg' | 'icon'
    className?: string
    isShowLabel?: boolean
    handleAccurency: (index: number, title: string, audio: any) => void
}

export default function MicButton({ index, title, variant = 'outline', size = 'sm', className = '', isShowLabel = true, handleAccurency }: SpeakButtonProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    // Store recorder reference
    const recorderRef = useRef<MediaRecorder | null>(null)
    const streamRef = useRef<MediaStream | null>(null)
    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Stop recording if component unmounts while recording
            if (recorderRef.current && recorderRef.current.state === 'recording') {
                recorderRef.current.stop()
            }

            // Stop all tracks
            if (streamRef.current) {
                streamRef.current.getTracks().forEach((track) => track.stop())
            }

            // Stop speech recognition
            SpeechRecognition.stopListening()
        }
    }, [])

    const setupMediaRecorder = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            streamRef.current = stream // Store stream reference
            const chunks: Blob[] = []

            const recorder = new MediaRecorder(stream)
            recorderRef.current = recorder // Store recorder reference

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data)
                }
            }

            recorder.onstop = async () => {
                const audioBlob = new Blob(chunks, { type: 'audio/webm' })
                setIsLoading(true)
                handleAccurency(index, title, audioBlob)
                // Cleanup stream
                if (streamRef.current) {
                    streamRef.current.getTracks().forEach((track) => track.stop())
                    streamRef.current = null
                }
                recorderRef.current = null
                setIsLoading(false)
                setIsPlaying(false) // Reset playing state
            }

            return recorder
        } catch (error) {
            console.error('Error accessing microphone:', error)
            return null
        }
    }

    const handleClick = async () => {
        if (isPlaying) {
            setIsPlaying(false)
            SpeechRecognition.stopListening()

            // Stop the MediaRecorder - this will trigger onstop
            if (recorderRef.current && recorderRef.current.state === 'recording') {
                recorderRef.current.stop()
            }
            return
        }

        setIsPlaying(true)
        const recorder = await setupMediaRecorder()
        if (!recorder) {
            setIsPlaying(false)
            return
        }

        SpeechRecognition.startListening({ continuous: true })
        recorder.start()
    }

    return (
        <Button
            variant={variant}
            size={size}
            className={`transition-all duration-200 ${isPlaying && 'animate-pulse text-destructive  hover:text-destructive'} ${className}`}
            onClick={handleClick}
            disabled={isLoading}
        >
            {isPlaying ? <SquareStop /> : isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}

            {size !== 'icon' && isShowLabel && <span className="ml-2 hidden md:block">{isPlaying ? 'Loading...' : 'Speak'}</span>}
        </Button>
    )
}
