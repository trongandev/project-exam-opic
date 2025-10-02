/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import type { User } from '@/types/user'

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
    getAccessToken: () => string | null
    getRefreshToken: () => string | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Token storage utilities với bảo mật cao
const TokenStorage = {
    // Sử dụng sessionStorage cho accessToken (tự động xóa khi đóng tab)
    setAccessToken: (token: string) => {
        sessionStorage.setItem('accessToken', token)
    },
    getAccessToken: (): string | null => {
        return sessionStorage.getItem('accessToken')
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

    // Clear all tokens và user data
    clearAll: () => {
        TokenStorage.removeAccessToken()
        TokenStorage.removeRefreshToken()
        TokenStorage.removeUser()
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
            const accessToken = TokenStorage.getAccessToken()
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
        TokenStorage.setAccessToken(accessToken)
        TokenStorage.setRefreshToken(refreshToken)
        TokenStorage.setUser(user)

        setAuthState({
            user,
            isAuthenticated: true,
            isLoading: false,
        })
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

    const getAccessToken = (): string | null => {
        return TokenStorage.getAccessToken()
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
        getAccessToken,
        getRefreshToken,
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
