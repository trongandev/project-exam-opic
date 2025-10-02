import { FileQuestionMark, GalleryVerticalEnd, Home, LogOut, Menu, PhoneCall, User } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
export default function CHeader() {
    const { user, logout } = useAuth()
    const [isOpenNavBar, setIsOpenNavBar] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()
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
            <div className="w-full xl:max-w-7xl bg-gradient-to-r from-primary/80 to-purple-700/80 backdrop-blur-sm py-2 md:py-4 mx-auto rounded-full flex items-center px-4 md:px-10 text-gray-300 justify-between shadow-xl shadow-primary/20  ">
                <div className="font-extrabold text-md md:text-2xl  text-white flex items-center gap-2 ">
                    <Menu className="block md:hidden cursor-pointer hover:opacity-60" onClick={() => setIsOpenNavBar(true)} />
                    <h1>EXAM OPIc</h1>
                </div>

                <ul className="gap-10 h-full md:flex hidden ">
                    {linkData.map((link) => (
                        <li key={link.name}>
                            <Link to={link.href} className={`flex gap-1 items-center justify-center  h-full hover:text-sky-100 transition-colors ${pathname === link.href ? 'text-sky-50' : ''}`}>
                                {link.icon} {link.name}
                            </Link>
                        </li>
                    ))}
                </ul>
                <div className="">
                    {user ? (
                        <div>
                            <div className="hidden md:block">
                                <span className="text-sm md:text-base text-white mr-3">
                                    Xin chào,{' '}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger className="font-semibold hover:underline cursor-pointer">{user.displayName}</DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                            <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem onClick={() => navigate('/profile')}>
                                                <User /> Thông tin chi tiết
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => navigate('/help-center')}>
                                                <PhoneCall /> Trung tâm Trợ giúp
                                            </DropdownMenuItem>
                                            <Separator />
                                            <DropdownMenuItem variant="destructive" className=" cursor-pointer " onClick={() => logout()}>
                                                <LogOut className="text-destructive" /> Đăng xuất
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </span>
                            </div>
                            <div className="flex items-center  w-10 h-10 justify-center md:hidden bg-gradient-to-tr from-sky-700 to-purple-700 rounded-full text-white">
                                <DropdownMenu>
                                    <DropdownMenuTrigger className="font-semibold hover:underline cursor-pointer">
                                        {user.displayName
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')}
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent>
                                        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => navigate('/profile')}>
                                            <User /> Thông tin chi tiết
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => navigate('/help-center')}>
                                            <PhoneCall /> Trung tâm Trợ giúp
                                        </DropdownMenuItem>
                                        <Separator />
                                        <DropdownMenuItem variant="destructive" className=" cursor-pointer " onClick={() => logout()}>
                                            <LogOut className="text-destructive" /> Đăng xuất
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    ) : (
                        <Link to={'/auth/login'}>
                            <Button className="" variant={'secondary'}>
                                Đăng nhập
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </div>
    )
}
