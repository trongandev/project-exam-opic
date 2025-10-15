import type { Category } from './etc'
import type { User } from './user'

export interface TopicCreateMin {
    name: string
    desc: string
}

export interface TopicCreateFull {
    name: string
    desc: string
    data: DataTopicCreate[]
}

export interface TopicCreate {
    _id: string
    userId: User
    name: string
    slug: string
    viewCount: number
    data: DataTopicCreate[]
    isPopular: boolean
    isActive: boolean
    rating: any[]
    desc: string
    createdAt: string
    updatedAt: string
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
    categoryId: Category
    quests: Quest[]
}

export interface DataTopicCreate {
    _id: string
    icon: string
    title: string
    desc: string
    categoryId: string
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
