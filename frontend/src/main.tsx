import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { SpeakWordProvider } from './contexts/SpeakWordContext.tsx'
import App from './App.tsx'

// Tạo router instance từ mảng routes

createRoot(document.getElementById('root')!).render(
    <AuthProvider>
        <SpeakWordProvider>
            <App />
        </SpeakWordProvider>
    </AuthProvider>
)
