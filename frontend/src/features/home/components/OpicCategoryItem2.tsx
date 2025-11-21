import SpeakButton from '@/components/SpeakButton'
import { Button } from '@/components/ui/button'
import LoadingIcon from '@/components/ui/loading-icon'
import type { DataTopic } from '@/types/topic'
import { Download, MoveDown } from 'lucide-react'

export default function OpicCategoryItem2({
    topic,
    index,
    loadingDownload,
    handleDownloadAudio,
}: {
    topic: DataTopic
    index: number
    loadingDownload?: boolean
    handleDownloadAudio?: (topic: DataTopic) => void
}) {
    return (
        <div key={index} id={`topic-${index}`} className="border border-gray-200 rounded-lg  transition-shadow  bg-gray-200">
            <div className="flex gap-4 shadow sticky top-0 bg-gray-200/20 backdrop-blur-sm px-5 md:px-0">
                <div className="w-[80px] hidden md:flex items-center justify-center text-2xl ">{topic.categoryId.icon}</div>
                <div className="py-2.5 flex items-center gap-2 justify-between flex-1">
                    <div className="">
                        <h3 className="font-medium text-lg mb-1 text-primary">{topic.categoryId.title}</h3>
                        <p className="text-sm text-gray-500">{topic.categoryId.desc || 'Không có mô tả'}</p>
                    </div>
                    <Button variant={'outline'} disabled={loadingDownload} onClick={() => handleDownloadAudio && handleDownloadAudio(topic)} className="md:mr-5">
                        {loadingDownload ? <LoadingIcon /> : <Download />}
                        <span className="hidden md:block"> Tải Audio</span>
                    </Button>
                </div>
            </div>
            <div className=" bg-gray-50 ">
                {topic.quests && (
                    <div className="p-3 md:p-5 border-t border-gray-200 ">
                        <div className="space-y-3 mt-2">
                            {topic.quests.map((quest: any, index: any) => (
                                <div key={index} className="bg-white text-gray-500 border border-gray-200 p-3 md:p-5 rounded-lg space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-10 h-10  hidden md:flex items-center justify-center text-gray-600 font-medium bg-gray-100 border text-sm rounded-lg">{index + 1}</div>
                                        <div className="flex-1 text-justify  font-medium text-xl">{quest?.text}</div>
                                        <SpeakButton text={quest.text} id={'custom'} />
                                    </div>
                                    <div className="text-justify">{quest?.note}</div>
                                    <MoveDown className="mx-auto my-2 " />
                                    <div className="text-justify mt-5 border-l-4 border-gray-300 text-gray-500 pl-3">{quest?.answer}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
