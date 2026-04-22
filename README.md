## SmartAttend (Frontend-Only)

A modern, clean, and responsive web application prototype for university event attendance management, built for **An-Najah National University**.

> This project is **frontend only** (no real backend/API).

---

## Project Overview

**SmartAttend** is an intelligent university event attendance platform where:

- Students can create accounts, browse events, register, and confirm attendance via QR check-in.
- Organizers can create/edit events and view attendance reports.
- Admins can manage users, statuses, and roles.

---

## Tech Stack and Libraries

### Core

- `react`: UI component architecture.
- `react-dom`: Browser rendering for React.
- `react-router-dom`: Routing and role-based protected navigation.

### Styling

- `tailwindcss`: Utility-first styling system for a clean and scalable design.
- `postcss` + `autoprefixer`: CSS processing and cross-browser support.

### Development and Build

- `vite`: Fast dev server and production build tool.
- `typescript`: Typed, maintainable, and scalable codebase.
- `@vitejs/plugin-react`: React integration for Vite.
- `@types/react`, `@types/react-dom`: TypeScript type definitions for React.

---

## Project Structure

```text
smartattend/
├─ src/
│  ├─ app/                       # Routing, layouts, and auth guards
│  │  ├─ App.tsx
│  │  ├─ RoleIndexRedirect.tsx
│  │  ├─ guards/RequireAuth.tsx
│  │  └─ layouts/
│  │     ├─ PublicLayout.tsx
│  │     └─ DashboardLayout.tsx
│  ├─ components/                # Reusable UI components
│  │  ├─ brand/Logo.tsx
│  │  ├─ charts/AttendanceChartPlaceholder.tsx
│  │  ├─ dashboard/SummaryCard.tsx
│  │  ├─ events/
│  │  │  ├─ EventCard.tsx
│  │  │  └─ EventForm.tsx
│  │  ├─ layout/
│  │  │  ├─ AppNavbar.tsx
│  │  │  ├─ PublicNavbar.tsx
│  │  │  ├─ Sidebar.tsx
│  │  │  ├─ MobileNav.tsx
│  │  │  └─ Footer.tsx
│  │  └─ ui/
│  │     ├─ Button.tsx
│  │     ├─ Input.tsx
│  │     ├─ Badge.tsx
│  │     ├─ Alert.tsx
│  │     ├─ Modal.tsx
│  │     ├─ Table.tsx
│  │     └─ EmptyState.tsx
│  ├─ pages/                     # Application pages grouped by role
│  │  ├─ LandingPage.tsx
│  │  ├─ AuthPage.tsx
│  │  ├─ NotFoundPage.tsx
│  │  ├─ student/
│  │  ├─ organizer/
│  │  └─ admin/
│  ├─ state/                     # Global state (mock auth, data, toast system)
│  │  ├─ AuthContext.tsx
│  │  └─ ToastContext.tsx
│  ├─ data/mock.ts               # Realistic dummy seed data
│  ├─ types/models.ts            # Shared typed models
│  ├─ utils/                     # Utility helpers (formatting, storage)
│  ├─ main.tsx
│  └─ style.css
├─ index.html
├─ tailwind.config.js
├─ postcss.config.js
├─ vite.config.ts
├─ tsconfig.json
└─ package.json
```

---

## Data Models Reflected in the UI

The frontend simulates these entities:

- `User`: `id, name, email, role, password, status`
- `Event`: `id, title, date, time, location, organizerId, description, capacity`
- `Registration`: links a student to an event
- `Attendance`: linked to registration and stores check-in status
- `Report`: event attendance summary

---

## Run Locally

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173/`).

### Build for Production

```bash
npm run build
```

---

## Demo Accounts

All demo users use the same password:

- **Password**: `Password123!`

Accounts:

- **Student**: `lina.qasem@najah.edu`
- **Organizer**: `ahmad.saleh@najah.edu`
- **Admin**: `admin@najah.edu`

---

## Important Notes

- This version has no real backend integration.
- Data is simulated and persisted in browser `localStorage`.
- Code structure is ready for future backend integration.

