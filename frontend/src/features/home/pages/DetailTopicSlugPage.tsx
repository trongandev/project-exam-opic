import { Button } from '@/components/ui/button'
import { ArrowLeft, Info, MessageCircleMore, Play, Star } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import VoiceSelectionModal from '@/components/etc/VoiceSelectionModal'
import OpicCategoryItem2 from '../components/OpicCategoryItem2'
import { useEffect, useState } from 'react'
import type { Topic } from '@/types/topic'
import topicService from '@/services/topicService'
import LoadingScreen from '@/components/etc/LoadingScreen'
import RatingComponent from '../components/RatingComponent'
import AvatarCircle from '@/components/etc/AvatarCircle'
import { formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale/vi'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
export default function DetailTopicSlugPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const [topicDetailData, setTopicDetailData] = useState<Topic>()
    const [loading, setLoading] = useState(false)
    const [score, setScore] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const { user } = useAuth()
    useEffect(() => {
        const fetchTopicDetail = async () => {
            setLoading(true)
            const response = await topicService.getTopicBySlug(params.slug as string)
            setTopicDetailData(response.data)
            setLoading(false)
        }
        fetchTopicDetail()
    }, [params.slug])

    const handleSubmitReview = async () => {
        if (score === 0) {
            toast.error('Vui lòng chọn số sao đánh giá!')
            return
        }
        if (!comment) {
            toast.error('Vui lòng nhập nhận xét!')
            return
        }

        setIsSubmittingReview(true)
        try {
            const res = await topicService.rateTopic(params.slug as string, { score, comment })
            console.log('Đánh giá gửi thành công:', res.data)

            setScore(0)
            setComment('')
            toast.success('Cảm ơn bạn đã đánh giá!')
            // Cập nhật lại danh sách đánh giá
            const newRating = {
                _id: new Date(),
                userId: user,
                score,
                comment,
                createdAt: new Date(),
            }
            setTopicDetailData((prev) => {
                if (!prev) return prev
                return { ...prev, rating: [newRating, ...prev.rating] }
            })
        } catch (error: any) {
            toast.error(error)
        } finally {
            setIsSubmittingReview(false)
        }
    }

    if (loading || !topicDetailData) {
        return <LoadingScreen />
    }
    return (
        <div className="px-0 max-w-7xl mx-auto my-10 text-gray-700 ">
            <div className="flex justify-between items-center">
                <Button variant={'ghost'} onClick={() => navigate('/topic')}>
                    <ArrowLeft /> Quay lại
                </Button>
                <VoiceSelectionModal>
                    <Button variant={'outline'}>Chọn giọng nói</Button>
                </VoiceSelectionModal>
            </div>
            <div className="space-y-2 mt-5">
                <h1 className="text-xl font-medium  px-4 xl:px-0">{topicDetailData.name}</h1>
                <p className=" px-4 xl:px-0">{topicDetailData.desc}</p>
                <Link to={`/exam/${params.slug}`} className="block mt-3">
                    <Button>
                        <Play /> Thi thử
                    </Button>
                </Link>
                <div className="flex gap-10 ">
                    <div className="my-5 grid grid-cols-1  gap-5 flex-1">
                        {topicDetailData.data.map((topic, index) => (
                            <OpicCategoryItem2 key={index} topic={topic} index={index} />
                        ))}
                    </div>
                    <div className="sticky top-10 space-y-3 mt-4 w-[250px] h-full hidden md:block border-l-2 border-gray-200">
                        {topicDetailData.data.map((topic, index) => (
                            <a
                                href={`#topic-${index}`}
                                className={`block relative transition-all  hover:bg-gray-200 hover:text-primary  px-3 py-1 rounded-r-md ${
                                    location.hash === `#topic-${index}` ? 'text-primary bg-sky-100' : 'text-gray-700'
                                }`}
                                key={index}
                            >
                                {location.hash === `#topic-${index}` && <div className="absolute w-0.5 h-8 bg-primary rounded-sm -translate-x-3.5 -translate-y-1 transition-all duration-300"></div>}
                                <p>
                                    {index + 1}. {topic.title}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="text-red-700 bg-red-50 border-l-4 border-red-700 p-3 md:p-5 rounded-r-xl ">
                    <p className="flex items-center gap-2 font-medium mb-2">
                        <Info size={20} /> Lưu ý:
                    </p>
                    <p className="">Các chủ đề trên được cộng đồng chia sẻ, mang tính chất tham khảo, bạn có thể mở rộng thêm các chủ đề khác phù hợp với khả năng và sở thích của mình.</p>
                    <p>
                        Hoặc{' '}
                        <a href="create-topic" className="underline text-primary">
                            click vào đây
                        </a>{' '}
                        để tạo chủ đề cho riêng mình
                    </p>
                </div>
                <RatingComponent score={score} setScore={setScore} comment={comment} setComment={setComment} isSubmittingReview={isSubmittingReview} handleSubmitReview={handleSubmitReview} />
                <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex gap-2 items-center">
                        <MessageCircleMore size={18} className="text-primary" /> Bình luận và đánh giá của những người khác
                    </h3>
                    {topicDetailData.rating.length === 0 && <p className="text-gray-500">Chưa có đánh giá nào</p>}
                    <div className="space-y-5">
                        {topicDetailData.rating.map((item) => (
                            <div key={item._id} className="flex gap-4 border border-gray-200 rounded-lg p-4">
                                <Link to={`/profile/${item.userId._id}`}>
                                    <AvatarCircle user={item.userId} className="h-14 w-14" />
                                </Link>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-medium">{item.userId.displayName}</h4>
                                            <p className="ml-2 text-sm text-gray-600 flex gap-1 items-center">
                                                ({item.score}/5 <Star size={14} />)
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-500">{formatDistance(new Date(item.createdAt), new Date(), { addSuffix: true, locale: vi })}</div>
                                    </div>
                                    <p className="mt-1 text-gray-700">{item.comment}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
