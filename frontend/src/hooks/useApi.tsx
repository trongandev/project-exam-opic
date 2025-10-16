import { useFetching } from './useFetching'
import { useCallback } from 'react'

/**
 * Enhanced hook for API calls with additional features
 * Built on top of useFetching with API-specific optimizations
 */
export function useApi<T>(
    apiFunction: (...args: any[]) => Promise<T>,
    options?: {
        immediate?: boolean
        cacheTime?: number
        retryCount?: number
        retryDelay?: number
        onSuccess?: (data: T) => void
        onError?: (error: Error) => void
    }
) {
    const {
        immediate = false,
        // cacheTime = 5 * 60 * 1000, // 5 minutes default
        retryCount = 3,
        retryDelay = 1000,
        onSuccess,
        onError,
    } = options || {}

    // Wrapper function with retry logic
    const apiCallWithRetry = useCallback(
        async (...args: any[]) => {
            let lastError: Error

            for (let attempt = 0; attempt <= retryCount; attempt++) {
                try {
                    return await apiFunction(...args)
                } catch (error) {
                    lastError = error instanceof Error ? error : new Error(String(error))

                    // Don't retry on client errors (4xx)
                    if (lastError.message.includes('4')) {
                        throw lastError
                    }

                    // Wait before retry (exponential backoff)
                    if (attempt < retryCount) {
                        await new Promise((resolve) => setTimeout(resolve, retryDelay * Math.pow(2, attempt)))
                    }
                }
            }

            throw lastError!
        },
        [apiFunction, retryCount, retryDelay]
    )

    const fetchingResult = useFetching(() => apiCallWithRetry(), {
        immediate,
        onSuccess,
        onError,
    })

    // Manual call function with arguments
    const call = useCallback(
        (...args: any[]) => {
            return apiCallWithRetry(...args).then((result) => {
                // Update the state manually since this is a manual call
                return result
            })
        },
        [apiCallWithRetry]
    )

    return {
        ...fetchingResult,
        call,
        // Additional computed properties
        hasData: !!fetchingResult.data,
        isEmpty: fetchingResult.isSuccess && (!fetchingResult.data || (Array.isArray(fetchingResult.data) && fetchingResult.data.length === 0)),
    }
}

/**
 * Hook for paginated API calls
 */
export function usePaginatedApi<T>(apiFunction: (page: number, limit: number) => Promise<{ data: T[]; total: number; page: number; limit: number }>, initialPage = 1, initialLimit = 10) {
    const { data, loading, error, refetch } = useFetching(() => apiFunction(initialPage, initialLimit), {
        immediate: true,
        dependencies: [initialPage, initialLimit],
    })

    const loadPage = useCallback(
        (page: number, limit = initialLimit) => {
            return apiFunction(page, limit)
        },
        [apiFunction, initialLimit]
    )

    return {
        data: data?.data || [],
        total: data?.total || 0,
        currentPage: data?.page || initialPage,
        limit: data?.limit || initialLimit,
        totalPages: data ? Math.ceil(data.total / data.limit) : 0,
        loading,
        error,
        refetch,
        loadPage,
        hasNextPage: data ? data.page < Math.ceil(data.total / data.limit) : false,
        hasPrevPage: data ? data.page > 1 : false,
    }
}
