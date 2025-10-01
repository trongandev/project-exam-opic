import "./App.css"
import { Route, Routes } from "react-router-dom"
import HomePages from "./pages/Home/HomePages"
import HomeLayout from "./layouts/HomeLayout"
import NotFound from "./pages/NotFound"
import AuthLayout from "./layouts/AuthLayout"
import LoginPage from "./pages/Auth/LoginPage"
import ForgotPasswordPage from "./pages/Auth/ForgotPasswordPage"
import TipPage from "./pages/Home/TipPage"
import SyntheticTopicPage from "./pages/Home/SyntheticTopicPage"

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomeLayout />}>
                <Route index element={<HomePages />} />
                <Route path="tip" element={<TipPage />} />
                <Route path="topic" element={<SyntheticTopicPage />} />
            </Route>
            <Route path="/auth" element={<AuthLayout />}>
                <Route index path="login" element={<LoginPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default App
