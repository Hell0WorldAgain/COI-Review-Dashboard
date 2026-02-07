import { describe, it, expect } from 'vitest'
import { formatDate, validateEmail, getTotalStats, truncateText } from '@utils/index'
import { MOCK_COIS } from '@utils/mockData'

describe('Utility Functions', () => {
  describe('formatDate', () => {
    it('should format ISO date correctly', () => {
      const result = formatDate('2026-11-17')
      expect(result).toMatch(/Nov 17, 2026/)
    })

    it('should handle invalid dates gracefully', () => {
      const result = formatDate('invalid-date')
      expect(result).toBe('invalid-date')
    })
  })

  describe('validateEmail', () => {
    it('should validate correct email', () => {
      expect(validateEmail('test@example.com')).toBe(true)
    })

    it('should reject invalid email', () => {
      expect(validateEmail('invalid-email')).toBe(false)
    })

    it('should reject email without domain', () => {
      expect(validateEmail('test@')).toBe(false)
    })
  })

  describe('getTotalStats', () => {
    it('should calculate stats correctly', () => {
      const stats = getTotalStats(MOCK_COIS)
      expect(stats.total).toBe(MOCK_COIS.length)
      expect(stats.accepted).toBeGreaterThan(0)
      expect(stats.rejected).toBeGreaterThan(0)
    })
  })

  describe('truncateText', () => {
    it('should truncate text longer than max length', () => {
      const result = truncateText('This is a long text', 10)
      expect(result).toBe('This is...')
    })

    it('should not truncate text shorter than max length', () => {
      const result = truncateText('Short', 10)
      expect(result).toBe('Short')
    })
  })
})
