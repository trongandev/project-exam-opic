import type { RouteObject } from 'react-router-dom'
import { lazy } from 'react'
import RegisterPage from '@/features/auth/pages/RegisterPage'
import ProfilePage from '@/features/home/pages/ProfilePage'
import SupportPage from '@/features/home/pages/SupportPage'
import ExamPage from '@/features/home/pages/ExamPage'
import DetailTopicSlugPage from '@/features/home/pages/DetailTopicSlugPage'
import ProfileIdPage from '@/features/home/pages/ProfileIdPage'
import CreateTopicPage from '@/features/home/pages/CreateTopicPage'
import ExamSlugPage from '@/features/home/pages/ExamSlugPage'
import EditTopicPage from '@/features/home/pages/EditTopicPage'
import CategoryPage from '@/features/home/pages/CategoryPage'
import FeedbackPage from '@/features/home/pages/FeedbackPage'
import TermsPage from '@/features/home/pages/TermsPage'
import PrivacyPage from '@/features/home/pages/PrivacyPage'
// import { authGuard } from './guards'

// Lazy Loading các components
const RootLayout = lazy(() => import('../layouts/RootLayout'))
const AuthLayout = lazy(() => import('@/features/auth/components/AuthLayout'))
const HomeLayout = lazy(() => import('@/features/home/components/HomeLayout'))
const TopicPage = lazy(() => import('@/features/home/pages/TopicPage'))
const HomePage = lazy(() => import('../features/home/pages/HomePage'))
const LoginPage = lazy(() => import('../features/auth/pages/LoginPage'))
const ForgotPasswordPage = lazy(() => import('../features/auth/pages/ForgotPasswordPage'))
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
                        path: 'profile',
                        element: <ProfilePage />,
                    },
                    {
                        path: 'profile/:id',
                        element: <ProfileIdPage />,
                    },
                    {
                        path: 'topic',
                        element: <TopicPage />,
                    },

                    {
                        path: 'help-center',
                        element: <SupportPage />,
                    },
                    {
                        path: 'feedback',
                        element: <FeedbackPage />,
                    },
                    {
                        path: 'terms',
                        element: <TermsPage />,
                    },
                    {
                        path: 'privacy',
                        element: <PrivacyPage />,
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
                path: 'topic/create-topic',
                element: <CreateTopicPage />,
            },
            {
                path: 'topic/edit-topic/:_id',
                element: <EditTopicPage />,
            },
            {
                path: 'topic/:slug',
                element: <DetailTopicSlugPage />,
            },
            {
                path: 'category',
                element: <CategoryPage />,
            },
            {
                path: 'exam',
                element: <ExamPage />,
            },
            {
                path: 'exam/:slug',
                element: <ExamSlugPage />,
            },
            // {
            //     path: 'dashboard',
            //     element: <DashboardLayout />,
            //     loader: authGuard,
            //     children: [
            //         {
            //             index: true,
            //             element: <DashboardHomePage />,
            //         },
            //         {
            //             path: 'users/:userId',
            //             element: <UserDetailPage />,
            //             loader: userLoader,
            //             errorElement: <div>Could not find user!</div>,
            //         },
            //     ],
            // },
            {
                path: '*',
                element: <NotFound />,
            },
        ],
    },
]
