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

    async downloadAudioFromText(tts: any, text: string) {
        const savedVoices = localStorage.getItem('defaultVoices') || ''

        // Split text into chunks of 1000 words if needed
        const words = text.split(' ')
        const chunkSize = 1000
        const chunks: string[] = []

        for (let i = 0; i < words.length; i += chunkSize) {
            chunks.push(words.slice(i, i + chunkSize).join(' '))
        }

        // Generate audio for each chunk
        const audioBuffers: ArrayBuffer[] = []
        for (const chunk of chunks) {
            const response = await tts.create({
                input: chunk,
                options: {
                    voice: savedVoices || 'en-US-JennyNeural',
                },
            })
            const audioBuffer = await response.arrayBuffer()
            audioBuffers.push(audioBuffer)
        }

        // Merge all audio buffers
        const totalLength = audioBuffers.reduce((acc, buffer) => acc + buffer.byteLength, 0)
        const mergedBuffer = new Uint8Array(totalLength)
        let offset = 0
        for (const buffer of audioBuffers) {
            mergedBuffer.set(new Uint8Array(buffer), offset)
            offset += buffer.byteLength
        }

        // Create blob and download
        const blob = new Blob([mergedBuffer], { type: 'audio/mpeg' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'audio.mp3'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }
}

export default new etcService()
