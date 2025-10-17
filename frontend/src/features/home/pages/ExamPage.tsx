import VoiceSelectionModal from '@/components/etc/VoiceSelectionModal'
import { Button } from '@/components/ui/button'
import { TOPICDATA } from '@/config/templateData'
import { ArrowLeft, ChevronLeft, Dot, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import OpicCategoryItem2 from '../components/OpicCategoryItem2'
import ExamOpic from '../components/ExamOpic'
import topicService from '@/services/topicService'
import type { Topic } from '@/types/topic'

export default function ExamPage() {
    const [dataExam, setDataExam] = useState<Topic | null>(TOPICDATA)
    const [isStartExam, setIsStartExam] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchAPI = async () => {
            const res = await topicService.getTopicPopulated()
            setDataExam(res)
        }
        fetchAPI()
    }, [])
    if (!dataExam) {
        return (
            <div className="flex items-center justify-center h-screen flex-col gap-2">
                <p>Không tìm thấy bộ đề thi.</p>
                <Button onClick={() => navigate(-1)}>
                    <ChevronLeft /> Quay lại
                </Button>
            </div>
        )
    }
    if (!isStartExam && dataExam) {
        return (
            <div className="px-0 max-w-7xl mx-auto my-10 text-gray-700 ">
                <div className="flex justify-between items-center px-3 md:px-0">
                    <Button variant={'ghost'} onClick={() => navigate('/topic')}>
                        <ArrowLeft /> Quay lại
                    </Button>
                    <VoiceSelectionModal>
                        <Button variant={'outline'}>Chọn giọng nói</Button>
                    </VoiceSelectionModal>
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
