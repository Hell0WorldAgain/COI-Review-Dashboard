import { create } from 'zustand'
import type {
  COI,
  FilterOptions,
  DateRangeFilter,
  SortConfig,
} from 'src/types/coi'
import { MOCK_COIS } from '@utils/mockData'

/* -------------------- DEFAULTS -------------------- */

const defaultFilters: FilterOptions = {
  properties: [],
  status: 'All',
  expiryFilter: 'All',
  searchQuery: '',
}

const defaultDateRange: DateRangeFilter = {
  startDate: null,
  endDate: null,
}

const defaultSortConfig: SortConfig = {
  key: null,
  direction: 'asc',
}

/* -------------------- STORE -------------------- */

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

/* -------------------- FILTER LOGIC -------------------- */

const getFilteredCOIs = (
  cois: COI[],
  filters: FilterOptions,
  dateRange: DateRangeFilter,
  sortConfig: SortConfig
): COI[] => {
  let result = [...cois]

  if (filters.properties.length) {
    result = result.filter(coi =>
      filters.properties.includes(coi.property)
    )
  }

  if (filters.status !== 'All') {
    result = result.filter(coi => coi.status === filters.status)
  }

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase()
    result = result.filter(coi =>
      coi.property.toLowerCase().includes(q) ||
      coi.tenantName.toLowerCase().includes(q) ||
      coi.unit.toLowerCase().includes(q) ||
      coi.coiName.toLowerCase().includes(q)
    )
  }

  if (filters.expiryFilter !== 'All') {
    const today = new Date()
    const ranges = {
      '30days': 30,
      '60days': 60,
      '90days': 90,
    } as const

    result = result.filter(coi => {
      const expiry = new Date(coi.expiryDate)

      if (filters.expiryFilter === 'Expired') {
        return expiry < today
      }

      const days = ranges[filters.expiryFilter as keyof typeof ranges]
      if (!days) return true

      const limit = new Date(today.getTime() + days * 86400000)
      return expiry >= today && expiry <= limit
    })
  }

  if (dateRange.startDate || dateRange.endDate) {
    result = result.filter(coi => {
      const d = new Date(coi.expiryDate)
      if (dateRange.startDate && d < new Date(dateRange.startDate)) return false
      if (dateRange.endDate && d > new Date(dateRange.endDate)) return false
      return true
    })
  }

  if (sortConfig.key) {
    result.sort((a, b) => {
      const aVal = a[sortConfig.key!]
      const bVal = b[sortConfig.key!]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortConfig.direction === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }

      return sortConfig.direction === 'asc'
        ? Number(aVal) - Number(bVal)
        : Number(bVal) - Number(aVal)
    })
  }

  return result
}

/* -------------------- STORE -------------------- */

export const useCOIStore = create<COIStore>((set, get) => {
  let initialCOIs = MOCK_COIS
  let initialDarkMode = false

  try {
    const saved = localStorage.getItem('coi-store')
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed.cois)) initialCOIs = parsed.cois
      if (typeof parsed.isDarkMode === 'boolean') {
        initialDarkMode = parsed.isDarkMode
      }
    }
  } catch {}

  return {
    cois: initialCOIs,
    filteredCOIs: getFilteredCOIs(
      initialCOIs,
      defaultFilters,
      defaultDateRange,
      defaultSortConfig
    ),
    selectedRows: [],
    filters: defaultFilters,
    dateRangeFilter: defaultDateRange,
    sortConfig: defaultSortConfig,
    isDarkMode: initialDarkMode,
    rowsPerPage: 10,
    currentPage: 1,

    addCOI: (newCOI) => {
      set(state => {
        const cois = [
          ...state.cois,
          {
            ...newCOI,
            id: Math.max(0, ...state.cois.map(c => c.id)) + 1,
            createdAt: new Date().toISOString(),
          },
        ]
        return {
          cois,
          filteredCOIs: getFilteredCOIs(
            cois,
            state.filters,
            state.dateRangeFilter,
            state.sortConfig
          ),
        }
      })
    },

    updateCOI: (id, updates) => {
      set(state => {
        const cois = state.cois.map(c =>
          c.id === id ? { ...c, ...updates } : c
        )
        return {
          cois,
          filteredCOIs: getFilteredCOIs(
            cois,
            state.filters,
            state.dateRangeFilter,
            state.sortConfig
          ),
        }
      })
    },

    deleteCOI: (id) => {
      set(state => {
        const cois = state.cois.filter(c => c.id !== id)
        return {
          cois,
          selectedRows: state.selectedRows.filter(r => r !== id),
          filteredCOIs: getFilteredCOIs(
            cois,
            state.filters,
            state.dateRangeFilter,
            state.sortConfig
          ),
        }
      })
    },

    setFilters: (filters) => {
      set(state => {
        const next: FilterOptions = { ...state.filters, ...filters }
        return {
          filters: next,
          currentPage: 1,
          filteredCOIs: getFilteredCOIs(
            state.cois,
            next,
            state.dateRangeFilter,
            state.sortConfig
          ),
        }
      })
    },

    setDateRangeFilter: (dateRangeFilter) =>
      set(state => ({
        dateRangeFilter,
        currentPage: 1,
        filteredCOIs: getFilteredCOIs(
          state.cois,
          state.filters,
          dateRangeFilter,
          state.sortConfig
        ),
      })),

    setSortConfig: (sortConfig) =>
      set(state => ({
        sortConfig,
        filteredCOIs: getFilteredCOIs(
          state.cois,
          state.filters,
          state.dateRangeFilter,
          sortConfig
        ),
      })),

    setSelectedRows: (rows) => set({ selectedRows: rows }),
    toggleRowSelection: (id) =>
      set(state => ({
        selectedRows: state.selectedRows.includes(id)
          ? state.selectedRows.filter(r => r !== id)
          : [...state.selectedRows, id],
      })),
    selectAllRows: (ids) => set({ selectedRows: ids }),
    clearSelection: () => set({ selectedRows: [] }),

    setDarkMode: (isDarkMode) => set({ isDarkMode }),
    setRowsPerPage: (rowsPerPage) => set({ rowsPerPage, currentPage: 1 }),
    setCurrentPage: (currentPage) => set({ currentPage }),

    applyFilters: () => {
      const state = get()
      set({
        currentPage: 1,
        filteredCOIs: getFilteredCOIs(
          state.cois,
          state.filters,
          state.dateRangeFilter,
          state.sortConfig
        ),
      })
    },

    resetFilters: () => {
      const state = get()
      set({
        filters: defaultFilters,
        dateRangeFilter: defaultDateRange,
        sortConfig: defaultSortConfig,
        currentPage: 1,
        filteredCOIs: getFilteredCOIs(
          state.cois,
          defaultFilters,
          defaultDateRange,
          defaultSortConfig
        ),
      })
    },

    loadFromLocalStorage: () => {
      const saved = localStorage.getItem('coi-store')
      if (!saved) return
      const { cois, isDarkMode } = JSON.parse(saved)
      set(state => ({
        cois,
        isDarkMode,
        filteredCOIs: getFilteredCOIs(
          cois,
          state.filters,
          state.dateRangeFilter,
          state.sortConfig
        ),
      }))
    },
  }
})

/* -------------------- PERSIST -------------------- */

useCOIStore.subscribe((state) => {
  localStorage.setItem(
    'coi-store',
    JSON.stringify({
      cois: state.cois,
      isDarkMode: state.isDarkMode,
    })
  )
})
