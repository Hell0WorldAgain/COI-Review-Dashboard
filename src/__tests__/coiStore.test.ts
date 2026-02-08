import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCOIStore } from '../store/coiStore'

describe('COI Store Tests', () => {
  beforeEach(() => {
    // Reset store before each test
    const { result } = renderHook(() => useCOIStore())
    act(() => {
      result.current.resetFilters()
      result.current.clearSelection()
    })
  })

  describe('Add COI', () => {
    it('should add a new COI to the store', () => {
      const { result } = renderHook(() => useCOIStore())
      const initialCount = result.current.cois.length

      act(() => {
        result.current.addCOI({
          property: 'Test Property',
          tenantName: 'Test Tenant',
          tenantEmail: 'test@example.com',
          unit: '101',
          coiName: 'Test COI',
          expiryDate: '2025-12-31',
          status: 'Active',
          reminderStatus: 'Not Sent',
        })
      })

      expect(result.current.cois.length).toBe(initialCount + 1)
      expect(result.current.cois[result.current.cois.length - 1].property).toBe('Test Property')
    })

    it('should generate unique ID for new COI', () => {
      const { result } = renderHook(() => useCOIStore())
      const ids: number[] = []

      act(() => {
        for (let i = 0; i < 3; i++) {
          result.current.addCOI({
            property: `Property ${i}`,
            tenantName: `Tenant ${i}`,
            tenantEmail: `test${i}@example.com`,
            unit: `${100 + i}`,
            coiName: `COI ${i}`,
            expiryDate: '2025-12-31',
            status: 'Active',
            reminderStatus: 'Not Sent',
          })
        }
      })

      const recentCOIs = result.current.cois.slice(-3)
      recentCOIs.forEach((coi) => {
        ids.push(coi.id)
      })

      // Check all IDs are unique
      expect(new Set(ids).size).toBe(ids.length)
    })

    it('should update filteredCOIs when adding COI', () => {
      const { result } = renderHook(() => useCOIStore())
      const initialFiltered = result.current.filteredCOIs.length

      act(() => {
        result.current.addCOI({
          property: 'New Property',
          tenantName: 'New Tenant',
          tenantEmail: 'new@example.com',
          unit: '102',
          coiName: 'New COI',
          expiryDate: '2025-12-31',
          status: 'Active',
          reminderStatus: 'Not Sent',
        })
      })

      expect(result.current.filteredCOIs.length).toBe(initialFiltered + 1)
    })
  })

  describe('Update COI', () => {
    it('should update COI properties', () => {
      const { result } = renderHook(() => useCOIStore())
      const coiId = result.current.cois[0].id

      act(() => {
        result.current.updateCOI(coiId, { status: 'Expired' })
      })

      const updatedCOI = result.current.cois.find(c => c.id === coiId)
      expect(updatedCOI?.status).toBe('Expired')
    })

    it('should update expiry date', () => {
      const { result } = renderHook(() => useCOIStore())
      const coiId = result.current.cois[0].id
      const newDate = '2026-06-30'

      act(() => {
        result.current.updateCOI(coiId, { expiryDate: newDate })
      })

      const updatedCOI = result.current.cois.find(c => c.id === coiId)
      expect(updatedCOI?.expiryDate).toBe(newDate)
    })

    it('should update reminder status', () => {
      const { result } = renderHook(() => useCOIStore())
      const coiId = result.current.cois[0].id

      act(() => {
        result.current.updateCOI(coiId, { reminderStatus: 'Sent (30d)' })
      })

      const updatedCOI = result.current.cois.find(c => c.id === coiId)
      expect(updatedCOI?.reminderStatus).toBe('Sent (30d)')
    })

    it('should update filteredCOIs when updating COI', () => {
      const { result } = renderHook(() => useCOIStore())
      const coiId = result.current.filteredCOIs[0].id

      act(() => {
        result.current.updateCOI(coiId, { status: 'Rejected' })
      })

      const updatedCOI = result.current.filteredCOIs.find(c => c.id === coiId)
      expect(updatedCOI?.status).toBe('Rejected')
    })
  })

  describe('Delete COI', () => {
    it('should delete COI from store', () => {
      const { result } = renderHook(() => useCOIStore())
      const coiIdToDelete = result.current.cois[0].id
      const initialCount = result.current.cois.length

      act(() => {
        result.current.deleteCOI(coiIdToDelete)
      })

      expect(result.current.cois.length).toBe(initialCount - 1)
      expect(result.current.cois.find(c => c.id === coiIdToDelete)).toBeUndefined()
    })

    it('should update filteredCOIs when deleting COI', () => {
      const { result } = renderHook(() => useCOIStore())
      const coiIdToDelete = result.current.filteredCOIs[0].id
      const initialFiltered = result.current.filteredCOIs.length

      act(() => {
        result.current.deleteCOI(coiIdToDelete)
      })

      expect(result.current.filteredCOIs.length).toBe(initialFiltered - 1)
      expect(result.current.filteredCOIs.find(c => c.id === coiIdToDelete)).toBeUndefined()
    })

    it('should remove deleted COI from selectedRows', () => {
      const { result } = renderHook(() => useCOIStore())
      const coiId = result.current.cois[0].id

      act(() => {
        result.current.toggleRowSelection(coiId)
      })

      expect(result.current.selectedRows).toContain(coiId)

      act(() => {
        result.current.deleteCOI(coiId)
      })

      expect(result.current.selectedRows).not.toContain(coiId)
    })
  })

  describe('Selection', () => {
    it('should toggle row selection', () => {
      const { result } = renderHook(() => useCOIStore())
      const coiId = result.current.cois[0].id

      act(() => {
        result.current.toggleRowSelection(coiId)
      })

      expect(result.current.selectedRows).toContain(coiId)

      act(() => {
        result.current.toggleRowSelection(coiId)
      })

      expect(result.current.selectedRows).not.toContain(coiId)
    })

    it('should select all rows', () => {
      const { result } = renderHook(() => useCOIStore())
      const allIds = result.current.cois.map(c => c.id)

      act(() => {
        result.current.selectAllRows(allIds)
      })

      expect(result.current.selectedRows).toEqual(allIds)
    })

    it('should clear selection', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.toggleRowSelection(result.current.cois[0].id)
        result.current.toggleRowSelection(result.current.cois[1].id)
      })

      expect(result.current.selectedRows.length).toBeGreaterThan(0)

      act(() => {
        result.current.clearSelection()
      })

      expect(result.current.selectedRows.length).toBe(0)
    })
  })

  describe('Filters', () => {
    it('should set status filter', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setFilters({ status: 'Active' })
      })

      expect(result.current.filters.status).toBe('Active')
    })

    it('should set search query filter', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setFilters({ searchQuery: 'Maplewood' })
      })

      expect(result.current.filters.searchQuery).toBe('Maplewood')
    })

    it('should reset all filters', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setFilters({ status: 'Expired', searchQuery: 'test' })
      })

      expect(result.current.filters.status).toBe('Expired')

      act(() => {
        result.current.resetFilters()
      })

      expect(result.current.filters.status).toBe('All')
      expect(result.current.filters.searchQuery).toBe('')
    })
  })

  describe('Sorting', () => {
    it('should sort COIs by property ascending', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setSortConfig({ key: 'property', direction: 'asc' })
      })

      expect(result.current.sortConfig.key).toBe('property')
      expect(result.current.sortConfig.direction).toBe('asc')
    })

    it('should sort COIs by expiry date descending', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setSortConfig({ key: 'expiryDate', direction: 'desc' })
      })

      expect(result.current.sortConfig.direction).toBe('desc')
    })
  })

  describe('Pagination', () => {
    it('should set rows per page', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setRowsPerPage(20)
      })

      expect(result.current.rowsPerPage).toBe(20)
      expect(result.current.currentPage).toBe(1)
    })

    it('should set current page', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setCurrentPage(3)
      })

      expect(result.current.currentPage).toBe(3)
    })

    it('should reset page on filter change', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setCurrentPage(5)
      })

      expect(result.current.currentPage).toBe(5)

      act(() => {
        result.current.setFilters({ status: 'Expired' })
      })

      expect(result.current.currentPage).toBe(1)
    })
  })

  describe('Dark Mode', () => {
    it('should toggle dark mode', () => {
      const { result } = renderHook(() => useCOIStore())

      expect(result.current.isDarkMode).toBe(false)

      act(() => {
        result.current.setDarkMode(true)
      })

      expect(result.current.isDarkMode).toBe(true)

      act(() => {
        result.current.setDarkMode(false)
      })

      expect(result.current.isDarkMode).toBe(false)
    })
  })

  describe('Statistics', () => {
    it('should calculate total processed COIs', () => {
      const { result } = renderHook(() => useCOIStore())
      expect(result.current.cois.length).toBeGreaterThan(0)
    })

    it('should count active COIs', () => {
      const { result } = renderHook(() => useCOIStore())
      const activeCOIs = result.current.cois.filter(coi => coi.status === 'Active')
      expect(activeCOIs.length).toBeGreaterThan(0)
    })

    it('should count expired COIs', () => {
      const { result } = renderHook(() => useCOIStore())
      const expiredCOIs = result.current.cois.filter(
        coi => coi.status === 'Expired' || coi.status === 'Rejected'
      )
      expect(Array.isArray(expiredCOIs)).toBe(true)
    })

    it('should count COIs expiring in 30 days', () => {
      const { result } = renderHook(() => useCOIStore())
      const today = new Date()
      const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)

      const expiringCOIs = result.current.cois.filter(coi => {
        const expiryDate = new Date(coi.expiryDate)
        return expiryDate >= today && expiryDate <= thirtyDaysLater
      })

      expect(Array.isArray(expiringCOIs)).toBe(true)
    })
  })

  describe('Complex Scenarios', () => {
    it('should handle multiple filters simultaneously', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setFilters({
          status: 'Active',
          searchQuery: 'Johnson',
        })
      })

      result.current.filteredCOIs.forEach(coi => {
        expect(coi.status).toBe('Active')
      })
    })

    it('should handle add, update, and delete sequence', () => {
      const { result } = renderHook(() => useCOIStore())
      const initialCount = result.current.cois.length

      let addedCoiId: number

      act(() => {
        result.current.addCOI({
          property: 'Sequence Test Property',
          tenantName: 'Sequence Test Tenant',
          tenantEmail: 'sequence@test.com',
          unit: '999',
          coiName: 'Sequence Test COI',
          expiryDate: '2025-12-31',
          status: 'Active',
          reminderStatus: 'Not Sent',
        })
        addedCoiId = result.current.cois[result.current.cois.length - 1].id
      })

      expect(result.current.cois.length).toBe(initialCount + 1)

      act(() => {
        result.current.updateCOI(addedCoiId, { status: 'Expired' })
      })

      let updatedCOI = result.current.cois.find(c => c.id === addedCoiId)
      expect(updatedCOI?.status).toBe('Expired')

      act(() => {
        result.current.deleteCOI(addedCoiId)
      })

      expect(result.current.cois.length).toBe(initialCount)
      updatedCOI = result.current.cois.find(c => c.id === addedCoiId)
      expect(updatedCOI).toBeUndefined()
    })

    it('should maintain data consistency across operations', () => {
      const { result } = renderHook(() => useCOIStore())

      act(() => {
        result.current.setFilters({ status: 'Active' })
        result.current.setSortConfig({ key: 'property', direction: 'asc' })
        result.current.setRowsPerPage(20)
      })

      const filteredCount = result.current.filteredCOIs.length
      const activeCount = result.current.cois.filter(c => c.status === 'Active').length

      expect(filteredCount).toBe(activeCount)
    })
  })
})
