import { router } from '@inertiajs/react'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '~/components/ui/pagination'

type CustomPaginationProps = {
  totalPages: number
  currentPage: number
  onPageChange?: (page: number) => void
  maxPageToShow: number
  startPage?: number
  endPage?: number
}

export function CustomPagination({
  totalPages,
  currentPage,
  onPageChange,
  maxPageToShow,
}: CustomPaginationProps) {
  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page)
      const url = new URL(window.location.href)
      url.searchParams.set('page', String(page))
      router.visit(url.pathname + url.search, { preserveState: true, preserveScroll: true })
    }
  }

  const renderPageNumbers = () => {
    const startPage = Math.max(1, currentPage - Math.floor(maxPageToShow / 2))
    const endPage = Math.min(totalPages, startPage + maxPageToShow - 1)

    const pages = []
    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <PaginationItem key={i}>
          <PaginationLink isActive={i === currentPage} onMouseDown={() => handlePageChange(i)}>
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }
    return pages
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationPrevious
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        />
        {currentPage > 2 && <PaginationEllipsis />}
        {renderPageNumbers()}
        {currentPage < totalPages - 1 && <PaginationEllipsis />}
        <PaginationNext
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        />
      </PaginationContent>
    </Pagination>
  )
}
