import { AlertCircle } from 'lucide-react'
import { Button } from '../ui/button'

export default function ErrorUI({ error, refetch }: { error?: Error; refetch: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="text-red-500 mb-4" size={48} />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không thể tải dữ liệu</h3>
            <p className="text-gray-600 mb-4">{error?.message || 'Đã xảy ra lỗi khi tải'}</p>
            <Button onClick={refetch} variant="outline">
                Thử lại
            </Button>
        </div>
    )
}
