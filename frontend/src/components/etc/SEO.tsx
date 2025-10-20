import { Helmet } from 'react-helmet-async'
interface Props {
    title?: string
    description?: string
    canonical?: string
    image?: string
    schemaMarkup?: object
}

export default function SEO({
    title = 'Ôn thi OPIC - opic.io.vn',
    description = 'Ôn thi OPIC - Luyện tập và nâng cao kỹ năng nói tiếng Anh',
    canonical,
    image = 'https://opic.io.vn/images/thumbnail.png',
    schemaMarkup = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Ôn Thi OPIC - OPIC.io.vn',
        url: 'https://opic.io.vn/',
    },
}: Props) {
    return (
        <Helmet>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta
                name="keywords"
                content="OPIC, opic, opic.io.vn, thi opic, tkg, taewang vina, taewang tkg,ôn thi opic tại tkg, tkg opic, opic tkg, luyện tiếng anh tkg, opic luyen tieng anh, on thi opic.io.vn , ôn thi OPIC, luyện nói tiếng Anh, kỹ năng nói, thi tiếng Anh, luyện tập tiếng Anh"
            />
            <meta name="author" content="Trọng An (trongandev)" />
            <link rel="canonical" href={`https://opic.io.vn${canonical}`} />
            {/* Open Graph for Facebook, LinkedIn */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />

            {/* Twitter Card */}
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data (Schema Markup) */}
            {schemaMarkup && <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>}
        </Helmet>
    )
}
