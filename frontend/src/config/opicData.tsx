// Dữ liệu cấu hình cho hệ thống luyện thi OPIc
export interface OpicQuestion {
    id: string
    questionText: string
    type: 'introduction' | 'description' | 'experience' | 'comparison' | 'role-play' | 'problem-solving'
    category: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    sampleAnswer?: string
    keywords: string[]
    hints: string[]
}

export interface OpicCategory {
    id: string
    name: string
    slug: string
    description: string
    icon: string
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    questionCount: number
    isPopular: boolean
    features: string[]
}

// Thông tin cơ bản về OPIc
export const opicInfo = {
    title: 'OPIc (Oral Proficiency Interview-computer)',
    subtitle: 'Phỏng vấn Năng lực Nói trên Máy tính',
    description:
        'OPIc là một bài đánh giá toàn diện, chuẩn hóa về khả năng nói chức năng. Được thực hiện dưới hình thức đối thoại giữa người kiểm tra và người dự thi, bài kiểm tra đo lường mức độ thành thạo ngôn ngữ của một người bằng cách đánh giá hiệu suất của họ trong một loạt các nhiệm vụ ngôn ngữ theo các tiêu chí cụ thể.',

    scoreRange: {
        title: 'Thang điểm OPIc',
        levels: [
            { level: 'NH', desc: '(Novice High)', score: '1', description: 'Người mới bắt đầu', explain: 'Có khả năng giao tiếp cơ bản và sử dụng từ vựng đơn giản.', isPopular: false },
            { level: 'IL', desc: '(Intermediate Low)', score: '2', description: 'Trung cấp thấp', explain: 'Có khả năng giao tiếp trong các tình huống quen thuộc.', isPopular: false },
            { level: 'IM', desc: '(Intermediate Mid)', score: '3', description: 'Trung cấp', explain: 'Có khả năng giao tiếp hiệu quả trong nhiều tình huống.', isPopular: true },
            { level: 'IH', desc: '(Intermediate High)', score: '4', description: 'Trung cấp cao', explain: 'Có khả năng giao tiếp tự tin và linh hoạt.', isPopular: false },
            { level: 'AL', desc: '(Advanced Low)', score: '5', description: 'Cao cấp thấp', explain: 'Có khả năng giao tiếp trôi chảy và chính xác.', isPopular: false },
            { level: 'AM', desc: '(Advanced Mid)', score: '6', description: 'Cao cấp', explain: 'Có khả năng giao tiếp tự nhiên và phong phú.', isPopular: false },
        ],
    },

    targetGoals: {
        title: 'Mục tiêu đào tạo',
        mainGoal: 'Đạt điểm từ IH (Intermediate High) đến AL (Advanced Low)',
        description: 'Để đạt được điểm số ở cấp độ này, bạn cần phải nói và trả lời các câu hỏi OPIc theo các đoạn văn liên kết, có cấu trúc và logic rõ ràng.',
        requirements: [
            'Sử dụng các chiến lược kết nối ý tưởng',
            'Trình bày theo đoạn văn có cấu trúc',
            'Sử dụng từ vựng và ngữ pháp phong phú',
            'Phát âm rõ ràng và tự nhiên',
            'Tự tin trong giao tiếp',
        ],
    },

    strategies: {
        title: 'Chiến lược trả lời',
        description: 'Các chiến lược giúp bạn trình bày theo dạng đoạn văn liên kết:',
        list: [
            {
                name: 'Sự tương phản (Contrast)',
                description: 'So sánh hai khía cạnh khác nhau của cùng một vấn đề',
                example: 'On one hand... On the other hand...',
            },
            {
                name: 'Trước và sau (Before & After)',
                description: 'So sánh tình huống trong quá khứ và hiện tại',
                example: 'Many years ago... / In the past... vs Today... / Nowadays...',
            },
            {
                name: 'Thay đổi cuộc sống (Life Changes)',
                description: 'Mô tả những thay đổi quan trọng trong cuộc sống',
                example: "Before I got married... vs Now that I'm married...",
            },
            {
                name: 'Ưu và nhược điểm (Pros & Cons)',
                description: 'Phân tích lợi thế và bất lợi của một vấn đề',
                example: 'The advantages are... However, the disadvantages include...',
            },
            {
                name: 'Ý kiến và lập luận (Opinion & Argument)',
                description: 'Đưa ra ý kiến, ủng hộ, phản biện và kết luận',
                example: 'In my opinion... / I believe that... / Therefore...',
            },
            {
                name: 'Thực tế vs Lý tưởng (Reality vs Ideal)',
                description: 'So sánh tình huống thực tế với mong muốn lý tưởng',
                example: 'In reality... / Actually... vs Ideally... / I wish...',
            },
        ],
    },
}

