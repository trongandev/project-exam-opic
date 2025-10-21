import { convertBlobToBase64 } from '@/lib/utils'
import axios from 'axios'
import { toast } from 'sonner'

class etcService {
    async convertEngToIPA(text: string) {
        try {
            const response = await axios.post(`${import.meta.env.VITE_ENG_TO_IPA}/convert`, { text: text })
            return response.data
        } catch (error: any) {
            console.error('Failed to fetch categories:', error)
            toast.error(error.message)
            throw error
        }
    }

    async getAccurencyFromAudio(referenceText: string, audioBlob: Blob) {
        const res = await axios.post(
            `${import.meta.env.VITE_API_STS}/GetAccuracyFromRecordedAudio`,
            {
                title: referenceText,
                base64Audio: await convertBlobToBase64(audioBlob),
                language: 'en',
            },
            {
                headers: { 'X-Api-Key': import.meta.env.VITE_STS_KEY },
            }
        )
        return res.data
    }
}

export default new etcService()
