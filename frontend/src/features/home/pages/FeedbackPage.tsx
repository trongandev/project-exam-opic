import AvatarCircle from '@/components/etc/AvatarCircle'
import feedbackService from '@/services/feedbackService'
import type { FeedbackResponse } from '@/types/etc'
import { formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale/vi'
import { MessageCircleMore, Star } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import RatingComponent from '../components/RatingComponent'
import LoadingGrid from '@/components/etc/LoadingGrid'
import { useAuth } from '@/contexts/AuthContext'

export default function FeedbackPage() {
    const [rating, setRating] = useState(5)
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const [feedback, setFeedback] = useState<FeedbackResponse[]>([])
    const [loading, setLoading] = useState(false)
    const [comment, setComment] = useState('')
    const { user } = useAuth()
    useEffect(() => {
        const fetchFeedback = async () => {
            setLoading(true)
            const res = await feedbackService.getAllFeedbacks(1, 20)
            console.log(res)
            setFeedback(res)
            setLoading(false)
        }
        fetchFeedback()
    }, [])
    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast.error('Vui lòng chọn số sao đánh giá!')
            return
        }
        if (!comment) {
            toast.error('Vui lòng nhập nhận xét!')
            return
        }

        setIsSubmittingReview(true)
        try {
            const res = await feedbackService.createFeedback({ rating, comment })
            console.log('Đánh giá gửi thành công:', res.data)

            setRating(0)
            setComment('')
            toast.success('Cảm ơn bạn đã đánh giá!')
            const newRating: FeedbackResponse = {
                _id: Date.now().toString(),
                userId: user!,
                rating,
                comment,
                helpfulCount: 0,
                createdAt: Date.now().toString(),
                updatedAt: Date.now().toString(),
            }
            setFeedback((prev) => {
                if (!prev) return prev
                return [newRating, ...prev]
            })
        } catch (error: any) {
            toast.error(error)
        } finally {
            setIsSubmittingReview(false)
        }
    }
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto my-20  min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Góp ý & phản hồi</h1>
                <p className="text-gray-600 mx-auto max-w-3xl">
                    Bạn hãy để lại 1 góp ý cho sản phẩm, cũng như phản hồi về trải nghiệm của bạn, hoặc bạn có thể yêu cầu một tính năng mới. Mình sẽ cố gắng cập nhật tính năng đó nhé 😘
                </p>
            </div>
            <RatingComponent
                title="Đánh giá sản phẩm"
                score={rating}
                setScore={setRating}
                comment={comment}
                setComment={setComment}
                isSubmittingReview={isSubmittingReview}
                handleSubmitReview={handleSubmitReview}
            />

            <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
                <h3 className="text-lg font-semibold mb-4 flex gap-2 items-center">
                    <MessageCircleMore size={18} className="text-primary" /> Bình luận và đánh giá của những người khác
                </h3>
                {feedback.length === 0 && <p className="text-gray-500">Chưa có đánh giá nào</p>}
                <div className="space-y-5">
                    {!loading &&
                        feedback &&
                        feedback.map((item) => (
                            <div key={item._id} className="flex gap-4 border border-gray-200 rounded-lg p-4">
                                <Link to={`/profile/${item.userId._id}`}>
                                    <AvatarCircle user={item.userId} className="h-14 w-14" />
                                </Link>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <h4 className="font-medium">{item.userId.displayName}</h4>
                                            <p className="ml-2 text-sm text-gray-600 flex gap-1 items-center">
                                                ({item.rating}/5 <Star size={14} className="fill-yellow-500 stroke-yellow-500" />)
                                            </p>
                                        </div>
                                        <div className="text-xs text-gray-500">{formatDistance(new Date(item.createdAt), new Date(), { addSuffix: true, locale: vi })}</div>
                                    </div>
                                    <p className="mt-1 text-gray-700">{item.comment}</p>
                                </div>
                            </div>
                        ))}
                    {loading && <LoadingGrid />}
                </div>
            </div>
            <div className="mt-20 text-gray-600">
                <p>
                    Bạn có thể{' '}
                    <a className="underline text-blue-500" href="mailto:trongandev@gmail.com">
                        nhấn vào đây
                    </a>{' '}
                    để yêu cầu tính năng mới nhé
                </p>
            </div>
        </div>
    )
}
