import { ReactNode } from 'react'

interface StatisticsCardProps {
  icon: ReactNode
  title: string
  value: number
  color: 'blue' | 'green' | 'red' | 'orange'
}

const colorClasses = {
  blue: 'bg-blue-50 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  green: 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300',
  red: 'bg-red-50 dark:bg-red-900 text-red-700 dark:text-red-300',
  orange: 'bg-orange-50 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
}

const iconBgClasses = {
  blue: 'bg-blue-100 dark:bg-blue-800',
  green: 'bg-green-100 dark:bg-green-800',
  red: 'bg-red-100 dark:bg-red-800',
  orange: 'bg-orange-100 dark:bg-orange-800',
}

export const StatisticsCard = ({ icon, title, value, color }: StatisticsCardProps) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{title}</p>
          <p className={`text-3xl font-bold ${colorClasses[color]}`}>
            {value.toLocaleString()}
          </p>
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBgClasses[color]}`}>
          <div className={`text-xl ${colorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  )
}
