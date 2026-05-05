'use client'
import Link from 'next/link'

export function Topbar() {
  return (
    <header className="bg-ivory border-b border-cream-dark flex items-center gap-3 px-4 sm:px-[26px] h-[58px] sticky top-0 z-50">

      {/* Mobile spacer for hamburger button */}
      <div className="w-10 md:hidden flex-shrink-0" />

      {/* Search — hidden on very small screens, shown sm+ */}
      <div className="hidden sm:flex items-center gap-2 bg-cream border border-cream-dark rounded-[9px] px-[13px] py-[7px] flex-1 max-w-[380px] focus-within:border-gold transition-colors">
        <svg className="w-3 h-3 text-ink-soft flex-shrink-0" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="7" cy="7" r="4.5"/><path d="M11 11l3 3"/>
        </svg>
        <input
          type="text"
          placeholder="Search users, protocols…"
          className="bg-transparent border-none outline-none font-sans text-[.82rem] text-ink w-full placeholder:text-ink-soft"
        />
      </div>

      {/* Page title on mobile (replaces search) */}
      <div className="sm:hidden font-serif text-[1.05rem] text-ink flex-1 text-center">Bloom Admin</div>

      {/* Right actions */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Admin pill — compact on mobile */}
        <div className="flex items-center gap-[7px] px-2 sm:px-[11px] sm:pl-1 py-1 bg-cream border border-cream-dark rounded-full cursor-pointer hover:bg-cream-dark transition-colors">
          <div className="w-[26px] h-[26px] bg-gold rounded-full flex items-center justify-center text-[.65rem] font-bold text-white flex-shrink-0">AU</div>
          <div className="hidden sm:block">
            <div className="text-[.78rem] font-semibold text-ink-mid">Admin User</div>
            <div className="text-[.6rem] text-ink-soft">Super Admin</div>
          </div>
        </div>
      </div>
    </header>
  )
}
