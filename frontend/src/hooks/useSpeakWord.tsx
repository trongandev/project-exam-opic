import { useCallback, useState, useRef, useEffect, useMemo } from 'react'
import { EdgeSpeechTTS } from '@lobehub/tts'
import { toast } from 'sonner'

export interface SpeakWordState {
    isPlaying: boolean
    currentText: string | null
    currentId: string | number | null
    isLoading: boolean
    error: string | null
}

export default function useSpeakWord() {
    const [state, setState] = useState<SpeakWordState>({
        isPlaying: false,
        currentText: null,
        currentId: null,
        isLoading: false,
        error: null,
    })

    const currentAudioRef = useRef<HTMLAudioElement | null>(null)
    const [selectedVoice, setSelectedVoice] = useState<string | null>(null)
    const [tts] = useState(() => new EdgeSpeechTTS({ locale: 'en-US' }))

    // Khởi tạo và đồng bộ với localStorage
    useEffect(() => {
        console.log('khởi tạo 1')
        try {
            const savedVoices = localStorage.getItem('defaultVoices')
            if (savedVoices) {
                const parsedVoices = JSON.parse(savedVoices)
                const defaultVoice = parsedVoices['en-US'] || 'en-US-JennyNeural'
                setSelectedVoice(defaultVoice)
                console.log('Loaded voice from localStorage:', defaultVoice)
            } else {
                // Nếu chưa có trong localStorage, khởi tạo với voice mặc định
                console.log('No voices in localStorage, setting default voice')
                const defaultVoices = { 'en-US': 'en-US-JennyNeural' }
                localStorage.setItem('defaultVoices', JSON.stringify(defaultVoices))
            }
        } catch (error) {
            console.warn('LocalStorage not available, using default voice:', error)
            setSelectedVoice('en-US-JennyNeural')
        }
    }, [])
    // Hàm để cập nhật voice và đồng bộ với localStorage
    const updateSelectedVoice = useCallback((newVoiceId: string, languageCode: string = 'en-US') => {
        console.log('khởi tạo updateSelectedVoice')

        try {
            const savedVoices = localStorage.getItem('defaultVoices')
            const parsedVoices = savedVoices ? JSON.parse(savedVoices) : {}

            parsedVoices[languageCode] = newVoiceId
            localStorage.setItem('defaultVoices', JSON.stringify(parsedVoices))
            setSelectedVoice(newVoiceId)

            console.log('Voice updated to:', newVoiceId)
            toast.success('Đã cập nhật giọng nói', {
                description: `Giọng mới sẽ được sử dụng cho các lần phát âm tiếp theo`,
                duration: 2000,
            })
        } catch (error) {
            console.warn('Cannot save to localStorage:', error)
            setSelectedVoice(newVoiceId)
            toast.error('Không thể lưu giọng nói vào bộ nhớ')
        }
    }, [])

    // Dừng audio hiện tại
    const stopCurrentAudio = useCallback(() => {
        if (currentAudioRef.current) {
            currentAudioRef.current.pause()
            currentAudioRef.current.currentTime = 0
            URL.revokeObjectURL(currentAudioRef.current.src)
            currentAudioRef.current = null
        }
        setState((prev) => ({
            ...prev,
            isPlaying: false,
            currentText: null,
            currentId: null,
            isLoading: false,
            error: null,
        }))
    }, [])

    // Phát âm thanh
    const speakWord = useCallback(
        async (text: string, id?: string | number) => {
            try {
                // Nếu đang phát cùng text và id, thì dừng lại
                if (state.isPlaying && state.currentText === text && state.currentId === id) {
                    stopCurrentAudio()
                    return
                }

                // Dừng audio hiện tại trước khi phát audio mới
                stopCurrentAudio()

                // Set loading state
                setState((prev) => ({
                    ...prev,
                    isLoading: true,
                    currentText: text,
                    currentId: id || null,
                    error: null,
                }))
                console.log('Selected voice:', selectedVoice)

                const response = await tts.create({
                    input: text,
                    options: {
                        voice: selectedVoice || 'en-US-JennyNeural',
                    },
                })

                const audioBuffer = await response.arrayBuffer()
                const blob = new Blob([audioBuffer], { type: 'audio/mpeg' })
                const url = URL.createObjectURL(blob)
                const audio = new Audio(url)

                // Lưu reference của audio hiện tại
                currentAudioRef.current = audio

                // Event listeners
                audio.addEventListener('ended', () => {
                    URL.revokeObjectURL(url)
                    setState((prev) => ({
                        ...prev,
                        isPlaying: false,
                        currentText: null,
                        currentId: null,
                        isLoading: false,
                    }))
                    currentAudioRef.current = null
                })

                audio.addEventListener('error', (e) => {
                    console.error('Audio playback error:', e)
                    URL.revokeObjectURL(url)
                    setState((prev) => ({
                        ...prev,
                        isPlaying: false,
                        currentText: null,
                        currentId: null,
                        isLoading: false,
                        error: 'Lỗi phát âm thanh',
                    }))
                    currentAudioRef.current = null
                    toast.error('Lỗi phát âm thanh', {
                        description: 'Không thể phát âm thanh này',
                        duration: 3000,
                    })
                })

                audio.addEventListener('loadstart', () => {
                    setState((prev) => ({
                        ...prev,
                        isLoading: false,
                        isPlaying: true,
                    }))
                })

                // Phát audio
                await audio.play()
            } catch (error) {
                console.error('TTS Error:', error)
                setState((prev) => ({
                    ...prev,
                    isPlaying: false,
                    currentText: null,
                    currentId: null,
                    isLoading: false,
                    error: error instanceof Error ? error.message : 'Lỗi không xác định',
                }))

                toast.error('Lỗi TTS', {
                    description: error instanceof Error ? error.message : 'Lỗi không xác định',
                    duration: 3000,
                })
            }
        },
        [state.isPlaying, state.currentText, state.currentId, selectedVoice, tts, stopCurrentAudio]
    )

    // Toggle phát/dừng audio
    const toggleAudio = useCallback(
        (text: string, id?: string | number) => {
            if (state.isPlaying && state.currentText === text && state.currentId === id) {
                stopCurrentAudio()
            } else {
                speakWord(text, id)
            }
        },
        [state.isPlaying, state.currentText, state.currentId, speakWord, stopCurrentAudio]
    )

    // Check xem có đang phát audio này không
    const isPlayingAudio = useCallback(
        (text?: string, id?: string | number) => {
            if (!text) return state.isPlaying
            return state.isPlaying && state.currentText === text && state.currentId === id
        },
        [state.isPlaying, state.currentText, state.currentId]
    )

    // Check xem có đang loading audio này không
    const isLoadingAudio = useCallback(
        (text?: string, id?: string | number) => {
            if (!text) return state.isLoading
            return state.isLoading && state.currentText === text && state.currentId === id
        },
        [state.isLoading, state.currentText, state.currentId]
    )

    return useMemo(
        () => ({
            // States
            ...state,
            selectedVoice,

            // Actions
            speakWord,
            stopCurrentAudio,
            toggleAudio,
            setSelectedVoice: updateSelectedVoice,

            // Helpers
            isPlayingAudio,
            isLoadingAudio,
        }),
        [state, selectedVoice, speakWord, stopCurrentAudio, toggleAudio, updateSelectedVoice, isPlayingAudio, isLoadingAudio]
    )
}
