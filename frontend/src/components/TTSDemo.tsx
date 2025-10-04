import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import SpeakButton from '@/components/SpeakButton'
import { useSpeakWordContext } from '@/hooks/useSpeakWordContext'

// Danh sách các voice phổ biến
const VOICE_OPTIONS = [
    { id: 'en-US-JennyNeural', name: 'Jenny (US Female)', flag: '🇺🇸', code: 'en-US' },
    { id: 'en-US-GuyNeural', name: 'Guy (US Male)', flag: '🇺🇸', code: 'en-US' },
    { id: 'en-GB-SoniaNeural', name: 'Sonia (UK Female)', flag: '🇬🇧', code: 'en-GB' },
    { id: 'en-GB-RyanNeural', name: 'Ryan (UK Male)', flag: '🇬🇧', code: 'en-GB' },
    { id: 'en-AU-NatashaNeural', name: 'Natasha (AU Female)', flag: '🇦🇺', code: 'en-AU' },
    { id: 'en-AU-WilliamNeural', name: 'William (AU Male)', flag: '🇦🇺', code: 'en-AU' },
]

// Các ví dụ câu để test
const SAMPLE_TEXTS = [
    { id: 1, text: 'Hello, how are you doing today?', category: 'Greetings' },
    { id: 2, text: 'I would like to describe my hometown.', category: 'Hometown' },
    { id: 3, text: 'My hobby is reading books and watching movies.', category: 'Hobbies' },
    { id: 4, text: 'The weather today is quite nice and sunny.', category: 'Weather' },
    { id: 5, text: 'I usually go to work by subway or bus.', category: 'Transportation' },
]

export default function TTSDemo() {
    const { selectedVoice, setSelectedVoice, stopCurrentAudio, isPlaying, error } = useSpeakWordContext()

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                        <span>🎙️ TTS Demo - Text to Speech</span>
                        {isPlaying && (
                            <Button variant="destructive" size="sm" onClick={stopCurrentAudio}>
                                Dừng tất cả âm thanh
                            </Button>
                        )}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Current Voice Display */}
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <Label className="text-sm font-medium text-blue-700">Giọng nói hiện tại:</Label>
                                <p className="text-blue-900 font-semibold">{VOICE_OPTIONS.find((v) => v.id === selectedVoice)?.name || selectedVoice}</p>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">{VOICE_OPTIONS.find((v) => v.id === selectedVoice)?.flag} Đang sử dụng</Badge>
                        </div>
                    </div>

                    {/* Voice Selector */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Chọn giọng nói khác:</Label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {VOICE_OPTIONS.map((voice) => (
                                <Button
                                    key={voice.id}
                                    variant={selectedVoice === voice.id ? 'default' : 'outline'}
                                    className="h-auto p-3 justify-start"
                                    onClick={() => setSelectedVoice(voice.id, voice.code)}
                                    disabled={selectedVoice === voice.id}
                                >
                                    <span className="mr-2">{voice.flag}</span>
                                    <div className="text-left">
                                        <div className="font-medium">{voice.name}</div>
                                        {selectedVoice === voice.id && <div className="text-xs text-green-600">✓ Đang sử dụng</div>}
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Sample Texts */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Ví dụ câu để test:</Label>
                        <div className="space-y-3">
                            {SAMPLE_TEXTS.map((sample) => (
                                <div key={sample.id} className="flex items-center justify-between p-4 border rounded-lg">
                                    <div className="flex-1 pr-4">
                                        <Badge variant="secondary" className="mb-2">
                                            {sample.category}
                                        </Badge>
                                        <p className="text-sm">{sample.text}</p>
                                    </div>
                                    <SpeakButton text={sample.text} id={sample.id} variant="outline" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Custom Text Input */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Test với văn bản tùy chỉnh:</Label>
                        <CustomTextDemo />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-red-700 text-sm">❌ Lỗi: {error}</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}

// Component con để test văn bản tùy chỉnh
function CustomTextDemo() {
    const [customText, setCustomText] = useState('Enter your text here to test TTS functionality...')

    return (
        <div className="space-y-3">
            <div className="flex gap-2">
                <textarea
                    value={customText}
                    onChange={(e) => setCustomText(e.target.value)}
                    className="flex-1 min-h-[100px] p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập văn bản để test..."
                />
                <div className="flex flex-col gap-2">
                    <SpeakButton text={customText} id="custom-text" variant="default" />
                    <Button variant="outline" size="sm" onClick={() => setCustomText('')}>
                        Xóa
                    </Button>
                </div>
            </div>
        </div>
    )
}