// Dữ liệu các chủ đề luyện thi OPIc
export const opicCategories: OpicCategory[] = [
    {
        id: 'self-introduction',
        name: 'Giới thiệu bản thân',
        slug: 'self-introduction',
        description: 'Luyện tập các câu hỏi về giới thiệu bản thân, công việc, sở thích và cuộc sống hàng ngày',
        icon: '👤',
        difficulty: 'beginner',
        questionCount: 10,
        isPopular: true,
        features: ['10 câu hỏi cơ bản về bản thân', 'Hướng dẫn cấu trúc câu trả lời', 'Gợi ý từ vựng và cụm từ hữu ích', 'Chiến lược kết nối ý tưởng'],
    },
    {
        id: 'neighborhood',
        name: 'Khu vực lân cận',
        slug: 'neighborhood',
        description: 'Mô tả nơi sinh sống, hàng xóm và các hoạt động trong khu phố',
        icon: '🏘️',
        difficulty: 'beginner',
        questionCount: 9,
        isPopular: false,
        features: ['9 câu hỏi về khu vực sinh sống', 'Luyện tập mô tả địa điểm', 'Kỹ năng kể chuyện về hàng xóm', 'Từ vựng chuyên biệt về địa lý'],
    },
    {
        id: 'weekend-activities',
        name: 'Hoạt động cuối tuần',
        slug: 'weekend-activities',
        description: 'Thảo luận về các hoạt động giải trí và thói quen cuối tuần',
        icon: '🎮',
        difficulty: 'beginner',
        questionCount: 5,
        isPopular: false,
        features: ['5 câu hỏi về hoạt động cuối tuần', 'Từ vựng về giải trí', 'Cách diễn đạt thói quen', 'Mẫu câu mô tả hoạt động'],
    },
    {
        id: 'restaurants',
        name: 'Nhà hàng',
        slug: 'restaurants',
        description: 'Mô tả nhà hàng yêu thích và trải nghiệm ăn uống',
        icon: '🍽️',
        difficulty: 'intermediate',
        questionCount: 6,
        isPopular: true,
        features: ['6 câu hỏi về nhà hàng và ẩm thực', 'Từ vựng về đồ ăn và dịch vụ', 'Cách diễn đạt sở thích ẩm thực', 'Kỹ năng mô tả chi tiết'],
    },
    {
        id: 'family-friends',
        name: 'Gia đình và bạn bè',
        slug: 'family-friends',
        description: 'Thảo luận về mối quan hệ gia đình và tình bạn',
        icon: '👨‍👩‍👧‍👦',
        difficulty: 'intermediate',
        questionCount: 8,
        isPopular: false,
        features: ['8 câu hỏi về gia đình và bạn bè', 'Từ vựng về mối quan hệ', 'Cách diễn đạt cảm xúc', 'Kỹ năng kể về kỷ niệm'],
    },
    {
        id: 'shopping',
        name: 'Mua sắm',
        slug: 'shopping',
        description: 'Thảo luận về thói quen mua sắm và cửa hàng yêu thích',
        icon: '🛒',
        difficulty: 'intermediate',
        questionCount: 7,
        isPopular: false,
        features: ['7 câu hỏi về mua sắm', 'Từ vựng về shopping', 'Cách mô tả sở thích mua sắm', 'Kỹ năng so sánh sản phẩm'],
    },
    {
        id: 'sports',
        name: 'Thể thao',
        slug: 'sports',
        description: 'Mô tả sự kiện thể thao và hoạt động thể chất yêu thích',
        icon: '⚽',
        difficulty: 'intermediate',
        questionCount: 6,
        isPopular: true,
        features: ['6 câu hỏi về thể thao', 'Từ vựng chuyên ngành thể thao', 'Cách mô tả sự kiện thể thao', 'Kỹ năng diễn đạt cảm xúc'],
    },
    {
        id: 'internet-technology',
        name: 'Internet & Công nghệ',
        slug: 'internet-technology',
        description: 'Thảo luận về việc sử dụng internet và công nghệ',
        icon: '💻',
        difficulty: 'advanced',
        questionCount: 8,
        isPopular: true,
        features: ['8 câu hỏi về công nghệ', 'Từ vựng technical chuyên sâu', 'Thảo luận về tác động công nghệ', 'Kỹ năng phân tích và đánh giá'],
    },
    {
        id: 'music',
        name: 'Âm nhạc',
        slug: 'music',
        description: 'Thể loại âm nhạc yêu thích và ảnh hưởng của âm nhạc',
        icon: '🎵',
        difficulty: 'intermediate',
        questionCount: 6,
        isPopular: false,
        features: ['6 câu hỏi về âm nhạc', 'Từ vựng về thể loại nhạc', 'Cách diễn đạt cảm xúc âm nhạc', 'Kỹ năng mô tả ảnh hưởng'],
    },
    {
        id: 'health-medical',
        name: 'Sức khỏe & Y tế',
        slug: 'health-medical',
        description: 'Thảo luận về sức khỏe, đi khám bác sĩ và thói quen chăm sóc sức khỏe',
        icon: '🏥',
        difficulty: 'intermediate',
        questionCount: 7,
        isPopular: false,
        features: ['7 câu hỏi về sức khỏe', 'Từ vựng y tế cơ bản', 'Cách mô tả triệu chứng', 'Kỹ năng đưa ra lời khuyên'],
    },
    {
        id: 'english-learning',
        name: 'Học tiếng Anh',
        slug: 'english-learning',
        description: 'Kinh nghiệm học tiếng Anh và phương pháp học tập',
        icon: '📚',
        difficulty: 'advanced',
        questionCount: 9,
        isPopular: true,
        features: ['9 câu hỏi về học tiếng Anh', 'Từ vựng về giáo dục', 'Cách mô tả khó khăn và tiến bộ', 'Kỹ năng chia sẻ kinh nghiệm'],
    },
    {
        id: 'beauty-salon',
        name: 'Tiệm làm đẹp',
        slug: 'beauty-salon',
        description: 'Trải nghiệm đến tiệm cắt tóc và làm đẹp',
        icon: '💇',
        difficulty: 'beginner',
        questionCount: 5,
        isPopular: false,
        features: ['5 câu hỏi về làm đẹp', 'Từ vựng về salon', 'Cách mô tả dịch vụ làm đẹp', 'Kỹ năng diễn đạt sở thích'],
    },
    {
        id: 'vacation-travel',
        name: 'Kỳ nghỉ & Du lịch',
        slug: 'vacation-travel',
        description: 'Kinh nghiệm du lịch và kế hoạch kỳ nghỉ',
        icon: '✈️',
        difficulty: 'advanced',
        questionCount: 12,
        isPopular: true,
        features: ['12 câu hỏi về du lịch', 'Từ vựng về travel và tourism', 'Cách mô tả địa điểm du lịch', 'Kỹ năng so sánh văn hóa'],
    },
    {
        id: 'role-play',
        name: 'Nhập vai (Role-play)',
        slug: 'role-play',
        description: 'Các tình huống nhập vai thực tế trong giao tiếp',
        icon: '🎭',
        difficulty: 'advanced',
        questionCount: 20,
        isPopular: true,
        features: ['20 tình huống role-play đa dạng', 'Luyện tập giao tiếp thực tế', 'Kỹ năng giải quyết vấn đề', 'Chiến lược thương lượng và thuyết phục', 'Phản ứng nhanh trong tình huống bất ngờ'],
    },
]

