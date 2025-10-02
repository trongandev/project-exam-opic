import axiosInstance from './axiosInstance'
import type { User } from '@/types/user'
import type { APIResponse } from '@/types/etc'

// Types for auth requests
export interface LoginRequest {
    email: string
    password: string
}

export interface RegisterRequest {
    displayName: string
    email: string
    password: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface ChangePasswordRequest {
    password: string
    confirmPassword: string
}

export interface RefreshTokenRequest {
    refreshToken: string
}

// Response types
export interface AuthResponse {
    user: User
    accessToken: string
    refreshToken: string
}

export interface RefreshTokenResponse {
    accessToken: string
}

class AuthService {
    // Login user
    async login(data: LoginRequest): Promise<AuthResponse> {
        const response = await axiosInstance.post<APIResponse<AuthResponse>>('/auth/login', data)
        return response.data.data
    }

    // Register user
    async register(data: RegisterRequest): Promise<AuthResponse> {
        const response = await axiosInstance.post<APIResponse<AuthResponse>>('/auth/register', data)
        return response.data.data
    }

    // Forgot password
    async forgotPassword(data: ForgotPasswordRequest): Promise<{ message: string }> {
        const response = await axiosInstance.post<APIResponse<{ message: string }>>('/auth/forget-password', data)
        return response.data.data
    }

    // Change password (requires authentication)
    async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
        const response = await axiosInstance.post<APIResponse<{ message: string }>>('/auth/change-password', data)
        return response.data.data
    }

    // Refresh token
    async refreshToken(data: RefreshTokenRequest): Promise<RefreshTokenResponse> {
        const response = await axiosInstance.post<APIResponse<RefreshTokenResponse>>('/auth/refresh-token', data)
        return response.data.data
    }

    // Logout user
    async logout(refreshToken: string): Promise<{ message: string }> {
        const response = await axiosInstance.post<APIResponse<{ message: string }>>('/auth/logout', {
            refreshToken,
        })
        return response.data.data
    }

    // Get current user profile (requires authentication)
    async getProfile(): Promise<User> {
        const response = await axiosInstance.get<APIResponse<User>>('/auth/profile')
        return response.data.data
    }
}

export default new AuthService()
