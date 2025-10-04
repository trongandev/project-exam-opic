/* eslint-disable react-refresh/only-export-components */
import { useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Hook để redirect user đã login ra khỏi auth pages
 */
export function useAuthRedirect() {
    const { isAuthenticated, isLoading } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            // Get the redirect URL from location state or default to home
            const from = (location.state as any)?.from?.pathname || '/'
            navigate(from, { replace: true })
        }
    }, [isAuthenticated, isLoading, navigate, location])
}

/**
 * Component wrapper để protect auth pages khỏi user đã login
 */
interface AuthOnlyRouteProps {
    children: React.ReactNode
}

export function AuthOnlyRoute({ children }: AuthOnlyRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()

    useAuthRedirect()

    // Show loading while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Đang kiểm tra xác thực...</p>
                </div>
            </div>
        )
    }

    // If authenticated, don't render auth forms (will be redirected)
    if (isAuthenticated) {
        return null
    }

    return <>{children}</>
}
