export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page py-6 text-sm text-slate-600">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} SmartAttend — An-Najah National University</div>
          <div className="flex flex-wrap gap-4">
            <span className="text-slate-500">Frontend prototype (no backend)</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

