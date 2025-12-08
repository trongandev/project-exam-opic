import { Outlet } from 'react-router-dom'
import { Toaster } from 'sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import useScrollRestoration from '@/hooks/useScrollRestoration'
import { ThemeProvider } from '@/hooks/useTheme'

export default function RootLayout() {
    useScrollRestoration()

    return (
        <AuthProvider>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <Outlet />
                <Toaster />
            </ThemeProvider>
        </AuthProvider>
    )
}
