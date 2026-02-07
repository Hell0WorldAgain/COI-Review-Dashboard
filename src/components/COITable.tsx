import { MoreVertical, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { COI, SortConfig } from '@types/coi'
import { useCOIStore } from '@store/coiStore'
import { formatDate, getStatusColor, truncateText } from '@utils/index'
import { useState } from 'react'

interface COITableProps {
  cois: COI[]
  onEdit: (coi: COI) => void
  onDelete: (id: number) => void
  onSelectRow: (id: number) => void
  onSelectAll: (ids: number[]) => void
  selectedRows: number[]
}

export const COITable = ({
  cois,
  onEdit,
  onDelete,
  onSelectRow,
  onSelectAll,
  selectedRows,
}: COITableProps) => {
  const { sortConfig, setSortConfig } = useCOIStore()
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)

  const columns: { key: keyof COI; label: string; sortable: boolean; width: string }[] = [
    { key: 'property', label: 'Property', sortable: true, width: 'w-40' },
    { key: 'tenantName', label: 'Tenant Name', sortable: true, width: 'w-48' },
    { key: 'unit', label: 'Unit', sortable: true, width: 'w-24' },
    { key: 'coiName', label: 'COI Name', sortable: false, width: 'w-48' },
    { key: 'expiryDate', label: 'Expiry Date', sortable: true, width: 'w-32' },
    { key: 'status', label: 'Status', sortable: true, width: 'w-32' },
    { key: 'reminderStatus', label: 'Reminder Status', sortable: false, width: 'w-32' },
  ]

  const handleSort = (key: keyof COI) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    setSortConfig({ key, direction })
  }

  const isAllSelected = cois.length > 0 && cois.every(coi => selectedRows.includes(coi.id))

  const getSortIcon = (key: keyof COI) => {
    if (sortConfig.key !== key) return null
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 inline-block ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 inline-block ml-1" />
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
            <tr>
              <th className="px-6 py-4 text-left">
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onSelectAll(cois.map(c => c.id))
                    } else {
                      onSelectAll([])
                    }
                  }}
                  className="w-4 h-4 cursor-pointer"
                />
              </th>
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider ${
                    col.sortable ? 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600' : ''
                  } ${col.width}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {col.sortable && getSortIcon(col.key)}
                  </span>
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {cois.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 2} className="px-6 py-8 text-center">
                  <p className="text-gray-500 dark:text-gray-400">No COIs found</p>
                </td>
              </tr>
            ) : (
              cois.map(coi => (
                <tr
                  key={coi.id}
                  className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors ${
                    selectedRows.includes(coi.id) ? 'bg-blue-50 dark:bg-blue-900' : ''
                  }`}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(coi.id)}
                      onChange={() => onSelectRow(coi.id)}
                      className="w-4 h-4 cursor-pointer"
                    />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {truncateText(coi.property, 20)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {truncateText(coi.tenantName, 20)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {coi.unit}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {truncateText(coi.coiName, 20)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 dark:text-white whitespace-nowrap">
                    {formatDate(coi.expiryDate)}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <select
                      value={coi.status}
                      onChange={(e) => onEdit({ ...coi, status: e.target.value as any })}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(
                        coi.status
                      )}`}
                    >
                      <option>Active</option>
                      <option>Expired</option>
                      <option>Rejected</option>
                      <option>Expiring Soon</option>
                      <option>Not Processed</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                    {coi.reminderStatus}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === coi.id ? null : coi.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>

                      {openMenuId === coi.id && (
                        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-20">
                          <button
                            onClick={() => {
                              onEdit(coi)
                              setOpenMenuId(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 border-b border-gray-200 dark:border-gray-600"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              onDelete(coi.id)
                              setOpenMenuId(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 flex items-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
