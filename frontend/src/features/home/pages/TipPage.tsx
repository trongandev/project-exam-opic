import QuestionCard from '@/features/home/components/QuestionCard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GENERIC_TIPS } from '@/config/etcConfig'
import { opicInfo, sampleQuestions } from '@/config/opicData'
import { BookOpen } from 'lucide-react'

export default function TipPage() {
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Tip trả lời</h1>
                <p className="text-gray-600">Tham khảo các cách trả lời hiệu quả, đạt điểm cao</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        {opicInfo.strategies.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 mb-6">{opicInfo.strategies.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {opicInfo.strategies.list.map((strategy, index) => (
                            <div key={index} className="border-l-4 border-primary px-6 py-4 bg-sky-50 rounded-r-lg">
                                <h3 className="font-semibold text-gray-900 mb-2">
                                    {index + 1}. {strategy.name}
                                </h3>
                                <p className="text-gray-600 mb-3">{strategy.description}</p>
                                <div className="bg-white rounded-md p-3 border">
                                    <span className="text-xs text-gray-500 font-medium block mb-1">Ví dụ:</span>
                                    <code className="text-sm text-primary font-mono">{strategy.example}</code>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-sky-50 to-purple-50 rounded-lg text-primary">
                        <h3 className="font-semibold text-lg mb-2 ">💡 Lời khuyên quan trọng</h3>
                        <p className="">
                            Hãy luyện tập kết hợp nhiều chiến lược trong một câu trả lời để tạo ra đoạn văn liên kết tự nhiên và ấn tượng. Điều này sẽ giúp bạn đạt được điểm số cao trong bài thi OPIc.
                        </p>
                    </div>
                </CardContent>
            </Card>
            {/* Self Introduction Section */}
            <div className="mt-20">
                <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center gap-2">👤 Giới thiệu bản thân</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sampleQuestions['self-introduction'].map((question, index) => (
                        <QuestionCard key={question.id} question={question} index={index} />
                    ))}
                </div>
            </div>
            {/* General Tips */}
            <Card className="mt-10 bg-gradient-to-r from-sky-50 to-purple-50 ">
                <CardHeader>
                    <CardTitle className="text-xl text-gray-900">💡 Mẹo tổng quát khi trả lời</CardTitle>
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
        </div>
    )
}
