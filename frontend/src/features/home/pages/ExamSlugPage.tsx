import SpeakButton from '@/components/SpeakButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GENERIC_TIPS } from '@/config/etcConfig'
import { ChevronLeft, ChevronRight, Eye, EyeOff, LogOut, Mic, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { format, formatDate } from 'date-fns'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { toast } from 'sonner'
import VoiceSelectionModal from '@/components/etc/VoiceSelectionModal'
import { shuffleArray } from '@/lib/utils'
import topicService from '@/services/topicService'
import type { Quest, Topic } from '@/types/topic'
import AvatarCircle from '@/components/etc/AvatarCircle'
export default function ExamSlugPage() {
    const params = useParams()
    const [dataExam, setDataExam] = useState<Topic>()
    const [isStartExam, setIsStartExam] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [isShowScript, setIsShowScript] = useState(false)
    const [isShuffleData, setIsShuffleData] = useState(false)
    const [confidence, setConfidence] = useState(0)
    const [newData, setNewData] = useState<Quest[]>([])
    const [volume, setVolume] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [countDown, setCountDown] = useState(60) // Thời gian ghi âm 60 giây
    const [showAnswer, setShowAnswer] = useState(false) // Hiển thị đáp án sau khi hết thời gian
    const [recordingCompleted, setRecordingCompleted] = useState(false) // Đánh dấu hoàn thành ghi âm
    const analyserRef = useRef<AnalyserNode | null>(null)
    const recognitionRef = useRef<any>(null)
    const navigate = useNavigate()
    const { transcript, resetTranscript } = useSpeechRecognition()

    useEffect(() => {
        const fetchAPI = async () => {
            const res = await topicService.getTopicBySlug(params.slug as string)
            console.log(res.data)
            setDataExam(res.data)
        }
        fetchAPI()
    }, [])

    useEffect(() => {
        if (dataExam) {
            const flattenedData = dataExam?.data.flatMap((item) => item.quests)
            if (isShuffleData) {
                // Shuffle the data

                setNewData(shuffleArray(flattenedData))
                toast.info('Shuffle mode is on. Questions are randomized.', { duration: 5000, position: 'top-center' })
            } else {
                console.log(flattenedData)
                setNewData(flattenedData)
            }
        }
    }, [isShuffleData])

    // const compareText = (original: string, spoken: string) => {
    //     const originalWords = original.split(' ')
    //     const spokenWords = spoken.split(' ')

    //     const matchedIndices = lcs(originalWords, spokenWords)
    //     const result = []

    //     let currentMatchIndex = 0

    //     for (let i = 0; i < originalWords.length; i++) {
    //         if (currentMatchIndex < matchedIndices.length && i === matchedIndices[currentMatchIndex]) {
    //             result.push(
    //                 <span key={i} className="text-green-500">
    //                     {originalWords[i]}{' '}
    //                 </span>
    //             )
    //             currentMatchIndex++
    //         } else {
    //             result.push(
    //                 <span key={i} className="text-red-500">
    //                     {originalWords[i]}{' '}
    //                 </span>
    //             )
    //         }
    //     }

    //     return result
    // }

    // Function để dừng recording hoàn toàn
    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            recognitionRef.current.onend = null // Ngăn không cho restart
        }
        setIsRecording(false)
        setVolume(0) // Reset volume khi dừng
        analyserRef.current = null // Clear analyser reference
        SpeechRecognition.stopListening()
    }

    const handleRecoding = () => {
        if (!isRecording && !recordingCompleted) {
            // Bắt đầu ghi âm
            resetTranscript()
            SpeechRecognition.startListening({ continuous: true })
            setIsRecording(true)
            setCountDown(60) // Reset thời gian về 60 giây
            setRecordingCompleted(false)
            setShowAnswer(false)
            recognitionRef.current?.start()
        }
        // Không cho phép dừng recording trong quá trình ghi âm
    }

    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto  h-screen">
            {!isStartExam && (
                <div className="flex flex-col gap-2 justify-center items-center h-screen">
                    <Card className="mt-10 bg-gradient-to-r from-sky-50 to-purple-50 ">
                        <CardHeader>
                            <CardTitle className="text-xl text-gray-900 text-center">Mẹo tổng quát khi trả lời</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {GENERIC_TIPS.map((tip) => (
                                <div key={tip.id} className="flex items-start gap-3">
                                    <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold flex-shrink-0">{tip.id}</span>
                                    <p className="text-gray-700">
                                        <strong>{tip.textBold}</strong>
                                        {tip.text}
                                    </p>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                    <div className="text-center">
                        <Button variant={'outline'} className="mr-5" onClick={() => navigate('/')}>
                            <ChevronLeft /> Quay về trang chủ
                        </Button>
                        <Button className="mt-5 w-64 h-16 text-lg " onClick={() => setIsStartExam(true)} disabled={isStartExam}>
                            <Play /> Bắt đầu thi
                        </Button>
                    </div>
                </div>
            )}
            {isStartExam && (
                <div className="py-20">
                    <div className="flex items-center justify-end gap-5">
                        <VoiceSelectionModal>
                            <Button variant={'outline'}>Voice Settings</Button>
                        </VoiceSelectionModal>
                        <div className="flex items-center space-x-2 border-2 border-primary/30 p-2 rounded-md">
                            <Switch id="airplane-mode" checked={isShuffleData} onCheckedChange={setIsShuffleData} />
                            <Label htmlFor="airplane-mode">Shuffle Mode</Label>
                        </div>
                        <Button
                            variant={'destructive'}
                            onClick={() => {
                                stopRecording() // Dừng recording khi thoát
                                setIsStartExam(false)
                            }}
                        >
                            <LogOut /> Leave
                        </Button>
                    </div>
                    <h1 className="w-full border-b-2 pb-2 border-gray-100 text-2xl font-medium">
                        Question {currentIndex + 1} or {dataExam?.data.reduce((acc, curr) => acc + curr.quests.length, 0)}
                    </h1>
                    <div className="flex gap-5">
                        <div className="pl-5 pt-5 flex gap-5  w-[350px]">
                            <div className="space-y-3">
                                <img src="/images/NewEuroAvatarCaptured.png" alt="" className="w-[350px]" />
                                <SpeakButton text={newData[currentIndex]?.text || 'Unable to load question'} id={'custom'} className=" w-full shadow-xs !h-10" />
                                <Button variant={'secondary'} className="transition-all" onClick={() => setIsShowScript(!isShowScript)}>
                                    {isShowScript ? (
                                        <>
                                            <EyeOff /> Hide Script
                                        </>
                                    ) : (
                                        <>
                                            <Eye /> Show Script
                                        </>
                                    )}
                                </Button>
                                {isShowScript && <p className="text-gray-500 italic">{newData[currentIndex]?.answer}</p>}
                                <div className="flex gap-3 items-center text-gray-700 mt-5">
                                    <AvatarCircle user={dataExam?.userId} />
                                    <p>
                                        Cảm ơn{' '}
                                        <Link to={`/profile/${dataExam?.userId._id}`} className="font-medium">
                                            {dataExam?.userId.displayName}
                                        </Link>{' '}
                                        đã chia sẻ Topic "{dataExam?.name}"
                                    </p>
                                </div>
                                <p className="text-gray-500">Ngày tạo topic: {formatDate(dataExam?.createdAt || new Date(), 'dd/MM/yyyy')}</p>
                            </div>
                            <div className="flex flex-col gap-3 justify-center items-center">
                                <div className="w-1 h-full bg-gray-100 rounded-md flex items-end">
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
                        <div className="flex-1 pt-5">
                            <h1 className="mb-2 text-gray-700 font-medium">Question Progress:</h1>
                            <div className="flex gap-2  flex-wrap w-full">
                                {newData &&
                                    newData?.map((_item: any, index: number) => (
                                        <div
                                            key={index}
                                            className={`w-10 h-10  rounded-md flex items-center justify-center text-xs font-medium ${
                                                currentIndex === index ? 'bg-primary text-white' : ' bg-gray-200'
                                            }`}
                                        >
                                            {index + 1}
                                        </div>
                                    ))}
                            </div>
                            {!recordingCompleted && (
                                <div
                                    className={`w-full h-20 border-2 border-dashed rounded-md mt-10 flex items-center justify-center gap-4 transition-all duration-300 ${
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
                                        <div
                                            className="bg-gradient-to-r relative overflow-hidden from-sky-700 to-purple-700 h-full rounded-full"
                                            style={{ width: `${((60 - countDown) * 100) / 60}%` }}
                                        >
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

                            {/* Stop Recording Button */}
                            {isRecording && (
                                <div className="mt-5 text-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            stopRecording()
                                            setRecordingCompleted(true)
                                            setShowAnswer(true)
                                            setCountDown(0)
                                        }}
                                        className="border-red-500 text-red-600 hover:bg-red-50"
                                    >
                                        Dừng recording sớm
                                    </Button>
                                </div>
                            )}

                            {/* Transcript Display */}
                            {(transcript || isRecording) && (
                                <div className="mt-5">
                                    <h1 className="mb-2 text-gray-700 font-medium flex items-center gap-2">
                                        Your Response:
                                        {isRecording && (
                                            <span className="text-red-500 text-sm font-normal flex items-center gap-1">
                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                                Live
                                            </span>
                                        )}
                                    </h1>
                                    <div className="min-h-[100px] p-4 border rounded-lg bg-gray-50 relative">
                                        {transcript ? (
                                            <div className="text-gray-800 leading-relaxed">
                                                {/* Hiển thị text với interim text được highlight */}
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: transcript.replace(/\[(.*?)\]/g, '<span class="text-blue-600 bg-blue-100 px-1 rounded">$1</span>'),
                                                    }}
                                                />
                                                {isRecording && <span className="inline-block w-0.5 h-4 bg-gray-600 animate-pulse ml-1"></span>}
                                            </div>
                                        ) : isRecording ? (
                                            <div className="text-gray-500 italic flex items-center gap-2">
                                                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                                Listening for your voice...
                                            </div>
                                        ) : (
                                            <div className="text-gray-400 italic">No speech detected yet</div>
                                        )}

                                        {confidence > 0 && (
                                            <div className="mt-3 pt-2 border-t border-gray-200">
                                                <div className="text-sm text-gray-500 flex items-center justify-between">
                                                    <span>Speech Confidence: {Math.round(confidence * 100)}%</span>
                                                    <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                                        <div className="h-full bg-green-500 transition-all duration-300" style={{ width: `${confidence * 100}%` }} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Answer Display */}
                            {showAnswer && recordingCompleted && (
                                <div className="mt-5">
                                    <h1 className="mb-2 text-gray-700 font-medium">Sample Answer:</h1>
                                    <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                                        <p className="text-gray-800 leading-relaxed italic">{newData[currentIndex]?.answer || 'Sample answer not available for this question.'}</p>
                                    </div>
                                </div>
                            )}

                            <div className="text-right mt-10">
                                <Button
                                    disabled={!recordingCompleted}
                                    onClick={() => {
                                        if (currentIndex < newData.length - 1) {
                                            // Cleanup trước khi chuyển câu hỏi
                                            stopRecording()
                                            setCurrentIndex((prev) => prev + 1)
                                            setRecordingCompleted(false)
                                            setShowAnswer(false)
                                            setCountDown(60)
                                            setConfidence(0)
                                        }
                                    }}
                                >
                                    Next <ChevronRight />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {/* General Tips */}

            {/* <h1>Voice test</h1>
            <button onClick={isListening ? handleStop : handleStart} className={`px-4 py-2 mb-4 text-white rounded ${isListening ? 'bg-red-500' : 'bg-blue-500'}`}>
                {isListening ? 'Stop Recognition' : 'Start Recognition'}
            </button>
            <div className="w-64 h-4 bg-gray-300 rounded mb-4 overflow-hidden">
                <div className="h-full bg-green-500" style={{ width: `${confidence * 100}%`, transition: 'width 0.3s' }} />
            </div>
            <p className="text-lg">You said: {transcript}</p> */}
        </div>
    )
}
