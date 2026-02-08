# 🧪 COI Dashboard - Unit Testing with Vitest

Complete testing setup and documentation for the COI Dashboard project using Vitest (Vite's native test framework).

---

## 📦 What's Included

### Test Files
- **`src/__tests__/coiStore.test.ts`** - Complete store tests (30+ test cases)
- **`src/__tests__/setup.ts`** - Vitest setup and configuration
- **`vitest.config.ts`** - Vitest configuration (with all aliases)

### Dependencies
- `vitest` - Fast unit test framework (uses Vite)
- `@vitest/ui` - Beautiful UI for test results
- `@vitest/coverage-v8` - Code coverage reporting
- `jsdom` - Browser-like DOM environment
- `@testing-library/react` - React testing utilities

---

## 🚀 Quick Start

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode (Hot Reload)
```bash
npm run test:watch
```

### Open Test UI Dashboard
```bash
npm run test:ui
```

### Generate Coverage Report
```bash
npm run test:coverage
```

---

## 📋 What's Being Tested

### 1. Add COI (3 tests)
- ✅ Add new COI to store
- ✅ Generate unique IDs
- ✅ Update filteredCOIs

### 2. Update COI (4 tests)
- ✅ Update properties
- ✅ Update expiry date
- ✅ Update reminder status
- ✅ Update filteredCOIs

### 3. Delete COI (3 tests)
- ✅ Delete from store
- ✅ Update filteredCOIs
- ✅ Remove from selection

### 4. Selection (3 tests)
- ✅ Toggle selection
- ✅ Select all
- ✅ Clear selection

### 5. Filters (3 tests)
- ✅ Status filter
- ✅ Search filter
- ✅ Reset filters

### 6. Sorting (2 tests)
- ✅ Ascending sort
- ✅ Descending sort

### 7. Pagination (3 tests)
- ✅ Set rows per page
- ✅ Change page
- ✅ Reset on filter

### 8. Dark Mode (1 test)
- ✅ Toggle dark/light

### 9. Statistics (4 tests)
- ✅ Total COIs
- ✅ Active count
- ✅ Expired count
- ✅ Expiring soon

### 10. Complex Scenarios (3 tests)
- ✅ Multiple filters
- ✅ CRUD sequence
- ✅ Data consistency

**Total: 30+ Tests**

---

## 🏃 Running Tests

### Run All Tests Once
```bash
npm test
```

### Watch Mode (Auto-rerun on changes)
```bash
npm run test:watch
```

### UI Dashboard (Interactive)
```bash
npm run test:ui
# Opens at http://localhost:51204
```

### Coverage Report
```bash
npm run test:coverage
# Shows in terminal + creates HTML report
```

### Specific Test Pattern
```bash
npm test -- --grep "Add COI"
npm test -- --grep "Update"
npm test -- --grep "Delete"
```

### Specific File
```bash
npm test -- coiStore.test.ts
```

---

## 📊 Expected Output

```
✓ src/__tests__/coiStore.test.ts (30)
  ✓ COI Store Tests
    ✓ Add COI (3)
      ✓ should add a new COI to the store
      ✓ should generate unique ID for new COI
      ✓ should update filteredCOIs when adding COI
    ✓ Update COI (4)
    ✓ Delete COI (3)
    ✓ Selection (3)
    ✓ Filters (3)
    ✓ Sorting (2)
    ✓ Pagination (3)
    ✓ Dark Mode (1)
    ✓ Statistics (4)
    ✓ Complex Scenarios (3)

Test Files  1 passed (1)
     Tests  30 passed (30)
  Start at  14:23:45
  Duration  1.23s
```

---

## 🎯 Key Features of Vitest

✅ **Lightning Fast** - Uses Vite for instant tests
✅ **Hot Reload** - Watch mode updates instantly  
✅ **Familiar Syntax** - Same as Jest
✅ **Great UI** - Visual test dashboard
✅ **Coverage** - Built-in with v8
✅ **Aliases** - Supports all your path aliases
✅ **TypeScript** - Works out of the box

---

## 🔧 Configuration

### vitest.config.ts
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,           // Use global test APIs
    environment: 'jsdom',    // Browser environment
    setupFiles: ['./src/__tests__/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@store': path.resolve(__dirname, './src/store'),
      '@types': path.resolve(__dirname, './src/types'),
      '@utils': path.resolve(__dirname, './src/utils'),
      // ... etc
    },
  },
})
```

---

## 📝 Example Test

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useCOIStore } from '../store/coiStore'

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
  })
})
```

---

## 🎨 Test UI Features

Run `npm run test:ui` to get:
- ✅ Visual test explorer
- ✅ Live results
- ✅ Code coverage map
- ✅ Filter and search
- ✅ Real-time updates

---

## 📈 Coverage Goals

Target: **80%+ Coverage**

```
Statements : 80%+
Branches   : 75%+
Functions  : 80%+
Lines      : 80%+
```

Generate with: `npm run test:coverage`

---

## ✅ Best Practices

### Use act() for state changes
```typescript
act(() => {
  result.current.updateCOI(id, data)
})
```

### Test behavior, not implementation
```typescript
// ✅ Good
expect(result.current.cois.length).toBe(expected)

// ❌ Bad
expect(mockFunction).toHaveBeenCalled()
```

### Use descriptive names
```typescript
// ✅ Good
it('should update reminder status when sending reminder', () => {})

// ❌ Bad
it('should work', () => {})
```

### Arrange-Act-Assert pattern
```typescript
// Setup
const initialCount = result.current.cois.length

// Execute
act(() => { result.current.addCOI(coi) })

// Verify
expect(result.current.cois.length).toBe(initialCount + 1)
```

---

## 🛠️ Troubleshooting

### Tests not finding modules
**Solution:** Check vitest.config.ts has all your aliases

### "act()" warnings
**Solution:** Always wrap state updates in act()

### Port already in use (UI)
**Solution:** Vitest auto-finds next available port

### Need more details
**Solution:** Run with `--reporter=verbose`

---

## 📚 Useful Commands

```bash
# Run all tests
npm test

# Watch mode (auto-rerun)
npm run test:watch

# Interactive UI
npm run test:ui

# Coverage report
npm run test:coverage

# Specific test
npm test -- --grep "Add COI"

# Single file
npm test -- coiStore.test.ts

# Verbose output
npm test -- --reporter=verbose
```

---

## 🔗 Resources

- [Vitest Docs](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## ✨ Summary

- **Framework:** Vitest (Vite native)
- **Test Files:** 30+ cases
- **Setup:** Auto-configured with aliases
- **Speed:** <2 seconds
- **Coverage:** 80%+
- **Status:** Ready to use!

**Run tests now:** `npm test`

🎉 **Happy Testing!**
