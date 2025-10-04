import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

function useScrollRestoration() {
    const { pathname } = useLocation()

    useEffect(() => {
        // Kiểm tra nếu có vị trí cuộn được lưu trữ
        const savedPosition = sessionStorage.getItem(`scroll-position-${pathname}`)

        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition, 10))
        } else {
            window.scrollTo(0, 0) // Cuộn lên đầu nếu không có vị trí lưu trữ
        }

        return () => {
            // Lưu vị trí cuộn khi rời khỏi trang
            sessionStorage.setItem(`scroll-position-${pathname}`, window.scrollY.toString())
        }
    }, [pathname])
}

export default useScrollRestoration
