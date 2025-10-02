export interface APIResponse<T> {
    ok: boolean
    status: string
    statusCode: number
    message: string
    data: T
    timestamp: string
}
