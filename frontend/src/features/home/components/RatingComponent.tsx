import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Star } from 'lucide-react'
import { useState } from 'react'

export default function RatingComponent() {
    const [rating, setRating] = useState(0)
    const [hoverRating, setHoverRating] = useState(0)
    const [review, setReview] = useState('')
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const handleStarClick = (starValue: number) => {
        setRating(starValue)
    }

    const handleStarHover = (starValue: number) => {
        setHoverRating(starValue)
    }

    const handleStarLeave = () => {
        setHoverRating(0)
    }

    const handleSubmitReview = async () => {
        if (rating === 0) {
            alert('Vui lòng chọn số sao đánh giá!')
            return
        }

        setIsSubmittingReview(true)
        try {
            // Gọi API để gửi đánh giá
            console.log('Gửi đánh giá:', {
                rating,
                review,
                // topicSlug: params.slug,
            })

            // Reset form sau khi gửi thành công
            setRating(0)
            setReview('')
            alert('Cảm ơn bạn đã đánh giá!')
        } catch (error) {
            console.error('Lỗi gửi đánh giá:', error)
            alert('Có lỗi xảy ra khi gửi đánh giá!')
        } finally {
            setIsSubmittingReview(false)
        }
    }

    return (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Đánh giá chủ đề này</h3>

            {/* Rating Stars */}
            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Đánh giá của bạn:</p>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            onMouseLeave={handleStarLeave}
                            className="text-2xl hover:scale-110 transition-all duration-200 focus:outline-none"
                        >
                            <Star size={28} className={`${star <= (hoverRating || rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors duration-200`} />
                        </button>
                    ))}
                    {rating > 0 && <span className="ml-2 text-sm text-gray-600">({rating}/5 sao)</span>}
                </div>
            </div>

            {/* Review Text */}
            <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2">
                    Nhận xét của bạn: <span className="text-gray-400">(Tùy chọn)</span>
                </label>
                <Textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    className="w-full h-24 rounded-md resize-none"
                    rows={4}
                    placeholder="Chia sẻ cảm nhận của bạn về chủ đề này..."
                    maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">{review.length}/500 ký tự</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">{rating === 0 && 'Vui lòng chọn số sao để đánh giá'}</div>
                <Button onClick={handleSubmitReview} disabled={rating === 0 || isSubmittingReview} className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmittingReview ? 'Đang gửi...' : 'Gửi đánh giá'}
                </Button>
            </div>
        </div>
    )
}
