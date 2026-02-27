# Admin Dashboard Template - Product Requirements Document

## Original Problem Statement
Create a high-fidelity, modern Admin Dashboard Template with "Neo-SaaS" Minimalist aesthetic (Light gray/slate background, white cards with subtle shadows, Indigo/Violet accent, Inter font).

## Core Requirements
- **Layout:** Fixed left sidebar, top navigation header, main content area
- **Dashboard Page:** KPI cards, Revenue line chart, Traffic donut chart, Recent Orders table
- **Account Settings & Forms Page:** Various form layouts, inputs, validation states
- **Tables Page:** Data table with search, filter, pagination, status badges
- **Authentication Page:** Split-screen design for Sign In, Sign Up, Forgot Password
- **Sidebar:** Expandable sub-menus support
- **Responsiveness:** Mobile-friendly design
- **UI Components Page:** Toast, Modal, Alert, Tabs (horizontal/vertical), Button styles
- **Invoice Pages:** Create invoice (with drag-and-drop items) and Invoice detail view
- **Static Export:** Convert to HTML/CSS/JS for Laravel Blade

## What's Been Implemented

### Completed Pages (Dec 2025)
1. **Dashboard Page** (`DashboardPage.jsx`)
   - KPI Cards with revenue, users, orders, bounce rate
   - Interactive charts using Recharts (Area & Donut)
   - Transactions table

2. **Account Settings Page** (`AccountSettingsPage.jsx`)
   - Complex form layouts
   - Input validation states (error/success)
   - Modern controls (toggles, radio buttons)

3. **Tables Page** (`TablesPage.jsx`)
   - Responsive data table
   - Filtering, search, pagination
   - Status badges

4. **Authentication Page** (`AuthenticationPage.jsx`)
   - Split-screen layout
   - Sign In, Sign Up, Forgot Password forms

5. **UI Components Page** (`ComponentsPage.jsx`)
   - Toast notifications (Sonner)
   - Modals/Dialogs (Shadcn)
   - Alerts (Success, Error, Warning, Info, Dismissible)
   - Horizontal Tabs
   - Vertical Tabs
   - Button variants and states

6. **Invoice Create Page** (`InvoiceFormPage.jsx`) - NEW
   - Client and Status dropdowns
   - Date fields (Issue date, Due date)
   - Drag-and-drop sortable items (@dnd-kit)
   - Add/Delete item functionality
   - Summary with Subtotal, Tax calculation, Total
   - Notes textarea

7. **Invoice Detail Page** (`InvoicePage.jsx`) - NEW
   - Breadcrumb navigation
   - Invoice ID with status badge
   - Client information display
   - Invoice metadata (dates)
   - Items table
   - Subtotal and Total
   - Action buttons (Preview, PDF, Edit)
   - Status dropdown

8. **Invoice Print Preview** (`InvoicePrintPage.jsx`) - NEW
   - A4 portrait paper size (210mm x 297mm)
   - Professional invoice layout
   - Company and client information
   - Itemized table with pricing
   - Subtotal, Tax (PPN), Total calculation
   - Print-optimized CSS
   - Footer with thank you message
   - Notes section for payment instructions

### Static HTML Export
- `/app/frontend/html-export/` contains converted static files
- Alpine.js for interactivity
- `README-LARAVEL.md` for Laravel integration guide

## Technical Stack
- **Frontend:** React, Tailwind CSS
- **UI Library:** Shadcn/UI
- **Charting:** Recharts
- **Drag-and-Drop:** @dnd-kit
- **Icons:** Lucide React
- **Toasts:** Sonner
- **Static Export:** Alpine.js

## Code Architecture
```
/app/frontend/src/
├── components/
│   ├── dashboard/ (Sidebar, Header, Charts, etc.)
│   ├── settings/ (ProfileCard, SecurityCard, etc.)
│   └── ui/ (Shadcn components)
├── pages/
│   ├── DashboardPage.jsx
│   ├── AccountSettingsPage.jsx
│   ├── TablesPage.jsx
│   ├── AuthenticationPage.jsx
│   ├── ComponentsPage.jsx
│   ├── InvoiceFormPage.jsx (NEW)
│   └── InvoicePage.jsx (NEW)
└── App.js (Routes)
```

## Routes
- `/` or `/dashboard` - Dashboard
- `/settings` - Account Settings
- `/tables` - Tables
- `/auth`, `/login`, `/signin` - Authentication
- `/components` - UI Components
- `/invoice/create` - Invoice Create Form
- `/invoice/:invoiceId` - Invoice Detail
- `/invoice/:invoiceId/print` - Invoice Print Preview (A4)

## Notes
- All data is MOCKED/static - no backend integration
- Invoice pages use hardcoded data for demonstration
- Preview and PDF buttons are functional UI but don't generate actual files

## Future/Backlog Tasks
1. Convert Invoice pages to static HTML for Laravel
2. Implement actual backend API integration
3. Add real PDF generation functionality
4. Break down static HTML into Blade components
5. Add dark mode support
