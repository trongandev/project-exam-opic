import { redirect } from 'react-router-dom'
import { isLoggedIn } from '../lib/authService'

// Loader để bảo vệ các route cần xác thực
export const authGuard = async () => {
    if (!isLoggedIn()) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login
        // kèm theo đường dẫn hiện tại để sau khi login có thể quay lại
        return redirect('/auth/login?redirect=' + window.location.pathname)
    }
    return null // Cho phép truy cập
}

// Loader để fetch dữ liệu user
export const userLoader = async ({ params }: { params: any }) => {
    // Giả lập gọi API
    const response = await fetch(`https://jsonplaceholder.typicode.com/users/${params.userId}`)
    if (!response.ok) {
        throw new Response('User not found', { status: 404 })
    }
    const user = await response.json()
    return user
}
