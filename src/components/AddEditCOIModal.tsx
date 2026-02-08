import { X } from 'lucide-react'
import type { COI } from 'src/types/coi'
import { useState, useEffect } from 'react'
import { validateEmail } from '@utils/index'

type COIFormData = Omit<COI, 'id' | 'createdAt'>

interface AddEditCOIModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: COIFormData) => void
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
  const [formData, setFormData] = useState<COIFormData>({
    property: '',
    tenantName: '',
    tenantEmail: '',
    unit: '',
    coiName: '',
    expiryDate: '',
    status: 'Not Processed',
    reminderStatus: 'Not Sent',
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
    if (!formData.tenantEmail.trim()) {
      newErrors.tenantEmail = 'Tenant email is required'
    } else if (!validateEmail(formData.tenantEmail)) {
      newErrors.tenantEmail = 'Invalid email format'
    }
    if (!formData.unit.trim()) newErrors.unit = 'Unit is required'
    if (!formData.coiName.trim()) newErrors.coiName = 'COI name is required'
    if (!formData.expiryDate.trim()) newErrors.expiryDate = 'Expiry date is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
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
                <label className="block text-sm font-medium mb-2">
                  Property *
                </label>
                <input
                  type="text"
                  list="properties-list"
                  value={formData.property}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, property: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />
                <datalist id="properties-list">
                  {properties.map(prop => (
                    <option key={prop} value={prop} />
                  ))}
                </datalist>
                {errors.property && <p className="text-red-500 text-xs">{errors.property}</p>}
              </div>

              {/* Unit */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Unit *
                </label>
                <input
                  type="text"
                  value={formData.unit}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, unit: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />
                {errors.unit && <p className="text-red-500 text-xs">{errors.unit}</p>}
              </div>

              {/* Tenant Name */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tenant Name *
                </label>
                <input
                  type="text"
                  value={formData.tenantName}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, tenantName: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />
                {errors.tenantName && <p className="text-red-500 text-xs">{errors.tenantName}</p>}
              </div>

              {/* Tenant Email */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tenant Email *
                </label>
                <input
                  type="email"
                  value={formData.tenantEmail}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, tenantEmail: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />
                {errors.tenantEmail && <p className="text-red-500 text-xs">{errors.tenantEmail}</p>}
              </div>

              {/* COI Name */}
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">
                  COI Name *
                </label>
                <input
                  type="text"
                  value={formData.coiName}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, coiName: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />
                {errors.coiName && <p className="text-red-500 text-xs">{errors.coiName}</p>}
              </div>

              {/* Expiry Date */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) =>
                    setFormData(prev => ({ ...prev, expiryDate: e.target.value }))
                  }
                  className="w-full px-4 py-2 rounded-lg border"
                />
                {errors.expiryDate && <p className="text-red-500 text-xs">{errors.expiryDate}</p>}
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      status: e.target.value as COI['status'],
                    }))
                  }
                  className="w-full px-4 py-2 rounded-lg border"
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
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-blue-600 text-white"
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
