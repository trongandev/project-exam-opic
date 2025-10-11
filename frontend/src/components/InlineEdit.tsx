import { Edit, Check, X } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useInlineEdit } from '@/hooks/useInlineEdit'
import type { UseInlineEditProps } from '@/hooks/useInlineEdit'
import { cn } from '@/lib/utils'

interface InlineEditProps extends UseInlineEditProps {
    children?: React.ReactNode
    className?: string
    inputClassName?: string
    displayClassName?: string
    multiline?: boolean
    isEmoji?: boolean
    showButtons?: boolean
    editIcon?: React.ReactNode
    saveIcon?: React.ReactNode
    cancelIcon?: React.ReactNode
}

export default function InlineEdit({
    initialValue,
    onSave,
    placeholder,
    children,
    className = '',
    inputClassName = '',
    displayClassName = '',
    multiline = false,
    isEmoji = false,
    showButtons = false,
    editIcon = <Edit size={14} />,
    saveIcon = <Check size={14} />,
    cancelIcon = <X size={14} />,
}: InlineEditProps) {
    const { isEditing, value, setValue, inputRef, startEdit, cancelEdit, saveEdit, handleKeyDown, handleBlur, placeholder: computedPlaceholder } = useInlineEdit({ initialValue, onSave, placeholder })

    const InputComponent = multiline ? Textarea : Input

    if (isEditing) {
        return (
            <div className={cn('flex items-start gap-2', className)}>
                <InputComponent
                    ref={inputRef as any}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    maxLength={isEmoji ? 1 : undefined}
                    minLength={isEmoji ? 1 : undefined}
                    onBlur={showButtons ? undefined : handleBlur}
                    placeholder={computedPlaceholder}
                    className={cn('flex-1', multiline && 'min-h-[80px] resize-none', inputClassName)}
                />
                {showButtons && (
                    <div className="flex gap-1 mt-1">
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={saveEdit} className="text-green-600 hover:text-green-700 p-1 rounded hover:bg-green-50">
                                    {saveIcon}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Lưu (Enter)</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <button onClick={cancelEdit} className="text-red-600 hover:text-red-700 p-1 rounded hover:bg-red-50">
                                    {cancelIcon}
                                </button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Hủy (Esc)</p>
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className={cn('group flex items-center gap-2 cursor-pointer hover:bg-gray-100', className, displayClassName)} onClick={startEdit}>
            {children || <span className={cn('block', !initialValue && 'text-gray-400 italic')}>{initialValue || computedPlaceholder}</span>}
            <button className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-opacity">{editIcon}</button>
        </div>
    )
}
