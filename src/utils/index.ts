import { COI } from 'src/types/coi'
import { format, parseISO, differenceInDays } from 'date-fns'

export const formatDate = (dateString: string): string => {
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy')
  } catch {
    return dateString
  }
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'Active':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
    case 'Expired':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Rejected':
      return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    case 'Expiring Soon':
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
    case 'Not Processed':
      return 'bg-blue-50 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
  }
}

export const getStatusBorderColor = (status: string): string => {
  switch (status) {
    case 'Active':
      return 'border-blue-300 dark:border-blue-700'
    case 'Expired':
      return 'border-red-300 dark:border-red-700'
    case 'Rejected':
      return 'border-red-300 dark:border-red-700'
    case 'Expiring Soon':
      return 'border-orange-300 dark:border-orange-700'
    case 'Not Processed':
      return 'border-blue-200 dark:border-blue-800'
    default:
      return 'border-gray-300 dark:border-gray-700'
  }
}

export const calculateDaysUntilExpiry = (expiryDate: string): number => {
  try {
    return differenceInDays(parseISO(expiryDate), new Date())
  } catch {
    return 0
  }
}

export const exportToCSV = (data: COI[]): void => {
  const headers = ['ID', 'Property', 'Tenant Name', 'Unit', 'COI Name', 'Expiry Date', 'Status', 'Reminder Status', 'Created At']
  const rows = data.map(coi => [
    coi.id,
    coi.property,
    coi.tenantName,
    coi.unit,
    coi.coiName,
    formatDate(coi.expiryDate),
    coi.status,
    coi.reminderStatus,
    format(parseISO(coi.createdAt), 'MMM dd, yyyy'),
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  link.href = URL.createObjectURL(blob)
  link.download = `COI_Export_${format(new Date(), 'yyyy-MM-dd')}.csv`
  link.click()
}

export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const debounce = <T extends (...args: unknown[]) => unknown>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout | null = null

  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      func(...args)
    }, delay)
  }
}

export const getUniqueProperties = (cois: COI[]): string[] => {
  return Array.from(new Set(cois.map(coi => coi.property))).sort()
}

export const getTotalStats = (cois: COI[]) => {
  const total = cois.length
  const accepted = cois.filter(c => c.status === 'Active').length
  const rejected = cois.filter(c => c.status === 'Rejected' || c.status === 'Expired').length
  const expiringIn30Days = cois.filter(c => {
    const days = calculateDaysUntilExpiry(c.expiryDate)
    return days > 0 && days <= 30
  }).length

  return { total, accepted, rejected, expiringIn30Days }
}
