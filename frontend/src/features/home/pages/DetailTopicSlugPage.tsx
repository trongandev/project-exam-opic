import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronRight, Copy, Dot, Download, Edit, Info, MessageCircleMore, Mic, Play, Star } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import VoiceSelectionModal from '@/components/etc/VoiceSelectionModal'
import OpicCategoryItem2 from '../components/OpicCategoryItem2'
import { useEffect, useState } from 'react'
import type { DataTopic, Topic } from '@/types/topic'
import topicService from '@/services/topicService'
import LoadingScreen from '@/components/etc/LoadingScreen'
import RatingComponent from '../components/RatingComponent'
import AvatarCircle from '@/components/etc/AvatarCircle'
import { formatDistance } from 'date-fns'
import { vi } from 'date-fns/locale/vi'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import SEO from '@/components/etc/SEO'
import etcService from '@/services/etcService'
import { EdgeSpeechTTS } from '@lobehub/tts'
import LoadingIcon from '@/components/ui/loading-icon'
export default function DetailTopicSlugPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const params = useParams()
    const [topicDetailData, setTopicDetailData] = useState<Topic>()
    const [loading, setLoading] = useState(false)
    const [loadingDownload, setLoadingDownload] = useState(false)
    const [loadingClone, setLoadingClone] = useState(false)
    const [score, setScore] = useState(0)
    const [comment, setComment] = useState('')
    const [isSubmittingReview, setIsSubmittingReview] = useState(false)
    const { user } = useAuth()
    const [tts] = useState(() => new EdgeSpeechTTS({ locale: 'en-US' }))
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
            await topicService.rateTopic(params.slug as string, { score, comment })

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

    const handleCloneTopic = async () => {
        try {
            setLoadingClone(true)
            const res = await topicService.cloneTopic(topicDetailData?._id as string)
            toast.success('Tạo bản sao chủ đề thành công!')
            navigate(`/topic/edit-topic/${res.data._id}`)
        } catch (error: any) {
            toast.error(error)
        } finally {
            setLoadingClone(false)
        }
    }

    const handleDownloadAudio = async (topic: DataTopic) => {
        try {
            setLoadingDownload(true)
            toast.loading('Đang tải audio, quá trình này có thể mất vài giây...')
            const newConnectWords: any = []
            topic.quests.forEach((quest) => {
                newConnectWords.push(quest.text + '. ' + quest.answer)
            })

            await etcService.downloadAudioFromText(tts, newConnectWords.join(' '), topic.categoryId.title)

            toast.success('Tải thành công!')
        } catch (error: any) {
            toast.error(error)
        } finally {
            setLoadingDownload(false)
            toast.dismiss('')
        }
    }

    const handleDownloadFullAudio = async (topic: DataTopic[]) => {
        try {
            setLoadingDownload(true)
            toast.loading('Đang tải audio, quá trình này có thể mất vài phút...')
            const newConnectWords: any = []
            topic.forEach((tp) => {
                tp.quests.forEach((quest) => {
                    newConnectWords.push(quest.text + '. ' + quest.answer)
                })
            })

            await etcService.downloadAudioFromText(tts, newConnectWords.join(' '), 'full-audio ' + topicDetailData?.name)

            toast.success('Tải thành công!')
        } catch (error: any) {
            toast.error(error)
        } finally {
            setLoadingDownload(false)
            toast.dismiss('')
        }
    }

    if (loading || !topicDetailData) {
        return <LoadingScreen />
    }
    return (
        <div className="px-0 max-w-7xl mx-auto my-10 text-gray-700 ">
            <SEO title={topicDetailData.name} description={topicDetailData.desc} canonical={`/${topicDetailData.slug}`} />
            <div className="flex justify-between  items-center px-3 md:px-0">
                <Button variant={'ghost'} onClick={() => navigate('/topic')}>
                    <ArrowLeft /> Quay lại
                </Button>
                <div className="flex items-center flex-wrap gap-2">
                    {user?._id === topicDetailData.userId._id && (
                        <Button variant={'outline'} onClick={() => navigate(`/topic/edit-topic/${topicDetailData._id}`)}>
                            <Edit /> Sửa
                        </Button>
                    )}
                    <Button variant={'outline'} disabled={loadingClone} onClick={() => handleCloneTopic()}>
                        <Copy />
                        Bản sao
                    </Button>
                    <Button variant={'outline'} disabled={loadingDownload} onClick={() => handleDownloadFullAudio(topicDetailData.data)} className="md:mr-5">
                        {loadingDownload ? <LoadingIcon /> : <Download />}
                        <span className="hidden md:block"> Tải Full Audio</span>
                    </Button>

                    <VoiceSelectionModal>
                        <Button variant={'outline'}>
                            <Mic /> Giọng nói
                        </Button>
                    </VoiceSelectionModal>
                </div>
            </div>
            <div className="space-y-2 mt-5">
                <div className=" px-3 md:px-0">
                    <h1 className="text-xl font-medium  px-4 xl:px-0">{topicDetailData.name}</h1>
                    <p className=" px-4 xl:px-0">{topicDetailData.desc}</p>
                    <Link to={`/exam/${params.slug}`} className="md:hidden block">
                        <Button className="w-full h-12 mt-10">
                            Thi thử bộ đề này <ChevronRight />
                        </Button>
                    </Link>
                </div>
                <div className="flex gap-10 ">
                    <div className="my-5 grid grid-cols-1  gap-5 flex-1">
                        {topicDetailData.data.map((topic, index) => (
                            <OpicCategoryItem2 key={index} topic={topic} index={index} loadingDownload={loadingDownload} handleDownloadAudio={handleDownloadAudio} />
                        ))}
                    </div>
                    <div className="sticky top-10  mt-4 w-[250px] h-full hidden md:block ">
                        <div className="border-l-2 border-gray-200 space-y-3">
                            {topicDetailData.data.map((topic, index) => (
                                <a
                                    href={`#topic-${index}`}
                                    className={`block relative transition-all  hover:bg-gray-200 hover:text-primary  px-3 py-1 rounded-r-md  ${
                                        location.hash === `#topic-${index}` ? 'text-primary bg-sky-100' : 'text-gray-700'
                                    }`}
                                    key={index}
                                >
                                    {location.hash === `#topic-${index}` && (
                                        <div className="absolute w-0.5 h-8 bg-primary rounded-sm -translate-x-3.5 -translate-y-1 transition-all duration-300"></div>
                                    )}
                                    <p className="flex">
                                        {topic.categoryId.icon} <Dot /> {topic.categoryId.title}
                                    </p>
                                </a>
                            ))}
                        </div>
                        <Link to={`/exam/${params.slug}`} className="block mt-3">
                            <Button className="w-full h-14 mt-10">
                                <Play /> Thi thử bộ đề này
                            </Button>
                        </Link>
                    </div>
                </div>
                <div className="mx-3 md:mx-0">
                    <div className=" text-red-700 bg-red-50 border-l-4 border-red-700 p-3 md:p-5 rounded-r-xl ">
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
                    <RatingComponent
                        title="Đánh giá chủ đề này"
                        score={score}
                        setScore={setScore}
                        comment={comment}
                        setComment={setComment}
                        isSubmittingReview={isSubmittingReview}
                        handleSubmitReview={handleSubmitReview}
                    />
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
                                                    ({item.score}/5 <Star size={14} className="fill-yellow-500 stroke-yellow-500" />)
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
        </div>
    )
}
