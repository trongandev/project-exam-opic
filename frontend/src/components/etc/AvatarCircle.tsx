import { cn } from '@/lib/utils'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Link } from 'react-router-dom'
import type { UserMin } from '@/types/etc'
export default function AvatarCircle({ user, className }: { user?: UserMin; className?: string }) {
    return (
        <Tooltip>
            <TooltipTrigger>
                <div className={cn(`w-12 h-12 bg-gradient-to-br from-sky-200 to-purple-200 rounded-full flex items-center justify-center cursor-pointer`, className)}>
                    {user
                        ? user.displayName
                              .split(' ')
                              .splice(0, 2)
                              .map((n) => n[0])
                              .join('')
                        : 'N/A'}
                </div>
            </TooltipTrigger>
            <TooltipContent className="">
                <p>{user?.displayName}</p>
                <Link to={`mailto:${user?.email}`}>{user?.email}</Link>
            </TooltipContent>
        </Tooltip>
    )
}
