import { useEffect, useState } from 'react'
import ExamOpic from '../components/ExamOpic'
import type { Topic } from '@/types/topic'
import topicService from '@/services/topicService'
import { Link, useNavigate, useParams } from 'react-router-dom'
import LoadingScreen from '@/components/etc/LoadingScreen'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { GENERIC_TIPS } from '@/config/etcConfig'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Play } from 'lucide-react'
import AvatarCircle from '@/components/etc/AvatarCircle'
import { formatDate } from 'date-fns'

export default function ExamSlugPage() {
    const params = useParams()
    const [dataExam, setDataExam] = useState<Topic | null>(null)
    const [isStartExam, setIsStartExam] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAPI = async () => {
            const res = await topicService.getTopicBySlug(params.slug as string)
            setDataExam(res.data)
        }
        fetchAPI()
    }, [params.slug])

    if (!dataExam) {
        return <LoadingScreen />
    }
    if (!isStartExam)
        return (
            <div className="flex flex-col gap-2 justify-center items-center h-screen px-3 md:px-0">
                <div className="flex  gap-3 items-center text-gray-700 mt-5">
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

                <div className="text-center mt-5 md:mt-0">
                    <Button variant={'outline'} className="mr-5" onClick={() => navigate('/')}>
                        <ChevronLeft /> Quay về trang chủ
                    </Button>
                    <Button className="mt-5 w-64 h-16 text-lg " onClick={() => setIsStartExam(true)} disabled={isStartExam}>
                        <Play /> Bắt đầu thi
                    </Button>
                </div>
            </div>
        )
    return <ExamOpic data={dataExam} />
}
