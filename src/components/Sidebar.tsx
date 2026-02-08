import { FileText, Download } from 'lucide-react'
import { Link, useLocation } from 'react-router-dom'

export const Sidebar = () => {
  const location = useLocation()

  const isActive = (path: string) => location.pathname === path

  const handleReviewDocuments = () => {
    alert('Review Documents - Coming Soon!\n\nYou can review documents by clicking the document icon (📄) on each COI row in the table.')
  }

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-lg text-gray-900 dark:text-white">LegalGraph AI</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        <Link
          to="/dashboard"
          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
            isActive('/dashboard') || isActive('/')
              ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="font-medium">COI Dashboard</span>
        </Link>

        <button
          onClick={handleReviewDocuments}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Download className="w-5 h-5" />
          <span className="font-medium">Review Documents</span>
        </button>
      </nav>

      {/* Version info */}
      <div className="px-4 py-3 text-xs text-gray-500 dark:text-gray-600 border-t border-gray-200 dark:border-gray-800">
        <p>v1.1.0</p>
      </div>
    </aside>
  )
}
