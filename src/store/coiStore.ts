import { create } from 'zustand'
import { COI, FilterOptions, DateRangeFilter, SortConfig } from '@types/coi'
import { MOCK_COIS } from '@utils/mockData'

interface COIStore {
  cois: COI[]
  filteredCOIs: COI[]
  selectedRows: number[]
  filters: FilterOptions
  dateRangeFilter: DateRangeFilter
  sortConfig: SortConfig
  isDarkMode: boolean
  rowsPerPage: number
  currentPage: number

  // Actions
  addCOI: (coi: Omit<COI, 'id' | 'createdAt'>) => void
  updateCOI: (id: number, updates: Partial<COI>) => void
  deleteCOI: (id: number) => void
  setFilters: (filters: Partial<FilterOptions>) => void
  setDateRangeFilter: (filter: DateRangeFilter) => void
  setSortConfig: (config: SortConfig) => void
  setSelectedRows: (rows: number[]) => void
  toggleRowSelection: (id: number) => void
  selectAllRows: (ids: number[]) => void
  clearSelection: () => void
  setDarkMode: (isDark: boolean) => void
  setRowsPerPage: (rows: number) => void
  setCurrentPage: (page: number) => void
  applyFilters: () => void
  resetFilters: () => void
  loadFromLocalStorage: () => void
}

const getFilteredCOIs = (cois: COI[], filters: FilterOptions, dateRange: DateRangeFilter, sortConfig: SortConfig): COI[] => {
  let result = [...cois]

  // Apply property filter
  if (filters.properties.length > 0) {
    result = result.filter(coi => filters.properties.includes(coi.property))
  }

  // Apply status filter
  if (filters.status !== 'All') {
    result = result.filter(coi => coi.status === filters.status)
  }

  // Apply search filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase()
    result = result.filter(coi =>
      coi.property.toLowerCase().includes(query) ||
      coi.tenantName.toLowerCase().includes(query) ||
      coi.unit.toLowerCase().includes(query) ||
      coi.coiName.toLowerCase().includes(query)
    )
  }

  // Apply expiry date filter
  if (filters.expiryFilter !== 'All') {
    const today = new Date()
    const days30 = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)
    const days60 = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000)
    const days90 = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)

    result = result.filter(coi => {
      const expiryDate = new Date(coi.expiryDate)
      switch (filters.expiryFilter) {
        case '30days':
          return expiryDate <= days30 && expiryDate >= today
        case '60days':
          return expiryDate <= days60 && expiryDate >= today
        case '90days':
          return expiryDate <= days90 && expiryDate >= today
        case 'Expired':
          return expiryDate < today
        default:
          return true
      }
    })
  }

  // Apply date range filter
  if (dateRange.startDate || dateRange.endDate) {
    result = result.filter(coi => {
      const expiryDate = new Date(coi.expiryDate)
      if (dateRange.startDate && expiryDate < new Date(dateRange.startDate)) return false
      if (dateRange.endDate && expiryDate > new Date(dateRange.endDate)) return false
      return true
    })
  }

  // Apply sorting
  if (sortConfig.key) {
    result.sort((a, b) => {
      const aVal = a[sortConfig.key as keyof COI]
      const bVal = b[sortConfig.key as keyof COI]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1
      return 0
    })
  }

  return result
}

