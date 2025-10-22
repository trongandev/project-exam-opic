import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { useState } from 'react'
import type { CategoryMin } from '@/types/etc'
interface Props {
    children: React.ReactNode
    handleChooseCategory: (value: string) => void
    flatCategory: CategoryMin[]
}
export function CategorySearch({ children, handleChooseCategory, flatCategory }: Props) {
    const [open, setOpen] = useState(false)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="w-full text-left">{children}</PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Type a command or search..." className="h-12" />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy kết quả...</CommandEmpty>
                        {flatCategory.map((category) => (
                            <CommandItem
                                key={category.title}
                                className="cursor-pointer"
                                value={category.title}
                                onSelect={(currentValue) => {
                                    handleChooseCategory(currentValue)
                                    setOpen(false)
                                }}
                            >
                                {category.icon}
                                <span>{category.title}</span>
                            </CommandItem>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
