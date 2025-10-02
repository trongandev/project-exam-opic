import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/contexts/AuthContext'
import { Edit, Info, Lock, Mail, Save, Trash } from 'lucide-react'
import { useState } from 'react'
import * as Yup from 'yup'
import { useFormik } from 'formik'
import authService, { type ChangePasswordRequest } from '@/services/authService'
import LoadingIcon from '@/components/ui/loading-icon'
import { toast } from 'sonner'
export default function ProfilePage() {
    const { user } = useAuth()
    const [isEditPassword, setIsEditPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const formik = useFormik<ChangePasswordRequest>({
        initialValues: {
            password: '',
            confirmPassword: '',
        },
        validationSchema: Yup.object({
            password: Yup.string().required('Vui lòng nhập password').min(8, 'Mật khẩu phải có ít nhất 8 ký tự').max(150, 'Mật khẩu không được vượt quá 150 ký tự'),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref('password'), undefined], 'Mật khẩu xác nhận không khớp')
                .required('Vui lòng xác nhận mật khẩu'),
        }),
        onSubmit: (values) => {
            handleLogin(values)
        },
    })

    const handleLogin = async (values: ChangePasswordRequest) => {
        try {
            setLoading(true)

            // Call login API
            await authService.changePassword(values)
            setErrorMessage('')
            setIsEditPassword(false)
            toast.success('Đổi mật khẩu thành công')
        } catch (error: any) {
            // Show error message
            let errorMessage = 'Có lỗi sảy ra, vui lòng thử lại'

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
        <div className="px-4 xl:px-0 max-w-7xl mx-auto space-y-7 h-screen flex  flex-col justify-center">
            <div className="border border-gray-300  p-5 rounded-xl  flex gap-10 items-center">
                <div className="flex items-center  w-32 h-32 justify-center bg-gradient-to-tr from-sky-700 to-purple-700 rounded-full text-white text-3xl">
                    {user?.displayName
                        .split(' ')
                        .map((n) => n[0])
                        .join('')}
                </div>
                <div className="">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Xin chào, {user?.displayName}</h1>
                    <p className="text-gray-600 flex items-center gap-1">
                        <Mail size={20} /> {user?.email}
                    </p>
                </div>
            </div>
            <div className="border border-gray-300  p-5 rounded-xl ">
                <div className=" flex gap-10 items-center justify-between">
                    <div className="flex gap-3 items-center font-bold">
                        <Lock size={20} />
                        <p className="text-gray-600">Mật khẩu</p>
                    </div>
                    {!isEditPassword && (
                        <Button variant={'outline'} onClick={() => setIsEditPassword(true)}>
                            <Edit />
                            Chỉnh sửa
                        </Button>
                    )}
                </div>
                {isEditPassword && (
                    <div className="space-y-5 mt-5">
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
                        <div className="space-y-1">
                            <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Nhập lại mật khẩu
                            </Label>
                            <Input
                                type="password"
                                id="confirmPassword"
                                placeholder="Nhập lại mật khẩu"
                                className="h-10 md:h-12"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                value={formik.values.confirmPassword}
                            />
                            {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="text-red-500 mt-1 ml-5 text-sm font-medium">{formik.errors.confirmPassword}</div> : null}
                        </div>
                        {errorMessage && (
                            <div className="text-sm flex  items-center">
                                <Info className="text-red-700" size={16} />
                                <span className="text-red-500 ml-2">{errorMessage}</span>
                            </div>
                        )}
                        <div className="flex gap-3 items-center justify-end">
                            <Button variant={'outline'} onClick={() => setIsEditPassword(false)}>
                                Đóng
                            </Button>
                            <Button type="submit" disabled={loading} onClick={formik.submitForm}>
                                {loading ? <LoadingIcon /> : <Save />}
                                Lưu thay đổi
                            </Button>
                        </div>
                    </div>
                )}
            </div>
            <div className="border border-gray-300  p-5 rounded-xl ">
                <div className="flex gap-3 items-center font-bold">
                    <Trash size={20} />
                    <p className="text-gray-600">Xóa tài khoản</p>
                </div>
                <div className=" flex gap-10 items-center justify-between">
                    <p className="text-gray-600">Bạn có chắc chắn muốn xóa tài khoản này?</p>
                    <Button variant={'destructive'}>Xóa tài khoản</Button>
                </div>
            </div>
        </div>
    )
}
