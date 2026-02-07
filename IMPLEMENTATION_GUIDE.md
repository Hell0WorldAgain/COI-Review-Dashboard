# COI Dashboard - Step-by-Step Implementation Guide

## 📋 Table of Contents
1. [Project Setup (5 minutes)](#project-setup)
2. [Understanding the Structure (10 minutes)](#understanding-structure)
3. [Running the Application (5 minutes)](#running-application)
4. [Feature Walkthrough (20 minutes)](#feature-walkthrough)
5. [Customization Guide (15 minutes)](#customization)
6. [Common Tasks (10 minutes)](#common-tasks)
7. [Troubleshooting](#troubleshooting)

---

## Project Setup

### Step 1: Download Project
```bash
# Navigate to your desired directory
cd ~/projects

# The project folder is: coi-dashboard/
```

### Step 2: Install Node.js (if not installed)
```bash
# Check if Node.js is installed
node --version  # Should be v18.0.0 or higher

# If not installed, download from: https://nodejs.org/
```

### Step 3: Install Dependencies
```bash
cd coi-dashboard
npm install
```

This installs ~200 packages:
- React & React DOM (core UI)
- React Router (navigation)
- Zustand (state management)
- Tailwind CSS (styling)
- date-fns (date utilities)
- Lucide React (icons)
- Vitest (testing)

**Expected time: 2-3 minutes** ⏱️

### Step 4: Verify Installation
```bash
# Check if npm packages are installed
ls node_modules | head -10

# Should see: react, react-dom, zustand, tailwindcss, etc.
```

---

## Understanding the Structure

### Project Organization

```
coi-dashboard/
├── Configuration Files
│   ├── package.json           ← Dependencies & scripts
│   ├── tsconfig.json          ← TypeScript settings
│   ├── vite.config.ts         ← Build configuration
│   ├── tailwind.config.js     ← Style settings
│   └── postcss.config.js      ← CSS processing
│
├── Source Code
│   ├── src/
│   │   ├── components/        ← React components
│   │   ├── pages/             ← Page components
│   │   ├── store/             ← State management
│   │   ├── types/             ← TypeScript types
│   │   ├── utils/             ← Helper functions
│   │   ├── hooks/             ← Custom React hooks
│   │   ├── App.tsx            ← Main app component
│   │   ├── main.tsx           ← Entry point
│   │   └── index.css          ← Global styles
│   └── index.html             ← HTML template
│
└── Documentation
    ├── README.md              ← Quick start guide
    ├── ARCHITECTURE.md        ← System design
    └── IMPLEMENTATION_GUIDE.md ← This file
```

### Key Files Explained

#### Configuration Files

**package.json**
- Lists all dependencies
- Defines npm scripts (dev, build, test, etc.)
- Project metadata

**vite.config.ts**
- Build tool settings
- Dev server configuration
- Path aliases (@ = src/)

**tailwind.config.js**
- Color schemes
- Breakpoints
- Custom styles

#### Source Code Structure

**Components/**
```
Sidebar.tsx       - Navigation sidebar
TopBar.tsx        - Header with dark mode
StatisticsCard.tsx - KPI cards
FilterBar.tsx     - Search & filter controls
COITable.tsx      - Main data table
Pagination.tsx    - Page navigation
AddEditCOIModal.tsx - Add/edit form
index.ts          - Export all components
```

**Store/**
```
coiStore.ts       - Zustand state store
                    ├─ State: cois, filters, etc.
                    └─ Actions: addCOI, updateCOI, etc.
```

**Utils/**
```
index.ts          - Helper functions
                    ├─ formatDate()
                    ├─ getStatusColor()
                    ├─ exportToCSV()
                    └─ ... more utilities
mockData.ts       - Sample COI data
```

**Types/**
```
coi.ts            - TypeScript interfaces
                    ├─ COI
                    ├─ FilterOptions
                    ├─ SortConfig
                    └─ ReminderStatus
```

---

## Running the Application

### Step 1: Start Development Server
```bash
npm run dev
```

**Output:**
```
✓ built in 2.5s

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Step 2: Open in Browser
- Automatically opens http://localhost:5173
- If not, manually navigate there

### Step 3: You Should See

```
┌─────────────────────────────────────┐
│  COI Review Dashboard               │
│                                     │
│  ├─ Sidebar (left)                 │
│  ├─ Top Bar (dark mode toggle)     │
│  ├─ 4 Statistics Cards              │
│  ├─ Filter Bar (search, filters)    │
│  ├─ Data Table (COIs)               │
│  └─ Pagination (bottom)             │
└─────────────────────────────────────┘
```

### Step 4: Test Features

1. **Search**: Type in search box → Results filter instantly
2. **Filter**: Select status dropdown → Table updates
3. **Sort**: Click column headers → Arrow indicates sort order
4. **Add COI**: Click "ADD COI" button → Form modal opens
5. **Dark Mode**: Click moon icon → Theme changes
6. **Export**: Click download icon → CSV file downloads
7. **Pagination**: Change rows per page → Table updates

### Step 5: Stop Development Server
```bash
Ctrl + C  (Windows/Linux)
Cmd + C   (Mac)
```

---

## Feature Walkthrough

### 1. Dashboard Overview

**Statistics Cards (Top)**
```
Total COI Processed: 12
Accepted: 8
Rejected: 2
Expiring in 30 days: 1
```

- Click card → No action (visual only)
- Numbers auto-update when adding/deleting COIs

**Key Code Location:** `src/pages/Dashboard.tsx`

### 2. Filter Bar

**Components:**
- **All Properties**: Multi-select dropdown
  - Uncheck to remove property filter
  - Select multiple properties
  - Shows count of selected

- **Status**: Single select dropdown
  - All, Active, Expired, Rejected, Expiring Soon, Not Processed

- **Filter by Expiry**: Expiry-specific filter
  - All, Expiring in 30 days, 60 days, 90 days, Expired

- **Search Box**: Real-time search
  - Searches: Property, Tenant Name, Unit, COI Name
  - Debounced 300ms (prevents lag)

- **Download Button**: Export to CSV
  - Downloads all filtered data
  - Filename: `COI_Export_YYYY-MM-DD.csv`

- **Settings Button**: Reserved for future use

- **ADD COI Button**: Opens form modal

**Key Code Location:** `src/components/FilterBar.tsx`

### 3. COI Table

**Columns:**
```
[Checkbox] Property  Tenant  Unit  COI Name  Expiry  Status  Reminder  Action
```

**Features:**

- **Checkbox**: 
  - Select individual rows
  - Check "All" to select all on current page
  - Count shown in console (can add badge)

- **Sortable Columns** (click header):
  - Property ↑↓
  - Tenant Name ↑↓
  - Unit ↑↓
  - Expiry Date ↑↓
  - Status ↑↓
  - Sort indicator shows active sort

- **Status Dropdown**:
  - Change status directly in table
  - Options: Active, Expired, Rejected, Expiring Soon, Not Processed
  - Color-coded (blue, red, orange, etc.)

- **Action Menu** (three dots):
  - Edit: Opens form with COI data pre-filled
  - Delete: Shows confirmation, then removes

**Key Code Location:** `src/components/COITable.tsx`

### 4. Add/Edit Modal

**Trigger:**
- Click "ADD COI" button → Add mode
- Click "Edit" in action menu → Edit mode

**Form Fields:**
```
Property *        (text input with autocomplete)
Tenant Name *     (text input)
Tenant Email *    (email input)
Unit *            (text input)
COI Name *        (text input)
Expiry Date *     (date picker)
Status            (dropdown)
```

**Validation:**
- Required fields marked with *
- Email format validated
- Errors shown in red below field
- Submit disabled if invalid

**Key Code Location:** `src/components/AddEditCOIModal.tsx`

### 5. Pagination

**Components:**
- **Rows per page**: 10, 20, 50, 100
- **Page info**: "5-14 of 52" (showing items)
- **Current page**: "Page 1 of 52"
- **Go to page**: Input box, press Enter
- **Navigation**: Previous/Next buttons

**Example:**
```
10 rows/page × 5 pages = 50 items shown
- Page 1: Items 1-10
- Page 2: Items 11-20
- Page 5: Items 41-50
```

**Key Code Location:** `src/components/Pagination.tsx`

### 6. Dark Mode

**Toggle:** Moon/Sun icon (top-right corner)

**What Changes:**
- Background: White → Dark gray
- Text: Black → White
- Cards: Light → Dark
- Borders: Light gray → Dark gray
- All components affected

**Persistence:**
- Saved to localStorage
- Restored on page reload
- Preference remembered

**Key Code Location:** `src/components/TopBar.tsx`, `src/store/coiStore.ts`

---

## Customization Guide

### 1. Change Colors

**File:** `tailwind.config.js`

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#0ea5e9',    // Change blue
        600: '#0284c7',
      },
      status: {
        active: '#3b82f6',      // Change active color
        expired: '#ef4444',     // Change expired color
        expiring: '#f97316',    // Change expiring color
      }
    }
  }
}
```

**Component Colors:** `src/utils/index.ts` → `getStatusColor()`

```typescript
case 'Active': return 'bg-blue-100 text-blue-800'
case 'Expired': return 'bg-red-100 text-red-800'
// Change these classes
```

### 2. Add More Mock Data

**File:** `src/utils/mockData.ts`

```typescript
export const MOCK_COIS: COI[] = [
  {
    id: 1,
    property: 'New Property Name',
    tenantName: 'New Tenant',
    tenantEmail: 'email@example.com',
    unit: '501',
    coiName: 'COI_Name_2026',
    expiryDate: '2026-12-31',
    status: 'Active',
    reminderStatus: 'Not Sent',
    createdAt: '2025-02-07T10:00:00Z',
  },
  // Add more entries...
]
```

### 3. Change Default Rows Per Page

**File:** `src/store/coiStore.ts`

```typescript
rowsPerPage: 10,  // Change to 20, 50, etc.
```

### 4. Change Debounce Delay

**File:** `src/components/FilterBar.tsx`

```typescript
const debouncedSearch = useDebounce(searchInput, 300)  // 300ms delay
// Change to 500, 1000, etc.
```

### 5. Add New Filter

**Steps:**

1. Update type in `src/types/coi.ts`:
```typescript
interface FilterOptions {
  // ... existing filters ...
  myNewFilter: string  // Add this
}
```

2. Add to store in `src/store/coiStore.ts`:
```typescript
filters: {
  // ... existing ...
  myNewFilter: '',  // Initialize
}
```

3. Add to getFilteredCOIs function:
```typescript
if (filters.myNewFilter !== '') {
  result = result.filter(coi => 
    coi.someField === filters.myNewFilter
  )
}
```

4. Add UI in `src/components/FilterBar.tsx`:
```typescript
<select
  value={filters.myNewFilter}
  onChange={(e) => setFilters({ myNewFilter: e.target.value })}
>
  <option value="">All</option>
  <option value="option1">Option 1</option>
</select>
```

---

## Common Tasks

### Task 1: Add a New Column to Table

1. Open `src/types/coi.ts`, add field to COI interface:
```typescript
interface COI {
  // ... existing fields ...
  newField: string
}
```

2. Update mock data `src/utils/mockData.ts`:
```typescript
{
  // ... existing fields ...
  newField: 'value'
}
```

3. Update table `src/components/COITable.tsx`, add column:
```typescript
const columns = [
  // ... existing columns ...
  { key: 'newField', label: 'New Field', sortable: true, width: 'w-32' }
]
```

### Task 2: Change Statistics Cards

**File:** `src/pages/Dashboard.tsx`

```typescript
<StatisticsCard
  icon={<YourIcon />}          // Change icon
  title="New Title"             // Change title
  value={newValue}              // Change value calculation
  color="blue"                  // Change color
/>
```

### Task 3: Send Bulk Reminder (Setup)

**File:** `src/components/TopBar.tsx`

```typescript
<button onClick={handleSendReminder}>
  Send Bulk Reminder
</button>
```

Then implement handler:
```typescript
const handleSendReminder = () => {
  const selectedIds = useCOIStore(s => s.selectedRows)
  // TODO: Send reminder API call
  console.log('Send reminder to:', selectedIds)
}
```

### Task 4: Connect to Backend API

**Create:** `src/api/coiApi.ts`

```typescript
const API_URL = process.env.VITE_API_URL || 'http://localhost:3000'

export const coiApi = {
  async getCOIs() {
    const res = await fetch(`${API_URL}/api/cois`)
    return res.json()
  },
  
  async addCOI(coi: Omit<COI, 'id' | 'createdAt'>) {
    const res = await fetch(`${API_URL}/api/cois`, {
      method: 'POST',
      body: JSON.stringify(coi),
    })
    return res.json()
  },
  
  // ... more methods
}
```

Update store to use API:
```typescript
useEffect(() => {
  coiApi.getCOIs().then(data => {
    useCOIStore.setState({ cois: data })
  })
}, [])
```

### Task 5: Add Toast Notifications

1. Install toast library:
```bash
npm install react-hot-toast
```

2. Wrap app in provider:
```typescript
import { Toaster } from 'react-hot-toast'

<Toaster />
<App />
```

3. Use in components:
```typescript
import toast from 'react-hot-toast'

const handleDelete = (id) => {
  deleteCOI(id)
  toast.success('COI deleted')
}
```

---

## Troubleshooting

### Issue 1: Port 5173 Already in Use

**Solution:**
```bash
# Use different port
npm run dev -- --port 3000
```

### Issue 2: Styles Not Loading

**Solution:**
```bash
# Clear and reinstall
rm -rf node_modules
npm install
npm run dev
```

### Issue 3: Dark Mode Not Working

**Solution:**
```javascript
// Clear localStorage
localStorage.clear()

// Refresh browser
```

### Issue 4: Search Not Debouncing

**Cause:** useDebounce hook not imported

**Solution:**
```typescript
import { useDebounce } from '@hooks/useDebounce'
```

### Issue 5: Form Validation Not Showing

**Cause:** Error not displayed in JSX

**Solution:**
```typescript
{errors.email && (
  <p className="text-red-600 text-xs">{errors.email}</p>
)}
```

### Issue 6: Data Lost on Refresh

**Cause:** localStorage not saving

**Solution:**
Check browser localStorage:
```javascript
localStorage.getItem('coi-store')  // Should return JSON
```

If null, check store subscription:
```typescript
useCOIStore.subscribe(
  (state) => ({ cois: state.cois }),
  (newState) => {
    localStorage.setItem('coi-store', JSON.stringify(newState))
  }
)
```

### Issue 7: Build Fails

**Solution:**
```bash
# Check for TypeScript errors
npm run build

# Fix errors or ignore them temporarily
npm run build -- --mode production
```

### Issue 8: Tests Not Running

**Solution:**
```bash
npm install  # Reinstall dependencies
npm test     # Run tests
```

---

## Development Workflow

### Daily Development

```bash
# 1. Start dev server
npm run dev

# 2. Make changes
# 3. See live updates (hot reload)

# 4. Before commit, run tests
npm test

# 5. Check for linting errors
npm run lint
```

### Before Deployment

```bash
# 1. Run all tests
npm test

# 2. Check linting
npm run lint

# 3. Build for production
npm run build

# 4. Preview build
npm run preview

# 5. Test in preview
# Visit http://localhost:4173
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# Commit regularly
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create Pull Request
# Merge after review
```

---

## Performance Tips

### 1. Optimize Images
```typescript
// Use optimized SVG icons (Lucide React)
import { CheckCircle } from 'lucide-react'

<CheckCircle className="w-5 h-5" />
```

### 2. Avoid Inline Functions
```typescript
// ❌ Bad - creates new function each render
<button onClick={() => handleDelete(id)} />

// ✅ Good - use wrapper function
const onClick = () => handleDelete(id)
<button onClick={onClick} />
```

### 3. Use Computed Selectors
```typescript
// Store only what you need
const { cois, filters } = useCOIStore()

// Not everything
const allState = useCOIStore()
```

### 4. Lazy Load Routes
```typescript
const Dashboard = lazy(() => import('./pages/Dashboard'))

<Suspense fallback={<Loading />}>
  <Dashboard />
</Suspense>
```

---

## Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start dev server: `npm run dev`
3. ✅ Explore features in dashboard
4. ✅ Customize colors and text
5. ✅ Add more mock data
6. ✅ Connect to backend API
7. ✅ Deploy to production
8. ✅ Add additional features

---

## Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Guide](https://zustand-demo.vercel.app)
- [Vite Documentation](https://vitejs.dev)
- [date-fns Docs](https://date-fns.org)

---

**Happy coding! 🚀**

For more details, see README.md and ARCHITECTURE.md
