/* eslint-disable react-refresh/only-export-components */
import type { User } from '@/types/user'
import axios from 'axios'
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'

interface AuthState {
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
}

interface AuthContextType extends AuthState {
    login: (user: User, accessToken: string, refreshToken: string) => void
    logout: () => void
    setUser: (user: User | null) => void
    setLoading: (loading: boolean) => void
    getCookieToken: () => string | null
    getRefreshToken: () => string | null
    loginWithoutUser: (accessToken: string, refreshToken: string) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Token storage utilities với bảo mật cao
const TokenStorage = {
    // Sử dụng sessionStorage cho accessToken (tự động xóa khi đóng tab)

    getCookieToken: () => {
        const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'))
        if (match) {
            return match[2]
        }
        return null
    },
    setCookieToken: (token: string) => {
        document.cookie = `token=${token}; path=/;expires=${new Date(Date.now() + 3600 * 1000 * 24 * 7).toUTCString()}` // 7 day expiry
    },
    removeAccessToken: () => {
        sessionStorage.removeItem('accessToken')
    },

    // Sử dụng localStorage cho refreshToken (httpOnly cookie sẽ tốt hơn trong production)
    setRefreshToken: (token: string) => {
        localStorage.setItem('refreshToken', token)
    },
    getRefreshToken: (): string | null => {
        return localStorage.getItem('refreshToken')
    },
    removeRefreshToken: () => {
        localStorage.removeItem('refreshToken')
    },

    // User data trong localStorage
    setUser: (user: User) => {
        localStorage.setItem('user', JSON.stringify(user))
    },
    getUser: (): User | null => {
        const userData = localStorage.getItem('user')
        return userData ? JSON.parse(userData) : null
    },
    removeUser: () => {
        localStorage.removeItem('user')
    },
    removeCookieToken: () => {
        document.cookie = 'token=; Max-Age=0; path=/;'
    },

    // Clear all tokens và user data
    clearAll: () => {
        TokenStorage.removeAccessToken()
        TokenStorage.removeRefreshToken()
        TokenStorage.removeUser()
        TokenStorage.removeCookieToken()
    },
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
        isLoading: true,
    })

    // Initialize auth state từ stored tokens
    useEffect(() => {
        const initializeAuth = () => {
            const accessToken = TokenStorage.getCookieToken()
            const refreshToken = TokenStorage.getRefreshToken()
            const user = TokenStorage.getUser()

            if (accessToken && refreshToken && user) {
                setAuthState({
                    user,
                    isAuthenticated: true,
                    isLoading: false,
                })
            } else {
                // Clear tất cả nếu thiếu bất kỳ thông tin nào
                TokenStorage.clearAll()
                setAuthState({
                    user: null,
                    isAuthenticated: false,
                    isLoading: false,
                })
            }
        }

        initializeAuth()
    }, [])

    const login = (user: User, accessToken: string, refreshToken: string) => {
        // Lưu tokens và user data
        TokenStorage.getCookieToken()
        TokenStorage.setCookieToken(accessToken)
        TokenStorage.setRefreshToken(refreshToken)
        TokenStorage.setUser(user)

        setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
        })
    }

    const loginWithoutUser = async (accessToken: string, refreshToken: string) => {
        const req: any = await axios.get(`${import.meta.env.VITE_API_ENDPOINT}/auth/me`, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        })
        if (req.status === 200 && req.data.user) {
            TokenStorage.getCookieToken()
            TokenStorage.setRefreshToken(refreshToken)
            TokenStorage.setCookieToken(accessToken)
            TokenStorage.setUser(req.data.user)

            setAuthState({
                user: req.data.user,
                isAuthenticated: true,
                isLoading: false,
            })
        }
    }

    const logout = () => {
        // Clear all stored data
        TokenStorage.clearAll()

        setAuthState({
            user: null,
            isAuthenticated: false,
            isLoading: false,
        })
    }

    const setUser = (user: User | null) => {
        if (user) {
            TokenStorage.setUser(user)
        } else {
            TokenStorage.removeUser()
        }

        setAuthState((prev) => ({
            ...prev,
            user,
        }))
    }

    const setLoading = (loading: boolean) => {
        setAuthState((prev) => ({
            ...prev,
            isLoading: loading,
        }))
    }
    const getCookieToken = (): string | null => {
        return TokenStorage.getCookieToken()
    }
    const getRefreshToken = (): string | null => {
        return TokenStorage.getRefreshToken()
    }

    const contextValue: AuthContextType = {
        ...authState,
        login,
        logout,
        setUser,
        setLoading,
        getRefreshToken,
        loginWithoutUser,
        getCookieToken,
    }

    return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}
// Custom hook để sử dụng AuthContext
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

// Export TokenStorage để sử dụng trong axios interceptor
export { TokenStorage }
