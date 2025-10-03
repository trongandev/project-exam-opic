import CFooter from '@/features/home/components/CFooter'
import { Outlet } from 'react-router-dom'

export default function DetailLayout() {
    return (
        <div className="min-h-screen">
            <Outlet />
            <CFooter />
        </div>
    )
}
