import { ReactNode } from 'react'

interface StatisticsCardProps {
  icon: ReactNode
  title: string
  value: number
  color: 'blue' | 'green' | 'red' | 'orange'
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950/40',
    border: 'border-blue-200 dark:border-blue-800',
    icon: 'bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300',
    text: 'text-blue-600 dark:text-blue-300',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950/40',
    border: 'border-green-200 dark:border-green-800',
    icon: 'bg-green-100 dark:bg-green-900/50 text-green-600 dark:text-green-300',
    text: 'text-green-600 dark:text-green-300',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950/40',
    border: 'border-red-200 dark:border-red-800',
    icon: 'bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300',
    text: 'text-red-600 dark:text-red-300',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950/40',
    border: 'border-orange-200 dark:border-orange-800',
    icon: 'bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300',
    text: 'text-orange-600 dark:text-orange-300',
  },
}

export const StatisticsCard = ({ icon, title, value, color }: StatisticsCardProps) => {
  const style = colorClasses[color]

  return (
    <div className={`${style.bg} border-l-4 ${style.border} rounded-lg p-6 transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-semibold ${style.icon}`}>
            {icon}
          </div>
          <p className={`text-sm font-medium ${style.text} opacity-80`}>
            {title}
          </p>
        </div>

        <div>
          <p className={`text-3xl font-bold ${style.text}`}>
            {value.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}

