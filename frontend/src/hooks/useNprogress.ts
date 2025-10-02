import { useEffect } from 'react'
import { useNavigation } from 'react-router-dom'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css' // Import CSS của nó

// Cấu hình NProgress nếu cần
NProgress.configure({ showSpinner: false })

export const useNprogress = () => {
    const navigation = useNavigation()

    useEffect(() => {
        if (navigation.state === 'loading') {
            NProgress.start()
        } else if (navigation.state === 'idle') {
            NProgress.done()
        }
    }, [navigation.state])
}
