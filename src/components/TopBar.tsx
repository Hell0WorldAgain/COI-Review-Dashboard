import { Moon, Sun, Bell, MessageCircle, HelpCircle, User, ChevronDown } from 'lucide-react'
import { useCOIStore } from '@store/coiStore'
import { useState } from 'react'

export const TopBar = () => {
  const { isDarkMode, setDarkMode, selectedRows, cois, updateCOI } = useCOIStore()
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showReminderMenu, setShowReminderMenu] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  const handleSendReminder = (type: string) => {
    if (selectedRows.length === 0) {
      alert('Please select at least one COI to send reminder')
      return
    }
    
    const selectedCOIs = cois.filter(c => selectedRows.includes(c.id))
    
    selectedCOIs.forEach(coi => {
      let reminderStatus = 'Not Sent'
      if (type === '30-day') {
        reminderStatus = 'Sent (30d)'
      } else if (type === '60-day') {
        reminderStatus = 'Sent (60d)'
      } else if (type === 'Immediate') {
        reminderStatus = 'Sent (30d)' 
      }
      
      updateCOI(coi.id, {
        ...coi,
        reminderStatus: reminderStatus as any,
      })
      
      console.log(`${type} reminder sent to: ${coi.tenantEmail}`)
    })
    
    alert(`${type} reminder sent to ${selectedRows.length} COI(s)\n\nReminder status updated in table`)
    setShowReminderMenu(false)
  }

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">COI Review Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Overview of all Certificate of Insurance</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            onClick={() => setShowReminderMenu(!showReminderMenu)}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2"
          >
            Send Bulk Reminder
            <ChevronDown className="w-4 h-4" />
          </button>

          {showReminderMenu && (
            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
              <button
                onClick={() => handleSendReminder('30-day')}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium">30-day Reminder</p>
                <p className="text-xs text-gray-500">Send 30 days before expiry</p>
              </button>
              <button
                onClick={() => handleSendReminder('60-day')}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 border-b border-gray-200 dark:border-gray-700"
              >
                <p className="font-medium">60-day Reminder</p>
                <p className="text-xs text-gray-500">Send 60 days before expiry</p>
              </button>
              <button
                onClick={() => handleSendReminder('Immediate')}
                className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <p className="font-medium">Immediate Reminder</p>
                <p className="text-xs text-gray-500">Send immediately</p>
              </button>
            </div>
          )}
        </div>

        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Ask LegalGraph AI
        </button>

        <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-2">
          <HelpCircle className="w-4 h-4" />
          Help
        </button>

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

          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            >
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Abhishek</span>
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20">
                <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Abhishek</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">abhi@shek.com</p>
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
