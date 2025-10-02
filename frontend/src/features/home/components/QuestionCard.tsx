import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageCircle, Lightbulb, Tag, BookOpenCheck } from 'lucide-react'

export default function QuestionCard({ question, index }: { question: any; index: number }) {
    const getTypeColor = (type: string) => {
        switch (type) {
            case 'introduction':
                return 'bg-blue-100 text-blue-600'
            case 'description':
                return 'bg-green-100 text-green-600'
            case 'experience':
                return 'bg-purple-100 text-purple-600'
            case 'comparison':
                return 'bg-orange-100 text-orange-600'
            case 'role-play':
                return 'bg-red-100 text-red-600'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    const getTypeText = (type: string) => {
        switch (type) {
            case 'introduction':
                return 'Giới thiệu'
            case 'description':
                return 'Mô tả'
            case 'experience':
                return 'Kinh nghiệm'
            case 'comparison':
                return 'So sánh'
            case 'role-play':
                return 'Nhập vai'
            default:
                return type
        }
    }

    return (
        <Card className="hover:shadow-lg transition-all duration-300">
            <CardHeader>
                <div className="flex items-start justify-between mb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Câu hỏi {index + 1}
                    </CardTitle>
                    <Badge className={getTypeColor(question.type)}>{getTypeText(question.type)}</Badge>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-primary font-medium leading-relaxed">"{question.questionText}"</p>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Hints */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-primary" />
                        Gợi ý trả lời
                    </h4>
                    <ul className="space-y-1">
                        {question.hints.map((hint: any, idx: any) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                                <span className="w-1 h-1 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                                {hint}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="">
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <BookOpenCheck className="w-4 h-4 text-primary" />
                        Tham khảo trả lời
                    </h4>
                    <div className={`bg-blue-50 p-4 rounded-lg `}>
                        <p className={`text-gray-600 text-justify leading-relaxed `}>"{question.answer_text_example}"</p>
                    </div>
                </div>

                {/* Keywords */}
                <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <Tag className="w-4 h-4 text-primary" />
                        Từ khóa quan trọng
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {question.keywords.map((keyword: any, idx: any) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                                {keyword}
                            </Badge>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
