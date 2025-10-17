import { Button } from '@/components/ui/button'
import { ArrowLeft, FileQuestion, Info, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import type { DataTopicCreate, DataTopicNoCategory, TopicCreateMin } from '@/types/topic'
import InlineEdit from '@/components/InlineEdit'
import { closestCenter, DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from '../components/SortableItem'
import topicService from '@/services/topicService'
import { toast } from 'sonner'
import LoadingIcon from '@/components/ui/loading-icon'
import ToastLogManyErrror from '@/components/etc/ToastLogManyErrror'
import type { Category } from '@/types/etc'
import categoryService from '@/services/categoryService'

export default function CreateTopicPage() {
    const navigate = useNavigate()
    const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor))
    const [flatCategory, setFlatCategory] = useState<Category[]>([])
    const [randomIndex, setRandomIndex] = useState(1)
    useEffect(() => {
        const initDataFetch = async () => {
            const initData: Category[] = []
            const fetchAPI = async () => {
                const res = await categoryService.getAllCategories()
                setFlatCategory(res)
                initData.push(...res)
            }
            const getCategory = sessionStorage.getItem('categories')
            if (getCategory) {
                setFlatCategory(JSON.parse(getCategory))
            } else {
                await fetchAPI()
                sessionStorage.setItem('categories', JSON.stringify(initData))
            }
        }
        initDataFetch()
    }, [])

    const [topicDetailData, setTopicDetailData] = useState<TopicCreateMin>({
        name: '',
        desc: '',
    })

    const defaultQuestionList: DataTopicCreate = {
        icon: flatCategory[randomIndex]?.icon,
        title: flatCategory[randomIndex]?.title,
        desc: flatCategory[randomIndex]?.desc,
        categoryId: flatCategory[randomIndex]?._id,
        quests: [{ _id: Date.now().toString(), text: '', note: '', answer: '' }],
        dateId: Date.now().toString(),
    }

    const defaultQuestionTemplateList: DataTopicCreate = {
        icon: '👤',
        title: 'Introduce yourself',
        desc: 'Thông tin cá nhân, sở thích, công việc, học vấn.',
        categoryId: '68f1a1f097c7b03a50ad61f5',
        dateId: Date.now().toString(),
        quests: [
            {
                _id: Date.now().toString(),
                text: 'Can you introduce yourself?',
                note: 'Mô tả ngắn gọn về bản thân bạn',
                answer: 'Hello, I am a software developer with a passion for learning new technologies and building innovative applications.',
            },
        ],
    }

    const [questionList, setQuestionList] = useState<DataTopicCreate[]>([defaultQuestionTemplateList])
    const [loadingCreateTopic, setLoadingCreateTopic] = useState(false)

    const createQuestion = () => {
        setQuestionList([{ ...defaultQuestionList, dateId: Date.now().toString() }, ...questionList])
        const newIndex = Math.floor(Math.random() * flatCategory.length)
        setRandomIndex(newIndex)
    }

    const createQuestExample = (index: number) => {
        const newList = [...questionList]
        newList[index].quests = [
            ...(newList[index].quests || []),
            {
                _id: Date.now().toString(),
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

    const handleTopicInfoChange = (item: DataTopicNoCategory, index: number) => {
        const newList = [...questionList]
        newList[index].title = item.title
        newList[index].desc = item.desc
        newList[index].icon = item.icon
        newList[index].categoryId = item._id
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
            const res = await topicService.createTopic(newDataTopic)
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
                const oldIndex = items.findIndex((item) => item.dateId === active.id)
                const newIndex = items.findIndex((item) => item.dateId === over.id)
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
            <div className=" h-10 flex gap-3 bg-red-50 mt-1 items-center text-sm text-red-700">
                <div className="h-10 w-10 flex items-center justify-center bg-red-100 ">
                    <Info size={16} />
                </div>
                <p>Lưu ý: các trường có dấu (*) là bắt buộc</p>
            </div>

            <div className="space-y-4 mt-10">
                {/* Topic Header */}
                <InlineEdit
                    initialValue={topicDetailData.name}
                    onSave={(value) => setTopicDetailData({ ...topicDetailData, name: value })}
                    placeholder="Chưa có tên chủ đề (*)"
                    className="px-4 xl:px-0 "
                    inputClassName="w-64"
                >
                    <h1 className="text-xl font-medium">{topicDetailData.name || 'Chưa có tên chủ đề (*)'}</h1>
                </InlineEdit>

                {/* Topic Description */}
                <InlineEdit
                    initialValue={topicDetailData.desc}
                    onSave={(value) => setTopicDetailData({ ...topicDetailData, desc: value })}
                    placeholder="Chưa có mô tả..."
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
                            <SortableContext items={questionList.map((item) => item.dateId)} strategy={verticalListSortingStrategy}>
                                {questionList.map((item: DataTopicCreate, index: number) => (
                                    <SortableItem
                                        key={item.dateId}
                                        item={item}
                                        index={index}
                                        flatCategory={flatCategory}
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
                <div className="fixed bottom-0 bg-sky-50/50 backdrop-blur-xs h-20 w-full max-w-7xl border-t-2 md:border-2 border-sky-700/20  border flex items-center justify-between px-5 md:px-5 pt-3 rounded-t-3xl">
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
