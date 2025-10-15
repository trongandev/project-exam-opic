import type { APIResponse, Category } from '@/types/etc'
import axiosInstance from './axiosInstance'

class categoryService {
    async getAllCategories() {
        const response = await axiosInstance.get<APIResponse<Category[]>>('/categories')
        return response.data.data
    }

    async getCategoryById(id: string) {
        const response = await axiosInstance.get<APIResponse<Category>>(`/categories/${id}`)
        return response.data.data
    }
}

export default new categoryService()