export const useCOIStore = create<COIStore>((set, get) => ({
  cois: MOCK_COIS,
  filteredCOIs: MOCK_COIS,
  selectedRows: [],
  filters: {
    properties: [],
    status: 'All',
    expiryFilter: 'All',
    searchQuery: '',
  },
  dateRangeFilter: {
    startDate: null,
    endDate: null,
  },
  sortConfig: {
    key: null,
    direction: 'asc',
  },
  isDarkMode: false,
  rowsPerPage: 10,
  currentPage: 1,

  addCOI: (newCOI) => {
    set((state) => {
      const cois = [
        ...state.cois,
        {
          ...newCOI,
          id: Math.max(...state.cois.map(c => c.id), 0) + 1,
          createdAt: new Date().toISOString(),
        },
      ]
      const filteredCOIs = getFilteredCOIs(cois, state.filters, state.dateRangeFilter, state.sortConfig)
      return { cois, filteredCOIs }
    })
  },

  updateCOI: (id, updates) => {
    set((state) => {
      const cois = state.cois.map(coi => (coi.id === id ? { ...coi, ...updates } : coi))
      const filteredCOIs = getFilteredCOIs(cois, state.filters, state.dateRangeFilter, state.sortConfig)
      return { cois, filteredCOIs }
    })
  },

  deleteCOI: (id) => {
    set((state) => {
      const cois = state.cois.filter(coi => coi.id !== id)
      const filteredCOIs = getFilteredCOIs(cois, state.filters, state.dateRangeFilter, state.sortConfig)
      const selectedRows = state.selectedRows.filter(rowId => rowId !== id)
      return { cois, filteredCOIs, selectedRows }
    })
  },

  setFilters: (filters) => {
    set((state) => {
      const newFilters = { ...state.filters, ...filters }
      const filteredCOIs = getFilteredCOIs(state.cois, newFilters, state.dateRangeFilter, state.sortConfig)
      return { filters: newFilters, filteredCOIs, currentPage: 1 }
    })
  },

  setDateRangeFilter: (dateRangeFilter) => {
    set((state) => {
      const filteredCOIs = getFilteredCOIs(state.cois, state.filters, dateRangeFilter, state.sortConfig)
      return { dateRangeFilter, filteredCOIs, currentPage: 1 }
    })
  },

  setSortConfig: (sortConfig) => {
    set((state) => {
      const filteredCOIs = getFilteredCOIs(state.cois, state.filters, state.dateRangeFilter, sortConfig)
      return { sortConfig, filteredCOIs }
    })
  },

  setSelectedRows: (rows) => set({ selectedRows: rows }),

  toggleRowSelection: (id) => {
    set((state) => {
      const selectedRows = state.selectedRows.includes(id)
        ? state.selectedRows.filter(rowId => rowId !== id)
        : [...state.selectedRows, id]
      return { selectedRows }
    })
  },

  selectAllRows: (ids) => set({ selectedRows: ids }),

  clearSelection: () => set({ selectedRows: [] }),

  setDarkMode: (isDark) => set({ isDarkMode: isDark }),

  setRowsPerPage: (rows) => set({ rowsPerPage: rows, currentPage: 1 }),

  setCurrentPage: (page) => set({ currentPage: page }),

  applyFilters: () => {
    const state = get()
    const filteredCOIs = getFilteredCOIs(state.cois, state.filters, state.dateRangeFilter, state.sortConfig)
    set({ filteredCOIs, currentPage: 1 })
  },

  resetFilters: () => {
    set((state) => {
      const filters = {
        properties: [],
        status: 'All',
        expiryFilter: 'All',
        searchQuery: '',
      }
      const dateRangeFilter = { startDate: null, endDate: null }
      const sortConfig = { key: null, direction: 'asc' as const }
      const filteredCOIs = getFilteredCOIs(state.cois, filters, dateRangeFilter, sortConfig)
      return { filters, dateRangeFilter, sortConfig, filteredCOIs, currentPage: 1 }
    })
  },

  loadFromLocalStorage: () => {
    try {
      const saved = localStorage.getItem('coi-store')
      if (saved) {
        const { cois, isDarkMode } = JSON.parse(saved)
        set((state) => ({
          cois,
          isDarkMode,
          filteredCOIs: getFilteredCOIs(cois, state.filters, state.dateRangeFilter, state.sortConfig),
        }))
      }
    } catch (error) {
      console.error('Failed to load from localStorage:', error)
    }
  },
}))

// Subscribe to changes and save to localStorage
useCOIStore.subscribe(
  (state) => ({ cois: state.cois, isDarkMode: state.isDarkMode }),
  (newState) => {
    localStorage.setItem('coi-store', JSON.stringify(newState))
  }
)
