import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { COI, FilterOptions, DateRangeFilter, SortConfig } from 'src/types/coi'
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

// ---------------------
// Default constants to preserve literal types
// ---------------------
const DEFAULT_FILTERS: FilterOptions = {
  properties: [],
  status: 'All',
  expiryFilter: 'All',
  searchQuery: '',
}

const DEFAULT_DATE_RANGE: DateRangeFilter = {
  startDate: null,
  endDate: null,
}

const DEFAULT_SORT: SortConfig = {
  key: null,
  direction: 'asc',
}

// ---------------------
// Filtering utility
// ---------------------
const getFilteredCOIs = (
  cois: COI[],
  filters: FilterOptions,
  dateRange: DateRangeFilter,
  sortConfig: SortConfig
): COI[] => {
  let result = [...cois]

  // Property filter
  if (filters.properties.length > 0) {
    result = result.filter(coi => filters.properties.includes(coi.property))
  }

  // Status filter
  if (filters.status !== 'All') {
    result = result.filter(coi => coi.status === filters.status)
  }

  // Search query filter
  if (filters.searchQuery.trim()) {
    const query = filters.searchQuery.toLowerCase()
    result = result.filter(coi =>
      coi.property.toLowerCase().includes(query) ||
      coi.tenantName.toLowerCase().includes(query) ||
      coi.unit.toLowerCase().includes(query) ||
      coi.coiName.toLowerCase().includes(query)
    )
  }

  // Expiry filter
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

  // Date range filter
  if (dateRange.startDate || dateRange.endDate) {
    result = result.filter(coi => {
      const expiryDate = new Date(coi.expiryDate)
      if (dateRange.startDate && expiryDate < new Date(dateRange.startDate)) return false
      if (dateRange.endDate && expiryDate > new Date(dateRange.endDate)) return false
      return true
    })
  }

  // Sorting
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

// ---------------------
// Zustand Store
// ---------------------
export const useCOIStore = create<COIStore>()(
  persist(
    (set, get) => ({
      cois: MOCK_COIS,
      filteredCOIs: getFilteredCOIs(MOCK_COIS, DEFAULT_FILTERS, DEFAULT_DATE_RANGE, DEFAULT_SORT),
      selectedRows: [],
      filters: DEFAULT_FILTERS,
      dateRangeFilter: DEFAULT_DATE_RANGE,
      sortConfig: DEFAULT_SORT,
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
          const cois = state.cois.map(coi =>
            coi.id === id ? { ...coi, ...updates } : coi
          )
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
          const filteredCOIs = getFilteredCOIs(
            state.cois,
            DEFAULT_FILTERS,
            DEFAULT_DATE_RANGE,
            DEFAULT_SORT
          )
          return {
            filters: DEFAULT_FILTERS,
            dateRangeFilter: DEFAULT_DATE_RANGE,
            sortConfig: DEFAULT_SORT,
            filteredCOIs,
            currentPage: 1,
          }
        })
      },

      loadFromLocalStorage: () => {
        // handled by persist middleware
      },
    }),
    {
      name: 'coi-store',
      partialize: (state) => ({
        cois: state.cois,
        isDarkMode: state.isDarkMode,
      }),
    }
  )
)
