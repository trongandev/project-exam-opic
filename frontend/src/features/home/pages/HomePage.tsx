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
                    <h1 className="mt-10 mb-3 text-center text-2xl font-medium">Lựa chọn level bạn muốn đạt được</h1>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {opicInfo.scoreRange.levels.map((level, index) => (
                            <div key={index} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex items-center justify-between mb-2">
                                    <Badge className={`${index < 2 ? 'bg-red-100 text-red-600' : index < 4 ? 'bg-yellow-100 text-yellow-600' : 'bg-green-100 text-green-600'}`}>
                                        {level.level + ' ' + level.desc}
                                    </Badge>
                                    <span className="text-sm font-mono text-gray-600">{level.score}</span>
                                </div>
                                <p className="text-sm text-gray-700 ">{level.description}</p>
                                <Link to={`/practice/${level.level.toLowerCase()}`}>
                                    <Button variant={'link'} className="mt-3">
                                        Xem chi tiết <ChevronRight />
                                    </Button>
                                </Link>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
