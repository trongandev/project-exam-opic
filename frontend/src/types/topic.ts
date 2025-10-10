import type { User } from './user'

export interface TopicCreate {
    name: string
    desc: string
}

export interface TopicCreateFull {
    name: string
    desc: string
    data: DataTopic[]
}

export interface Topic {
    _id: string
    userId: User
    name: string
    slug: string
    viewCount: number
    data: DataTopic[]
    isPopular: boolean
    isActive: boolean
    rating: any[]
    desc: string
    createdAt: string
    updatedAt: string
}

export interface DataTopic {
    _id: string
    icon: string
    title: string
    desc: string
    quests: Quest[]
}

export interface Quest {
    _id: string
    text: string
    note: string
    answer: string
}

export interface Pagination {
    currentPage: number
    totalPages: number
    pageSize: number
    totalItems: number
    hasPrevPage?: boolean
    hasNextPage?: boolean
}

export interface TopicResponse {
    data: Topic[]
    pagination: Pagination
}
