# COI Dashboard - Architecture & System Design

## Table of Contents
1. [System Architecture](#system-architecture)
2. [Component Architecture](#component-architecture)
3. [State Management](#state-management)
4. [Data Flow](#data-flow)
5. [API Contracts](#api-contracts)
6. [Performance Optimization](#performance-optimization)

---

## System Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser Environment                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐│
│  │                  React Application                      ││
│  │                                                          ││
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ││
│  │  │   Sidebar    │  │    TopBar    │  │   Pages      │  ││
│  │  │   (Router)   │  │  (Dark Mode) │  │  (Layout)    │  ││
│  │  └──────────────┘  └──────────────┘  └──────────────┘  ││
│  │         │                 │                 │            ││
│  │         └─────────────────┼─────────────────┘            ││
│  │                           │                              ││
│  │         ┌─────────────────▼─────────────────┐            ││
│  │         │   Zustand Store (useCOIStore)    │            ││
│  │         │  ├─ cois[]                        │            ││
│  │         │  ├─ filteredCOIs[]                │            ││
│  │         │  ├─ filters                       │            ││
│  │         │  ├─ sortConfig                    │            ││
│  │         │  ├─ isDarkMode                    │            ││
│  │         │  └─ actions (add, update, etc)    │            ││
│  │         └─────────────────┬─────────────────┘            ││
│  │                           │                              ││
│  │         ┌─────────────────▼─────────────────┐            ││
│  │         │     Local Storage (persist)       │            ││
│  │         │  ├─ coi-store (JSON)              │            ││
│  │         │  └─ theme preferences             │            ││
│  │         └───────────────────────────────────┘            ││
│  │                                                          ││
│  └──────────────────────────────────────────────────────────┘│
│                                                              │
│  Styling: Tailwind CSS                                      │
│  Date Utils: date-fns                                       │
│  Icons: Lucide React                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Technology Layers

```
Presentation Layer (React Components)
        ↓
State Management Layer (Zustand Store)
        ↓
Business Logic Layer (Utilities)
        ↓
Data Layer (Local Storage)
```

---

## Component Architecture

### Component Tree

```
App
├── Dashboard (Main Page)
│   ├── Sidebar
│   │   ├── Navigation Links
│   │   ├── Settings
│   │   └── Help
│   │
│   ├── TopBar
│   │   ├── Title Section
│   │   ├── Action Buttons (Send Reminder, Ask AI, Help)
│   │   ├── Dark Mode Toggle
│   │   ├── Notifications
│   │   └── User Menu
│   │
│   ├── Statistics Section
│   │   ├── StatisticsCard (Total Processed)
│   │   ├── StatisticsCard (Accepted)
│   │   ├── StatisticsCard (Rejected)
│   │   └── StatisticsCard (Expiring in 30 days)
│   │
│   ├── FilterBar
│   │   ├── Property Filter (Multi-select Dropdown)
│   │   ├── Status Dropdown
│   │   ├── Expiry Filter Dropdown
│   │   ├── Search Input (Debounced)
│   │   ├── Export Button
│   │   └── Add COI Button
│   │
│   ├── COITable
│   │   ├── Table Header (Sortable Columns)
│   │   ├── Checkbox Column (Select All)
│   │   ├── Data Rows
│   │   │   ├── Checkbox (Row Select)
│   │   │   ├── Property Column
│   │   │   ├── Tenant Name Column
│   │   │   ├── Unit Column
│   │   │   ├── COI Name Column
│   │   │   ├── Expiry Date Column
│   │   │   ├── Status Dropdown
│   │   │   ├── Reminder Status Column
│   │   │   └── Action Menu
│   │   │       ├── Edit
│   │   │       └── Delete
│   │   └── Empty State
│   │
│   ├── Pagination
│   │   ├── Rows Per Page Select
│   │   ├── Total Items Display
│   │   ├── Current Page Info
│   │   ├── Go to Page Input
│   │   └── Navigation Buttons
│   │
│   └── AddEditCOIModal
│       ├── Property Input
│       ├── Tenant Name Input
│       ├── Tenant Email Input
│       ├── Unit Input
│       ├── COI Name Input
│       ├── Expiry Date Picker
│       ├── Status Dropdown
│       ├── Form Validation
│       └── Submit/Cancel Buttons
```

### Component Responsibilities

| Component | Responsibility |
|-----------|-----------------|
| **Sidebar** | Navigation, routing, layout organization |
| **TopBar** | Header, dark mode toggle, user menu |
| **StatisticsCard** | Display KPI metrics |
| **FilterBar** | Search, filtering, export controls |
| **COITable** | Display data, sorting, selection, row actions |
| **Pagination** | Page navigation, rows per page |
| **AddEditCOIModal** | Form for adding/editing COIs |

---

## State Management

### Zustand Store Structure

```typescript
// Type Definitions
interface COI {
  id: number
  property: string
  tenantName: string
  tenantEmail: string
  unit: string
  coiName: string
  expiryDate: string
  status: COIStatus
  reminderStatus: ReminderStatus
  createdAt: string
}

interface FilterOptions {
  properties: string[]
  status: COIStatus | 'All'
  expiryFilter: string
  searchQuery: string
}

interface COIStore {
  // State
  cois: COI[]                          // All COIs
  filteredCOIs: COI[]                  // Filtered & sorted COIs
  selectedRows: number[]               // Selected row IDs
  filters: FilterOptions               // Active filters
  dateRangeFilter: DateRangeFilter    // Date range
  sortConfig: SortConfig               // Sort settings
  isDarkMode: boolean                  // Theme
  rowsPerPage: number                  // Pagination
  currentPage: number                  // Current page
  
  // Actions
  addCOI(coi): void
  updateCOI(id, updates): void
  deleteCOI(id): void
  setFilters(filters): void
  setDateRangeFilter(filter): void
  setSortConfig(config): void
  setSelectedRows(rows): void
  toggleRowSelection(id): void
  selectAllRows(ids): void
  clearSelection(): void
  setDarkMode(isDark): void
  setRowsPerPage(rows): void
  setCurrentPage(page): void
  applyFilters(): void
  resetFilters(): void
  loadFromLocalStorage(): void
}
```

### Store Initialization

```typescript
// Initial State
{
  cois: MOCK_COIS,
  filteredCOIs: MOCK_COIS,
  selectedRows: [],
  filters: {
    properties: [],
    status: 'All',
    expiryFilter: 'All',
    searchQuery: '',
  },
  dateRangeFilter: { startDate: null, endDate: null },
  sortConfig: { key: null, direction: 'asc' },
  isDarkMode: false,
  rowsPerPage: 10,
  currentPage: 1,
}
```

### State Updates Flow

```
User Action (click, type, select)
    ↓
Component Handler
    ↓
Call Store Action (setFilters, addCOI, etc)
    ↓
Zustand Store Updates State
    ↓
Compute Filtered/Sorted Data
    ↓
Update localStorage
    ↓
React Re-renders Components
```

---

## Data Flow

### Filter & Search Flow

```
Input Event (search, filter change)
    ↓
setFilters() called
    ↓
Debounce (300ms for search)
    ↓
getFilteredCOIs() function:
  ├─ Apply property filter
  ├─ Apply status filter
  ├─ Apply search query
  ├─ Apply expiry filter
  ├─ Apply date range
  └─ Apply sorting
    ↓
filteredCOIs updated
    ↓
Components re-render with new data
    ↓
Pagination recalculates
```

### Add/Edit Flow

```
User clicks "Add COI" or "Edit"
    ↓
Modal opens (AddEditCOIModal)
    ↓
User fills form & submits
    ↓
Form validation:
  ├─ Check required fields
  ├─ Validate email
  └─ Validate dates
    ↓
If valid:
  ├─ Call addCOI() or updateCOI()
  ├─ Store updates cois array
  ├─ Re-filter data
  ├─ Save to localStorage
  └─ Close modal
    ↓
If invalid:
  └─ Show error messages
```

### Delete Flow

```
User clicks "Delete" in action menu
    ↓
Confirm dialog shows
    ↓
User confirms
    ↓
deleteCOI(id) called
    ↓
Remove from cois array
    ↓
Re-filter data
    ↓
Save to localStorage
    ↓
Remove from selectedRows if present
    ↓
UI updates
```

---

## API Contracts

### Component Props

#### StatisticsCard
```typescript
interface StatisticsCardProps {
  icon: ReactNode
  title: string
  value: number
  color: 'blue' | 'green' | 'red' | 'orange'
}
```

#### COITable
```typescript
interface COITableProps {
  cois: COI[]
  onEdit: (coi: COI) => void
  onDelete: (id: number) => void
  onSelectRow: (id: number) => void
  onSelectAll: (ids: number[]) => void
  selectedRows: number[]
}
```

#### Pagination
```typescript
interface PaginationProps {
  currentPage: number
  totalPages: number
  rowsPerPage: number
  totalItems: number
  onPageChange: (page: number) => void
  onRowsPerPageChange: (rows: number) => void
}
```

#### AddEditCOIModal
```typescript
interface AddEditCOIModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Omit<COI, 'id' | 'createdAt'>) => void
  initialData?: COI
  properties: string[]
}
```

---

## Performance Optimization

### 1. Search Debouncing
```typescript
useDebounce(searchInput, 300)
// Delays search processing by 300ms to prevent excessive re-renders
```

### 2. Filtered Data Memoization
```typescript
const getFilteredCOIs = (cois, filters, dateRange, sortConfig) => {
  // Computed once per filter/sort change
  // Prevents recalculation on every render
}
```

### 3. Component-Level Optimization
- Functional components with React.memo for static components
- useCallback for event handlers (if needed in future)
- useMemo for expensive computations

### 4. Pagination
- Only render visible rows
- Reduces DOM elements
- Improves scroll performance

### 5. LocalStorage Persistence
- Saves state on updates
- Loads on app start
- Reduces server calls (mock data only)

### 6. CSS Optimization
- Tailwind purges unused styles in build
- Only relevant classes included in production
- ~50KB gzipped final CSS

---

## Error Handling

### Form Validation
```typescript
validateForm(): boolean {
  // Check required fields
  // Validate email format
  // Validate dates
  // Display inline errors
  // Prevent submission if invalid
}
```

### Try-Catch Blocks
```typescript
try {
  const saved = localStorage.getItem('coi-store')
  if (saved) JSON.parse(saved)
} catch (error) {
  console.error('Failed to load from localStorage:', error)
}
```

### User Feedback
- Validation error messages
- Confirmation dialogs for destructive actions
- Toast notifications (can be added)
- Loading states (can be added)

---

## Security Considerations

### 1. Input Validation
- Email format validation
- XSS prevention (React escapes by default)
- SQL injection not applicable (no backend)

### 2. LocalStorage Security
- Only stores non-sensitive mock data
- Can add encryption if needed

### 3. Type Safety
- TypeScript prevents type-related bugs
- Props validation via interfaces

### 4. Content Security
- No external API calls (mock data)
- No user authentication required
- No sensitive data handling

---

## Scalability

### Adding Backend
```typescript
// Current: Mock data
const MOCK_COIS = [...]

// Future: API calls
const fetchCOIs = async () => {
  const response = await fetch('/api/cois')
  return response.json()
}
```

### Multi-Page Support
```typescript
// Current: Single page dashboard
<Route path="/dashboard" element={<Dashboard />} />

// Future: Multiple pages
<Route path="/reports" element={<Reports />} />
<Route path="/settings" element={<Settings />} />
```

### User Management
```typescript
// Can add user context
const AuthContext = createContext(null)
const { user, login, logout } = useAuth()
```

---

## Testing Strategy

### Unit Tests
```typescript
// Utility functions
test('formatDate formats ISO dates correctly')
test('validateEmail validates email format')
test('getTotalStats calculates stats')
```

### Component Tests (Future)
```typescript
test('COITable renders rows correctly')
test('FilterBar applies filters on submit')
test('Pagination navigates to page')
```

### Integration Tests (Future)
```typescript
test('Add COI workflow')
test('Filter and export flow')
test('Dark mode persistence')
```

---

## File Size Analysis

| File | Size | Purpose |
|------|------|---------|
| React + ReactDOM | ~42KB | Core framework |
| Tailwind CSS | ~50KB | Styling |
| Zustand | ~2KB | State management |
| date-fns | ~20KB | Date utilities |
| Lucide Icons | ~5KB | Icons |
| App Code | ~30KB | Components & logic |
| **Total (gzipped)** | **~100KB** | Lightweight bundle |

---

## Future Enhancements

1. **Backend Integration**: Replace mock data with API
2. **Authentication**: User login/logout
3. **Real-time Updates**: WebSocket for live data
4. **Advanced Reports**: Charts, graphs, analytics
5. **Email Integration**: Send reminders
6. **File Upload**: Upload COI documents
7. **Audit Log**: Track all changes
8. **Multi-user**: Collaborative features
9. **Mobile App**: React Native version
10. **Accessibility**: WCAG compliance improvements

---

## Deployment Checklist

- [ ] Environment variables configured
- [ ] Build succeeds: `npm run build`
- [ ] Tests pass: `npm test`
- [ ] No console errors or warnings
- [ ] Linting passes: `npm run lint`
- [ ] Lighthouse score > 90
- [ ] Performance metrics acceptable
- [ ] Browser compatibility verified
- [ ] Responsive design tested
- [ ] Dark mode tested
- [ ] All features tested manually

---

End of Architecture Documentation
