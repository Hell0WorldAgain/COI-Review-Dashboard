export type COIStatus = 'Active' | 'Expired' | 'Rejected' | 'Expiring Soon' | 'Not Processed'
export type ReminderStatus = 'Not Sent' | 'Sent (30d)' | 'Sent (60d)' | 'N/A'

export interface COI {
  id: number
  property: string
  tenantName: string
  tenantEmail: string
  unit: string
  coiName: string
  expiryDate: string // ISO 8601 format: YYYY-MM-DD
  status: COIStatus
  reminderStatus: ReminderStatus
  createdAt: string
}

export interface FilterOptions {
  properties: string[]
  status: COIStatus | 'All'
  expiryFilter: 'All' | '30days' | '60days' | '90days' | 'Expired'
  searchQuery: string
}

export interface DateRangeFilter {
  startDate: string | null
  endDate: string | null
}

export interface SortConfig {
  key: keyof COI | null
  direction: 'asc' | 'desc'
}
