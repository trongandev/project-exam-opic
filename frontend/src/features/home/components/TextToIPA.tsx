import LoadingGrid from '@/components/etc/LoadingGrid'
import MicButton from '@/components/etc/MicButton'
import SpeakButton from '@/components/SpeakButton'
import LoadingIcon from '@/components/ui/loading-icon'
import { useSpeakWordContext } from '@/hooks/useSpeakWordContext'
import etcService from '@/services/etcService'
import type { IAccurancyFromRecoderAudio } from '@/types/etc'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'
import SpeechRecognition from 'react-speech-recognition'
import { Skeleton } from '@/components/ui/skeleton'

interface Accuracy {
    index: number
    data: IAccurancyFromRecoderAudio
}
export default function TextToIPA({ text }: { text: string }) {
    const [ipa, setIpa] = useState([{ text: '', ipa: '' }])
    const [itemSelection, setItemSelection] = useState({ index: '', title: '' })
    const [loading, setLoading] = useState(false)
    const [accuracy, setAccurency] = useState<Accuracy[]>([])
    const { toggleAudio, isPlayingAudio, isLoadingAudio } = useSpeakWordContext()
    const [isLoading, setIsLoading] = useState(false)
    const [isPlaying, setIsPlaying] = useState(false)
    const recorderRef = useRef<MediaRecorder | null>(null)
    const streamRef = useRef<MediaStream | null>(null)

    // Use ref to store current itemSelection to avoid stale closure
    const itemSelectionRef = useRef(itemSelection)
    useEffect(() => {
        const fetchIPA = async () => {
            setLoading(true)
            const res = await etcService.convertEngToIPA(text)
            setIpa(res)
            setLoading(false)
        }
        fetchIPA()
    }, [text])

    // Update ref whenever itemSelection changes
    useEffect(() => {
        itemSelectionRef.current = itemSelection
        console.log('itemSelection updated in ref:', itemSelection)
    }, [itemSelection])
    console.log(accuracy, 'accurancy')
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
                try {
                    // Use ref to get current value, not stale closure
                    const currentSelection = itemSelectionRef.current
                    const res = await etcService.getAccurencyFromAudio(currentSelection?.title, audioBlob)
                    setAccurency((prev) => [...prev, { index: Number(currentSelection.index), data: res }])
                } catch (error) {
                    console.error('Error getting accuracy:', error)
                    toast.error('Error getting accuracy from audio.')
                } finally {
                    // Cleanup stream
                    if (streamRef.current) {
                        streamRef.current.getTracks().forEach((track) => track.stop())
                        streamRef.current = null
                    }
                    recorderRef.current = null
                    setIsLoading(false)
                    setIsPlaying(false) // Reset playing state
                }
            }

            return recorder
        } catch (error) {
            console.error('Error accessing microphone:', error)
            return null
        }
    }

    const handleClick = async (title: string, index: string) => {
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
        setItemSelection({ index, title })

        const recorder = await setupMediaRecorder()
        if (!recorder) {
            setIsPlaying(false)
            return
        }

        SpeechRecognition.startListening({ continuous: true })
        recorder.start()
    }

    const getBgColorForAccuracy = (accuracy: string) => {
        const accuracyValue = parseFloat(accuracy)
        if (accuracyValue >= 85) return 'border-green-200  bg-green-50 text-green-800'
        if (accuracyValue >= 70) return 'border-yellow-200 bg-yellow-50 text-yellow-800'
        if (accuracyValue >= 50) return 'border-orange-200  bg-orange-50 text-orange-800'
        if (accuracyValue <= 25 && accuracyValue > 0) return 'border-red-200  bg-red-50 text-red-800'
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }

    const renderAccurancy = (text: string, index: number) => {
        // Safe check for accuracy data
        const accuracyItem = accuracy.find((acc) => acc.index === index)
        if (!accuracyItem || !accuracyItem.data?.is_letter_correct_all_words) return null

        const lettersOfWordAreCorrect = accuracyItem.data.is_letter_correct_all_words.split(' ')
        const currentTextWords = text.split(' ') || []

        return (
            <div className="text-justify">
                {currentTextWords.map((word, wordIdx) => {
                    const isPlaying = isPlayingAudio(word, wordIdx)
                    const isLoading = isLoadingAudio(word, wordIdx)
                    return (
                        <span
                            key={wordIdx}
                            className="inline-flex items-center mr-2  cursor-pointer hover:bg-yellow-500/20"
                            onClick={() => {
                                if (!isPlaying && !isLoading) {
                                    toggleAudio(word, wordIdx)
                                }
                            }}
                        >
                            {word.split('').map((letter, letterIdx) => {
                                const isCorrect = lettersOfWordAreCorrect[wordIdx]?.[letterIdx] === '1'
                                return (
                                    <span key={letterIdx} className={`${isCorrect ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                        {letter}
                                    </span>
                                )
                            })}
                            {isLoading && <LoadingIcon className="ml-2 w-5 h-5" />}
                        </span>
                    )
                })}
            </div>
        )
    }

    const renderTextSplit = (text: string) => {
        return text.split(' ').map((word, idx) => {
            const isPlaying = isPlayingAudio(word, idx)
            const isLoading = isLoadingAudio(word, idx)
            return (
                <span
                    key={idx}
                    className={`inline-flex items-center gap-1 mr-2 cursor-pointer hover:bg-yellow-100/50 `}
                    onClick={() => {
                        if (!isPlaying && !isLoading) {
                            toggleAudio(word, idx)
                        }
                    }}
                >
                    <span className={isPlaying ? 'text-green-600 font-medium underline' : ''}>{word}</span>
                    {isLoading && <LoadingIcon className="w-5 h-5" />}
                </span>
            )
        })
    }

    // Helper function to get accuracy data for a specific index
    const getAccuracyForIndex = (index: number) => {
        return accuracy.find((acc) => acc.index === index)
    }
    return (
        <div className="">
            {loading ? (
                <LoadingGrid className="h-[500px]" />
            ) : (
                <div className="space-y-5">
                    {ipa.map((item, index) => {
                        const accuracyData = getAccuracyForIndex(index)

                        return (
                            <div
                                key={index}
                                className={`relative md:gap-5 items-center  p-3 md:p-5 rounded-md border  ${accuracyData && getBgColorForAccuracy(accuracyData.data.pronunciation_accuracy)}`}
                            >
                                {/* Accuracy Badge */}
                                {accuracyData && (
                                    <div className={`absolute -top-4 -right-3 -skew-5 px-1 py-0.5 text-lg rounded-sm shadow border ${getBgColorForAccuracy(accuracyData.data.pronunciation_accuracy)}`}>
                                        <span className="skew-5">{accuracyData.data.pronunciation_accuracy}%</span>
                                    </div>
                                )}

                                <div className="flex justify-between gap-3 md:gap-5 items-center ">
                                    <div className="">
                                        {accuracyData ? (
                                            <>
                                                <p className="mb-2 text-justify text-md md:text-2xl"> {renderAccurancy(item.text, index)}</p>
                                                <span className="text-sm md:text-xl text-gray-400">{'/ ' + item.ipa + ' /'}</span>
                                                <p className="text-sm md:text-xl text-gray-400">{'/ ' + accuracyData.data.ipa_transcript + ' /'}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="mb-2 text-justify text-md md:text-2xl">{renderTextSplit(item.text)}</p>
                                                <span className="text-sm md:text-xl text-gray-400">{'/ ' + item.ipa + ' /'}</span>
                                                {isLoading && <Skeleton className="mt-2 h-[20px] w-full rounded-full" />}
                                            </>
                                        )}
                                    </div>
                                    <div className="w-[50px] flex flex-col gap-2 items-end">
                                        <SpeakButton text={item.text} isShowLabel={false} id={'custom'} />
                                        <MicButton isLoading={isLoading} isPlaying={isPlaying} index={String(index)} title={item.text} isShowLabel={false} handleClick={handleClick} />
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
