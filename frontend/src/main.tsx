import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { SpeakWordProvider } from './contexts/SpeakWordContext.tsx'
import App from './App.tsx'
import { HelmetProvider } from 'react-helmet-async'

// Tạo router instance từ mảng routes
const helmetContext = {}
createRoot(document.getElementById('root')!).render(
    <HelmetProvider context={helmetContext}>
        <AuthProvider>
            <SpeakWordProvider>
                <App />
            </SpeakWordProvider>
        </AuthProvider>
    </HelmetProvider>
)
