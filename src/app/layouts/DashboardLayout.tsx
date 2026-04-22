import { Outlet } from 'react-router-dom'
import AppNavbar from '../../components/layout/AppNavbar'
import Sidebar from '../../components/layout/Sidebar'
import MobileNav from '../../components/layout/MobileNav'

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-surface-50">
      <AppNavbar />
      <div className="mx-auto flex w-full max-w-7xl gap-4 px-3 pb-10 pt-4 sm:px-6 lg:px-8">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <MobileNav />
    </div>
  )
}

