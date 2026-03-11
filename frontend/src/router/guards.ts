import { redirect } from 'react-router-dom'

export const isLoggedIn = () => {
    return localStorage.getItem('local_TOKEN:') !== null
}
// Loader để bảo vệ các route cần xác thực
export const authGuard = async () => {
    if (!isLoggedIn()) {
        // Nếu chưa đăng nhập, chuyển hướng về trang login
        // kèm theo đường dẫn hiện tại để sau khi login có thể quay lại
        return redirect('/auth/login?redirect=' + window.location.pathname)
    }
    return null // Cho phép truy cập
}
