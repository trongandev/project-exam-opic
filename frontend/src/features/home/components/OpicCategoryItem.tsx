import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { opicCategories } from '@/config/opicData'
import { Check, BookOpen } from 'lucide-react'
export default function OpicCategoryItem({ category }: { category: (typeof opicCategories)[0] }) {
    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner':
                return 'bg-green-100 text-green-600'
            case 'intermediate':
                return 'bg-yellow-100 text-yellow-600'
            case 'advanced':
                return 'bg-red-100 text-red-600'
            default:
                return 'bg-gray-100 text-gray-600'
        }
    }

    const getDifficultyText = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner':
                return 'Cơ bản'
            case 'intermediate':
                return 'Trung cấp'
            case 'advanced':
                return 'Nâng cao'
            default:
                return 'Không xác định'
        }
    }
    return (
        <Card key={category.id} className="bg-white border-primary/20 hover:shadow-lg shadow-primary/10 transition-all duration-300 relative group">
            {category.isPopular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                    <Badge className="bg-primary text-white px-4 py-1">Phổ biến nhất</Badge>
                </div>
            )}

            <CardHeader className="pb-4 pt-8">
                <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-xl font-semibold text-gray-900 flex-1">{category.name}</CardTitle>
                    <div className="w-14 h-11 bg-gradient-to-br from-sky-200 to-purple-200 rounded-lg flex items-center justify-center text-2xl">{category.icon}</div>
                </div>

                <div className="mb-4">
                    <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Độ khó:</span>
                        <Badge className={getDifficultyColor(category.difficulty)}>{getDifficultyText(category.difficulty)}</Badge>
                    </div>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-3">{category.description}</p>

                <Button className="w-full bg-primary hover:bg-primary/90 text-white group-hover:shadow-md transition-all">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Bắt đầu luyện tập
                </Button>
            </CardHeader>

            <Separator />

            <CardContent className="pt-4">
                <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-3">Nội dung:</h4>
                    <ul className="space-y-2">
                        {category.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                                <Check className="w-4 h-4 text-primary mr-2 flex-shrink-0 mt-0.5" />
                                <span className="leading-relaxed">{feature}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    )
}
