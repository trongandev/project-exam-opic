import type { APIResponse } from '@/types/etc'
import axiosInstance from './axiosInstance'
import type { Topic, TopicCreateFull, TopicResponse } from '@/types/topic'

class TopicService {
    async getAllTopics() {
        const response = await axiosInstance.get<APIResponse<TopicResponse>>('/topics')
        return response.data
    }

    async getTopicBySlug(slug: string) {
        const response = await axiosInstance.get<APIResponse<Topic>>(`/topics/slug/${slug}`)
        return response.data
    }

    async createTopic(data: TopicCreateFull) {
        const response = await axiosInstance.post<APIResponse<Topic>>('/topics', data)
        return response.data
    }
}

export default new TopicService()
