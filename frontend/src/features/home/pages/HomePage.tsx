import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { opicInfo } from '@/config/opicData'
import { Award, ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function HomePage() {
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto my-20">
            {/* Header */}
            <div className="text-center mb-12 text-primary">
                <h1 className="text-4xl font-bold  mb-4">{opicInfo.title}</h1>
                <p className="text-xl text-gray-600 mb-6">{opicInfo.subtitle}</p>
                <div className="bg-sky-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed max-w-4xl mx-auto">{opicInfo.description}</p>
                </div>
            </div>
            {/* Score Range */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2  text-primary text-xl">
                        <Award className="w-6 h-6" />
                        {opicInfo.scoreRange.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <img src="https://josephenglishyhc.wordpress.com/wp-content/uploads/2019/11/opic-fi.jpg" alt="" className="mx-auto mb-3" />
                </CardContent>
            </Card>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2  text-primary text-xl">
                        <Award className="w-6 h-6" />
                        Lựa chọn level bạn muốn đạt được
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {opicInfo.scoreRange.levels.map((level, index) => (
                            <div key={index} className={`border rounded-lg p-4 hover:shadow-md transition-shadow ${level.isPopular ? 'border-primary bg-sky-50 relative' : 'border-gray-300'}`}>
                                {level.isPopular && <Badge className="absolute top-3 right-3 bg-sky-200 text-primary">Phổ biến</Badge>}
                                <div className="flex items-center justify-between mb-2">
                                    <Badge className={`font-semibold ${level.isPopular ? 'bg-sky-200 text-primary' : 'bg-gray-200 text-gray-500'}`}>{level.level + ' ' + level.desc}</Badge>
                                    <span className="text-sm font-mono text-gray-600">{level.score}</span>
                                </div>
                                <p className="text-sm text-gray-700 ">{level.description}</p>
                                <p className="text-sm text-gray-500 italic ">{level.explain}</p>

                                <Link to={`${level.isPopular ? `/intro-im` : '#'}`} className="block text-right">
                                    <Button variant={level.isPopular ? 'default' : 'link'} disabled={!level.isPopular} className="mt-3">
                                        Xem chi tiết <ChevronRight />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* TTS Demo Card */}
            <Card className="mb-8 border-2 border-dashed border-blue-300 bg-blue-50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-700 text-xl">🎙️ TTS Demo - Text to Speech</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-700 mb-4">Hệ thống phát âm thông minh giúp bạn luyện tập phát âm tiếng Anh chuẩn xác. Hỗ trợ nhiều giọng nói từ các quốc gia khác nhau.</p>
                    <div className="flex gap-3">
                        <Link to="/tts-demo">
                            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
                                Thử ngay TTS Demo <ChevronRight className="w-4 h-4 ml-1" />
                            </Button>
                        </Link>
                        <Badge variant="secondary">Tính năng mới</Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
