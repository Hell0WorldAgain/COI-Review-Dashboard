import { X } from 'lucide-react'
import { COI } from '@types/coi'
import { useState, useEffect } from 'react'
import { validateEmail } from '@utils/index'

interface AddEditCOIModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<COI, 'id' | 'createdAt'>) => void
  initialData?: COI
  properties: string[]
}

export const AddEditCOIModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  properties,
}: AddEditCOIModalProps) => {
  const [formData, setFormData] = useState({
    property: '',
    tenantName: '',
    tenantEmail: '',
    unit: '',
    coiName: '',
    expiryDate: '',
    status: 'Not Processed' as const,
    reminderStatus: 'Not Sent' as const,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (initialData) {
      setFormData({
        property: initialData.property,
        tenantName: initialData.tenantName,
        tenantEmail: initialData.tenantEmail,
        unit: initialData.unit,
        coiName: initialData.coiName,
        expiryDate: initialData.expiryDate,
        status: initialData.status,
        reminderStatus: initialData.reminderStatus,
      })
    } else {
      setFormData({
        property: '',
        tenantName: '',
        tenantEmail: '',
        unit: '',
        coiName: '',
        expiryDate: '',
        status: 'Not Processed',
        reminderStatus: 'Not Sent',
      })
    }
    setErrors({})
  }, [initialData, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.property.trim()) newErrors.property = 'Property is required'
    if (!formData.tenantName.trim()) newErrors.tenantName = 'Tenant name is required'
    if (!formData.tenantEmail.trim()) newErrors.tenantEmail = 'Tenant email is required'
    else if (!validateEmail(formData.tenantEmail)) newErrors.tenantEmail = 'Invalid email format'
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required'
    if (!formData.coiName.trim()) newErrors.coiName = 'COI name is required'
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData as Omit<COI, 'id' | 'createdAt'>)
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {initialData ? 'Edit COI' : 'Add New COI'}
            </h2>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
            >
              <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              {/* Property */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Property *
                </label>
                <input
                  type="text"
                  list="properties-list"
                  value={formData.property}
                  onChange={(e) => setFormData({ ...formData, property: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter property name"
                />
                <datalist id="properties-list">
                  {properties.map(prop => (
                    <option key={prop} value={prop} />
                  ))}
                </datalist>
                {errors.property && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.property}</p>}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Unit *
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 101"
                />
                {errors.unit && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.unit}</p>}
              </div>

              {/* Tenant Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tenant Name *
                </label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) => setFormData({ ...formData, tenantName: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter tenant name"
                />
                {errors.tenantName && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.tenantName}</p>}
              </div>

              {/* Tenant Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tenant Email *
                </label>
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) => setFormData({ ...formData, tenantEmail: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="tenant@example.com"
                />
                {errors.tenantEmail && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.tenantEmail}</p>}
              </div>

              {/* COI Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  COI Name *
                </label>
                <input
                  type="text"
                  value={formData.coiName}
                  onChange={(e) => setFormData({ ...formData, coiName: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Tenant_Property_COI_2026"
                />
                {errors.coiName && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.coiName}</p>}
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.expiryDate && <p className="text-red-600 dark:text-red-400 text-xs mt-1">{errors.expiryDate}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-2 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Active">Active</option>
                  <option value="Expired">Expired</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Expiring Soon">Expiring Soon</option>
                  <option value="Not Processed">Not Processed</option>
                </select>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 justify-end mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                {initialData ? 'Update' : 'Add'} COI
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
