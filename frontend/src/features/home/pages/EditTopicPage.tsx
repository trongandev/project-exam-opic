import { Button } from '@/components/ui/button'
import { ArrowLeft, FileQuestion, Save } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { DataTopic, TopicCreate } from '@/types/topic'
import InlineEdit from '@/components/InlineEdit'
import { closestCenter, DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from '../components/SortableItem'
import topicService from '@/services/topicService'
import { toast } from 'sonner'
import LoadingIcon from '@/components/ui/loading-icon'
import ToastLogManyErrror from '@/components/etc/ToastLogManyErrror'
export default function EditTopicPage() {
    const navigate = useNavigate()
    const params = useParams()
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
    const [topicDetailData, setTopicDetailData] = useState<TopicCreate>({
        name: '',
        desc: '',
    })

    const defaultQuestionList: DataTopic = {
        _id: new Date().toISOString(),
        icon: '🐎',
        title: '',
        desc: '',
        quests: [],
    }
    const [questionList, setQuestionList] = useState<DataTopic[]>([defaultQuestionList])
    const [loadingCreateTopic, setLoadingCreateTopic] = useState(false)

    useEffect(() => {
        const fetchTopicDetail = async () => {
            const res = await topicService.getTopicByIdToEdit(params._id as string)
            setTopicDetailData(res.data)
            setQuestionList(res.data.data.length > 0 ? res.data.data : [defaultQuestionList])
            console.log(res)
        }
        fetchTopicDetail()
    }, [params._id])

    const createQuestion = () => {
        setQuestionList([{ ...defaultQuestionList, _id: new Date().toISOString() }, ...questionList])
    }

    const createQuestExample = (index: number) => {
        const newList = [...questionList]
        newList[index].quests = [
            ...(newList[index].quests || []),
            {
                _id: new Date().toISOString(),
                text: '',
                note: '',
                answer: '',
            },
        ]
        setQuestionList(newList)
    }

    const removeQuestion = (index: number) => {
        const newList = [...questionList]
        newList.splice(index, 1)
        setQuestionList(newList)
    }

    const removeQuestExample = (questionIndex: number, questIndex: number) => {
        const newList = [...questionList]
        newList[questionIndex].quests?.splice(questIndex, 1)
        setQuestionList(newList)
    }

    const handleQuestExampleChange = (value: string, questionIndex: number, questIndex: number, field: 'text' | 'note' | 'answer') => {
        const newList = [...questionList]
        if (newList[questionIndex].quests && newList[questionIndex].quests[questIndex]) {
            newList[questionIndex].quests![questIndex][field] = value
            setQuestionList(newList)
        }
    }

    const handleTopicInfoChange = (value: string, index: number, field: 'icon' | 'title' | 'desc') => {
        const newList = [...questionList]
        newList[index][field] = value
        setQuestionList(newList)
    }

    const handleSaveTopic = async () => {
        // Logic to save the topic and questions
        const newDataTopic = {
            name: topicDetailData.name,
            desc: topicDetailData.desc,
            data: questionList,
        }
        try {
            setLoadingCreateTopic(true)
            const res = await topicService.updateTopic(params._id as string, newDataTopic)
            toast.success(res.message)
            navigate(`/topic/${res.data.slug}`)
        } catch (error: any) {
            console.log(error.response.data)
            ToastLogManyErrror(error)
        } finally {
            setLoadingCreateTopic(false)
        }
    }

    const handleDragEnd = (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            setQuestionList((items) => {
                const oldIndex = items.findIndex((item) => item._id === active.id)
                const newIndex = items.findIndex((item) => item._id === over.id)
                return arrayMove(items, oldIndex, newIndex)
            })
        }
    }
    return (
        <div className={`px-0 max-w-7xl mx-auto my-10 text-gray-700 relative`}>
            <div className="flex justify-between items-center">
                <Button variant={'ghost'} onClick={() => navigate(-1)}>
                    <ArrowLeft /> Quay lại
                </Button>
            </div>

            <div className="space-y-4 mt-5">
                {/* Topic Header */}
                <InlineEdit
                    initialValue={topicDetailData.name}
                    onSave={(value) => setTopicDetailData({ ...topicDetailData, name: value })}
                    placeholder="Tên tiêu đề"
                    className="px-4 xl:px-0 "
                    inputClassName="w-64"
                >
                    <h1 className="text-xl font-medium">{topicDetailData.name || 'Tên tiêu đề'}</h1>
                </InlineEdit>

                {/* Topic Description */}
                <InlineEdit
                    initialValue={topicDetailData.desc}
                    onSave={(value) => setTopicDetailData({ ...topicDetailData, desc: value })}
                    placeholder="Mô tả..."
                    className="px-4 xl:px-0"
                    inputClassName="w-[500px]"
                    multiline
                />

                {/* Create Question Button */}
                <div className="my-5 px-4 xl:px-0">
                    <Button variant={'outline'} onClick={createQuestion}>
                        Tạo câu hỏi <FileQuestion />
                    </Button>
                </div>

                {/* Questions List */}

                <div className="flex gap-10 my-5">
                    <div className="my-5 grid grid-cols-1 gap-5 flex-1 transition-all duration-200">
                        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                            <SortableContext items={questionList.map((item) => item._id)} strategy={verticalListSortingStrategy}>
                                {questionList.map((item: DataTopic, index: number) => (
                                    <SortableItem
                                        key={item._id}
                                        item={item}
                                        index={index}
                                        handleTopicInfoChange={handleTopicInfoChange}
                                        removeQuestion={removeQuestion}
                                        createQuestExample={createQuestExample}
                                        handleQuestExampleChange={handleQuestExampleChange}
                                        removeQuestExample={removeQuestExample}
                                    />
                                ))}
                            </SortableContext>
                        </DndContext>
                    </div>
                </div>
                <div className="mt-28"></div>
                <div className="fixed bottom-0 bg-sky-50/50 backdrop-blur-xs h-20 w-full md:w-7xl border-t-2 md:border-2 border-sky-700/20  border flex items-center justify-between px-5 md:px-5 pt-3 rounded-t-3xl">
                    <div className="font-medium text-gray-700">Tổng số câu: {questionList.reduce((acc, curr) => acc + (curr.quests ? curr.quests.length : 0), 0)}</div>
                    <div className="flex items-center gap-3">
                        <Button variant={'outline'}>Hủy</Button>
                        <Button onClick={handleSaveTopic}>
                            {loadingCreateTopic ? (
                                <>
                                    <LoadingIcon /> Đang lưu...
                                </>
                            ) : (
                                <>
                                    <Save /> Lưu
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
