import { Button } from '@/components/ui/button'
import { TOPICDATA } from '@/config/templateData'
import { ArrowLeft, Info, MoveDown } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
export default function IntroIM() {
    const navigate = useNavigate()
    const params = useLocation()
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto my-10 text-gray-700 ">
            <Button variant={'ghost'} onClick={() => navigate('/')}>
                <ArrowLeft /> Quay lại
            </Button>
            <div className="space-y-2 mt-5">
                <h1 className="text-xl font-medium ">Giới thiệu về IM (Intermediate Mid)</h1>
                <p className="">
                    Để chuẩn bị cho kỳ thi OPIc ở mức Trung cấp (Intermediate Mid), bạn nên tập trung vào các chủ đề phổ biến thường xuất hiện trong đề thi. Dưới đây là một số chủ đề thường gặp:
                </p>
                <div className="flex gap-10 ">
                    <div className="my-5 grid grid-cols-1  gap-5 flex-1">
                        {TOPICDATA.map((topic, index) => (
                            <div key={index} id={`topic-${index}`} className="border border-gray-200 rounded-lg  transition-shadow  bg-gray-200">
                                <div className="flex gap-4 shadow sticky top-0 bg-gray-200/20 backdrop-blur-sm">
                                    <div className="w-[80px] flex items-center justify-center text-2xl ">{topic.icon}</div>
                                    <div className="py-2.5">
                                        <h3 className="font-medium text-lg mb-1 text-primary">{topic.title}</h3>
                                        <p className="text-sm text-gray-500">{topic.description}</p>
                                    </div>
                                </div>
                                <div className=" bg-gray-50 ">
                                    {topic.quests && (
                                        <div className="p-3 md:p-5 border-t border-gray-200 ">
                                            <div className="space-y-3 mt-2">
                                                {topic.quests.map((quest, index) => (
                                                    <div key={index} className="bg-white text-gray-500 border border-gray-200 p-3 md:p-5 rounded-lg space-y-2">
                                                        <div className="flex gap-3 items-center">
                                                            <div className="w-10 h-10  hidden md:flex items-center justify-center text-gray-600 font-medium bg-gray-100 border text-sm rounded-lg">
                                                                {index + 1}
                                                            </div>
                                                            <div className="flex-1 text-justify  font-medium text-xl">{quest?.text}</div>
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
                        ))}
                    </div>
                    <div className="sticky top-10 space-y-3 mt-4 w-[250px] h-full hidden md:block border-l-2 border-gray-200">
                        {TOPICDATA.map((topic, index) => (
                            <a
                                href={`#topic-${index}`}
                                className={`block relative transition-all hover:bg-gray-200  px-3 py-1 ${params.hash === `#topic-${index}` ? 'text-primary' : 'text-gray-700'}`}
                                key={index}
                            >
                                {params.hash === `#topic-${index}` && <div className="absolute w-0.5 h-5 bg-primary rounded-sm -translate-x-3.5 translate-y-0.5 transition-all duration-300"></div>}
                                <p>
                                    {index + 1}. {topic.title}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="text-red-700 bg-red-50 border-l-4 border-red-700 p-3 md:p-5 rounded-r-xl ">
                    <p className="flex items-center gap-2 font-medium mb-2">
                        <Info size={20} /> Lưu ý:
                    </p>
                    <p className="">
                        Các chủ đề trên được admin xem qua các câu hỏi trong năm 2025, nó chỉ mang tính chất tham khảo, bạn có thể mở rộng thêm các chủ đề khác phù hợp với khả năng và sở thích của
                        mình.
                    </p>
                </div>
                <h1 className="text-xl font-medium mt-10">Xem qua sơ đồ tư duy về các chủ đề năm 2025 được cóp nhặt từ nhiều nguồn</h1>
                <a href="https://app.xmind.com/share/znTFN2kw?sheet-id=b6a2b210-e0a2-4ce9-a062-bc4387716f33" className="underline text-primary" target="_blank" rel="noopener noreferrer">
                    Hoặc click vào đây để xem full
                </a>

                <iframe src="https://app.xmind.com/embed/znTFN2kw?sheet-id=b6a2b210-e0a2-4ce9-a062-bc4387716f33" className="w-full h-[80vh]" allow="fullscreen"></iframe>
            </div>
        </div>
    )
}
