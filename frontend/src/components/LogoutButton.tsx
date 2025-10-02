import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import authService from '@/services/authService'

interface LogoutButtonProps {
    variant?: 'default' | 'ghost' | 'outline'
    size?: 'default' | 'sm' | 'lg'
    showText?: boolean
}

export default function LogoutButton({ variant = 'ghost', size = 'default', showText = true }: LogoutButtonProps) {
    const { logout, getRefreshToken } = useAuth()
    const [loading, setLoading] = useState(false)

    const handleLogout = async () => {
        try {
            setLoading(true)

            const refreshToken = getRefreshToken()

            // Call logout API if refresh token exists
            if (refreshToken) {
                try {
                    await authService.logout(refreshToken)
                } catch (error) {
                    // Even if API call fails, still logout locally
                    console.error('Logout API error:', error)
                }
            }

            // Clear local storage and context
            logout()
        } catch (error) {
            console.error('Logout error:', error)
            // Force logout even if there's an error
            logout()
        } finally {
            setLoading(false)
        }
    }

    return (
        <Button variant={variant} size={size} onClick={handleLogout} disabled={loading} className="flex items-center gap-2">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LogOut className="w-4 h-4" />}
            {showText && (loading ? 'Đang đăng xuất...' : 'Đăng xuất')}
        </Button>
    )
}
