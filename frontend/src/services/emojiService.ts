class emojiService {
    async getEmoji(name: string) {
        const response = await fetch(`${import.meta.env.VITE_API_EMOJI}?name=${name}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': import.meta.env.VITE_API_EMOJI_KEY,
            },
        })
        return response.json()
    }
}

export default new emojiService()
