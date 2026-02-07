# COI Dashboard - Complete Setup Guide

A production-ready Certificate of Insurance (COI) management dashboard built with React, TypeScript, and Tailwind CSS.

## 📋 Project Overview

The COI Dashboard is a comprehensive application for managing, filtering, and tracking certificates of insurance. It features a modern UI matching the provided design, with advanced filtering, pagination, sorting, dark mode, and data export capabilities.

### Key Features

- ✅ Complete COI management (Create, Read, Update, Delete)
- ✅ Advanced filtering by properties, status, and expiry dates
- ✅ Real-time search with debounce
- ✅ Sorting by multiple columns
- ✅ Pagination with customizable rows per page
- ✅ Dark/Light mode toggle
- ✅ CSV export functionality
- ✅ Responsive design
- ✅ Form validation
- ✅ Mock data with localStorage persistence
- ✅ Unit tests with Vitest
- ✅ TypeScript for type safety

---

## 📁 Project Structure

```
coi-dashboard/
├── public/
│   └── favicon.svg
├── src/
│   ├── __tests__/
│   │   └── utils.test.ts                # Unit tests
│   ├── components/
│   │   ├── Sidebar.tsx                  # Left navigation
│   │   ├── TopBar.tsx                   # Header with dark mode toggle
│   │   ├── StatisticsCard.tsx           # Statistics display cards
│   │   ├── FilterBar.tsx                # Search & filter controls
│   │   ├── COITable.tsx                 # Main data table with sorting
│   │   ├── Pagination.tsx               # Pagination controls
│   │   ├── AddEditCOIModal.tsx          # Form modal for add/edit
│   │   └── index.ts                     # Components barrel export
│   ├── hooks/
│   │   └── useDebounce.ts              # Debounce & pagination hooks
│   ├── pages/
│   │   └── Dashboard.tsx                # Main dashboard page
│   ├── store/
│   │   └── coiStore.ts                  # Zustand state management
│   ├── types/
│   │   └── coi.ts                       # TypeScript interfaces
│   ├── utils/
│   │   ├── index.ts                     # Utility functions
│   │   └── mockData.ts                  # Mock COI data
│   ├── App.tsx                          # App router & main layout
│   ├── main.tsx                         # React DOM render
│   └── index.css                        # Global styles with Tailwind
├── index.html                           # HTML entry point
├── package.json                         # Dependencies & scripts
├── tsconfig.json                        # TypeScript config
├── tsconfig.node.json                   # TypeScript Node config
├── vite.config.ts                       # Vite build config
├── vitest.config.ts                     # Vitest testing config
├── tailwind.config.js                   # Tailwind CSS config
├── postcss.config.js                    # PostCSS config
├── .eslintrc.cjs                        # ESLint config
├── .gitignore                           # Git ignore rules
└── README.md                            # This file
```

---

## 🏗️ Architecture Overview

### Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **UI Framework** | React 18 | Component-based UI |
| **Language** | TypeScript 5 | Type safety |
| **Styling** | Tailwind CSS 3 | Utility-first CSS |
| **State Management** | Zustand | Lightweight global state |
| **Routing** | React Router 6 | Client-side routing |
| **Build Tool** | Vite 5 | Fast bundling |
| **Testing** | Vitest + RTL | Unit testing |
| **Date Handling** | date-fns | Date manipulation |
| **Icons** | Lucide React | SVG icons |

### State Management Flow

```
User Interaction
       ↓
React Component
       ↓
Zustand Store (useCOIStore)
       ↓
Local State Update
       ↓
localStorage Persistence
       ↓
Component Re-render
```

### Component Hierarchy

```
App
└── Router
    └── Dashboard
        ├── Sidebar
        ├── TopBar (dark mode toggle)
        ├── StatisticsCards[] (4 cards)
        ├── FilterBar (search, filters, export)
        ├── COITable (sortable, selectable)
        ├── Pagination
        └── AddEditCOIModal (form)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or yarn/pnpm)

### Installation Steps

#### 1. Clone/Download Project
```bash
cd coi-dashboard
```

#### 2. Install Dependencies
```bash
npm install
```

This installs:
- React & React DOM
- React Router for navigation
- Zustand for state management
- Tailwind CSS for styling
- date-fns for date utilities
- Lucide React for icons
- Vitest & Testing Library for tests

#### 3. Start Development Server
```bash
npm run dev
```

The app opens at `http://localhost:5173`

#### 4. Build for Production
```bash
npm run build
```

Output: `dist/` folder (ready to deploy)

#### 5. Run Tests
```bash
npm test
```

Run with UI:
```bash
npm run test:ui
```

#### 6. Linting
```bash
npm run lint
```

---

## 📖 Feature Walkthrough

### 1. Dashboard Overview
- **Statistics Cards**: Display total COIs, accepted, rejected, and expiring counts
- **Filter Bar**: Multi-select properties, status, expiry filters, and search
- **Table**: Sortable columns, row selection, status dropdown
- **Pagination**: Navigate pages, set rows per page, jump to specific page

### 2. Add/Edit COI
Click "ADD COI" button to open modal:
- Property (dropdown with existing properties)
- Tenant Name & Email (with validation)
- Unit
- COI Name
- Expiry Date (date picker)
- Status (dropdown)

### 3. Search & Filter
- **Property Filter**: Multi-select dropdown
- **Status Filter**: Active, Expired, Rejected, Expiring Soon, Not Processed
- **Expiry Filter**: 30/60/90 days, or Expired
- **Search**: Real-time search (debounced 300ms) across property, tenant, unit, COI name
- **Export**: Download filtered data as CSV

### 4. Sorting
Click column headers to sort:
- Property, Tenant Name, Unit, Expiry Date, Status (sortable columns)
- Ascending/Descending toggle with visual indicators

