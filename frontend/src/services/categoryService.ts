import type { APIResponse, Category } from '@/types/etc'
import axiosInstance from './axiosInstance'
import { toast } from 'sonner'

class categoryService {
    async getAllCategories() {
        try {
            const response = await axiosInstance.get<APIResponse<Category[]>>('/categories')
            return response.data.data
        } catch (error: any) {
            console.error('Failed to fetch categories:', error)
            toast.error(error.message)
            throw error
        }
    }

    async getCategoryById(id: string) {
        const response = await axiosInstance.get<APIResponse<Category>>(`/categories/${id}`)
        return response.data.data
    }
}

export default new categoryService()
