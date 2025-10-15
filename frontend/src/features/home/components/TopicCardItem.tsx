import { Button } from '@/components/ui/button'
import { Clock, Edit2, Eye, Settings, Star, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import AvatarCircle from '@/components/etc/AvatarCircle'
import { formatDate, formatDistance } from 'date-fns'
import type { Topic } from '@/types/topic'
import { vi } from 'date-fns/locale/vi'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import LoadingIcon from '@/components/ui/loading-icon'

export default function TopicCardItem({ topic, idUser, loadingDelete, handleDeleteTopic }: { topic: Topic; idUser?: string; loadingDelete: boolean; handleDeleteTopic: any }) {
    return (
        <Card className="bg-white border-primary/20 hover:shadow-lg shadow-primary/10 transition-all duration-300 relative group" key={topic._id}>
            <CardHeader className="">
                <div className="flex items-center gap-3 justify-between">
                    <div className="">
                        <CardTitle className="text-xl font-semibold text-gray-900 flex-1">{topic.name}</CardTitle>
                        <p className="text-gray-500 text-sm line-clamp-3">{topic.desc}</p>
                    </div>
                </div>
            </CardHeader>
            <Separator />

            <CardContent>
                <div className="mb-5">
                    <p>Các chủ đề có trong topic:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                        {topic.data.map((item) => (
                            <Badge variant={'secondary'} key={item._id} className="mr-2 mb-2">
                                {item.categoryId.title}
                            </Badge>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3 items-center">
                    <Link to={`/profile/${topic.userId._id}`}>
                        <AvatarCircle user={topic.userId} />
                    </Link>
                    <div className="flex items-center justify-between gap-5 w-full text-gray-500">
                        <div className="w-full  ">
                            <h1 className="font-medium text-gray-700">{topic.userId.displayName}</h1>
                            <div className="flex gap-2 items-center text-xs" title={`Ngày tạo: ${formatDate(new Date(topic.createdAt), 'PPPP', { locale: vi })}`}>
                                <Clock size={14} /> {formatDistance(new Date(topic.createdAt), new Date(), { addSuffix: true, locale: vi })}
                            </div>
                        </div>
                        <div className="text-xs">
                            <div className="flex items-center gap-1 flex-1">
                                <Eye size={14} /> {topic.viewCount}
                            </div>
                            <div className="flex items-center gap-1 flex-1 ">
                                <Star size={14} className="fill-yellow-500 stroke-yellow-500" />
                                <p>{topic.rating.length > 0 ? topic.rating.reduce((acc, curr) => acc + curr.score, 0) / topic.rating.length : '5.0'}</p>
                                <p>{topic.rating.length ? `(${topic.rating.length})` : ''}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="gap-2">
                <Link to={`/topic/${topic.slug}`} className="block w-full">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white group-hover:shadow-md transition-all">
                        <Eye />
                        Xem chi tiết
                    </Button>
                </Link>
                {idUser === topic.userId._id && (
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Button variant={'outline'}>
                                <Settings />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>Tính năng</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <Link to={`edit-topic/${topic._id}`}>
                                <DropdownMenuItem>
                                    <Edit2 />
                                    Chỉnh sửa
                                </DropdownMenuItem>
                            </Link>
                            <DropdownMenuItem variant="destructive" onClick={() => handleDeleteTopic(topic._id)} disabled={loadingDelete}>
                                {loadingDelete ? (
                                    <>
                                        <LoadingIcon />
                                        Đang xóa...
                                    </>
                                ) : (
                                    <>
                                        <Trash2 />
                                        Xóa
                                    </>
                                )}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </CardFooter>
        </Card>
    )
}
