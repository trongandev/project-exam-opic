import { FileQuestionMark, GalleryVerticalEnd, Home, Menu } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function CHeader() {
    const [isOpenNavBar, setIsOpenNavBar] = useState(false)
    const location = useLocation()
    const pathname = location.pathname
    const linkData = [
        { name: 'Trang chủ', icon: <Home size={20} />, href: '/' },
        { name: 'Tip trả lời', icon: <FileQuestionMark size={20} />, href: '/tip' },
        { name: 'Tổng hợp topic', icon: <GalleryVerticalEnd size={20} />, href: '/topic' },
    ]
    return (
        <div className="sticky top-3  z-50 px-3 md:px-0">
            <div
                className={`fixed inset-0 z-[998] bg-black/20 transition-opacity duration-300 ${isOpenNavBar ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpenNavBar(false)}
            />
            <div
                className={`fixed top-0 left-0 z-[999] w-[80%] h-full shadow bg-background/80 backdrop-blur-xs transition-transform duration-300 ${
                    isOpenNavBar ? 'translate-x-0' : '-translate-x-full'
                } flex flex-col`}
                onClick={(e) => e.stopPropagation()}
            >
                <nav className="flex flex-col gap-2 items-start justify-start">
                    <h1 className="text-lg font-semibold text-center w-full py-5 text-primary">EXAM OPIc</h1>
                    {linkData.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`px-4 w-full flex items-center justify-start gap-2 h-12 transition-colors ${
                                pathname === item.href ? 'border-l-4 border-primary bg-primary/10  text-primary ' : 'text-gray-500'
                            }`}
                            onClick={() => setIsOpenNavBar(false)}
                        >
                            {item.icon}
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
            <div className="w-full xl:max-w-7xl bg-gradient-to-r from-primary/80 to-purple-700/80 backdrop-blur-sm h-14 md:h-16 mx-auto rounded-full flex items-center px-5 md:px-10 text-gray-300 justify-between shadow-xl shadow-primary/20 ">
                <div className="font-extrabold text-2xl text-white flex items-center gap-2 ">
                    <Menu className="block md:hidden cursor-pointer hover:opacity-60" onClick={() => setIsOpenNavBar(true)} />
                    <h1>EXAM OPIc</h1>
                </div>

                <ul className="gap-10 h-full md:flex hidden ">
                    {linkData.map((link) => (
                        <li key={link.name}>
                            <a href={link.href} className={`flex gap-1 items-center justify-center  h-full hover:text-sky-100 transition-colors ${pathname === link.href ? 'text-sky-50' : ''}`}>
                                {link.icon} {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="">
                    <Link to={'/auth/login'}>
                        <Button className="" variant={'secondary'}>
                            Đăng nhập
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
