import CFooter from '@/features/home/components/CFooter'
import CHeader from '@/features/home/components/CHeader'
import { Outlet } from 'react-router-dom'

export default function HomeLayout() {
    return (
        <div className="">
            <CHeader />
            <main className="">
                <Outlet />
            </main>
            <CFooter />
        </div>
    )
}
