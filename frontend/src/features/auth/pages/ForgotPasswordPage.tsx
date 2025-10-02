import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { ForgotPasswordRequest } from '@/services/authService'
import { ChevronLeft, CircleCheckBig, Info, Mail } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import authService from '@/services/authService'
import LoadingIcon from '@/components/ui/loading-icon'
export default function LoginPage() {
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState('')
    const [loading, setLoading] = useState(false)
    const [isSendSuccessForgetPassword, setIsSendSuccessForgetPassword] = useState(false)
    const formik = useFormik<ForgotPasswordRequest>({
        initialValues: {
            email: '',
        },
        validationSchema: Yup.object({
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email'),
        }),
        onSubmit: (values) => {
            handleForgetPassword(values)
        },
    })

    const handleForgetPassword = async (values: ForgotPasswordRequest) => {
        try {
            setLoading(true)

            // Call login API
            await authService.forgotPassword(values)

            setIsSendSuccessForgetPassword(true)

            // Navigate to dashboard or home
        } catch (error: any) {
            // Show error message
            let errorMessage = 'Email không tồn tại'

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message
            } else if (error.message) {
                errorMessage = error.message
            }
            setErrorMessage(errorMessage)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="h-screen flex items-center justify-center  px-5 xl:px-0">
            <div className="w-full xl:w-4xl  mx-auto shadow-md rounded-xl border border-gray-200 flex flex-col-reverse xl:flex-row overflow-hidden items-center relative">
                {!isSendSuccessForgetPassword && (
                    <div className="absolute left-5 top-5">
                        <Button variant={'outline'} onClick={() => navigate(-1)}>
                            <ChevronLeft />
                        </Button>
                    </div>
                )}

                {isSendSuccessForgetPassword ? (
                    <div className="p-5 flex-1 w-full text-center text-primary font-medium">
                        <CircleCheckBig size={60} className="mx-auto" />
                        <p className="text-xl  my-3">Đặt lại mật khẩu thành công</p>
                        <p className="flex-1 text-gray-500 text-sm">Mật khẩu mới đã được tạo và gửi vào email của bạn. Vui lòng kiểm tra hộp thư đến</p>
                        <Button className="mt-10" onClick={() => navigate('/auth/login')}>
                            <ChevronLeft /> Quay lại đăng nhập
                        </Button>
                    </div>
                ) : (
                    <div className="p-5 flex-1 w-full">
                        <h1 className="text-3xl font-medium text-primary mb-5 text-center">Quên mật khẩu</h1>
                        <form className="space-y-5 mt-5" onSubmit={formik.handleSubmit}>
                            <div className="space-y-1">
                                <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Nhập email mà bạn đã đăng ký
                                </Label>
                                <Input
                                    type="email"
                                    id="email"
                                    placeholder="Nhập email"
                                    className="h-10 md:h-12"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={formik.values.email}
                                />
                                {formik.touched.email && formik.errors.email ? <div className="text-red-500 mt-1 mb-3 ml-5 text-sm">{formik.errors.email}</div> : null}
                            </div>
                            {errorMessage && (
                                <div className="text-sm flex  items-center">
                                    <Info className="text-red-700" size={16} />
                                    <span className="text-red-500 ml-2">{errorMessage}</span>
                                </div>
                            )}
                            <div className="flex justify-between items-center gap-3 md:gap-0">
                                <Button type="submit" disabled={loading}>
                                    {loading ? <LoadingIcon /> : <Mail />}
                                    Đặt lại mật khẩu mới
                                </Button>
                                <Link to="/auth/login" className="text-xs text-gray-500 hover:underline pr-5">
                                    Quay lại đăng nhập
                                </Link>
                            </div>
                        </form>
                    </div>
                )}

                <div className="flex-1 h-[400px]">
                    <img src="/svg/undraw_compose-email_s6kf.svg" alt="" className="w-full h-full " />
                </div>
            </div>
        </div>
    )
}
