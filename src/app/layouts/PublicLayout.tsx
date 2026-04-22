import { Outlet } from 'react-router-dom'
import Footer from '../../components/layout/Footer'
import PublicNavbar from '../../components/layout/PublicNavbar'

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white">
      <PublicNavbar />
      <main className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

