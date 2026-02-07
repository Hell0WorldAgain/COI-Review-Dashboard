import { Moon, Sun, Bell, MessageCircle, HelpCircle, User, ChevronDown } from 'lucide-react'
import { useCOIStore } from '@store/coiStore'
import { useState } from 'react'

export const TopBar = () => {
  const { isDarkMode, setDarkMode } = useCOIStore()
  const [showUserMenu, setShowUserMenu] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      {/* Left section - Title */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">COI Review Dashboard</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">Manage your certificates of insurance</p>
      </div>

      {/* Right section - Actions */}
      <div className="flex items-center gap-4">
        {/* Buttons */}
        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          Send Bulk Reminder
        </button>

        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
          Ask LegalGraph AI
        </button>

        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1">
          <HelpCircle className="w-4 h-4" />
          Help
        </button>

        {/* Icons */}
        <div className="flex items-center gap-2 border-l border-gray-200 dark:border-gray-800 pl-4">
          <button
            onClick={toggleDarkMode}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <Sun className="w-5 h-5 text-yellow-500" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Shubham</span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Shubham</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">shubham@example.com</p>
                </div>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-t border-gray-200 dark:border-gray-700">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
