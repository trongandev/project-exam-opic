import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './router/index.tsx'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { Toaster } from './components/ui/sonner.tsx'

// Tạo router instance từ mảng routes
const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <RouterProvider router={router} />
            <Toaster />
        </AuthProvider>
    </StrictMode>
)
