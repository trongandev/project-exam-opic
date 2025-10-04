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
}

function SpeakButton({ text, id, variant = 'outline', size = 'sm', className = '' }: SpeakButtonProps) {
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

            {size !== 'icon' && <span className="ml-2">{isLoading ? 'Đang tải...' : isPlaying ? 'Tắt' : 'Phát âm'}</span>}
        </Button>
    )
}

export default memo(SpeakButton)
