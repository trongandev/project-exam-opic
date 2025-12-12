import SpeakButton from '@/components/SpeakButton'
import { Button } from '@/components/ui/button'
import LoadingIcon from '@/components/ui/loading-icon'
import { useSpeakWordContext } from '@/hooks/useSpeakWordContext'
import type { DataTopic } from '@/types/topic'
import { Copy, Download, MoveDown } from 'lucide-react'
import { toast } from 'sonner'

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
    const { toggleAudio, isPlayingAudio, isLoadingAudio } = useSpeakWordContext()

    return (
        <div key={index} id={`topic-${index}`} className="border border-gray-200  dark:border-white/10 rounded-lg  transition-shadow  bg-gray-200 dark:bg-gray-800/50 overflow-hidden">
            <div className="flex gap-4 shadow sticky top-0 bg-gray-200/20 dark:bg-gray-700/50 backdrop-blur-sm px-5 md:px-0">
                <div className="w-[80px] hidden md:flex items-center justify-center text-2xl ">{topic.categoryId?.icon}</div>
                <div className="py-2.5 flex items-center gap-2 justify-between flex-1">
                    <div className="">
                        <h3 className="font-medium text-lg mb-1 text-primary">{topic.categoryId?.title}</h3>
                        <p className="text-sm text-gray-500">{topic.categoryId?.desc || 'Không có mô tả'}</p>
                    </div>

                    <Button disabled={loadingDownload} onClick={() => handleDownloadAudio && handleDownloadAudio(topic)} className="dark:border-white/10 dark:bg-gray-800 md:mr-5">
                        {loadingDownload ? <LoadingIcon /> : <Download />}
                        <span className="hidden md:block"> Tải Audio</span>
                    </Button>
                </div>
            </div>
            <div className=" bg-gray-50  dark:bg-gray-800/50">
                {topic.quests && (
                    <div className="p-3 md:p-5 border-t border-gray-200 dark:border-white/10">
                        <div className="space-y-3 mt-2">
                            {topic.quests.map((quest: any, index: any) => (
                                <div key={index} className="bg-white dark:bg-gray-700/20 text-gray-500 border border-gray-200 dark:border-white/10 p-3 md:p-5 rounded-lg space-y-2">
                                    <div className="flex gap-3 items-center">
                                        <div className="w-10 h-10  hidden md:flex items-center justify-center text-gray-600 dark:text-gray-400 font-medium bg-gray-100 dark:bg-gray-800/50 border dark:border-white/10 text-sm rounded-lg">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 text-justify  font-medium text-xl text-gray-400">
                                            {quest?.text.split(' ').map((word: string, idx: number) => {
                                                const isPlaying = isPlayingAudio(word, idx)
                                                const isLoading = isLoadingAudio(word, idx)
                                                return (
                                                    <span
                                                        key={idx}
                                                        className={`inline-flex hover:text-primary/80 cursor-pointer items-center gap-1 mr-2 ${isPlaying && 'text-red-700'}`}
                                                        onClick={() => toggleAudio(word, idx)}
                                                    >
                                                        {word} {isLoading && <LoadingIcon className="w-4 h-4" />}
                                                    </span>
                                                )
                                            })}
                                            <Button
                                                variant={'ghost'}
                                                className="ml-3 dark:text-gray-400"
                                                onClick={() => {
                                                    window.navigator.clipboard.writeText(quest.text)
                                                    toast.success('Sao chép thành công')
                                                }}
                                            >
                                                <Copy />
                                            </Button>
                                            <SpeakButton text={quest.text} id={'custom'} variant="ghost" isShowLabel={false} className="" />
                                        </div>
                                    </div>
                                    <div className="text-justify">{quest?.note}</div>
                                    <MoveDown className="mx-auto my-2 " />
                                    <div className="text-justify mt-5 border-l-4 border-gray-300 dark:border-white/30 text-gray-500 dark:text-gray-400 pl-3">
                                        {quest?.answer.split(' ').map((word: string, idx: number) => {
                                            const isPlaying = isPlayingAudio(word, idx)
                                            const isLoading = isLoadingAudio(word, idx)
                                            return (
                                                <span
                                                    key={idx}
                                                    className={`inline-flex hover:text-primary/80 cursor-pointer items-center gap-1 px-1 ${isPlaying && 'text-red-700'}`}
                                                    onClick={() => toggleAudio(word, idx)}
                                                >
                                                    {word} {isLoading && <LoadingIcon className="w-4 h-4" />}
                                                </span>
                                            )
                                        })}
                                        <Button
                                            variant={'ghost'}
                                            className="ml-3 dark:text-gray-400"
                                            onClick={() => {
                                                window.navigator.clipboard.writeText(quest.answer)
                                                toast.success('Sao chép thành công')
                                            }}
                                        >
                                            <Copy />
                                        </Button>
                                        <SpeakButton isShowLabel={false} variant="ghost" text={quest.answer} id={'custom'} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
