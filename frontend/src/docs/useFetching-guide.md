# 🚀 useFetching Hook - Best Practices Guide

## ✨ **Key Features**

### 🔧 **Built-in Best Practices:**

-   ✅ **useReducer**: Better state management than multiple useState
-   ✅ **AbortController**: Cancel ongoing requests when component unmounts
-   ✅ **Memory Leak Prevention**: Check if component is mounted before updating state
-   ✅ **Type Safety**: Full TypeScript support with generics
-   ✅ **Error Boundaries**: Proper error handling and recovery
-   ✅ **Flexible API**: Multiple options for different use cases

### 🎯 **Usage Patterns:**

## 1. **Basic Auto-fetch (Most Common)**

```tsx
const { data, loading, error, isSuccess } = useFetching(
    () => topicService.getAllTopics(),
    { immediate: true } // Default behavior
)
```

## 2. **Lazy Loading (Manual Trigger)**

```tsx
const { data, loading, refetch } = useFetching(
    () => topicService.getAllTopics(),
    { immediate: false }
)

// Trigger manually
<button onClick={refetch}>Load Data</button>
```

## 3. **Dependent Fetching**

```tsx
const [userId, setUserId] = useState(null)

const { data } = useFetching(() => userService.getProfile(userId), {
    immediate: !!userId, // Only when userId exists
    dependencies: [userId], // Re-fetch when userId changes
})
```

## 4. **With Callbacks**

```tsx
const { data, error } = useFetching(() => topicService.getAllTopics(), {
    onSuccess: (data) => {
        toast.success('Data loaded successfully')
        analytics.track('data_loaded', { count: data.length })
    },
    onError: (error) => {
        console.error('Failed to load:', error)
        if (error.message.includes('401')) {
            router.push('/login')
        }
    },
})
```

## 🎨 **UI State Management:**

### **Loading States:**

```tsx
if (loading) return <LoadingSpinner />
if (isError) return <ErrorMessage error={error} onRetry={refetch} />
if (isSuccess && !data) return <EmptyState />
if (isSuccess && data) return <DataDisplay data={data} />
```

### **Status Flags:**

-   `isIdle`: Not loading, no data, no error (initial state)
-   `loading`: Currently fetching data
-   `isSuccess`: Has data, not loading, no error
-   `isError`: Has error, not loading
-   `error`: Error object (null if no error)
-   `data`: Fetched data (null if no data)

## 🔄 **Manual Controls:**

### **Refetch:**

```tsx
const { refetch } = useFetching(...)

// Refresh data
<button onClick={refetch}>Refresh</button>
```

### **Reset:**

```tsx
const { reset } = useFetching(...)

// Clear data and error, return to idle state
<button onClick={reset}>Clear</button>
```

## 📊 **Real-world Examples:**

### **Data Grid with Refresh:**

```tsx
function TopicsGrid() {
    const { data: topics, loading, error, refetch } = useFetching(() => topicService.getAllTopics())

    return (
        <div>
            <div className="header">
                <h1>Topics</h1>
                <button onClick={refetch} disabled={loading}>
                    {loading ? 'Refreshing...' : 'Refresh'}
                </button>
            </div>

            {loading && <LoadingGrid />}
            {error && <ErrorBanner error={error} />}
            {topics && <TopicsGrid data={topics} />}
        </div>
    )
}
```

### **Search with Dependencies:**

```tsx
function SearchTopics() {
    const [query, setQuery] = useState('')
    const [debouncedQuery] = useDebounce(query, 300)

    const { data, loading } = useFetching(() => topicService.search(debouncedQuery), {
        immediate: debouncedQuery.length > 2,
        dependencies: [debouncedQuery],
    })

    return (
        <div>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search topics..." />
            {loading && <SearchSpinner />}
            {data && <SearchResults results={data} />}
        </div>
    )
}
```

### **Profile Page with Multiple Fetches:**

```tsx
function ProfilePage({ userId }: { userId: string }) {
    const profile = useFetching(() => userService.getProfile(userId))
    const topics = useFetching(() => topicService.getByUser(userId))
    const stats = useFetching(() => statsService.getUserStats(userId))

    const allLoading = profile.loading || topics.loading || stats.loading
    const hasError = profile.error || topics.error || stats.error

    if (allLoading) return <ProfileSkeleton />
    if (hasError) return <ErrorPage />

    return (
        <div>
            <ProfileHeader user={profile.data} />
            <StatsCards stats={stats.data} />
            <TopicsList topics={topics.data} />
        </div>
    )
}
```

## 🛡️ **Error Handling Patterns:**

### **Global Error Handler:**

```tsx
const { error, isError } = useFetching(() => apiCall(), {
    onError: (error) => {
        // Global error handling
        errorTracker.report(error)

        if (error.status === 401) {
            auth.logout()
            router.push('/login')
        } else if (error.status >= 500) {
            toast.error('Server error, please try again')
        }
    },
})
```

### **Component-level Error Recovery:**

```tsx
function DataComponent() {
    const { data, error, refetch, isError } = useFetching(...)

    if (isError) {
        return (
            <ErrorFallback>
                <h3>Failed to load data</h3>
                <p>{error.message}</p>
                <button onClick={refetch}>Try Again</button>
            </ErrorFallback>
        )
    }

    return <DataView data={data} />
}
```

## 🎯 **Performance Tips:**

1. **Use immediate: false** for data that's not needed immediately
2. **Minimize dependencies array** to avoid unnecessary re-fetches
3. **Use onSuccess/onError callbacks** for side effects instead of useEffect
4. **Leverage built-in abort controller** - no manual cleanup needed
5. **Reset data when needed** to free memory for large datasets

## 🔗 **Integration with Other Hooks:**

```tsx
// With React Router
function TopicDetail({ topicId }: { topicId: string }) {
    const navigate = useNavigate()

    const { data, error } = useFetching(() => topicService.getById(topicId), {
        dependencies: [topicId],
        onError: (error) => {
            if (error.status === 404) {
                navigate('/topics', { replace: true })
            }
        },
    })
}

// With Context
function useUserTopics() {
    const { user } = useAuth()

    return useFetching(() => topicService.getByUser(user.id), {
        immediate: !!user,
        dependencies: [user?.id],
    })
}
```

This hook follows modern React patterns and provides a robust foundation for data fetching in your application! 🚀
