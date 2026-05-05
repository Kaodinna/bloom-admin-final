'use client'
import { useRouter } from 'next/navigation'
import { useToast } from '@/lib/toast'
import { PageHeader, TableWrap, Th, Td, Avatar, Badge, Dropdown } from '@/components/ui'
import { clearToken } from '@/lib/api'

const ADMINS = [
  { initials: 'AU', color: '#C9973A', name: 'Super Admin',    email: 'admin@bloomapp.com',    role: 'Super Admin',       roleBadge: 'active' as const,    access: 'All modules + AI Engine + User Management', lastActive: 'Now' },
  { initials: 'CK', color: '#2D6B4A', name: 'Clara Klein',    email: 'clara.k@bloomapp.com',   role: 'Content Moderator', roleBadge: 'pregnant' as const,  access: 'Community · Posts · Reports',               lastActive: '3h ago' },
  { initials: 'TH', color: '#B85C38', name: 'Thomas Huber',   email: 't.huber@bloomapp.com',   role: 'Data Analyst',      roleBadge: 'ttc' as const,       access: 'Analytics (read-only)',                     lastActive: 'Yesterday' },
  { initials: 'LB', color: '#9B7EA6', name: 'Lena Brunner',   email: 'lena.b@bloomapp.com',    role: 'Content Editor',    roleBadge: 'ttc' as const,       access: 'Nutrition · Movement · Protocols',          lastActive: 'Mar 18' },
]

const PERMISSIONS = [
  { role: 'Super Admin',       dashboard: true,  users: true,  community: true,  nutrition: true,  movement: true,  protocols: true,  analytics: true,  settings: true,  roles: true  },
  { role: 'Content Moderator', dashboard: true,  users: false, community: true,  nutrition: false, movement: false, protocols: false, analytics: false, settings: false, roles: false },
  { role: 'Data Analyst',      dashboard: true,  users: false, community: false, nutrition: false, movement: false, protocols: false, analytics: true,  settings: false, roles: false },
  { role: 'Content Editor',    dashboard: true,  users: false, community: false, nutrition: true,  movement: true,  protocols: true,  analytics: false, settings: false, roles: false },
]

const PAGES = ['dashboard','users','community','nutrition','movement','protocols','analytics','settings','roles'] as const

export default function AdminRolesPage() {
  const { toast } = useToast()
  const router = useRouter()

  function handleLogout() {
    clearToken()
    router.push('/')
  }

  return (
    <>
      <PageHeader
        title="Admin Roles"
        sub="Manage team access levels, permissions, and session control"
        action={
          <div className="flex items-center gap-2">
            <button onClick={() => toast('Invite form — requires Bubble admin_login workflow')}
              className="bg-gold text-white text-[.79rem] font-semibold rounded-[9px] px-4 py-[7px] border-none cursor-pointer font-sans hover:opacity-85">
              + Invite Admin
            </button>
            <button onClick={handleLogout}
              className="text-[.79rem] font-semibold border border-cream-dark text-rust rounded-[9px] px-4 py-[7px] bg-transparent hover:bg-cream cursor-pointer font-sans">
              Sign Out
            </button>
          </div>
        }
      />

      {/* Current admins */}
      <TableWrap>
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-cream-dark">
              <Th>Admin</Th><Th>Role</Th><Th>Module Access</Th><Th>Last Active</Th><Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {ADMINS.map(admin => (
              <tr key={admin.email} className="border-b border-cream hover:bg-[#FDFAF6] transition-colors last:border-0">
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar initials={admin.initials} color={admin.color} size={28} />
                    <div>
                      <div className="font-semibold text-ink text-[.79rem]">{admin.name}</div>
                      <div className="text-[.63rem] text-ink-soft">{admin.email}</div>
                    </div>
                  </div>
                </Td>
                <Td><Badge variant={admin.roleBadge}>{admin.role}</Badge></Td>
                <Td className="text-ink-soft text-[.74rem]">{admin.access}</Td>
                <Td className="text-ink-soft">{admin.lastActive}</Td>
                <Td>
                  <Dropdown items={[
                    { label: '✏ Edit Role',       onClick: () => toast('Edit role in Bubble — update role field on User') },
                    { label: '🔑 Reset Password',  onClick: () => toast('Password reset sent', 'success') },
                    ...(admin.email !== 'admin@bloomapp.com'
                      ? [{ label: '✕ Remove Admin', onClick: () => toast(`${admin.name} removed`, 'error'), danger: true }]
                      : []),
                  ]} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>

      {/* Permissions matrix */}
      <div className="mt-5 bg-ivory border border-cream-dark rounded-xl overflow-hidden">
        <div className="px-[18px] py-[13px] border-b border-cream bg-cream">
          <div className="font-bold text-[.85rem] text-ink">Role Permissions Matrix</div>
          <div className="text-[.71rem] text-ink-soft mt-[1px]">Page-level access for each admin role</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-cream">
                <th className="text-left px-4 py-2.5 text-[.68rem] font-bold uppercase tracking-wide text-ink-soft">Role</th>
                {PAGES.map(p => (
                  <th key={p} className="px-3 py-2.5 text-[.65rem] font-bold uppercase tracking-wide text-ink-soft capitalize">{p}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PERMISSIONS.map((row, i) => (
                <tr key={row.role} className={`border-b border-cream last:border-0 ${i % 2 === 0 ? '' : 'bg-[#FDFAF6]'}`}>
                  <td className="px-4 py-2.5 text-[.77rem] font-semibold text-ink">{row.role}</td>
                  {PAGES.map(p => (
                    <td key={p} className="px-3 py-2.5 text-center">
                      {(row as Record<string, unknown>)[p]
                        ? <span className="text-[#2D6B4A] text-base">✓</span>
                        : <span className="text-ink-xs text-base">—</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Setup note */}
      <div className="mt-4 bg-[#F5EDD8] border border-[#E8D4A0] rounded-xl px-[18px] py-[13px] flex items-start gap-3">
        <span className="text-lg flex-shrink-0">⚠️</span>
        <div>
          <div className="font-bold text-[.82rem] text-[#8A5C20] mb-1">Bubble setup required</div>
          <div className="text-[.72rem] text-[#8A5C20] leading-[1.5]">
            Admin roles are enforced by the <code className="font-mono bg-[#EED9A8] px-1 rounded">is_admin</code> boolean field on the Bubble User type.
            Only users with <code className="font-mono bg-[#EED9A8] px-1 rounded">is_admin = true</code> can authenticate via <code className="font-mono bg-[#EED9A8] px-1 rounded">/wf/admin_login</code>.
            Role differentiation (Moderator, Analyst, etc.) requires adding a <code className="font-mono bg-[#EED9A8] px-1 rounded">admin_role</code> text field to the User type.
          </div>
        </div>
      </div>
    </>
  )
}
