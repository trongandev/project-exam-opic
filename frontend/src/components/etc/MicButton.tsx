import { Button } from '../ui/button'
import { Loader2, Mic, SquareStop } from 'lucide-react'

interface SpeakButtonProps {
    isLoading: boolean
    isPlaying: boolean
    index: string
    title: string
    variant?: 'default' | 'outline' | 'ghost' | 'link' | 'destructive' | 'secondary'
    size?: 'sm' | 'default' | 'lg' | 'icon'
    className?: string
    isShowLabel?: boolean
    handleClick: (title: string, index: string) => void
}

export default function MicButton({ isLoading, isPlaying, title, index, variant = 'outline', size = 'sm', className = '', isShowLabel = true, handleClick }: SpeakButtonProps) {
    // Store recorder reference

    // Cleanup on unmount

    return (
        <Button
            variant={variant}
            size={size}
            className={`transition-all duration-200 ${isPlaying && 'animate-pulse text-destructive  hover:text-destructive'} ${className}`}
            onClick={() => handleClick(title, index)}
            disabled={isLoading}
        >
            {isPlaying ? <SquareStop /> : isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}

            {size !== 'icon' && isShowLabel && <span className="ml-2 hidden md:block">{isPlaying ? 'Loading...' : 'Speak'}</span>}
        </Button>
    )
}
