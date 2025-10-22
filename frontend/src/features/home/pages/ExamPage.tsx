import VoiceSelectionModal from '@/components/etc/VoiceSelectionModal'
import { Button } from '@/components/ui/button'
import { ArrowLeft, ChevronLeft, Copy, Dot, Mic, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OpicCategoryItem2 from '../components/OpicCategoryItem2'
import ExamOpic from '../components/ExamOpic'
import topicService from '@/services/topicService'
import type { Topic } from '@/types/topic'
import { toast } from 'sonner'
import LoadingScreen from '@/components/etc/LoadingScreen'

export default function ExamPage() {
    const [dataExam, setDataExam] = useState<Topic | null>(null)
    const [isStartExam, setIsStartExam] = useState(false)
    const navigate = useNavigate()
    const [loadingClone, setLoadingClone] = useState(false)
    const [loading, setLoading] = useState(false)
    useEffect(() => {
        const initDataFetch = async () => {
            const initData: Topic = {} as Topic
            const fetchAPI = async () => {
                setLoading(true)
                const res = await topicService.getTopicPopulated()
                setDataExam(res)
                Object.assign(initData, res)
                setLoading(false)
            }
            const getCategory = JSON.parse(sessionStorage.getItem('dataExam') || '{}') as Topic
            if (getCategory && Object.keys(getCategory).length > 0) {
                setDataExam(getCategory)
            } else {
                await fetchAPI()
                sessionStorage.setItem('dataExam', JSON.stringify(initData))
            }
        }
        initDataFetch()
    }, [])
    if (loading) {
        return LoadingScreen()
    }
    if (!dataExam && !loading) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-2">
                <p>Không tìm thấy bộ đề thi.</p>
                <Button onClick={() => navigate(-1)}>
                    <ChevronLeft /> Quay lại
                </Button>
            </div>
        )
    }

    const handleCloneTopic = async () => {
        try {
            setLoadingClone(true)
            const res = await topicService.cloneTopic(dataExam?._id as string)
            toast.success('Tạo bản sao chủ đề thành công!')
            navigate(`/topic/edit-topic/${res.data._id}`)
        } catch (error: any) {
            toast.error(error)
        } finally {
            setLoadingClone(false)
        }
    }

    if (!isStartExam && dataExam) {
        return (
            <div className="px-0 max-w-7xl mx-auto my-10 text-gray-700 ">
                <div className="flex justify-between items-center px-3 md:px-0">
                    <Button variant={'ghost'} onClick={() => navigate(-1)}>
                        <ArrowLeft /> Quay lại
                    </Button>
                    <div className="flex items-center gap-2">
                        <Button variant={'outline'} disabled={loadingClone} onClick={() => handleCloneTopic()}>
                            <Copy />
                            Tạo bản sao
                        </Button>

                        <VoiceSelectionModal>
                            <Button variant={'outline'}>
                                <Mic /> Chọn giọng nói
                            </Button>
                        </VoiceSelectionModal>
                    </div>
                </div>

                <div className="flex-1 mt-8">
                    <h1 className="text-xl font-semibold text-gray-900 flex-1 ">{dataExam.name}</h1>
                    <p className="text-gray-500 text-sm line-clamp-3 mt-1">{dataExam.desc}</p>
                </div>

                <div className="flex gap-10 ">
                    <div className="my-5 grid grid-cols-1  gap-5 flex-1">
                        {dataExam.data.map((topic, index) => (
                            <OpicCategoryItem2 key={index} topic={topic} index={index} />
                        ))}
                    </div>
                    <div className="sticky top-10  mt-4 w-[250px] h-full hidden md:block ">
                        <div className="border-l-2 border-gray-200 space-y-3">
                            {dataExam.data.map((topic, index) => (
                                <a
                                    href={`#topic-${index}`}
                                    className={`block relative transition-all  hover:bg-gray-200 hover:text-primary  px-3 py-1 rounded-r-md ${
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
                        <Button className="w-full h-14 mt-10" onClick={() => setIsStartExam(true)}>
                            <Play /> Thi thử bộ đề này
                        </Button>
                    </div>
                </div>
            </div>
        )
    }
    if (isStartExam && dataExam) return <ExamOpic data={dataExam} />
}
