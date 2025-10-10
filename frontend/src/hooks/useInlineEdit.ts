import { useState, useRef, useEffect } from 'react'

export interface UseInlineEditProps {
    initialValue: string
    onSave: (value: string) => void
    placeholder?: string
}

export function useInlineEdit({ initialValue, onSave, placeholder }: UseInlineEditProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [value, setValue] = useState(initialValue)
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

    // Sync with external value changes
    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            inputRef.current.select()
        }
    }, [isEditing])

    const startEdit = () => {
        setIsEditing(true)
    }

    const cancelEdit = () => {
        setValue(initialValue)
        setIsEditing(false)
    }

    const saveEdit = () => {
        onSave(value.trim())
        setIsEditing(false)
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            saveEdit()
        } else if (e.key === 'Escape') {
            e.preventDefault()
            cancelEdit()
        }
    }

    const handleBlur = () => {
        saveEdit()
    }

    return {
        isEditing,
        value,
        setValue,
        inputRef,
        startEdit,
        cancelEdit,
        saveEdit,
        handleKeyDown,
        handleBlur,
        placeholder: placeholder || initialValue || 'Nhập nội dung...',
    }
}
