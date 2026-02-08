import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Clock } from 'lucide-react'
import {
  Sidebar,
  TopBar,
  StatisticsCard,
  FilterBar,
  COITable,
  Pagination,
  AddEditCOIModal,
  COIDetailModal,
} from '@components/index'
import { useCOIStore } from '@store/coiStore'
import { getTotalStats, getUniqueProperties } from '@utils/index'
import { COI } from 'src/types/coi'

export const Dashboard = () => {
  const {
    filteredCOIs,
    selectedRows,
    toggleRowSelection,
    selectAllRows,
    addCOI,
    updateCOI,
    deleteCOI,
    rowsPerPage,
    setRowsPerPage,
    currentPage,
    setCurrentPage,
    cois,
    isDarkMode,
    loadFromLocalStorage,
  } = useCOIStore()

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [editingCOI, setEditingCOI] = useState<COI | undefined>()
  const [selectedDetailCOI, setSelectedDetailCOI] = useState<COI | null>(null)

  useEffect(() => {
    loadFromLocalStorage()
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    }
  }, [isDarkMode, loadFromLocalStorage])

  // Calculate pagination
  const totalPages = Math.ceil(filteredCOIs.length / rowsPerPage)
  const startIndex = (currentPage - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const paginatedCOIs = filteredCOIs.slice(startIndex, endIndex)

  // Calculate stats from ALL cois, not just filtered
  const stats = getTotalStats(cois)
  const properties = getUniqueProperties(cois)

  const handleAddCOI = (formData: Omit<COI, 'id' | 'createdAt'>) => {
    if (editingCOI) {
      updateCOI(editingCOI.id, formData)
      setEditingCOI(undefined)
    } else {
      addCOI(formData)
    }
    setIsAddModalOpen(false)
  }

  const handleEditCOI = (coi: COI) => {
    setSelectedDetailCOI(coi)
    setIsDetailModalOpen(true)
  }

  const handleUpdateCOI = (coi: COI) => {
    updateCOI(coi.id, coi)
    setIsDetailModalOpen(false)
  }

  // Direct update handler for inline edits (status, expiry date)
  const handleInlineUpdate = (id: number, updates: Partial<COI>) => {
    updateCOI(id, updates)
  }

  const handleDeleteCOI = (id: number) => {
    deleteCOI(id)
  }

  const handleOpenAddModal = () => {
    setEditingCOI(undefined)
    setIsAddModalOpen(true)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <TopBar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {/* Statistics Cards */}
          <div className="grid grid-cols-4 gap-6 mb-8">
            <StatisticsCard
              icon="📋"
              title="Total COI Processed"
              value={stats.total}
              color="blue"
            />
            <StatisticsCard
              icon={<CheckCircle className="w-6 h-6" />}
              title="Accepted"
              value={stats.accepted}
              color="green"
            />
            <StatisticsCard
              icon={<XCircle className="w-6 h-6" />}
              title="Rejected"
              value={stats.rejected}
              color="red"
            />
            <StatisticsCard
              icon={<Clock className="w-6 h-6" />}
              title="Expiring in 30 days"
              value={stats.expiringIn30Days}
              color="orange"
            />
          </div>

          {/* Filter Bar */}
          <FilterBar onAddClick={handleOpenAddModal} />

          {/* Table */}
          <COITable
            cois={paginatedCOIs}
            onEdit={handleEditCOI}
            onUpdate={handleInlineUpdate}
            onDelete={handleDeleteCOI}
            onSelectRow={toggleRowSelection}
            onSelectAll={selectAllRows}
            selectedRows={selectedRows}
          />

          {/* Pagination */}
          <div className="mt-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              rowsPerPage={rowsPerPage}
              totalItems={filteredCOIs.length}
              onPageChange={setCurrentPage}
              onRowsPerPageChange={setRowsPerPage}
            />
          </div>
        </main>
      </div>

      {/* Add/Edit Modal */}
      <AddEditCOIModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false)
          setEditingCOI(undefined)
        }}
        onSubmit={handleAddCOI}
        initialData={editingCOI}
        properties={properties}
      />

      {/* Detail Modal */}
      <COIDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        coi={selectedDetailCOI}
        onUpdate={handleUpdateCOI}
        onDelete={handleDeleteCOI}
      />
    </div>
  )
}
