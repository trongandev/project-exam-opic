import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

import { useEffect, useState } from 'react'
import topicService from '@/services/topicService'
import type { Topic } from '@/types/topic'
import Pagination from '@/components/etc/Pagination'

import TopicCardItem from '../components/TopicCardItem'
import LoadingIcon from '@/components/ui/loading-icon'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import SEO from '@/components/etc/SEO'
export default function TopicPage() {
    const [topicData, setTopicData] = useState<Topic[]>([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, pageSize: 6, totalItems: 0 })
    const [currentPage, setCurrentPage] = useState(1)
    const [loadingDelete, setLoadingDelete] = useState(false)
    const [SEOTopic, setSEOTopic] = useState('')
    const { user } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            try {
                const response = await topicService.getAllTopics(currentPage, pagination.pageSize)
                setTopicData(response.data.data)
                const flatSEOTOPIC = response.data.data.map((topic) => topic.name).join(', ')
                setSEOTopic(flatSEOTOPIC)
                setPagination({
                    currentPage: response.data.pagination.currentPage,
                    totalPages: response.data.pagination.totalPages,
                    pageSize: response.data.pagination.pageSize,
                    totalItems: response.data.pagination.totalItems,
                })
            } catch (error) {
                console.error('Error fetching topics:', error)
                toast.error('Không thể tải dữ liệu')
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [currentPage, pagination.pageSize])

    const handlePageChange = (page: number) => {
        if (page !== currentPage && page >= 1 && page <= pagination.totalPages) {
            setCurrentPage(page)
            // useEffect sẽ tự động gọi lại API với currentPage mới
        }
    }

    const handleDeleteTopic = async (_id: string) => {
        try {
            setLoadingDelete(true)
            const res = await topicService.deleteTopic(_id)
            toast.success(res.data.message)
            setTopicData((prev) => prev.filter((topic) => topic._id !== _id))
        } catch (error: any) {
            toast.error(error?.message)
        } finally {
            setLoadingDelete(false)
        }
    }
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto my-20 min-h-screen">
            <SEO title="Tổng hợp topic" description={`Danh sách các topic đã được tạo: ${SEOTopic}`} />
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Tổng hợp topic
                    {pagination.totalItems > 0 && (
                        <span className="text-lg font-normal text-gray-600">
                            ({pagination.totalItems} topic{pagination.totalItems > 1 ? 's' : ''})
                        </span>
                    )}
                </h1>
                <p className="text-gray-600">Tham khảo các topic mà người dùng đóng góp hoặc bấm vào nút ở dưới để</p>
                <Link to={'/topic/create-topic'}>
                    <Button className="mt-2">
                        <PlusCircle /> Đóng góp topic
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading ? (
                    // Hiển thị loading skeleton khi đang tải
                    <div className="flex items-center justify-center h-[500px] col-span-full">
                        <LoadingIcon />
                    </div>
                ) : topicData.length > 0 ? (
                    // Hiển thị data khi có dữ liệu
                    topicData.map((topic) => <TopicCardItem key={topic._id} topic={topic} idUser={user?._id} loadingDelete={loadingDelete} handleDeleteTopic={handleDeleteTopic} />)
                ) : (
                    // Hiển thị empty state khi không có dữ liệu
                    <div className="flex flex-col items-center justify-center h-[300px] col-span-full text-gray-500">
                        <p className="text-lg font-medium mb-2">Chưa có topic nào</p>
                        <p className="text-sm">Hãy là người đầu tiên đóng góp topic!</p>
                    </div>
                )}
            </div>
            <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
        </div>
    )
}