### 5. Dark Mode
Toggle moon/sun icon in top-right to switch themes
- Saved to localStorage
- Applies to entire application

### 6. Responsive Design
- Desktop: Full table with all columns
- Tablet: Horizontal scroll
- Mobile: Sidebar collapses (can be enhanced)

---

## 🔧 Configuration Guide

### Tailwind Colors
Edit `tailwind.config.js` to customize:
```javascript
colors: {
  primary: { /* Blue shades */ },
  status: {
    active: '#3b82f6',      // Blue
    expired: '#ef4444',     // Red
    rejected: '#ef4444',    // Red
    expiring: '#f97316',    // Orange
    notProcessed: '#93c5fd' // Light Blue
  }
}
```

### Mock Data
Modify `src/utils/mockData.ts`:
- Add more COI records
- Change default status values
- Update property names

### Store Configuration
Edit `src/store/coiStore.ts`:
- Initial filter values
- Default rows per page
- LocalStorage keys

---

## 📊 State Management (Zustand)

### Store Structure
```typescript
interface COIStore {
  // Data
  cois: COI[]
  filteredCOIs: COI[]
  selectedRows: number[]
  
  // Settings
  filters: FilterOptions
  dateRangeFilter: DateRangeFilter
  sortConfig: SortConfig
  isDarkMode: boolean
  rowsPerPage: number
  currentPage: number
  
  // Actions
  addCOI(coi): void
  updateCOI(id, updates): void
  deleteCOI(id): void
  setFilters(filters): void
  // ... more actions
}
```

### Using the Store
```typescript
import { useCOIStore } from '@store/coiStore'

function MyComponent() {
  const { cois, addCOI, filters, setFilters } = useCOIStore()
  
  // Component logic
}
```

### localStorage Persistence
Automatically saves:
- COI list
- Dark mode preference

On app load, data is restored.

---

## 🧪 Testing

### Run Tests
```bash
npm test
```

### Test Coverage
- Utility functions (formatDate, validateEmail, etc.)
- Store actions
- Component rendering

### Adding Tests
Create files in `src/__tests__/`:
```typescript
import { describe, it, expect } from 'vitest'

describe('MyFeature', () => {
  it('should do something', () => {
    expect(result).toBe(expected)
  })
})
```

---

## 🎯 Usage Examples

### Filter COIs
```typescript
// Filter by property
setFilters({ properties: ['Maplewood Shopping Center'] })

// Filter by status
setFilters({ status: 'Active' })

// Search
setFilters({ searchQuery: 'johnson' })
```

### Edit COI
```typescript
// Click table row action menu → Edit
// Update form fields
// Click "Update COI"
```

### Export Data
```typescript
// Click Download icon
// CSV file downloads with filtered data
```

### Dark Mode Toggle
```typescript
// Click moon/sun icon in top-right
// Theme switches, preference saved
```

---

## 🔒 Data Validation

### Form Validation
- **Property**: Required
- **Tenant Name**: Required
- **Tenant Email**: Required + email format
- **Unit**: Required
- **COI Name**: Required
- **Expiry Date**: Required

### Error Display
Validation errors appear below each field in red.

---

## 📱 Responsive Breakpoints

```css
sm: 640px    /* Small devices */
md: 768px    /* Tablets */
lg: 1024px   /* Desktops */
xl: 1280px   /* Large screens */
2xl: 1536px  /* Extra large screens */
```

---

## 🚨 Troubleshooting

### Issue: Data not persisting
**Solution**: Check browser localStorage is enabled
```javascript
localStorage.setItem('test', 'value')
```

### Issue: Styles not applying
**Solution**: Ensure Tailwind CSS is built
```bash
npm run dev  # Rebuilds CSS
```

### Issue: Dark mode not working
**Solution**: Clear localStorage and refresh
```javascript
localStorage.clear()
```

### Issue: Search not debouncing
**Solution**: Check useDebounce hook is properly imported
```typescript
import { useDebounce } from '@hooks/useDebounce'
```

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## 📦 Build & Deployment

### Build for Production
```bash
npm run build
```

Output: `dist/` folder

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

### Deploy to Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=dist
```

### Deploy to GitHub Pages
Add to `package.json`:
```json
"homepage": "https://username.github.io/coi-dashboard"
```

---

## 🔐 Environment Variables

Create `.env.local`:
```
VITE_API_URL=https://api.example.com
VITE_APP_NAME=COI Dashboard
```

Access in components:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
```

---

## 📝 Git Workflow

```bash
# Initialize git
git init

# Add all files
git add .

# Create first commit
git commit -m "Initial commit: COI Dashboard setup"

# Add remote
git remote add origin <your-repo-url>

# Push
git push -u origin main
```

---

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/amazing-feature`
2. Make changes and test: `npm test`
3. Commit: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

---

## 🆘 Getting Help

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Port 5173 already in use | Change port: `npm run dev -- --port 3000` |
| Module not found | Run `npm install` and restart dev server |
| CSS not loading | Clear `node_modules`: `rm -rf node_modules && npm install` |
| Dark mode stuck | Clear localStorage: `localStorage.clear()` |

### Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Zustand Docs](https://zustand-demo.vercel.app)
- [Vite Docs](https://vitejs.dev)

---

## 📞 Support

For issues or questions:
1. Check this README
2. Review project comments in code
3. Check browser console for errors
4. Verify all dependencies are installed

---

## 🎉 Next Steps

1. ✅ Install dependencies: `npm install`
2. ✅ Start dev server: `npm run dev`
3. ✅ Explore the dashboard
4. ✅ Customize mock data
5. ✅ Add your own features
6. ✅ Deploy to production

Happy coding! 🚀
