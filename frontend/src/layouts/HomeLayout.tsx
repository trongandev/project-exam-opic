import CHeader from "@/components/etc/CHeader"
import { Outlet } from "react-router-dom"

export default function HomeLayout() {
    return (
        <div className="">
            <CHeader />
            <main className="my-20">
                <Outlet />
            </main>
        </div>
    )
}
