/* eslint-disable react-refresh/only-export-components */
import { createContext } from 'react'
import type { ReactNode } from 'react'
import useSpeakWord from '@/hooks/useSpeakWord'

// Tạo context type dựa trên return type của hook
type SpeakWordContextType = ReturnType<typeof useSpeakWord>

export const SpeakWordContext = createContext<SpeakWordContextType | null>(null)

interface SpeakWordProviderProps {
    children: ReactNode
}

export function SpeakWordProvider({ children }: SpeakWordProviderProps) {
    const speakWordValue = useSpeakWord()

    return <SpeakWordContext.Provider value={speakWordValue}>{children}</SpeakWordContext.Provider>
}
