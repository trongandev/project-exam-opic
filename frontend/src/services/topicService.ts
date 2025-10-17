import type { APIResponse } from '@/types/etc'
import axiosInstance from './axiosInstance'
import type { Topic, TopicCreateFull, TopicResponse } from '@/types/topic'

class TopicService {
    async getAllTopics(page: number = 1, pageSize: number = 6) {
        const response = await axiosInstance.get<APIResponse<TopicResponse>>(`/topics?page=${page}&pageSize=${pageSize}`)
        return response.data
    }
    async getTopicByIdToEdit(_id: string) {
        const response = await axiosInstance.get<APIResponse<any>>(`/topics/${_id}/edit`)
        return response.data
    }
    async getTopicBySlug(slug: string) {
        const response = await axiosInstance.get<APIResponse<Topic>>(`/topics/slug/${slug}`)
        return response.data
    }

    async getTopicPopulated() {
        const response = await axiosInstance.get<APIResponse<Topic>>(`/topics/populate`)
        return response.data.data
    }

    async createTopic(data: TopicCreateFull) {
        const response = await axiosInstance.post<APIResponse<Topic>>('/topics', data)
        return response.data
    }

    async updateTopic(id: string, data: TopicCreateFull) {
        const response = await axiosInstance.patch<APIResponse<Topic>>(`/topics/${id}`, data)
        return response.data
    }

    async deleteTopic(topicId: string) {
        const response = await axiosInstance.delete<APIResponse<{ message: string }>>(`/topics/${topicId}`)
        return response.data
    }

    async rateTopic(topicId: string, data: { score: number; comment: string }) {
        const response = await axiosInstance.post<APIResponse<{ message: string }>>(`/topics/${topicId}/rating`, data)
        return response.data
    }
}

export default new TopicService()
