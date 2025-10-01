import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ChevronLeft, Info, Mail, Phone } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function LoginPage() {
    const navigate = useNavigate()
    return (
        <div className="h-screen flex items-center justify-center  px-5 xl:px-0">
            <div className="w-full xl:w-4xl  mx-auto shadow-md rounded-xl border border-gray-200 flex flex-col-reverse xl:flex-row overflow-hidden items-center relative">
                <div className="absolute left-5 top-5">
                    <Button variant={'outline'} onClick={() => navigate(-1)}>
                        <ChevronLeft />
                    </Button>
                </div>
                <div className="absolute bottom-5 left-5 text-xs text-gray-500 flex gap-2 items-center">
                    <Phone size={16} />
                    <span className="">
                        Hỗ trợ:{' '}
                        <a href="tel:03887616331" className="text-blue-500 hover:underline">
                            0388 761 6331
                        </a>
                    </span>
                </div>
                <div className="p-5 flex-1 w-full">
                    <h1 className="text-3xl font-medium text-primary mb-5 text-center">Quên mật khẩu</h1>
                    <form className="space-y-5">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Nhập email mà bạn đã đăng ký
                            </Label>
                            <Input type="email" id="email" placeholder="Nhập email" className="h-12" />
                        </div>
                        <div className="text-xs text-gray-500 flex gap-2 items-center">
                            <Info size={16} />
                            <p className="flex-1">Vui lòng kiểm tra hộp thư đến của bạn sau khi gửi yêu cầu. Nếu bạn không nhận được email, hãy kiểm tra thư mục spam hoặc thử lại.</p>
                        </div>
                        <div className="flex justify-between items-center">
                            <Button>
                                <Mail />
                                Gửi liên kết đặt lại mật khẩu
                            </Button>
                            <Link to="/auth/login" className="text-xs text-gray-500 hover:underline pr-5">
                                Quay lại đăng nhập
                            </Link>
                        </div>
                    </form>
                </div>
                <div className="flex-1 h-[400px]">
                    <img src="/svg/undraw_compose-email_s6kf.svg" alt="" className="w-full h-full " />
                </div>
            </div>
        </div>
    )
}
