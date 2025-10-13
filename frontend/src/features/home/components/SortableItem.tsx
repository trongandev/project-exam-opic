import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import type { DataTopic } from '@/types/topic'
import { ChevronDown, ChevronUp, GripVertical, MoveDown, PlusCircle, Trash2 } from 'lucide-react'
import InlineEdit from '@/components/InlineEdit'
import { Button } from '@/components/ui/button'
interface Props {
    item: DataTopic
    index: number
    handleTopicInfoChange: any
    removeQuestion: any
    createQuestExample: any
    handleQuestExampleChange: any
    removeQuestExample: any
}
export default function SortableItem({ item, index, handleTopicInfoChange, removeQuestion, createQuestExample, handleQuestExampleChange, removeQuestExample }: Props) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item._id })
    const [collapse, setCollapse] = useState<boolean>(false)

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes}>
            <div key={item._id} className="border border-gray-200 rounded-lg overflow-hidden transition-shadow bg-gray-200">
                {/* Question Header */}
                <div className="flex items-center gap-4 shadow sticky top-0 bg-gray-50/50 backdrop-blur-sm px-5">
                    <GripVertical {...listeners} className="cursor-grab hover:text-primary" />
                    <p className="cursor-grab" {...listeners}>
                        {index + 1}
                    </p>
                    <div className="w-[80px] flex items-center justify-center text-2xl">{item.icon}</div>

                    <div className="flex gap-5 items-center justify-between flex-1">
                        <div className="py-2.5 flex-1 w-full space-y-2">
                            <InlineEdit initialValue={item.title} onSave={(value) => handleTopicInfoChange(value, index, 'title')} placeholder="Không có tiêu đề">
                                <h3 className="font-medium text-lg text-primary cursor-pointer hover:bg-gray-50">{item.title || 'Không có tiêu đề (*)'}</h3>
                            </InlineEdit>

                            <InlineEdit initialValue={item.desc} onSave={(value) => handleTopicInfoChange(value, index, 'desc')} placeholder="Không có mô tả..." multiline>
                                <p className="text-sm text-gray-500 cursor-pointer hover:bg-gray-50">{item.desc || 'Không có mô tả...'}</p>
                            </InlineEdit>
                        </div>

                        <div
                            className=" text-red-500 hover:text-red-600 cursor-pointer"
                            onClick={(e) => {
                                e.stopPropagation()
                                removeQuestion(index)
                            }}
                        >
                            <Trash2 size={18} />
                        </div>
                        <div
                            className="cursor-pointer hover:text-primary"
                            onClick={(e) => {
                                e.stopPropagation()
                                setCollapse(!collapse)
                            }}
                        >
                            {collapse ? <ChevronUp /> : <ChevronDown />}
                        </div>
                    </div>
                </div>

                {/* Question Content */}
                <div className={`bg-gray-50 transition-all duration-500 ease-in-out  overflow-hidden ${!collapse ? 'max-h-[2000px] ' : 'max-h-0'}`}>
                    <div className="p-3 md:p-5 border-t border-gray-200">
                        <Button
                            variant={'outline'}
                            size={'sm'}
                            className="text-xs"
                            onClick={(e) => {
                                e.stopPropagation()
                                createQuestExample(index)
                            }}
                        >
                            <PlusCircle size={12} /> Thêm ví dụ
                        </Button>

                        <div className="space-y-3 mt-2">
                            {item.quests?.map((quest, questIndex) => (
                                <div key={quest._id} className="bg-white text-gray-500 border border-gray-200 p-3 md:p-5 rounded-lg space-y-4">
                                    {/* Question Text */}
                                    <div className="flex  gap-3 items-center">
                                        <div className="w-10 h-10 hidden md:flex items-center justify-center text-gray-600 font-medium bg-gray-100 border text-sm rounded-lg">{questIndex + 1}</div>
                                        <div className="flex-1">
                                            <InlineEdit
                                                initialValue={quest.text}
                                                onSave={(value) => handleQuestExampleChange(value, index, questIndex, 'text')}
                                                placeholder="Chưa có câu hỏi... (*)"
                                                multiline
                                            >
                                                <div className="text-justify font-medium text-xl cursor-pointer">{quest.text || 'Chưa có câu hỏi... (*)'}</div>
                                            </InlineEdit>
                                        </div>
                                        <div
                                            className="cursor-pointer text-red-500 hover:text-red-600"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                removeQuestExample(index, questIndex)
                                            }}
                                        >
                                            <Trash2 size={18} />
                                        </div>
                                    </div>

                                    {/* Question Note */}
                                    <InlineEdit initialValue={quest.note} onSave={(value) => handleQuestExampleChange(value, index, questIndex, 'note')} placeholder="Chưa có ghi chú..." multiline>
                                        <div className="text-justify cursor-pointer">{quest.note || 'Chưa có ghi chú...'}</div>
                                    </InlineEdit>

                                    <MoveDown className="mx-auto my-2" />

                                    {/* Question Answer */}
                                    <InlineEdit
                                        initialValue={quest.answer}
                                        onSave={(value) => handleQuestExampleChange(value, index, questIndex, 'answer')}
                                        placeholder="Chưa có câu trả lời... (*)"
                                        multiline
                                    >
                                        <div className="text-justify border-l-4 border-gray-300 text-gray-500 pl-3 cursor-pointer">{quest.answer || 'Chưa có câu trả lời... (*)'}</div>
                                    </InlineEdit>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
