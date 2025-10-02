import { useAuth } from '@/contexts/AuthContext'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { User, Mail, Calendar } from 'lucide-react'
import LogoutButton from '@/components/LogoutButton'

export default function UserProfile() {
    const { user, isAuthenticated } = useAuth()

    if (!isAuthenticated || !user) {
        return (
            <Card className="w-full max-w-md mx-auto">
                <CardContent className="pt-6">
                    <p className="text-center text-gray-500">Chưa đăng nhập</p>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Thông tin tài khoản
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{user.displayName}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{user.email}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm text-gray-600">Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>

                    {user.role && (
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                                {user.role}
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="pt-4 border-t">
                    <LogoutButton variant="outline" size="sm" />
                </div>
            </CardContent>
        </Card>
    )
}
