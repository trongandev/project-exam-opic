import { Button } from '@/components/ui/button'
import LoadingIcon from '@/components/ui/loading-icon'
import { Textarea } from '@/components/ui/textarea'
import { Send, Star } from 'lucide-react'
import { useState } from 'react'

interface Props {
    title: string
    score: number
    setScore: (score: number) => void
    comment: string
    setComment: (comment: string) => void
    isSubmittingReview: boolean
    handleSubmitReview: () => void
}
export default function RatingComponent({ title, score, setScore, comment, setComment, isSubmittingReview, handleSubmitReview }: Props) {
    const [hoverRating, setHoverRating] = useState(0)

    const handleStarClick = (starValue: number) => {
        setScore(starValue)
    }

    const handleStarHover = (starValue: number) => {
        setHoverRating(starValue)
    }

    const handleStarLeave = () => {
        setHoverRating(0)
    }

    return (
        <div className="mt-8 bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex gap-2 items-center">
                <Star size={18} className="text-primary" /> {title}
            </h3>
            {/* Rating Stars */}
            <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2 font-medium">Đánh giá của bạn:</p>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            onClick={() => handleStarClick(star)}
                            onMouseEnter={() => handleStarHover(star)}
                            onMouseLeave={handleStarLeave}
                            className="text-2xl hover:scale-110 transition-all duration-200 focus:outline-none cursor-pointer"
                        >
                            <Star size={28} className={`${star <= (hoverRating || score) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} transition-colors duration-200`} />
                        </button>
                    ))}
                    {score > 0 && <span className="ml-2 text-sm text-gray-600">({score}/5 sao)</span>}
                </div>
            </div>

            {/* Review Text */}
            <div className="mb-4">
                <label className="block text-sm text-gray-600 mb-2 font-medium">
                    Nhận xét của bạn: <span className="text-gray-400 text-xs">(Tùy chọn)</span>
                </label>
                <Textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full h-36 rounded-md resize-none"
                    rows={4}
                    placeholder="Chia sẻ cảm nhận của bạn về chủ đề này..."
                    maxLength={500}
                />
                <p className="text-xs text-gray-400 mt-1">{comment.length}/500 ký tự</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-between items-center">
                <div className="text-sm text-gray-500">{score === 0 && 'Vui lòng chọn số sao để đánh giá'}</div>
                <Button onClick={handleSubmitReview} disabled={score === 0 || isSubmittingReview} className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isSubmittingReview ? (
                        <>
                            <LoadingIcon /> Đang gửi đánh giá...
                        </>
                    ) : (
                        <>
                            <Send /> Gửi đánh giá
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
