import { Instagram, Linkedin } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function CFooter() {
    const socialLinks = [
        {
            name: 'Facebook',
            url: 'https://facebook.com/trongandev',
            icon: (
                <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="facebook" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="size-4">
                    <path
                        fill="currentColor"
                        d="M279.14 288l14.22-92.66h-88.91V141.09c0-25.35 12.42-50.06 52.24-50.06H293V6.26S259.26 0 225.36 0c-73.22 0-121.36 44.38-121.36 124.72V195.3H22.89V288h81.11v224h100.2V288z"
                    ></path>
                </svg>
            ),
        },
        {
            name: 'Discord',
            url: 'https://discord.com',
            icon: (
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="size-4">
                    <title>Discord</title>
                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"></path>
                </svg>
            ),
        },
        { name: 'Instagram', url: 'https://instagram.com/troandev', icon: <Instagram className="size-4" /> },
        { name: 'LinkedIn', url: 'https://www.linkedin.com/in/troandev/', icon: <Linkedin className="size-4" /> },
    ]
    return (
        <footer className="bg-gradient-to-r from-primary/10 to-purple-500/10 py-6 mt-20 ">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3  xl:grid-cols-4 gap-5 text-gray-500 ">
                <div className="space-y-2 text-sm ">
                    <div className="flex items-center gap-3">
                        <img src="/images/logo.png" alt="" className="h-7" />
                        <h1 className="text-2xl font-extrabold text-primary">OPIc</h1>
                    </div>
                    <p className="text-gray-600">Nền tảng ôn luyện thi OPIc cho TKG</p>
                    <p className="">
                        © 2025 Ôn thi OPIC by{' '}
                        <Link to="https://fb.com/trongandev" target="_blank" className="text-primary underline">
                            trongandev
                        </Link>
                    </p>
                    <p>All rights reserved.</p>
                </div>
                <div className="text-sm">
                    <h1 className="font-medium text-lg ">Liên kết</h1>
                    <ul className="space-y-2 mt-3">
                        <li className="hover:underline cursor-pointer">
                            <Link to="/">Trang chủ</Link>
                        </li>
                        <li className="hover:underline cursor-pointer">
                            <Link to="/topic">Tổng hợp topic</Link>
                        </li>
                        <li className="hover:underline cursor-pointer">
                            <Link to="/exam">Thi thử</Link>
                        </li>
                        <li className="hover:underline cursor-pointer">
                            <Link to="/feedback">Góp ý</Link>
                        </li>
                    </ul>
                </div>
                <div className="text-sm">
                    <h1 className="font-medium text-lg ">Điều khoản</h1>
                    <ul className="space-y-2 mt-3">
                        <li className="hover:underline cursor-pointer">
                            <Link to="/terms">Điều khoản sử dụng</Link>
                        </li>
                        <li className="hover:underline cursor-pointer">
                            <Link to="/privacy">Quyền riêng tư</Link>
                        </li>
                    </ul>
                </div>
                <div className="text-sm">
                    <h1 className="font-medium text-lg ">MXH</h1>
                    <ul className="space-y-2 mt-3">
                        {socialLinks.map((link) => (
                            <li key={link.name}>
                                <Link to={link.url} target="_blank" className="flex items-center gap-2 hover:underline">
                                    {link.icon}
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </footer>
    )
}
