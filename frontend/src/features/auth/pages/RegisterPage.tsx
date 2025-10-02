import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import type { RegisterRequest } from '@/services/authService'
import authService from '@/services/authService'
import { ChevronLeft, Info } from 'lucide-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import Loading from '@/components/ui/Loading'

export default function RegisterPage() {
    const navigate = useNavigate()
    const { login } = useAuth()
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const formik = useFormik<RegisterRequest>({
        initialValues: {
            displayName: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            displayName: Yup.string().required('Vui lòng nhập tên hiển thị').min(5, 'Tên hiển thị phải có ít nhất 5 ký tự').max(50, 'Tên hiển thị không được vượt quá 50 ký tự'),
            email: Yup.string().email('Email không hợp lệ').required('Vui lòng nhập email').min(5, 'Email phải có ít nhất 5 ký tự').max(100, 'Email không được vượt quá 100 ký tự'),
            password: Yup.string().required('Vui lòng nhập password').min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(150, 'Mật khẩu không được vượt quá 150 ký tự'),
        }),
        onSubmit: (values) => {
            handleLogin(values)
        },
    })

    const handleLogin = async (values: RegisterRequest) => {
        try {
            setLoading(true)

            // Call login API
            const response = await authService.register(values)

            // Login successful - save to context
            login(response.user, response.accessToken, response.refreshToken)

            // Navigate to dashboard or home
            navigate('/')
        } catch (error: any) {
            // Show error message
            let errorMessage = 'Email hoặc mật khẩu không đúng'

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
            <div className="w-full xl:max-w-4xl  mx-auto shadow-md rounded-xl border border-gray-200 flex flex-col-reverse xl:flex-row overflow-hidden items-center relative">
                <div className="absolute left-5 top-5">
                    <Button variant={'outline'} onClick={() => navigate(-1)}>
                        <ChevronLeft />
                    </Button>
                </div>

                <div className="p-5 flex-1 w-full">
                    <h1 className="text-3xl font-medium text-primary mb-5 text-center">Đăng ký</h1>
                    <form className="space-y-5" onSubmit={formik.handleSubmit}>
                        <div className="space-y-1">
                            <Label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                                Tên hiển thị
                            </Label>
                            <Input
                                type="text"
                                id="displayName"
                                placeholder="Nhập tên hiển thị"
                                className="h-10 md:h-12"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.displayName}
                            />
                            {formik.touched.displayName && formik.errors.displayName ? <div className="text-red-500 mt-1 mb-3 ml-5 text-sm">{formik.errors.displayName}</div> : null}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input type="email" id="email" placeholder="Nhập email" className="h-10 md:h-12" onChange={formik.handleChange} onBlur={formik.handleBlur} value={formik.values.email} />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 mt-1 mb-3 ml-5 text-sm">{formik.errors.email}</div> : null}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Mật khẩu
                            </Label>
                            <Input
                                type="password"
                                id="password"
                                placeholder="Nhập mật khẩu"
                                className="h-10 md:h-12"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.password}
                            />
                            {formik.touched.password && formik.errors.password ? <div className="text-red-500 mt-1 ml-5 text-sm font-medium">{formik.errors.password}</div> : null}
                        </div>
                        {errorMessage && (
                            <div className="text-sm flex  items-center">
                                <Info className="text-red-700" size={16} />
                                <span className="text-red-500 ml-2">{errorMessage}</span>
                            </div>
                        )}

                        <Button type="submit" disabled={loading}>
                            {loading && <Loading />}
                            Đăng ký
                        </Button>
                    </form>
                    <div className="flex gap-2 text-xs text-gray-500 mt-3">
                        <p>Bạn đã có tài khoản?</p>
                        <Link to="/auth/login" className="text-primary underline ">
                            Đăng nhập ngay
                        </Link>
                    </div>
                </div>
                <div className="flex-1  p-5">
                    <img src="/svg/undraw_terms_sx63.svg" alt="" className="w-full h-full " />
                </div>
            </div>
        </div>
    )
}
