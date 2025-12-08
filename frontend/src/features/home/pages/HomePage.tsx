import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { opicInfo, sampleQuestions } from '@/config/opicData'
import { Award, BookOpen, Check, ChevronRight, Landmark } from 'lucide-react'
import QuestionCard from '../components/QuestionCard'
import { Button } from '@/components/ui/button'
import type { Category } from '@/types/etc'
import { useEffect, useState } from 'react'
import categoryService from '@/services/categoryService'
import LoadingGrid from '@/components/etc/LoadingGrid'
import { Link } from 'react-router-dom'

export default function HomePage() {
    const [loading, setLoading] = useState(false)
    const [categories, setCategories] = useState<Category[]>([])
    useEffect(() => {
        const initDataFetch = async () => {
            const initData: Category[] = []
            const fetchAPI = async () => {
                setLoading(true)
                const res = await categoryService.getAllCategories()
                setCategories(res.slice(0, 6))
                initData.push(...res)
                setLoading(false)
            }
            const getCategory = JSON.parse(sessionStorage.getItem('categories') || '[]')
            if (getCategory && getCategory.length > 0) {
                setCategories(getCategory.slice(0, 6))
            } else {
                await fetchAPI()
                sessionStorage.setItem('categories', JSON.stringify(initData))
            }
        }
        initDataFetch()
    }, [])
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto my-20">
            {/* Header */}
            <div className="text-center text-primary">
                <h1 className="text-4xl font-bold  mb-4">{opicInfo.title}</h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 mb-6">{opicInfo.subtitle}</p>
                <div className="bg-sky-50 dark:bg-gray-800/50 rounded-xl p-6">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed max-w-4xl mx-auto">{opicInfo.description}</p>
                </div>
            </div>
            <div style={{ position: 'relative', paddingBottom: 'calc(49.21875% + 41px)', height: '0', width: '100%' }} className="mb-8">
                <iframe
                    src="https://demo.arcade.software/8Mi4F61oSvuPRDLqDJyU?embed&embed_mobile=tab&embed_desktop=inline&show_copy_link=true"
                    title="Thực hành trả lời phỏng vấn OPIc với các chế độ luyện tập"
                    loading="lazy"
                    allowFullScreen
                    allow="clipboard-write"
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', colorScheme: 'light' }}
                />
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between ">
                        <div className="flex items-center gap-3   text-primary text-md md:text-xl ">
                            <Landmark className="w-6 h-6" />
                            <p className="flex-1">Tổng hợp 74 thể loại hay gặp trong đề</p>
                        </div>
                        <Link to="/category">
                            <Button variant={'ghost'} size={'sm'} className="text-xs">
                                Xem thêm... <ChevronRight />
                            </Button>
                        </Link>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {categories && !loading && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {categories.map((category) => (
                                <div key={category._id} className="p-6 border dark:border-white/10 rounded-lg hover:shadow-md transition-shadow bg-white dark:bg-gray-800/50">
                                    <div className="flex items-center gap-3 mb-3">
                                        <span className="text-2xl">{category.icon}</span>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{category.title}</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{category.desc}</p>
                                </div>
                            ))}
                            {loading && <LoadingGrid className="col-span-full" />}
                            <Link to="/category" className="block text-center col-span-full">
                                <Button variant={'ghost'} size={'sm'} className="text-xs">
                                    Nhấn vào để xem thêm... <ChevronRight />
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
            </Card>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2  text-primary text-md md:text-xl">
                        <Award className="w-6 h-6" />
                        Các level trong OPIc và mức thưởng tại TKG
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-gray-600 ">
                        {opicInfo.scoreRange.levels.map((level, index) => (
                            <div
                                key={index}
                                className={`border dark:border-white/10 rounded-lg p-4 hover:shadow-md transition-shadow ${
                                    level.isPopular ? 'border-primary/20 bg-sky-50 dark:bg-gray-700/50 relative' : 'border-gray-300/50'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm  text-gray-700 dark:text-gray-300 font-medium">Level: {level.level}</span>
                                    {level.isPopular && <Badge className=" bg-sky-200 text-primary dark:bg-primary dark:text-white/80">Phổ biến</Badge>}
                                    <Badge
                                        className={`font-semibold ${
                                            level.isPopular ? 'bg-sky-200 text-primary dark:bg-primary dark:text-white/80' : 'bg-gray-200 text-gray-500 dark:bg-gray-700/50 dark:text-gray-400 '
                                        }`}
                                    >
                                        {level.claim}
                                    </Badge>
                                </div>
                                <p className="text-sm font-medium ">{level.description}</p>
                                <p className="text-sm text-gray-500 italic ">{level.explain}</p>
                                <div className="mt-3 italic">
                                    {level.descArr.map((desc, idx) => (
                                        <p key={idx} className="text-xs  flex items-center gap-1">
                                            <Check size={14} /> {desc}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <BookOpen className="w-6 h-6 text-primary" />
                        {opicInfo.strategies.title}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-600 dark:text-gray-300 mb-6">{opicInfo.strategies.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {opicInfo.strategies.list.map((strategy, index) => (
                            <div key={index} className="border-l-4 border-primary px-6 py-4 bg-sky-50 dark:bg-gray-700/50 rounded-r-lg">
                                <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                    {index + 1}. {strategy.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 mb-3">{strategy.description}</p>
                                <div className="bg-white dark:bg-gray-800/50 rounded-md p-3 border dark:border-white/10">
                                    <span className="text-xs text-gray-500 dark:text-gray-400 font-medium block mb-1">Ví dụ:</span>
                                    <code className="text-sm text-primary dark:text-white font-mono">{strategy.example}</code>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 p-6 bg-gradient-to-r from-sky-50 to-purple-50 dark:from-gray-700/50 dark:to-gray-800 rounded-lg text-primary dark:text-gray-400">
                        <h3 className="font-semibold text-lg mb-2 ">💡 Lời khuyên quan trọng</h3>
                        <p className="">
                            Hãy luyện tập kết hợp nhiều chiến lược trong một câu trả lời để tạo ra đoạn văn liên kết tự nhiên và ấn tượng. Điều này sẽ giúp bạn đạt được điểm số cao trong bài thi OPIc.
                        </p>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">🪖 Thực chiến</h2>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {sampleQuestions['self-introduction'].map((question, index) => (
                            <QuestionCard key={question.id} question={question} index={index} />
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Self Introduction Section */}
        </div>
    )
}
