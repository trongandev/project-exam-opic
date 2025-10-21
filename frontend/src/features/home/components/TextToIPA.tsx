import LoadingGrid from '@/components/etc/LoadingGrid'
import MicButton from '@/components/etc/MicButton'
import SpeakButton from '@/components/SpeakButton'
import etcService from '@/services/etcService'
import type { IAccurancyFromRecoderAudio } from '@/types/etc'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Accuracy {
    index: number
    data: IAccurancyFromRecoderAudio
}
export default function TextToIPA({ text }: { text: string }) {
    const [ipa, setIpa] = useState([{ text: '', ipa: '' }])
    const [loading, setLoading] = useState(false)
    const [accuracy, setAccurency] = useState<Accuracy | null>(null)

    useEffect(() => {
        const fetchIPA = async () => {
            setLoading(true)
            const res = await etcService.convertEngToIPA(text)
            setIpa(res)
            setLoading(false)
        }
        fetchIPA()
    }, [text])

    const handleAccurency = async (index: number, title: string, audioBlob: any) => {
        try {
            const res = await etcService.getAccurencyFromAudio(title, audioBlob)
            console.log('Accuracy Result:', res)
            setAccurency({ index, data: res })
        } catch (error) {
            console.error('Error getting accuracy:', error)
            toast.error('Error getting accuracy from audio.')
        }
    }

    const getBgColorForAccuracy = (accuracy: string) => {
        const accuracyValue = parseFloat(accuracy)
        if (accuracyValue >= 85) return 'border-green-200  bg-green-50 text-green-800'
        if (accuracyValue >= 70) return 'border-yellow-200 bg-yellow-50 text-yellow-800'
        if (accuracyValue >= 50) return 'border-orange-200  bg-orange-50 text-orange-800'
        if (accuracyValue <= 25 && accuracyValue > 0) return 'border-red-200  bg-red-50 text-red-800'
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }

    const renderAccurancy = (text: string) => {
        if (!accuracy) return null
        const lettersOfWordAreCorrect = accuracy.data.is_letter_correct_all_words.split(' ')
        const currentTextWords = text.split(' ') || []

        return (
            <div className="text-justify">
                {currentTextWords.map((word, wordIdx) => (
                    <span key={wordIdx} className="inline-block mr-2">
                        {word.split('').map((letter, letterIdx) => {
                            const isCorrect = lettersOfWordAreCorrect[wordIdx]?.[letterIdx] === '1'
                            return (
                                <span key={letterIdx} className={`${isCorrect ? 'text-green-600' : 'text-red-600'} font-medium`}>
                                    {letter}
                                </span>
                            )
                        })}
                    </span>
                ))}
            </div>
        )
    }
    return (
        <div className="">
            {loading ? (
                <LoadingGrid className="h-[500px]" />
            ) : (
                <div className="space-y-5">
                    {ipa.map((item, index) => (
                        <div className={`relative md:gap-5 items-center text-gray-600 bg-gray-50 p-3 md:p-5 rounded-md`}>
                            {accuracy && accuracy.index === index && (
                                <div className={`absolute -top-4 -right-3 -skew-5 px-1 py-0.5 text-lg rounded-sm shadow border ${getBgColorForAccuracy(accuracy.data.pronunciation_accuracy)}`}>
                                    <span className="skew-5">{accuracy.data.pronunciation_accuracy}%</span>
                                </div>
                            )}

                            <div key={index} className="flex justify-between gap-3 md:gap-5 items-center ">
                                <div className="">
                                    <p className="mb-2 text-justify text-md md:text-2xl">{accuracy?.index === index ? renderAccurancy(item.text) : item.text}</p>
                                    <span className="text-sm md:text-xl text-gray-400">{'/ ' + item.ipa + ' /'}</span>
                                    {accuracy && <p>{accuracy.data.ipa_transcript}</p>}
                                </div>
                                <div className="w-[50px] flex flex-col gap-2 items-end">
                                    <SpeakButton text={item.text} isShowLabel={false} id={'custom'} />
                                    <MicButton index={index} title={item.text} isShowLabel={false} handleAccurency={handleAccurency} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
