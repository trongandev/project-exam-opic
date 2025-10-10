import { Button } from '../ui/button'

export default function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
    const handleClick = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            onPageChange(page)
        }
    }

    const renderPageNumbers = () => {
        const pageNumbers = []
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <Button variant={i === currentPage ? 'default' : 'outline'} key={i} onClick={() => handleClick(i)} className={i === currentPage ? ' text-white' : ''}>
                    {i}
                </Button>
            )
        }
        return pageNumbers
    }
    return (
        <div className="flex gap-2 items-center justify-center mt-10">
            <Button variant={'outline'} onClick={() => handleClick(currentPage - 1)} disabled={currentPage === 1}>
                Previous
            </Button>
            {renderPageNumbers()}
            <Button variant={'outline'} onClick={() => handleClick(currentPage + 1)} disabled={currentPage === totalPages}>
                Next
            </Button>
        </div>
    )
}
