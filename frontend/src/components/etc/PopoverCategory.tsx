import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from '@/components/ui/command'
import { CATEGORY_TEMPLATE } from '@/config/categoryConfig'
import { useState } from 'react'
export function CategorySearch({ children, handleChooseCategory }: any) {
    const [open, setOpen] = useState(false)
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger className="w-full text-left">{children}</PopoverTrigger>
            <PopoverContent className="p-0">
                <Command>
                    <CommandInput placeholder="Type a command or search..." />
                    <CommandList>
                        <CommandEmpty>Không tìm thấy kết quả...</CommandEmpty>
                        {CATEGORY_TEMPLATE.map((category) => (
                            <>
                                <CommandGroup key={category.header} heading={category.header} className="">
                                    {category.content.map((item) => (
                                        <CommandItem
                                            key={item.title}
                                            className="cursor-pointer"
                                            value={item.title}
                                            onSelect={(currentValue) => {
                                                handleChooseCategory(currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            {item.icon}
                                            <span>{item.title}</span>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                <CommandSeparator />
                            </>
                        ))}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
