import SpeakButton from '@/components/SpeakButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GENERIC_TIPS } from '@/config/etcConfig'
import { TOPICDATA } from '@/config/templateData'
import { ChevronLeft, ChevronRight, Eye, EyeOff, LogOut, Mic, Play } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
export default function ExamPage() {
    const [isStartExam, setIsStartExam] = useState(true)
    const [isRecording, setIsRecording] = useState(false)
    const [isShowScript, setIsShowScript] = useState(false)
    const [transcript, setTranscript] = useState('')
    const [confidence, setConfidence] = useState(0)
    const [newData, setNewData] = useState<any>([])
    const [volume, setVolume] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(0)
    const [countDown, setCountDown] = useState(60) // Thời gian ghi âm 60 giây
    const [showAnswer, setShowAnswer] = useState(false) // Hiển thị đáp án sau khi hết thời gian
    const [recordingCompleted, setRecordingCompleted] = useState(false) // Đánh dấu hoàn thành ghi âm
    const analyserRef = useRef<AnalyserNode | null>(null)
    const recognitionRef = useRef<any>(null)
    const navigate = useNavigate()

    // Khởi tạo Speech Recognition
    useEffect(() => {
        const recognition = new (window as any).webkitSpeechRecognition()
        recognition.continuous = true // Ghi âm liên tục
        recognition.interimResults = true // Hiển thị kết quả tạm thời
        recognition.lang = 'en-US'

        recognition.onresult = (event: any) => {
            let finalTranscript = ''
            let interimTranscript = ''

            // Lấy tất cả kết quả từ đầu
            for (let i = 0; i < event.results.length; i++) {
                if (event.results[i].isFinal) {
                    finalTranscript += event.results[i][0].transcript + ' '
                    setConfidence(event.results[i][0].confidence)
                } else {
                    interimTranscript += event.results[i][0].transcript
                }
            }

            // Cập nhật transcript - giữ lại tất cả kết quả final và thêm interim
            setTranscript(() => {
                const fullText = finalTranscript.trim()
                if (interimTranscript) {
                    return fullText + (fullText ? ' ' : '') + `[${interimTranscript}]`
                }
                return fullText
            })
        }

        recognition.onerror = (event: any) => {
            console.error('Error occurred in recognition: ' + event.error)
        }

        recognition.onend = () => {
            // Tự động restart recognition nếu vẫn đang trong quá trình ghi âm
            if (isRecording && countDown > 0) {
                setTimeout(() => {
                    if (recognitionRef.current && isRecording && countDown > 0) {
                        recognitionRef.current.start()
                    }
                }, 100) // Delay một chút để tránh lỗi
            }
        }

        recognitionRef.current = recognition
    }, [isRecording, countDown])
    useEffect(() => {
        const flattenedData = TOPICDATA.flatMap((item) => item.quests)
        setNewData(flattenedData)
    }, [])

    // Function để dừng recording hoàn toàn
    const stopRecording = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            recognitionRef.current.onend = null // Ngăn không cho restart
        }
        setIsRecording(false)
        setVolume(0) // Reset volume khi dừng
        analyserRef.current = null // Clear analyser reference
    }

    // Cleanup khi component unmount
    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop()
                recognitionRef.current.onend = null
            }
        }
    }, [])

    const handleRecoding = () => {
        if (!isRecording && !recordingCompleted) {
            // Bắt đầu ghi âm
            setIsRecording(true)
            setTranscript('') // Reset transcript
            setCountDown(60) // Reset thời gian về 60 giây
            setRecordingCompleted(false)
            setShowAnswer(false)
            recognitionRef.current?.start()
        }
        // Không cho phép dừng recording trong quá trình ghi âm
    }

    useEffect(() => {
        if (isRecording && countDown > 0) {
            // Đếm ngược khi đang ghi âm
            const interval = setInterval(() => {
                setCountDown((prev) => {
                    if (prev <= 1) {
                        // Hết thời gian - dừng recording hoàn toàn
                        stopRecording()
                        setRecordingCompleted(true)
                        setShowAnswer(true)

                        const audio = new Audio('timer-terminer.mp3')
                        audio.play().catch(() => console.log('Audio play failed'))

                        return 0
                    }
                    return prev - 1
                })
            }, 1000)

            return () => clearInterval(interval)
        }
    }, [isRecording, countDown])

    // Chỉ setup audio khi bắt đầu recording
    useEffect(() => {
        let animationId: number
        let stream: MediaStream | null = null
        let audioContext: AudioContext | null = null

        const setupAudio = async () => {
            if (isRecording) {
                try {
                    stream = await navigator.mediaDevices.getUserMedia({ audio: true })
                    audioContext = new AudioContext()
                    const source = audioContext.createMediaStreamSource(stream)
                    const analyser = audioContext.createAnalyser()
                    analyser.fftSize = 256
                    analyserRef.current = analyser
                    source.connect(analyser)

                    const dataArray = new Uint8Array(analyser.frequencyBinCount)

                    const updateVolume = () => {
                        if (analyserRef.current && isRecording) {
                            analyserRef.current.getByteFrequencyData(dataArray)
                            const avg = dataArray.reduce((a, b) => a + b) / dataArray.length
                            setVolume(avg)
                            animationId = requestAnimationFrame(updateVolume)
                        }
                    }

                    updateVolume()
                } catch (error) {
                    console.error('Error accessing microphone:', error)
                }
            } else {
                // Dừng volume tracking khi không recording
                setVolume(0)
            }
        }

        setupAudio()

        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId)
            }
            // Cleanup audio stream khi dừng recording
            if (stream) {
                stream.getTracks().forEach((track) => track.stop())
            }
            if (audioContext) {
                audioContext.close()
            }
        }
    }, [isRecording])

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
                    <div className="text-right">
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
                        Question {currentIndex + 1} or {TOPICDATA.reduce((acc, curr) => acc + curr.quests.length, 0)}
                    </h1>
                    <div className="flex gap-5">
                        <div className="pl-5 pt-5 flex gap-5  w-[350px]">
                            <div className="space-y-3">
                                <img src="/images/NewEuroAvatarCaptured.png" alt="" className="w-[350px]" />
                                <SpeakButton text="Hello, can you introduce yourself?" id={'custom'} className=" w-full shadow-xs !h-10" />
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
                                {isShowScript && <p className="text-gray-500 italic">{newData[currentIndex].text}</p>}
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
                                            setTranscript('')
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
