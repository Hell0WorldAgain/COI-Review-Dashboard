import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  rowsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
}

export const Pagination = ({
  currentPage,
  totalPages,
  rowsPerPage,
  totalItems,
  onPageChange,
  onRowsPerPageChange,
}: PaginationProps) => {
  const startItem = (currentPage - 1) * rowsPerPage + 1
  const endItem = Math.min(currentPage * rowsPerPage, totalItems)

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      {/* Left side - Rows per page */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Rows per page:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="px-3 py-1 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>

        <span className="text-sm text-gray-700 dark:text-gray-300">
          {startItem}-{endItem} of {totalItems}
        </span>
      </div>

      {/* Center - Page info and Go to page */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700 dark:text-gray-300">
          Page {currentPage} of {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-700 dark:text-gray-300">Go to:</span>
          <input
            type="number"
            min="1"
            max={totalPages}
            defaultValue={currentPage}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const page = Math.min(Math.max(1, parseInt((e.target as HTMLInputElement).value) || 1), totalPages)
                onPageChange(page)
              }
            }}
            className="w-16 px-3 py-1 text-sm text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Right side - Navigation buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
      </div>
    </div>
  )
}
