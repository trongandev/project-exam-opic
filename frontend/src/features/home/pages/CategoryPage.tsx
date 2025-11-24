import categoryService from '@/services/categoryService'
import type { Category } from '@/types/etc'
import LoadingGrid from '@/components/etc/LoadingGrid'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Rows2, Rows4 } from 'lucide-react'
import CategoryItem from '../components/CategoryItem'
import { useNavigate } from 'react-router-dom'

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(false)

    const [isSimple, setIsSimple] = useState(true)
    const navigate = useNavigate()

    useEffect(() => {
        const initDataFetch = async () => {
            const initData: Category[] = []
            const fetchAPI = async () => {
                setLoading(true)
                const res = await categoryService.getAllCategories()
                setCategories(res)
                initData.push(...res)
                setLoading(false)
            }
            const getCategory = sessionStorage.getItem('categories')
            if (getCategory) {
                setCategories(JSON.parse(getCategory))
            } else {
                await fetchAPI()
                sessionStorage.setItem('categories', JSON.stringify(initData))
            }
        }
        initDataFetch()
    }, [])

    return (
        <div className="px-4 xl:px-0 max-w-7xl mx-auto my-5  min-h-screen">
            <Button variant={'ghost'} onClick={() => navigate(-1)}>
                <ArrowLeft /> Quay lại
            </Button>
            <div className="text-center mb-8 mt-5 md:mt-0">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Tổng hợp {categories?.length || 0} thể loại</h1>
                <p className="text-gray-600">Tất tần tận {categories?.length || 0} thể loại hay gặp nhất khi thi OPIc</p>
            </div>
            <div className="flex items-center justify-end mb-10 ">
                <p>Chế độ xem:</p>
                <div className="flex items-center gap-3 ml-5">
                    <Button variant={isSimple ? 'default' : 'outline'} onClick={() => setIsSimple(true)}>
                        <Rows2 /> Đơn giản
                    </Button>
                    <Button variant={!isSimple ? 'default' : 'outline'} onClick={() => setIsSimple(false)}>
                        <Rows4 /> Chi tiết
                    </Button>
                </div>
            </div>

            {/* Loading State */}
            {loading && <LoadingGrid />}

            {/* Error State */}
            {/* {isError && error && <ErrorUI error={error} refetch={refetch} />} */}

            {/* Success State */}
            {categories && isSimple && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category._id} className="p-6 border rounded-lg hover:shadow-md transition-shadow bg-white">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="text-2xl">{category.icon}</span>
                                <h3 className="text-lg font-semibold text-gray-900">{category.title}</h3>
                            </div>
                            <p className="text-gray-600 text-sm">{category.desc}</p>
                        </div>
                    ))}
                </div>
            )}

            {categories && !isSimple && (
                <div className="flex gap-10 ">
                    <div className="my-5 grid grid-cols-1  gap-5 flex-1">
                        {categories.map((category, index) => (
                            <CategoryItem key={index} category={category} index={index} />
                        ))}
                    </div>
                    <div className="sticky top-10 space-y-3 mt-4 w-[250px]  hidden md:block border-l-2 border-gray-200 overflow-y-scroll h-[90vh] custom-scrollbar-category">
                        {categories.map((category, index) => (
                            <a
                                href={`#category-${index}`}
                                className={`block relative transition-all  hover:bg-gray-200 hover:text-primary  px-3 py-1 rounded-r-md ${
                                    location.hash === `#category-${index}` ? 'text-primary bg-sky-100' : 'text-gray-700'
                                }`}
                                key={index}
                            >
                                {location.hash === `#category-${index}` && <div className="absolute w-0.5 h-8 bg-primary rounded-sm -translate-x-3.5 -translate-y-1 transition-all duration-300"></div>}
                                <p>
                                    {index + 1}. {category.title}
                                </p>
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!categories || categories.length === 0) && (
                <div className="text-center py-20">
                    <p className="text-gray-500">Chưa có thể loại nào</p>
                </div>
            )}
        </div>
    )
}
