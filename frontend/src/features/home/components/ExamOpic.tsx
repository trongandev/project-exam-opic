import SpeakButton from '@/components/SpeakButton'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight, Eye, EyeOff, LogOut, Mic, Play, Pause, Volume2, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import SpeechRecognition from 'react-speech-recognition'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import VoiceSelectionModal from '@/components/etc/VoiceSelectionModal'
import { convertBlobToBase64, shuffleArray } from '@/lib/utils'

import type { Quest, Topic } from '@/types/topic'
import { useSpeakWordContext } from '@/hooks/useSpeakWordContext'
import axios from 'axios'
import LoadingIcon from '@/components/ui/loading-icon'
import type { IAccurancyFromRecoderAudio } from '@/types/etc'
import TextToIPA from './TextToIPA'

export default function ExamOpic({ data }: { data: Topic }) {
    const dataExam: Topic = data
    const [isRecording, setIsRecording] = useState(false)
    const [isShowSynthetic, setIsShowSynthetic] = useState<string>('')
    const [isShuffleData, setIsShuffleData] = useState(false)
    const [isFreedomMode, setIsFreedomMode] = useState(false)
    const [isSpeakMode, setIsSpeakMode] = useState(false)
    // const [confidence, setConfidence] = useState(0)
    const [newData, setNewData] = useState<Quest[]>([])
    const [volume, setVolume] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [countDown, setCountDown] = useState(60) // Thời gian ghi âm 60 giây
    const [recordingCompleted, setRecordingCompleted] = useState(false) // Đánh dấu hoàn thành ghi âm
    const [recordedAudio, setRecordedAudio] = useState<string | null>(null)
    const [loadingAccurancy, setLoadingAccurancy] = useState(false)
    const [accurancyFromRecoderAudio, setAccurancyFromRecoderAudio] = useState<IAccurancyFromRecoderAudio | null>(null)
    const [isPlayingAudio, setIsPlayingAudio] = useState(false)
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
    const analyserRef = useRef<AnalyserNode | null>(null)
    const recognitionRef = useRef<any>(null)
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const { speakWord } = useSpeakWordContext()

    // const { transcript, interimTranscript, finalTranscript, resetTranscript } = useSpeechRecognition()
    const navigate = useNavigate()
    useEffect(() => {
        if (dataExam) {
            const flattenedData = dataExam?.data.flatMap((item) => item.quests)
            if (isShuffleData) {
                // Shuffle the data

                setNewData(shuffleArray(flattenedData))
                toast.info('Shuffle mode is on. Questions are randomized.', { duration: 5000, position: 'top-center' })
            } else {
                setNewData(flattenedData)
                speakWord(flattenedData[0]?.text || 'Unable to load question', 'custom')
            }
        }
    }, [isShuffleData, dataExam])

    // Setup audio reference when recorded audio is available
    useEffect(() => {
        if (recordedAudio && audioRef.current) {
            audioRef.current.src = recordedAudio
        }
    }, [recordedAudio])

    // Cleanup recorded audio URL when component unmounts or audio changes
    useEffect(() => {
        return () => {
            if (recordedAudio) {
                URL.revokeObjectURL(recordedAudio)
            }
        }
    }, [recordedAudio])

    // Countdown timer for recording

    // Function để dừng recording hoàn toàn
    const stopRecording = useCallback(async () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            recognitionRef.current.onend = null // Ngăn không cho restart
        }

        // Stop MediaRecorder
        if (mediaRecorder && mediaRecorder.state === 'recording') {
            mediaRecorder.stop()
        }

        setIsRecording(false)
        setVolume(0) // Reset volume khi dừng
        analyserRef.current = null // Clear analyser reference
        SpeechRecognition.stopListening()
    }, [mediaRecorder])
    useEffect(() => {
        let timer: number

        if (isRecording && countDown > 0) {
            timer = window.setTimeout(() => {
                setCountDown((prev) => prev - 1)
            }, 1000)
        } else if (isRecording && countDown === 0) {
            // Auto stop recording when time's up
            stopRecording()
            setRecordingCompleted(true)
            toast.info('Hết thời gian ghi âm!')
        }

        return () => {
            if (timer) window.clearTimeout(timer)
        }
    }, [isRecording, countDown, stopRecording])

    // Function để khởi tạo MediaRecorder
    const setupMediaRecorder = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
            const chunks: Blob[] = []

            const recorder = new MediaRecorder(stream)

            recorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunks.push(event.data)
                }
            }

            recorder.onstop = async () => {
                try {
                    const audioBlob = new Blob(chunks, { type: 'audio/webm' })
                    const audioUrl = URL.createObjectURL(audioBlob)
                    const convertedBase64 = (await convertBlobToBase64(audioBlob)) as string
                    if (convertedBase64.length < 6) {
                        toast.error('Không thể ghi âm, vui lòng thử lại.')
                        return
                    }

                    setRecordedAudio(audioUrl)
                    setLoadingAccurancy(true)
                    const res = await axios.post(
                        `${import.meta.env.VITE_API_STS}/GetAccuracyFromRecordedAudio`,
                        {
                            title: newData[currentIndex]?.answer,
                            base64Audio: convertedBase64,
                            language: 'en',
                        },
                        {
                            headers: { 'X-Api-Key': import.meta.env.VITE_STS_KEY as string },
                        }
                    )
                    setAccurancyFromRecoderAudio(res.data)
                    setLoadingAccurancy(false)
                } catch (error) {
                    console.error('Error creating audio blob:', error)
                    toast.error('Lỗi xử lý audio đã ghi')
                } finally {
                    setLoadingAccurancy(false)
                }
            }

            setMediaRecorder(recorder)
            return recorder
        } catch (error) {
            console.error('Error setting up media recorder:', error)
            toast.error('Không thể truy cập microphone')
            return null
        }
    }

    // Function để phát/dừng audio đã ghi
    const toggleAudioPlayback = async () => {
        if (!recordedAudio || !audioRef.current) return

        try {
            if (isPlayingAudio) {
                audioRef.current.pause()
                setIsPlayingAudio(false)
            } else {
                // Ensure audio is loaded before playing
                await audioRef.current.load()
                await audioRef.current.play()
                setIsPlayingAudio(true)
            }
        } catch (error) {
            console.error('Error playing audio:', error)
            setIsPlayingAudio(false)
            toast.error('Không thể phát audio đã ghi')
        }
    }

    const handleRecoding = async () => {
        if (!isRecording && !recordingCompleted) {
            // Bắt đầu ghi âm
            // resetTranscript()
            setRecordedAudio(null) // Reset audio cũ
            setIsPlayingAudio(false) // Reset playing state

            // Setup MediaRecorder
            const recorder = await setupMediaRecorder()
            if (!recorder) return

            SpeechRecognition.startListening({ continuous: true })
            recorder.start()

            setIsRecording(true)
            setCountDown(60) // Reset thời gian về 60 giây
            setRecordingCompleted(false)
            recognitionRef.current?.start()
        }
        // Không cho phép dừng recording trong quá trình ghi âm
    }

    const handleFreedomModeChange = (index: number) => {
        if (isFreedomMode || isSpeakMode || recordingCompleted) {
            stopRecording()

            // Reset audio states
            setRecordedAudio(null)
            setIsPlayingAudio(false)

            setCurrentIndex(index)
            setRecordingCompleted(false)
            setCountDown(60)
            // setConfidence(0)
            // resetTranscript()
            setAccurancyFromRecoderAudio(null)
            if (isSpeakMode) return

            speakWord(newData[index]?.text || 'Unable to load question', 'custom')
        }
    }

    const handleSyntheticChange = (type: 'script' | 'answer') => {
        if (isShowSynthetic === type) {
            setIsShowSynthetic('')
        } else {
            setIsShowSynthetic(type)
        }
    }
    const renderAccurancy = () => {
        if (!accurancyFromRecoderAudio) return null
        const lettersOfWordAreCorrect = accurancyFromRecoderAudio.is_letter_correct_all_words.split(' ')
        const currentTextWords = newData[currentIndex]?.answer.split(' ') || []

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

    const getBgColorForAccuracy = (accuracy: string) => {
        const accuracyValue = parseFloat(accuracy)
        if (accuracyValue >= 85) return 'border-green-200  bg-green-50 text-green-800'
        if (accuracyValue >= 70) return 'border-yellow-200 bg-yellow-50 text-yellow-800'
        if (accuracyValue >= 50) return 'border-orange-200  bg-orange-50 text-orange-800'
        if (accuracyValue <= 25 && accuracyValue > 0) return 'border-red-200  bg-red-50 text-red-800'
        return 'border-blue-200 bg-blue-50 text-blue-800'
    }
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto  h-screen">
            <div className="py-5 md:py-20">
                <div className="flex items-center flex-wrap justify-end gap-2 md:gap-5">
                    <VoiceSelectionModal>
                        <Button variant={'outline'}>Voice Settings</Button>
                    </VoiceSelectionModal>
                    <div className="flex items-center space-x-2 border-2 border-primary/20 p-2 rounded-md">
                        <Switch id="shuffle-mode" checked={isShuffleData} onCheckedChange={setIsShuffleData} />
                        <Label htmlFor="shuffle-mode">Shuffle Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2 border-2 border-primary/20 p-2 rounded-md">
                        <Switch id="Speak-mode" checked={isSpeakMode} onCheckedChange={setIsSpeakMode} />
                        <Label htmlFor="Speak-mode">Speak Mode</Label>
                    </div>
                    <div className="flex items-center space-x-2 border-2 border-primary/20 p-2 rounded-md">
                        <Switch
                            id="freedom-mode"
                            checked={isFreedomMode}
                            onCheckedChange={() => {
                                setIsFreedomMode(!isFreedomMode)
                                toast.success('Freedom Mode is on. You can navigate between questions freely.', {
                                    duration: 5000,
                                    position: 'top-center',
                                })
                            }}
                        />
                        <Label htmlFor="freedom-mode">Freedom Mode</Label>
                    </div>
                    <Button
                        variant={'destructive'}
                        onClick={() => {
                            stopRecording() // Dừng recording khi thoát
                            navigate(-1)
                        }}
                    >
                        <LogOut /> Leave
                    </Button>
                </div>
                <h1 className="w-full border-b-2 pb-2 border-gray-100 dark:border-white/20 text-2xl font-medium mt-5 md:mt-0">
                    Question {currentIndex + 1} or {dataExam?.data.reduce((acc, curr) => acc + curr.quests.length, 0)}
                </h1>
                <div className="flex gap-5 flex-col md:flex-row ">
                    {!isSpeakMode && (
                        <div className="pl-5 pt-5 flex gap-5  w-[350px]">
                            <div className="space-y-3">
                                <img src="/images/NewEuroAvatarCaptured.png" alt="" className="w-[350px]" />
                                <SpeakButton text={newData[currentIndex]?.text || 'Unable to load question'} id={'custom'} className=" w-full shadow-xs !h-10" />

                                <div className="flex gap-2">
                                    <Button variant={'secondary'} className="transition-all" onClick={() => handleSyntheticChange('script')}>
                                        {isShowSynthetic === 'script' ? (
                                            <>
                                                <EyeOff /> Hide Script
                                            </>
                                        ) : (
                                            <>
                                                <Eye /> Show Script
                                            </>
                                        )}
                                    </Button>
                                    <Button variant={'secondary'} className="transition-all" onClick={() => handleSyntheticChange('answer')}>
                                        {isShowSynthetic === 'answer' ? (
                                            <>
                                                <EyeOff /> Hide Answer
                                            </>
                                        ) : (
                                            <>
                                                <Eye /> Show Answer
                                            </>
                                        )}
                                    </Button>
                                </div>
                                {(isShowSynthetic === 'script' || isShowSynthetic === 'answer') && (
                                    <p className="text-gray-500 italic">{isShowSynthetic === 'script' ? newData[currentIndex]?.text : newData[currentIndex]?.answer}</p>
                                )}
                            </div>
                            <div className="flex-col gap-3 justify-center items-center hidden md:flex">
                                <div className="w-1 h-full bg-gray-100 dark:bg-white/20 rounded-md flex items-end">
                                    <div
                                        className={`w-1 rounded-md transition-all ${isRecording ? 'bg-gradient-to-t from-sky-600 to-purple-600' : 'bg-gray-300'}`}
                                        style={{
                                            height: `${isRecording ? volume : 0}%`,
                                            transition: 'height 0.1s ease-out',
                                        }}
                                    />
                                </div>
                                <div className={`mb-1 transition-colors ${isRecording ? 'text-red-500' : 'text-gray-500'}`}>
                                    <Mic size={20} />
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex-1 pt-5">
                        <h1 className="mb-2 text-gray-700 font-medium">Question Progress:</h1>
                        <div className="flex gap-2  flex-wrap w-full">
                            {newData &&
                                newData?.map((_item: any, index: number) => (
                                    <div
                                        key={index}
                                        onClick={() => handleFreedomModeChange(index)}
                                        className={`w-10 h-10  rounded-md flex items-center justify-center text-xs font-medium ${
                                            currentIndex === index ? 'bg-primary text-white' : ' bg-gray-200 dark:bg-gray-700/50'
                                        }
                                                 ${isFreedomMode ? 'cursor-pointer hover:bg-primary/50 hover:text-white' : 'cursor-not-allowed'}
                                                `}
                                    >
                                        {index + 1}
                                    </div>
                                ))}
                        </div>
                        {(!recordingCompleted || isRecording) && !isSpeakMode && (
                            <div
                                className={`w-full h-20 border-2 border-dashed dark:border-white/20 rounded-md mt-10 flex items-center justify-center gap-4 transition-all duration-300 ${
                                    isRecording
                                        ? 'border-red-500/50 text-red-600 bg-red-50'
                                        : recordingCompleted
                                        ? 'border-primary text-primary bg-green-50 cursor-not-allowed'
                                        : 'border-gray-300 text-gray-500 cursor-pointer hover:border-gray-500 hover:text-gray-800'
                                }`}
                                onClick={handleRecoding}
                            >
                                <div className="relative size-5 flex items-center justify-center">
                                    <div className={`absolute inset-0 bg-red-500 opacity-25 rounded-full -z-1 animate-ping ${isRecording ? 'visible' : 'invisible'}`}></div>
                                    <Mic />
                                </div>
                                <p className="text-xl">{isRecording ? 'Recording... Đang ghi âm' : recordingCompleted ? 'Recording completed' : 'Press to start recording'}</p>
                            </div>
                        )}

                        {isRecording && (
                            <div className="mt-5 ">
                                <h1 className="mb-2 text-gray-700 font-medium">Response time:</h1>
                                <div className="h-5 bg-gray-100 w-full  rounded-full">
                                    <div className="bg-gradient-to-r relative overflow-hidden from-sky-700 to-purple-700 h-full rounded-full" style={{ width: `${((60 - countDown) * 100) / 60}%` }}>
                                        <div
                                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse duration-2000 translate-x-[-100%]"
                                            style={{
                                                animation: 'shimmer 2s ease-in-out infinite',
                                                animationDelay: '0s',
                                            }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="text-end text-gray-500 mt-1">{format(countDown * 1000, 'mm:ss')}</div>
                            </div>
                        )}

                        {/* Transcript Display */}

                        {/* Audio Playback Controls */}
                        {recordedAudio && recordingCompleted && !isSpeakMode && (
                            <div className="mt-5">
                                <h1 className="mb-2 text-gray-700 font-medium flex items-center gap-2">
                                    <Volume2 size={18} />
                                    Your Recording:
                                </h1>
                                <div className="p-4 border rounded-lg bg-green-50 border-green-200 dark:border-white/20">
                                    <div className="flex items-center gap-3">
                                        <Button variant="outline" size="sm" onClick={toggleAudioPlayback} className="flex items-center gap-2">
                                            {isPlayingAudio ? (
                                                <>
                                                    <Pause size={16} />
                                                    Pause
                                                </>
                                            ) : (
                                                <>
                                                    <Play size={16} />
                                                    Play Recording
                                                </>
                                            )}
                                        </Button>
                                        <span className="text-sm text-gray-600">Click to {isPlayingAudio ? 'pause' : 'play'} your recorded answer</span>
                                    </div>
                                    <audio
                                        ref={audioRef}
                                        src={recordedAudio}
                                        onEnded={() => setIsPlayingAudio(false)}
                                        onPause={() => setIsPlayingAudio(false)}
                                        onPlay={() => setIsPlayingAudio(true)}
                                        className="hidden"
                                    />
                                </div>
                            </div>
                        )}
                        {isSpeakMode && (
                            <div className="mt-5">
                                <TextToIPA text={newData[currentIndex]?.answer} />
                            </div>
                        )}

                        {/* Stop Recording Button */}
                        {isRecording && (
                            <div className="mt-5 text-center">
                                <Button
                                    variant="outline"
                                    onClick={() => {
                                        stopRecording()
                                        setRecordingCompleted(true)
                                        setCountDown(0)
                                    }}
                                    className="border-red-500 text-red-600 hover:bg-red-50"
                                >
                                    Dừng recording
                                </Button>
                            </div>
                        )}
                        {recordingCompleted && !isSpeakMode && (
                            <div className="mt-5">
                                <h1 className="mb-2 text-gray-700 font-medium">Check Answer:</h1>
                                <div className={`p-4 border dark:border-white/20 rounded-lg text-gray-800 relative ${getBgColorForAccuracy(accurancyFromRecoderAudio?.pronunciation_accuracy || '0')}`}>
                                    {accurancyFromRecoderAudio && (
                                        <div className="space-y-5">
                                            <div
                                                className={`absolute -top-4 -right-3 -skew-5 px-1 py-0.5 text-lg rounded-sm shadow border ${getBgColorForAccuracy(
                                                    accurancyFromRecoderAudio.pronunciation_accuracy
                                                )}`}
                                            >
                                                <span className="skew-5">{accurancyFromRecoderAudio.pronunciation_accuracy}%</span>
                                            </div>
                                            <p className="text-gray-800 leading-relaxed italic">{renderAccurancy()}</p>
                                        </div>
                                    )}
                                    {!accurancyFromRecoderAudio && !loadingAccurancy && <p className="text-gray-500 italic">No accuracy data available. Please try recording again.</p>}

                                    {loadingAccurancy && !accurancyFromRecoderAudio && (
                                        <p className="text-gray-500 text-sm flex flex-col items-center justify-center gap-4 ">
                                            <LoadingIcon /> <span className="animate-bounce">Loading accuracy details, wait a moment...</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className={`flex items-center ${isFreedomMode ? 'justify-between' : 'justify-end'} mt-10`}>
                            {isFreedomMode && (
                                <Button
                                    disabled={!isFreedomMode || currentIndex === 0}
                                    onClick={() => {
                                        if (currentIndex > 0) {
                                            handleFreedomModeChange(currentIndex - 1)
                                        }
                                    }}
                                >
                                    <ChevronLeft /> Prev
                                </Button>
                            )}
                            {recordingCompleted && (
                                <Button variant="outline" className="mr-5" onClick={() => handleFreedomModeChange(currentIndex)}>
                                    <RotateCw /> Làm lại
                                </Button>
                            )}

                            <Button
                                disabled={(!isFreedomMode || !isSpeakMode) && currentIndex === newData.length - 1 && !loadingAccurancy}
                                onClick={() => {
                                    if (currentIndex < newData.length - 1 && !loadingAccurancy) {
                                        handleFreedomModeChange(currentIndex + 1)
                                    } else if (currentIndex === newData.length - 1) {
                                        toast.error('Bạn đã ở câu hỏi cuối cùng.')
                                    } else {
                                        toast.info('Vui lòng chờ hệ thống xử lý câu trả lời của bạn trước khi chuyển sang câu hỏi tiếp theo.', { duration: 5000, position: 'top-center' })
                                    }
                                }}
                            >
                                Next <ChevronRight />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
