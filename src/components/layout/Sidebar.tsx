"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { NAV_ITEMS } from "@/lib/data";
import type { NavItem } from "@/types";
import { clearToken } from "@/lib/api";

// ── Icons ─────────────────────────────────────────────────
function GridIcon() {
  return (
    <svg className="w-[15px] h-[15px]" viewBox="0 0 16 16" fill="currentColor">
      <rect x="1" y="1" width="6" height="6" rx="1.5" />
      <rect x="9" y="1" width="6" height="6" rx="1.5" />
      <rect x="1" y="9" width="6" height="6" rx="1.5" />
      <rect x="9" y="9" width="6" height="6" rx="1.5" />
    </svg>
  );
}
function ClockIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="6" />
      <path d="M8 4v4l2.5 2" />
    </svg>
  );
}
function UsersIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="5" r="3" />
      <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    </svg>
  );
}
function CommunityIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 11V7a5 5 0 0 1 10 0v4" />
      <rect x="1" y="11" width="3" height="3" rx="1" />
      <rect x="12" y="11" width="3" height="3" rx="1" />
    </svg>
  );
}
function LeafIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 2c-2 0-5 1.5-5 7 0 3.3 2 5 5 5s5-1.7 5-5c0-5.5-3-7-5-7z" />
    </svg>
  );
}
function BoltIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 12l4-5 3 3 5-7" />
    </svg>
  );
}
function ChartIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M2 12l4-5 3 3 5-7" />
    </svg>
  );
}
function GearIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <circle cx="8" cy="8" r="2.5" />
      <path d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41" />
    </svg>
  );
}
function StarIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M8 2l1.5 3 3.5.5-2.5 2.5.5 3.5L8 10l-3 1.5.5-3.5L3 5.5 6.5 5z" />
    </svg>
  );
}
function CodeIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8 9l-3 3 3 3M16 9l3 3-3 3M12 6l-2 12"
      />
    </svg>
  );
}
function DatabaseIcon() {
  return (
    <svg
      className="w-[15px] h-[15px]"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path strokeLinecap="round" d="M21 12c0 1.66-4.03 3-9 3S3 13.66 3 12" />
      <path strokeLinecap="round" d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" />
    </svg>
  );
}
function ExitIcon() {
  return (
    <svg
      className="w-[13px] h-[13px]"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
    >
      <path d="M6 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3M11 11l3-3-3-3M14 8H6" />
    </svg>
  );
}
function MenuIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" d="M3 6h18M3 12h18M3 18h18" />
    </svg>
  );
}
function CloseIcon() {
  return (
    <svg
      className="w-5 h-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path strokeLinecap="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

const ICON_MAP: Record<string, () => JSX.Element> = {
  grid: GridIcon,
  clock: ClockIcon,
  users: UsersIcon,
  community: CommunityIcon,
  leaf: LeafIcon,
  bolt: BoltIcon,
  chart: ChartIcon,
  gear: GearIcon,
  star: StarIcon,
  code: CodeIcon,
  database: DatabaseIcon,
};

function NavLink({
  item,
  isActive,
  onClick,
}: {
  item: NavItem;
  isActive: boolean;
  onClick?: () => void;
}) {
  const Icon = ICON_MAP[item.iconKey] ?? GridIcon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-[9px] px-[11px] py-[7px] rounded-[8px] transition-all text-[.79rem] font-medium no-underline ${
        isActive
          ? "bg-gold text-white shadow-gold"
          : "text-ink-soft hover:bg-cream hover:text-ink"
      }`}
    >
      <span className={isActive ? "text-white" : "text-ink-soft"}>
        <Icon />
      </span>
      <span className="flex-1 leading-tight">{item.label}</span>
      {item.badge && (
        <span className="ml-auto bg-rust text-white text-[.57rem] font-bold px-1.5 py-px rounded-[20px] min-w-[18px] text-center">
          {item.badge}
        </span>
      )}
    </Link>
  );
}
function SignOutButton({ onLinkClick }: { onLinkClick?: () => void }) {
  const router = useRouter();
  function handleSignOut() {
    clearToken();
    onLinkClick?.();
    router.push("/");
  }
  return (
    <button
      onClick={handleSignOut}
      className="w-full flex items-center gap-[9px] px-[11px] py-[7px] rounded-[8px] text-[.79rem] text-ink-soft hover:bg-cream hover:text-rust transition-all bg-transparent border-none cursor-pointer font-sans text-left"
    >
      <ExitIcon />
      Sign out
    </button>
  );
}
function SidebarContent({ onLinkClick }: { onLinkClick?: () => void }) {
  const pathname = usePathname();
  const sections = [...new Set(NAV_ITEMS.map((i) => i.section))];

  return (
    <aside className="w-[238px] flex flex-col h-full bg-ivory border-r border-cream-dark overflow-y-auto scrollbar-none">
      {/* Logo */}
      <div className="px-[18px] pt-[22px] pb-[18px] border-b border-cream flex-shrink-0">
        <div className="font-serif text-[1.25rem] text-ink tracking-[-0.3px]">
          Bloom
        </div>
        <div className="flex items-center gap-[6px] mt-[4px]">
          <div className="w-[7px] h-[7px] bg-sage rounded-full pulse-dot flex-shrink-0" />
          <div className="text-[.65rem] text-ink-soft">AI Engine running</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-[10px] py-[12px] flex flex-col gap-[18px]">
        {sections.map((section) => {
          const items = NAV_ITEMS.filter((i) => i.section === section);
          return (
            <div key={section}>
              <div className="text-[.57rem] font-bold tracking-[1.6px] uppercase text-ink-xs mb-[5px] px-[11px]">
                {section}
              </div>
              <div className="flex flex-col gap-[2px]">
                {items.map((item) => (
                  <NavLink
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                    onClick={onLinkClick}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-[10px] pb-[14px] pt-[10px] border-t border-cream flex-shrink-0">
        <SignOutButton onLinkClick={onLinkClick} />
      </div>
    </aside>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  // Close on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* ── Desktop sidebar (md+) ─────────────────────── */}
      <div className="hidden md:block fixed top-0 left-0 bottom-0 z-[100]">
        <SidebarContent />
      </div>

      {/* ── Mobile hamburger button ───────────────────── */}
      <button
        onClick={() => setMobileOpen((o) => !o)}
        className="md:hidden fixed top-[11px] left-4 z-[200] w-9 h-9 bg-ivory border border-cream-dark rounded-[8px] flex items-center justify-center text-ink-mid shadow-sm"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* ── Mobile overlay ────────────────────────────── */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 z-[150] bg-ink/40 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Mobile drawer ─────────────────────────────── */}
      <div
        className={`md:hidden fixed top-0 left-0 bottom-0 z-[160] transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent onLinkClick={() => setMobileOpen(false)} />
      </div>
    </>
  );
}
