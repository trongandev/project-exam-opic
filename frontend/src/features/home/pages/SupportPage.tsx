import { Button } from '@/components/ui/button'
import { Mail } from 'lucide-react'
import React from 'react'

export default function SupportPage() {
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto space-y-7 h-screen flex  flex-col justify-center">
            <h1 className="text-3xl font-bold text-center">Trang Hỗ Trợ</h1>
            <p className="text-center text-gray-600">Nếu bạn cần hỗ trợ, vui lòng liên hệ qua email: support@example.com</p>
            <div className="flex justify-center">
                <Button className=" ">
                    <Mail /> Gửi yêu cầu hỗ trợ
                </Button>
            </div>
        </div>
    )
}
