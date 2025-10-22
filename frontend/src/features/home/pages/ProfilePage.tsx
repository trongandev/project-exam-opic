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
import AvatarCircle from '@/components/etc/AvatarCircle'
import ToastLogManyErrror from '@/components/etc/ToastLogManyErrror'
import profileService from '@/services/profileService'
export default function ProfilePage() {
    const { user, setUser } = useAuth()
    const [isEditDisplayName, setIsEditDisplayName] = useState(false)
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
            handleChangePassword(values)
        },
    })
    const formikDisplayName = useFormik({
        initialValues: {
            displayName: user?.displayName || '',
        },
        validationSchema: Yup.object({
            displayName: Yup.string().required('Vui lòng nhập tên hiển thị').min(2, 'Tên hiển thị phải có ít nhất 2 ký tự').max(100, 'Tên hiển thị không được vượt quá 100 ký tự'),
        }),
        onSubmit: (values) => {
            handleChangeDisplayName(values)
        },
    })

    const handleChangeDisplayName = async (values: { displayName: string }) => {
        try {
            setLoading(true)

            // Call login API
            const res = await profileService.updateProfile(user?._id as string, values)
            setErrorMessage('')
            setIsEditDisplayName(false)
            toast.success('Đổi tên hiển thị thành công')
            setUser(res)
        } catch (error: any) {
            ToastLogManyErrror(error)
        } finally {
            setLoading(false)
        }
    }

    const handleChangePassword = async (values: ChangePasswordRequest) => {
        try {
            setLoading(true)

            // Call login API
            await authService.changePassword(values)
            setErrorMessage('')
            setIsEditPassword(false)
            toast.success('Đổi mật khẩu thành công')
        } catch (error: any) {
            ToastLogManyErrror(error)
        } finally {
            setLoading(false)
        }
    }
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto space-y-7 h-screen flex  flex-col justify-center">
            <div className="border border-gray-300  p-5 rounded-xl  flex gap-10 items-center">
                {user && <AvatarCircle user={user} className="h-32 w-32 text-3xl" />}
                <div className="flex flex-1 items-center justify-between">
                    <div className="">
                        {isEditDisplayName ? (
                            <>
                                <Label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                                    Tên hiển thị
                                </Label>
                                <Input
                                    type="text"
                                    id="displayName"
                                    placeholder="Nhập tên hiển thị"
                                    className="h-10 md:h-12"
                                    onChange={formikDisplayName.handleChange}
                                    onBlur={formikDisplayName.handleBlur}
                                    value={formikDisplayName.values.displayName}
                                />
                                {formikDisplayName.touched.displayName && formikDisplayName.errors.displayName ? (
                                    <div className="text-red-500 mt-1 ml-5 text-sm font-medium">{formikDisplayName.errors.displayName}</div>
                                ) : null}
                                <div className="flex gap-3 items-center mt-3">
                                    <Button variant={'outline'} onClick={() => setIsEditDisplayName(false)}>
                                        Đóng
                                    </Button>
                                    <Button type="submit" disabled={loading} onClick={formikDisplayName.submitForm}>
                                        {loading ? <LoadingIcon /> : <Save />}
                                        Lưu thay đổi
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <h1 className="text-2xl font-bold text-gray-900 mb-2">Xin chào, {user?.displayName}</h1>
                                <p className="text-gray-600 flex items-center gap-1">
                                    <Mail size={20} /> {user?.email}
                                </p>
                            </>
                        )}
                    </div>
                    {!isEditDisplayName && (
                        <Button variant={'outline'} onClick={() => setIsEditDisplayName(true)}>
                            <Edit />
                            Chỉnh sửa
                        </Button>
                    )}
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
