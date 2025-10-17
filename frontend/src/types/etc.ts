export interface APIResponse<T> {
    ok: boolean
    status: string
    statusCode: number
    message: string
    data: T
    timestamp: string
}

export interface Voice {
    id: string
    name: string
    gender: string
    code: string
    language: string
    country: string
    description: string
    premium: boolean
    popular: boolean
    avatar: string
    sample: string
}

export interface Category {
    _id: string
    icon: string
    title: string
    desc: string
    createdAt: string
    updatedAt: string
}

export interface CategoryMin {
    icon: string
    title: string
    desc: string
}

export interface IAccurancyFromRecoderAudio {
    end_time: string
    ipa_transcript: string
    is_letter_correct_all_words: string
    matched_transcripts: string
    matched_transcripts_ipa: string
    pair_accuracy_category: string
    pronunciation_accuracy: string
    real_transcript: string
    real_transcripts: string
    real_transcripts_ipa: string
    start_time: string
}
