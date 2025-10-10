import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Link } from 'react-router-dom'

// import { useAuth } from '@/contexts/AuthContext'
import { useEffect, useState } from 'react'
import topicService from '@/services/topicService'
import type { Topic } from '@/types/topic'
import Pagination from '@/components/etc/Pagination'

import TopicCardItem from '../components/TopicCardItem'
import LoadingIcon from '@/components/ui/loading-icon'
export default function TopicPage() {
    const [topicData, setTopicData] = useState<Topic[]>([])
    const [loading, setLoading] = useState(false)
    const [pagination, setPagination] = useState({ currentPage: 1, totalPages: 1, pageSize: 6, totalItems: 0 })
    const [currentPage, setCurrentPage] = useState(1)
    // const { user } = useAuth()

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            const response = await topicService.getAllTopics()
            setTopicData(response.data.data)
            setPagination({
                currentPage: response.data.pagination.currentPage,
                totalPages: response.data.pagination.totalPages,
                pageSize: response.data.pagination.pageSize,
                totalItems: response.data.pagination.totalItems,
            })
            setLoading(false)
        }
        fetchData()
    }, [])

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
        // Tải dữ liệu mới từ API hoặc bất kỳ thao tác nào khác
    }
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto my-20 min-h-screen">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tổng hợp topic</h1>
                <p className="text-gray-600">Tham khảo các topic mà người dùng đóng góp hoặc bấm vào nút ở dưới để</p>
                <Link to={'/topic/create-topic'}>
                    <Button className="mt-2">
                        <PlusCircle /> Đóng góp topic
                    </Button>
                </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {topicData.map((topic) => (
                    <TopicCardItem key={topic._id} topic={topic} />
                ))}
                {loading && !topicData.length && (
                    <div className="flex items-center justify-center h-[500px] col-span-full">
                        <LoadingIcon />
                    </div>
                )}
            </div>
            <Pagination currentPage={currentPage} totalPages={pagination.totalPages} onPageChange={handlePageChange} />
        </div>
    )
}
