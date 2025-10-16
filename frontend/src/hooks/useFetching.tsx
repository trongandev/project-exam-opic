import { useCallback, useEffect, useReducer, useRef } from 'react'

// State interface for better type safety
interface FetchState<T> {
    data: T | null
    loading: boolean
    error: Error | null
}

// Action types for reducer
type FetchAction<T> = { type: 'FETCH_START' } | { type: 'FETCH_SUCCESS'; payload: T } | { type: 'FETCH_ERROR'; payload: Error } | { type: 'RESET' }

// Reducer function for state management
function fetchReducer<T>(state: FetchState<T>, action: FetchAction<T>): FetchState<T> {
    switch (action.type) {
        case 'FETCH_START':
            return { ...state, loading: true, error: null }
        case 'FETCH_SUCCESS':
            return { data: action.payload, loading: false, error: null }
        case 'FETCH_ERROR':
            return { ...state, loading: false, error: action.payload }
        case 'RESET':
            return { data: null, loading: false, error: null }
        default:
            return state
    }
}

// Main hook with multiple overloads for flexibility
export function useFetching<T>(
    fetchFunction: () => Promise<T>,
    options?: {
        immediate?: boolean
        dependencies?: React.DependencyList
        onSuccess?: (data: T) => void
        onError?: (error: Error) => void
    }
) {
    const { immediate = true, dependencies = [], onSuccess, onError } = options || {}

    const [state, dispatch] = useReducer(fetchReducer<T>, {
        data: null,
        loading: false,
        error: null,
    })

    // Ref to track if component is still mounted
    const isMountedRef = useRef(true)
    const abortControllerRef = useRef<AbortController | null>(null)

    // Cleanup on unmount
    useEffect(() => {
        isMountedRef.current = true
        return () => {
            isMountedRef.current = false
            // Cancel any ongoing request
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [])

    // Store callbacks in refs to avoid recreating executeFetch
    const onSuccessRef = useRef(onSuccess)
    const onErrorRef = useRef(onError)
    const fetchFunctionRef = useRef(fetchFunction)

    // Update refs when callbacks change
    useEffect(() => {
        onSuccessRef.current = onSuccess
        onErrorRef.current = onError
        fetchFunctionRef.current = fetchFunction
    })

    // Stable fetch function that doesn't change on every render
    const executeFetch = useCallback(async () => {
        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        // Create new AbortController for this request
        abortControllerRef.current = new AbortController()

        dispatch({ type: 'FETCH_START' })

        try {
            const result = await fetchFunctionRef.current()

            // Only update state if component is still mounted
            if (isMountedRef.current) {
                dispatch({ type: 'FETCH_SUCCESS', payload: result })
                onSuccessRef.current?.(result)
            }
        } catch (err) {
            const error = err instanceof Error ? err : new Error(String(err))

            // Don't treat AbortError as actual error
            if (error.name !== 'AbortError' && isMountedRef.current) {
                dispatch({ type: 'FETCH_ERROR', payload: error })
                onErrorRef.current?.(error)
            }
        }
    }, []) // Empty dependency array - function is stable

    // Auto-fetch on mount
    useEffect(() => {
        if (immediate) {
            executeFetch()
        }
    }, [immediate, executeFetch])

    // Handle dependencies changes
    useEffect(() => {
        if (immediate && dependencies.length > 0) {
            executeFetch()
        }
    }, dependencies) // eslint-disable-line react-hooks/exhaustive-deps

    // Manual refetch function
    const refetch = useCallback(() => {
        return executeFetch()
    }, [executeFetch])

    // Reset function
    const reset = useCallback(() => {
        dispatch({ type: 'RESET' })
    }, [])

    return {
        ...state,
        refetch,
        reset,
        isIdle: !state.loading && !state.data && !state.error,
        isSuccess: !state.loading && !!state.data && !state.error,
        isError: !state.loading && !!state.error,
    }
}
