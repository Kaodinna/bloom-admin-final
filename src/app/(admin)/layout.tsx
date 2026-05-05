import { Sidebar } from '@/components/layout/Sidebar'
import { Topbar }  from '@/components/layout/Topbar'
import AuthGuard   from '@/components/AuthGuard'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <Sidebar />
      <main className="flex-1 flex flex-col min-h-screen md:ml-[238px]">
        <Topbar />
        <div className="p-4 sm:p-5 lg:p-7 flex-1 animate-fade-up">
          {children}
        </div>
      </main>
    </AuthGuard>
  )
}
