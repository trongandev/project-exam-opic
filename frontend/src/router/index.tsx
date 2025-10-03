import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import { authGuard, userLoader } from './guards'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ProfilePage from '@/features/home/pages/ProfilePage'
import SupportPage from '@/features/home/pages/SupportPage'
import IntroIM from '@/features/detail/pages/IntroIM'
const AuthLayout = lazy(() => import('@/features/auth/components/AuthLayout'))
const HomeLayout = lazy(() => import('@/features/home/components/HomeLayout'))
const TipPage = lazy(() => import('@/features/home/pages/TipPage'))
const SyntheticTopicPage = lazy(() => import('@/features/home/pages/SyntheticTopicPage'))

// Lazy Loading các components
const HomePage = lazy(() => import('../features/home/pages/HomePage'))
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'))
const DashboardLayout = lazy(() => import('../features/dashboard/components/DashboardLayout'))
const DashboardHomePage = lazy(() => import('../features/dashboard/pages/DashboardHomePage'))
const UserDetailPage = lazy(() => import('../features/dashboard/pages/UserDetailPage'))
const NotFound = lazy(() => import('../features/not-found/NotFound'))

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <HomeLayout />,
        children: [
            {
                index: true,
                element: <HomePage />,
            },
            {
                path: 'tip',
                element: <TipPage />,
            },
            {
                path: 'topic',
                element: <SyntheticTopicPage />,
            },
            {
                path: 'profile',
                element: <ProfilePage />,
            },
            {
                path: 'help-center',
                element: <SupportPage />,
            },
        ],
        errorElement: <div>Something went wrong!</div>,
    },
    {
        path: 'intro-im',
        element: <IntroIM />,
    },
    {
        path: 'auth',
        element: <AuthLayout />,
        children: [
            {
                index: true,
                path: 'login',
                element: <LoginPage />,
            },
            {
                path: 'register',
                element: <RegisterPage />,
            },
            {
                path: 'forgot-password',
                element: <ForgotPasswordPage />,
            },
        ],
    },
    {
        path: 'dashboard',
        element: <DashboardLayout />,
        // Sử dụng loader để bảo vệ toàn bộ các route con của dashboard
        loader: authGuard,
        children: [
            {
                index: true, // path: "/dashboard"
                element: <DashboardHomePage />,
            },
            {
                path: 'users/:userId', // path: "/dashboard/users/:userId"
                element: <UserDetailPage />,
                // Sử dụng loader để fetch dữ liệu cho route này
                loader: userLoader,
                errorElement: <div>Could not find user!</div>, // Error boundary riêng cho route này
            },
        ],
    },
    {
        path: '*',
        element: <NotFound />,
    },
]
