import { memo, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Volume2, VolumeX, Loader2 } from 'lucide-react'
import { useSpeakWordContext } from '@/hooks/useSpeakWordContext'

interface SpeakButtonProps {
    text: string
    id?: string | number
    variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary'
    size?: 'sm' | 'default' | 'lg' | 'icon'
    className?: string
    isShowLabel?: boolean
}

function SpeakButton({ text, id, variant = 'outline', size = 'sm', className = '', isShowLabel = true }: SpeakButtonProps) {
    const { toggleAudio, isPlayingAudio, isLoadingAudio } = useSpeakWordContext()

    const isPlaying = isPlayingAudio(text, id)
    const isLoading = isLoadingAudio(text, id)

    const handleClick = useCallback(() => {
        toggleAudio(text, id)
    }, [toggleAudio, text, id])

    return (
        <Button
            variant={variant}
            size={size}
            className={`transition-all duration-200 ${isPlaying ? 'bg-destructive text-primary-foreground' : ''} ${className}`}
            onClick={handleClick}
            disabled={isLoading}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : isPlaying ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}

            {size !== 'icon' && isShowLabel && <span className="ml-2 hidden md:block">{isLoading ? 'Loading...' : isPlaying ? 'Off' : 'Speak'}</span>}
        </Button>
    )
}

export default memo(SpeakButton)
