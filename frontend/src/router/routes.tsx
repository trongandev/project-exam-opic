import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import { authGuard, userLoader } from './guards'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ProfilePage from '@/features/home/pages/ProfilePage'
import SupportPage from '@/features/home/pages/SupportPage'
import IntroIM from '@/features/detail/pages/IntroIM'
import ExamPage from '@/features/home/pages/ExamPage'

// Lazy Loading các components
const RootLayout = lazy(() => import('../layouts/RootLayout'))
const AuthLayout = lazy(() => import('@/features/auth/components/AuthLayout'))
const HomeLayout = lazy(() => import('@/features/home/components/HomeLayout'))
const TipPage = lazy(() => import('@/features/home/pages/TipPage'))
const SyntheticTopicPage = lazy(() => import('@/features/home/pages/SyntheticTopicPage'))
const HomePage = lazy(() => import('../features/home/pages/HomePage'))
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'))
const DashboardLayout = lazy(() => import('../features/dashboard/components/DashboardLayout'))
const DashboardHomePage = lazy(() => import('../features/dashboard/pages/DashboardHomePage'))
const UserDetailPage = lazy(() => import('../features/dashboard/pages/UserDetailPage'))
const TTSDemo = lazy(() => import('@/components/TTSDemo'))
const NotFound = lazy(() => import('../features/not-found/NotFound'))

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <RootLayout />,
        children: [
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
                    {
                        path: 'tts-demo',
                        element: <TTSDemo />,
                    },
                ],
                errorElement: <div>Something went wrong!</div>,
            },
            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
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
                path: 'intro-im',
                element: <IntroIM />,
            },
            {
                path: 'exam',
                element: <ExamPage />,
            },
            {
                path: 'dashboard',
                element: <DashboardLayout />,
                loader: authGuard,
                children: [
                    {
                        index: true,
                        element: <DashboardHomePage />,
                    },
                    {
                        path: 'users/:userId',
                        element: <UserDetailPage />,
                        loader: userLoader,
                        errorElement: <div>Could not find user!</div>,
                    },
                ],
            },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]
