import { useContext } from 'react'
import { SpeakWordContext } from '@/contexts/SpeakWordContext'

export function useSpeakWordContext() {
    const context = useContext(SpeakWordContext)
    if (!context) {
        throw new Error('useSpeakWordContext must be used within a SpeakWordProvider')
    }
    return context
}
