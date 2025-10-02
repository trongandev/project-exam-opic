import { useEffect, useRef } from 'react'
import { Outlet, useNavigation } from 'react-router-dom'
import LoadingBar from 'react-top-loading-bar'

export default function App() {
    const ref = useRef<any>(null)
    const navigation = useNavigation() // Hook này lắng nghe trạng thái điều hướng

    useEffect(() => {
        // Khi trạng thái điều hướng là 'loading', bắt đầu progress bar
        if (navigation.state === 'loading') {
            ref.current?.continuousStart()
        }
        // Khi trạng thái quay lại 'idle', hoàn thành progress bar
        else if (navigation.state === 'idle') {
            ref.current?.complete()
        }
    }, [navigation.state])
    {
        /* Thanh progress bar luôn ở trên cùng */
    }

    return (
        <>
            {/* Thanh progress bar luôn ở trên cùng */}
            <LoadingBar color="#0369a1" ref={ref} height={3} />
            <Outlet />
        </>
    )
}
