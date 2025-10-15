import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface Props {
    data: any[]
    displayKey: string
    value?: string
    setValue?: (value: string) => void
    valueKey: string
    dataKeyArray?: string[]
    isDisableSearch?: boolean
    placeholder?: string
    type?: string
    className?: string
}
export default function Combobox({ data, value, setValue, isDisableSearch = false, placeholder = "Select item...", valueKey, displayKey, dataKeyArray, type = "default", className }: Props) {
    const [open, setOpen] = useState(false)

    const onChangeValue = (currentValue: string) => {
        setValue?.(currentValue === value ? "" : currentValue)
        setOpen(false)
    }

    const getDisplayValue = () => {
        const selectedItem = data.find((item) => item[valueKey] === value)
        return selectedItem ? selectedItem[displayKey] : placeholder
    }
    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" role="combobox" aria-expanded={open} className={`min-w-[200px] justify-between ${className}`}>
                    {getDisplayValue()}
                    <ChevronsUpDown className="opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className={`w-auto  p-1`}>
                <Command className="">
                    {!isDisableSearch && <CommandInput placeholder={placeholder} className="h-9" />}
                    <CommandList className="max-h-[600px] mt-1">
                        <CommandEmpty>No item found.</CommandEmpty>
                        <CommandGroup className="p-0 overflow-visible ">
                            {type === "table" ? (
                                <>
                                    <table className="w-full  text-xs">
                                        <thead className="">
                                            <tr className=" px-4 py-2">
                                                {dataKeyArray?.map((key, i) => (
                                                    <th key={i} className="bg-background/50 backdrop-blur text-left  font-medium text-foreground  px-3 py-2  sticky z-10 top-0">
                                                        {key}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className=" ">
                                            {data.map((item, index) => {
                                                const isSelected = item[valueKey] === value
                                                return (
                                                    <tr className={`hover:bg-accent ${isSelected ? "bg-accent text-primary" : ""}`} key={index}>
                                                        {dataKeyArray?.map((key, i) => (
                                                            <td key={i} className=" border-t ">
                                                                <CommandItem
                                                                    key={item[valueKey] || index}
                                                                    value={item[valueKey]}
                                                                    onSelect={(currentValue) => onChangeValue(currentValue)}
                                                                    className="!bg-transparent text-xs px-3 py-2 cursor-pointer"
                                                                >
                                                                    {item[key]}
                                                                </CommandItem>
                                                            </td>
                                                        ))}
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </>
                            ) : (
                                <>
                                    {data.map((item, index) => (
                                        <CommandItem key={item[valueKey] || index} value={item[valueKey]} onSelect={(currentValue) => onChangeValue(currentValue)}>
                                            {item[displayKey]}
                                            <Check className={cn("ml-auto", value === item[valueKey] ? "opacity-100" : "opacity-0")} />
                                        </CommandItem>
                                    ))}
                                </>
                            )}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
