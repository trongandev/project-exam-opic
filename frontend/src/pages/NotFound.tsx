import { Button } from '@/components/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function NotFound() {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col gap-5 items-center justify-center h-screen text-2xl font-bold text-gray-900">
            <h1 className="text-6xl font-extrabold text-primary animate-bounce">404</h1>
            <div className="text-center">
                <p className="text-gray-500 ">Trang bạn tìm kiếm không tồn tại....</p>
                <Button className="mt-5" onClick={() => navigate(-1)}>
                    <ChevronLeft /> Quay lại trang trước
                </Button>
            </div>
        </div>
    )
}
