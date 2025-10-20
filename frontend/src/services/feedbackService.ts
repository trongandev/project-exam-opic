import type { APIResponse, FeedbackCreate, FeedbackResponse } from '@/types/etc'
import axiosInstance from './axiosInstance'

class FeedbackService {
    async getAllFeedbacks(page: number = 1, pageSize: number = 6) {
        const response = await axiosInstance.get<APIResponse<FeedbackResponse[]>>(`/feedback?page=${page}&pageSize=${pageSize}`)
        return response.data.data
    }

    async createFeedback(data: FeedbackCreate) {
        const response = await axiosInstance.post<APIResponse<FeedbackResponse>>('/feedback', data)
        return response.data
    }

    async updateFeedback(id: string, data: FeedbackCreate) {
        const response = await axiosInstance.patch<APIResponse<FeedbackResponse>>(`/feedback/${id}`, data)
        return response.data
    }

    async deleteFeedback(FeedbackId: string) {
        const response = await axiosInstance.delete<APIResponse<{ message: string }>>(`/feedback/${FeedbackId}`)
        return response.data
    }
}

export default new FeedbackService()
