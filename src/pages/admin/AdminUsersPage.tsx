import { useMemo, useState } from 'react'
import Badge, { RoleBadge } from '../../components/ui/Badge'
import Button from '../../components/ui/Button'
import Input, { Label, Select } from '../../components/ui/Input'
import Modal from '../../components/ui/Modal'
import Table from '../../components/ui/Table'
import { useAuth } from '../../state/AuthContext'
import { useToast } from '../../state/ToastContext'
import type { User, UserRole } from '../../types/models'

type Action =
  | { type: 'role'; user: User }
  | { type: 'toggle'; user: User }
  | { type: 'delete'; user: User }
  | null

export default function AdminUsersPage() {
  const { users, adminUpdateUserRole, adminToggleUserStatus, adminDeleteUser } = useAuth()
  const { pushToast } = useToast()
  const [q, setQ] = useState('')
  const [action, setAction] = useState<Action>(null)
  const [roleDraft, setRoleDraft] = useState<UserRole>('student')

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase()
    if (!query) return users
    return users.filter((u) => u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query) || u.role.includes(query))
  }, [q, users])

  const columns = [
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role' },
    { key: 'status', header: 'Status' },
    { key: 'actions', header: 'Actions', className: 'text-right' },
  ]

  const rows = filtered.map((u) => ({
    id: u.id,
    cells: {
      name: <div className="font-semibold">{u.name}</div>,
      email: <div className="text-slate-700">{u.email}</div>,
      role: <RoleBadge role={u.role} />,
      status: <Badge tone={u.status === 'active' ? 'success' : 'warning'}>{u.status === 'active' ? 'Active' : 'Disabled'}</Badge>,
      actions: (
        <div className="flex justify-end gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setRoleDraft(u.role)
              setAction({ type: 'role', user: u })
            }}
          >
            Edit role
          </Button>
          <Button size="sm" variant="secondary" onClick={() => setAction({ type: 'toggle', user: u })}>
            {u.status === 'active' ? 'Disable' : 'Enable'}
          </Button>
          <Button size="sm" variant="danger" onClick={() => setAction({ type: 'delete', user: u })}>
            Delete
          </Button>
        </div>
      ),
    },
  }))

  return (
    <div className="space-y-4">
      <div className="card p-6">
        <div className="text-xl font-semibold text-slate-900">Admin • User management</div>
        <div className="mt-1 text-sm text-slate-600">Search users, update roles, disable accounts, or delete users (mocked).</div>
        <div className="mt-5 grid gap-2 sm:max-w-md">
          <Label htmlFor="q">Search</Label>
          <Input id="q" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, email, role..." />
        </div>
      </div>

      <Table
        columns={columns}
        rows={rows}
        empty={<div className="text-center text-slate-600">No users match your search.</div>}
      />

      <Modal
        open={!!action}
        title={
          action?.type === 'role'
            ? 'Edit user role'
            : action?.type === 'toggle'
              ? action.user.status === 'active'
                ? 'Disable user'
                : 'Enable user'
              : 'Delete user'
        }
        description="This is a frontend-only confirmation modal (no backend)."
        onClose={() => setAction(null)}
      >
        {action?.type === 'role' ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{action.user.name}</div>
              <div className="mt-0.5 text-slate-600">{action.user.email}</div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="role">Role</Label>
              <Select id="role" value={roleDraft} onChange={(e) => setRoleDraft(e.target.value as UserRole)}>
                <option value="student">Student</option>
                <option value="organizer">Organizer</option>
                <option value="admin">Admin</option>
              </Select>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => {
                  adminUpdateUserRole(action.user.id, roleDraft)
                  pushToast({ title: 'Role updated', tone: 'success' })
                  setAction(null)
                }}
              >
                Save role
              </Button>
              <Button variant="secondary" onClick={() => setAction(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : action?.type === 'toggle' ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{action.user.name}</div>
              <div className="mt-0.5 text-slate-600">{action.user.email}</div>
            </div>
            <div className="text-sm text-slate-700">
              {action.user.status === 'active'
                ? 'Disabling a user prevents login and access to dashboards.'
                : 'Enabling a user restores access to the system.'}
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant={action.user.status === 'active' ? 'danger' : 'primary'}
                onClick={() => {
                  adminToggleUserStatus(action.user.id)
                  pushToast({ title: action.user.status === 'active' ? 'User disabled' : 'User enabled', tone: 'success' })
                  setAction(null)
                }}
              >
                {action.user.status === 'active' ? 'Disable user' : 'Enable user'}
              </Button>
              <Button variant="secondary" onClick={() => setAction(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : action?.type === 'delete' ? (
          <div className="space-y-4">
            <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
              <div className="font-semibold">Delete confirmation</div>
              <div className="mt-1 opacity-90">
                This action removes the user and their student registrations in local state.
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-surface-50 p-4 text-sm text-slate-700">
              <div className="font-semibold text-slate-900">{action.user.name}</div>
              <div className="mt-0.5 text-slate-600">{action.user.email}</div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="danger"
                onClick={() => {
                  adminDeleteUser(action.user.id)
                  pushToast({ title: 'User deleted', tone: 'success' })
                  setAction(null)
                }}
              >
                Delete user
              </Button>
              <Button variant="secondary" onClick={() => setAction(null)}>
                Cancel
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  )
}

