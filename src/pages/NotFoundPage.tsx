import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] bg-white">
      <div className="container-page py-16">
        <div className="card p-10 text-center">
          <div className="text-3xl font-semibold text-slate-900">Page not found</div>
          <div className="mt-2 text-sm text-slate-600">The page you’re looking for doesn’t exist in this prototype.</div>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/">
              <Button variant="secondary">Back to landing</Button>
            </Link>
            <Link to="/app">
              <Button>Go to app</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

