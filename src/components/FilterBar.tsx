import { Search, Settings, Plus, Download } from 'lucide-react'
import { useCOIStore } from '@store/coiStore'
import { useDebounce } from '@hooks/useDebounce'
import { exportToCSV, getUniqueProperties } from '@utils/index'
import { useEffect, useState } from 'react'

interface FilterBarProps {
  onAddClick: () => void
}

export const FilterBar = ({ onAddClick }: FilterBarProps) => {
  const {
    cois,
    filters,
    setFilters,
  } = useCOIStore()

  const [searchInput, setSearchInput] = useState(filters.searchQuery)
  const debouncedSearch = useDebounce(searchInput, 300)
  const [selectedProperties, setSelectedProperties] = useState<string[]>(filters.properties)
  const properties = getUniqueProperties(cois)
  const [showPropertyMenu, setShowPropertyMenu] = useState(false)

  useEffect(() => {
    setFilters({ searchQuery: debouncedSearch })
  }, [debouncedSearch, setFilters])

  const handlePropertyToggle = (property: string) => {
    const updated = selectedProperties.includes(property)
      ? selectedProperties.filter(p => p !== property)
      : [...selectedProperties, property]
    setSelectedProperties(updated)
    setFilters({ properties: updated })
  }

  const handleExport = () => {
    exportToCSV(cois)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Filters Section */}
        <div className="flex items-center gap-3 flex-1">
          {/* All Properties Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowPropertyMenu(!showPropertyMenu)}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors flex items-center gap-1"
            >
              All Properties {selectedProperties.length > 0 && `(${selectedProperties.length})`}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </button>

            {showPropertyMenu && (
              <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20 max-h-64 overflow-y-auto">
                {properties.map(property => (
                  <label key={property} className="flex items-center gap-2 px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-600 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selectedProperties.includes(property)}
                      onChange={() => handlePropertyToggle(property)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{property}</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as any })}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
          >
            <option value="All">Status</option>
            <option value="Active">Active</option>
            <option value="Expired">Expired</option>
            <option value="Rejected">Rejected</option>
            <option value="Expiring Soon">Expiring Soon</option>
            <option value="Not Processed">Not Processed</option>
          </select>

          {/* Filter by Expiry Dropdown */}
          <select
            value={filters.expiryFilter}
            onChange={(e) => setFilters({ expiryFilter: e.target.value as any })}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-600 transition-colors"
          >
            <option value="All">Filter by Expiry</option>
            <option value="30days">Expiring in 30 days</option>
            <option value="60days">Expiring in 60 days</option>
            <option value="90days">Expiring in 90 days</option>
            <option value="Expired">Expired</option>
          </select>
        </div>

        {/* Search Bar */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-600" />
          <input
            type="text"
            placeholder="Search by tenant, properties, or unit..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          />
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400"
            title="Export to CSV"
          >
            <Download className="w-5 h-5" />
          </button>

          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors text-gray-600 dark:text-gray-400">
            <Settings className="w-5 h-5" />
          </button>

          <button
            onClick={onAddClick}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg flex items-center gap-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            ADD COI
          </button>
        </div>
      </div>
    </div>
  )
}
