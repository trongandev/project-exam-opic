import { FileQuestionMark, GalleryVerticalEnd, Home } from "lucide-react"
import { Button } from "../ui/button"
import { Link, useLocation } from "react-router-dom"

export default function CHeader() {
    const location = useLocation()
    const pathname = location.pathname
    const linkData = [
        { name: "Trang chủ", icon: <Home size={20} />, href: "/" },
        { name: "Tip trả lời", icon: <FileQuestionMark size={20} />, href: "/tip" },
        { name: "Tổng hợp topic", icon: <GalleryVerticalEnd size={20} />, href: "/topic" },
    ]
    return (
        <div className="sticky top-3  z-50">
            <div className="w-full xl:max-w-7xl bg-gradient-to-r from-primary/80 to-purple-700/80 backdrop-blur-sm h-16 mx-auto rounded-full flex items-center px-10 text-gray-300 justify-between shadow-xl shadow-primary/20 ">
                <div className="font-extrabold text-2xl text-white">EXAM OPIC</div>

                <ul className="flex gap-10 h-full ">
                    {linkData.map((link) => (
                        <li key={link.name}>
                            <a href={link.href} className={`flex gap-1 items-center justify-center  h-full hover:text-sky-100 transition-colors ${pathname === link.href ? "text-sky-50" : ""}`}>
                                {link.icon} {link.name}
                            </a>
                        </li>
                    ))}
                </ul>
                <div className="">
                    <Link to={"/auth/login"}>
                        <Button className="" variant={"secondary"}>
                            Đăng nhập
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
