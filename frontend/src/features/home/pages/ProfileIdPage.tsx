import { Mail } from 'lucide-react'
import { useEffect, useState } from 'react'

import AvatarCircle from '@/components/etc/AvatarCircle'
import { formatDistance } from 'date-fns'
import LoadingScreen from '@/components/etc/LoadingScreen'
import profileService from '@/services/profileService'
import { useParams } from 'react-router-dom'
import { vi } from 'date-fns/locale/vi'
import type { User } from '@/types/user'
export default function ProfileIdPage() {
    const [profile, setProfile] = useState<User>()
    const [loading, setLoading] = useState(false)
    const params = useParams()
    useEffect(() => {
        const fetchAPI = async () => {
            setLoading(true)
            const res = await profileService.getProfileById(params.id as string)
            setProfile(res)
            setLoading(false)
        }
        fetchAPI()
    }, [])
    if (loading) return <LoadingScreen />
    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto space-y-7 h-screen flex  flex-col justify-center">
            <div className="border border-gray-300  p-5 rounded-xl  flex gap-10 items-center">
                {profile && <AvatarCircle user={profile} className="h-32 w-32 text-3xl" />}

                <div className="">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile?.displayName}</h1>
                    <p className="text-gray-600 flex items-center gap-1">
                        <Mail size={20} /> {profile?.email}
                    </p>
                    <p className="text-gray-500">Đã tham gia được: {formatDistance(new Date(profile?.createdAt || new Date()), new Date(), { addSuffix: true, locale: vi })}</p>
                </div>
            </div>
        </div>
    )
}