// Câu hỏi mẫu cho từng chủ đề
export const sampleQuestions = {
    'self-introduction': [
        {
            id: 'intro-1',
            questionText: 'Hãy cho tôi biết một chút về bạn và công việc bạn làm để kiếm sống.',
            type: 'introduction' as const,
            category: 'self-introduction',
            difficulty: 'beginner' as const,
            hints: ['Giới thiệu tên và tuổi', 'Mô tả công việc hiện tại', 'Chia sẻ cảm nhận về công việc', 'So sánh với công việc trước đây (nếu có)'],
            keywords: ['job', 'work', 'career', 'profession', 'occupation'],
            answer_text_example:
                "My name is John, I'm 28 years old. I work as a software developer at a tech company. I enjoy my job because it allows me to solve problems and create new applications. Before this, I worked as a web designer, which was also interesting but less challenging.",
        },
        {
            id: 'intro-2',
            questionText: 'Hãy cho tôi biết đôi chút về bạn và nơi bạn sống.',
            type: 'description' as const,
            category: 'self-introduction',
            difficulty: 'beginner' as const,
            hints: ['Mô tả khu vực sinh sống', 'Đặc điểm của khu phố', 'Lý do chọn nơi ở', 'So sánh với nơi ở trước'],
            keywords: ['live', 'home', 'neighborhood', 'area', 'location'],
            answer_text_example:
                "I live in a small town called Springfield. It's a quiet and friendly place with a close-knit community. I chose to live here because of the peaceful environment and the beautiful nature surrounding the area. Compared to my previous residence in a big city, I find Springfield much more relaxing and less stressful.",
        },
    ],
    // Có thể mở rộng thêm câu hỏi cho các chủ đề khác
}

export default {
    opicInfo,
    opicCategories,
    sampleQuestions,
}
