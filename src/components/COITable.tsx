import { MoreVertical, Edit2, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import { COI } from 'src/types/coi.ts'
import { useCOIStore } from '@store/coiStore'
import { formatDate, getStatusColor, truncateText } from '@utils/index'
import { useState } from 'react'

interface COITableProps {
  cois: COI[]
  onEdit: (coi: COI) => void
  onUpdate: (id: number, updates: Partial<COI>) => void
  onDelete: (id: number) => void
  onSelectRow: (id: number) => void
  onSelectAll: (ids: number[]) => void
  selectedRows: number[]
}

export const COITable = ({
  cois,
  onEdit,
  onUpdate,
  onDelete,
  onSelectRow,
  onSelectAll,
  selectedRows,
}: COITableProps) => {
  const { sortConfig, setSortConfig } = useCOIStore()
  const [openMenuId, setOpenMenuId] = useState<number | null>(null)
  const [editingExpiryId, setEditingExpiryId] = useState<number | null>(null)
  const [editingExpiryDate, setEditingExpiryDate] = useState<string>('')

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

  const handleSaveExpiryDate = (coiId: number) => {
    if (editingExpiryDate) {
      onUpdate(coiId, { expiryDate: editingExpiryDate })
      setEditingExpiryId(null)
      setEditingExpiryDate('')
    }
  }

  const handleStatusChange = (coiId: number, newStatus: string) => {
    onUpdate(coiId, { status: newStatus as any })
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
                    {editingExpiryId === coi.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="date"
                          value={editingExpiryDate}
                          onChange={(e) => setEditingExpiryDate(e.target.value)}
                          className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:text-white"
                          autoFocus
                        />
                        <button
                          onClick={() => handleSaveExpiryDate(coi.id)}
                          className="text-xs px-2 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => {
                            setEditingExpiryId(null)
                            setEditingExpiryDate('')
                          }}
                          className="text-xs px-2 py-1 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span>{formatDate(coi.expiryDate)}</span>
                        <button
                          onClick={() => {
                            setEditingExpiryId(coi.id)
                            setEditingExpiryDate(coi.expiryDate)
                          }}
                          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                          title="Edit expiry date"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">
                    <select
                      value={coi.status}
                      onChange={(e) => handleStatusChange(coi.id, e.target.value)}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border-0 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors ${getStatusColor(
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
                    <div className="relative inline-block">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === coi.id ? null : coi.id)}
                        className="p-1 hover:bg-gray-100 dark:hover:bg-gray-600 rounded transition-colors"
                      >
                        <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>

                      {openMenuId === coi.id && (
                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-2xl z-50">
                          <button
                            onClick={() => {
                              onEdit(coi)
                              setOpenMenuId(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 border-b border-gray-200 dark:border-gray-600 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Send reminder to: ' + coi.tenantEmail + '?')) {
                                onUpdate(coi.id, { reminderStatus: 'Sent (30d)' })
                                alert(`Reminder sent to: ${coi.tenantEmail}`)
                              }
                              setOpenMenuId(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center gap-2 border-b border-gray-200 dark:border-gray-600 transition-colors"
                          >
                            <span>📧</span>
                            Send Reminder
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to delete this COI?')) {
                                onDelete(coi.id)
                              }
                              setOpenMenuId(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-700 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900 flex items-center gap-2 transition-colors"
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