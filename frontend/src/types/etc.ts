export interface APIResponse<T> {
    ok: boolean
    status: string
    statusCode: number
    message: string
    data: T
    timestamp: string
}

export interface Voice {
    id: string
    name: string
    gender: string
    code: string
    language: string
    country: string
    description: string
    premium: boolean
    popular: boolean
    avatar: string
    sample: string
}
