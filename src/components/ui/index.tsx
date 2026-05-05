"use client";

import React, { useState, useRef, useEffect } from "react";

// ── StatCard ──────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: string;
  delta?: string;
  deltaUp?: boolean;
  icon: string;
  iconBg: string;
  onClick?: () => void;
}
export function StatCard({
  label,
  value,
  delta,
  deltaUp,
  icon,
  iconBg,
  onClick,
}: StatCardProps) {
  return (
    <div
      className="stat-card bg-ivory rounded-xl border border-cream-dark p-3 sm:p-[16px_18px] relative transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
      onClick={onClick}
      style={{ cursor: onClick ? "pointer" : "default" }}
    >
      <div
        className="absolute top-3 right-3 sm:top-[14px] sm:right-[14px] w-7 h-7 sm:w-[30px] sm:h-[30px] rounded-[8px] flex items-center justify-center text-[.8rem] sm:text-[.88rem]"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="text-[.63rem] sm:text-[.68rem] text-ink-soft font-medium mb-1 pr-8">
        {label}
      </div>
      <div className="font-serif text-[1.45rem] sm:text-[1.85rem] text-ink leading-none">
        {value}
      </div>
      {delta && (
        <div
          className={`text-[.63rem] sm:text-[.68rem] font-semibold mt-1 ${deltaUp ? "text-sage" : "text-rust"}`}
        >
          {delta}
        </div>
      )}
    </div>
  );
}

// ── MiniChart ─────────────────────────────────────────────
const DAYS = ["M", "T", "W", "T", "F", "S", "S"];
interface MiniChartProps {
  heights: number[];
  color: string;
  activeColor: string;
  activeIndex?: number;
}
export function MiniChart({
  heights,
  color,
  activeColor,
  activeIndex,
}: MiniChartProps) {
  return (
    <div>
      <div className="flex items-end gap-[3px] h-[40px] sm:h-[52px] mt-[9px]">
        {heights.map((h, i) => (
          <div
            key={i}
            className="flex-1 rounded-sm transition-colors duration-200 cursor-pointer hover:opacity-80"
            style={{
              height: `${h}%`,
              background: i === activeIndex ? activeColor : color,
            }}
          />
        ))}
      </div>
      <div className="flex justify-between text-[.6rem] text-ink-xs mt-[2px]">
        {DAYS.map((d, i) => (
          <span key={i}>{d}</span>
        ))}
      </div>
    </div>
  );
}

// ── BarRow ────────────────────────────────────────────────
interface BarRowProps {
  label: string;
  pct: number;
  value: string;
  color: string;
}
export function BarRow({ label, pct, value, color }: BarRowProps) {
  return (
    <div className="flex items-center gap-[6px] sm:gap-[9px] mt-[7px]">
      <div className="text-[.7rem] sm:text-[.73rem] text-ink-mid w-[90px] sm:w-[108px] flex-shrink-0 truncate">
        {label}
      </div>
      <div className="flex-1 h-2 bg-cream-dark rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <div className="text-[.65rem] sm:text-[.68rem] text-ink-soft w-7 sm:w-9 text-right flex-shrink-0">
        {value}
      </div>
    </div>
  );
}

// ── DonutChart ────────────────────────────────────────────
export function DonutChart() {
  return (
    <div className="flex items-center gap-[18px] mt-[9px]">
      <svg
        width="80"
        height="80"
        viewBox="0 0 100 100"
        className="flex-shrink-0"
      >
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#C9973A"
          strokeWidth="18"
          strokeDasharray="76.9 142.7"
          strokeDashoffset="35"
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#2D6B4A"
          strokeWidth="18"
          strokeDasharray="101 118.6"
          strokeDashoffset="-41.9"
        />
        <circle
          cx="50"
          cy="50"
          r="35"
          fill="none"
          stroke="#B85C38"
          strokeWidth="18"
          strokeDasharray="41.7 178"
          strokeDashoffset="-142.9"
        />
        <circle cx="50" cy="50" r="26" fill="#FFFCF8" />
      </svg>
      <div className="flex flex-col gap-[7px]">
        {[
          { color: "#C9973A", label: "Trying to Conceive", count: "4,523" },
          { color: "#2D6B4A", label: "Pregnant", count: "5,891" },
          { color: "#B85C38", label: "Postpartum", count: "2,433" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-[7px] text-[.7rem] sm:text-[.73rem]"
          >
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{ background: item.color }}
            />
            <div>
              {item.label}
              <br />
              <strong>{item.count}</strong>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── ActivityList ──────────────────────────────────────────
interface ActivityItem {
  text: string;
  time: string;
  color: string;
}
export function ActivityList({ items }: { items: ActivityItem[] }) {
  return (
    <div className="flex flex-col">
      {items.map((item, i) => (
        <div
          key={i}
          className={`flex items-start gap-[9px] py-2 ${i < items.length - 1 ? "border-b border-cream" : ""}`}
        >
          <div
            className="w-[6px] h-[6px] rounded-full flex-shrink-0 mt-1"
            style={{ background: item.color }}
          />
          <div>
            <div className="text-[.77rem] text-ink-mid leading-[1.38]">
              {item.text}
            </div>
            <div className="text-[.65rem] text-ink-soft mt-[1px]">
              {item.time}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Toggle ────────────────────────────────────────────────
interface ToggleProps {
  defaultOn?: boolean;
  onChange?: (on: boolean) => void;
}
export function Toggle({ defaultOn = false, onChange }: ToggleProps) {
  const [on, setOn] = useState(defaultOn);
  return (
    <div
      className={`toggle w-[36px] h-5 rounded-full transition-colors duration-200 flex-shrink-0 ${on ? "bg-gold on" : "bg-cream-dark"}`}
      onClick={() => {
        setOn(!on);
        onChange?.(!on);
      }}
    />
  );
}

// ── Dropdown ──────────────────────────────────────────────
interface DropdownItem {
  label: string;
  danger?: boolean;
  onClick: () => void;
}
export function Dropdown({ items }: { items: DropdownItem[] }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen((o) => !o);
        }}
        className="bg-transparent border-none cursor-pointer w-[26px] h-[26px] rounded-[6px] flex items-center justify-center text-ink-soft text-base hover:bg-cream-dark transition-colors"
      >
        ⋮
      </button>
      <div
        className={`dropdown-menu absolute top-[calc(100%+5px)] right-0 bg-ivory border border-cream-dark rounded-[10px] shadow-md min-w-[160px] z-[80] ${open ? "open" : ""}`}
      >
        {items.map((item, i) => (
          <div
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              item.onClick();
              setOpen(false);
            }}
            className={`px-[13px] py-2 text-[.78rem] cursor-pointer flex items-center gap-[7px] transition-colors hover:bg-cream ${item.danger ? "text-rust hover:bg-rust-light" : "text-ink-mid"} ${i === 0 ? "rounded-t-[10px]" : ""} ${i === items.length - 1 ? "rounded-b-[10px]" : ""}`}
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Badge ─────────────────────────────────────────────────
type BadgeVariant =
  | "pregnant"
  | "ttc"
  | "postpartum"
  | "active"
  | "pending"
  | "suspended"
  | "beta"
  | "live";

const BADGE_CLASSES: Record<BadgeVariant, string> = {
  pregnant: "bg-sage-light text-sage",
  ttc: "bg-gold-dim text-brown",
  postpartum: "bg-rust-light text-rust",
  active: "bg-[#E0F2EB] text-[#1A6B42]",
  pending: "bg-[#FDF3E0] text-[#B07A1A]",
  suspended: "bg-rust-light text-rust",
  beta: "bg-violet-light text-violet",
  live: "bg-sage-light text-sage",
};

export function Badge({
  variant,
  children,
}: {
  variant: BadgeVariant;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-[3px] rounded-full text-[.65rem] font-bold tracking-[.3px] ${BADGE_CLASSES[variant]}`}
    >
      {children}
    </span>
  );
}

// ── Tabs ──────────────────────────────────────────────────
interface TabDef<T> {
  id: T;
  label: string;
}
interface TabsProps<T extends string> {
  tabs: TabDef<T>[];
  active: T;
  onChange: (id: T) => void;
}
export function Tabs<T extends string>({
  tabs,
  active,
  onChange,
}: TabsProps<T>) {
  return (
    <div className="flex gap-[3px] mb-4 bg-cream rounded-[9px] p-1 w-fit max-w-full overflow-x-auto scrollbar-none">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`px-[10px] sm:px-[14px] py-[6px] rounded-[7px] border-none text-[.72rem] sm:text-[.77rem] font-semibold cursor-pointer transition-all font-sans whitespace-nowrap ${
            active === tab.id
              ? "bg-ivory text-gold shadow-sm"
              : "bg-transparent text-ink-soft hover:text-ink"
          }`}
          dangerouslySetInnerHTML={{ __html: tab.label }}
        />
      ))}
    </div>
  );
}

// ── EngineStatusRow ───────────────────────────────────────
interface EngineStatusItem {
  icon: string;
  iconBg: string;
  label: string;
  statusText: string;
  count: string;
  href: string;
}
export function EngineStatusRow({ items }: { items: EngineStatusItem[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-[14px] mb-5">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-ivory border border-cream-dark rounded-xl p-3 sm:p-[15px] flex items-center gap-[11px]"
        >
          <div
            className="w-9 h-9 sm:w-[38px] sm:h-[38px] rounded-[9px] flex items-center justify-center text-[.9rem] sm:text-[.95rem] flex-shrink-0"
            style={{ background: item.iconBg }}
          >
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[.63rem] sm:text-[.68rem] text-ink-soft font-bold uppercase tracking-[.8px] truncate">
              {item.label}
            </div>
            <div className="text-[.78rem] sm:text-[.82rem] font-bold text-sage flex items-center gap-[5px] mt-[2px]">
              <span className="w-[6px] h-[6px] bg-sage rounded-full inline-block pulse-dot flex-shrink-0" />
              <span className="truncate">
                {item.statusText} · {item.count}
              </span>
            </div>
          </div>
          <a
            href={item.href}
            className="text-[.7rem] sm:text-[.72rem] font-semibold text-ink-mid border border-cream-dark rounded-[9px] px-2 sm:px-[11px] py-[5px] hover:bg-cream transition-colors no-underline whitespace-nowrap flex-shrink-0"
          >
            Manage →
          </a>
        </div>
      ))}
    </div>
  );
}

// ── PageHeader ────────────────────────────────────────────
interface PageHeaderProps {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}
export function PageHeader({ title, sub, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-5">
      <div>
        <h1 className="font-serif text-[1.45rem] sm:text-[1.7rem] text-ink leading-[1.12]">
          {title}
        </h1>
        {sub && (
          <p className="text-[.76rem] sm:text-[.82rem] text-ink-soft mt-1">
            {sub}
          </p>
        )}
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────
export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-ivory rounded-xl border border-cream-dark shadow-sm p-4 sm:p-[18px] ${className}`}
    >
      {children}
    </div>
  );
}

// ── CardTitle ─────────────────────────────────────────────
export function CardTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[.65rem] font-bold tracking-[1.4px] uppercase text-ink-soft mb-[9px]">
      {children}
    </div>
  );
}

// ── TableWrap ─────────────────────────────────────────────
export function TableWrap({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-ivory rounded-xl border border-cream-dark overflow-hidden shadow-sm">
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

// ── TableToolbar ──────────────────────────────────────────
export function TableToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[9px] px-4 py-3 border-b border-cream-dark flex-wrap">
      {children}
    </div>
  );
}

// ── SearchInput ───────────────────────────────────────────
interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChange?: (v: string) => void;
}
export function SearchInput({
  placeholder = "Search…",
  value,
  onChange,
}: SearchInputProps) {
  return (
    <div className="flex items-center gap-[5px] bg-cream border border-cream-dark rounded-[7px] px-[11px] py-[6px] flex-1 min-w-[140px] focus-within:border-gold transition-colors">
      <svg
        className="w-3 h-3 text-ink-soft flex-shrink-0"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="7" cy="7" r="4.5" />
        <path d="M11 11l3 3" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-transparent border-none outline-none font-sans text-[.77rem] text-ink w-full placeholder:text-ink-soft"
      />
    </div>
  );
}

// ── SelectFilter ──────────────────────────────────────────
interface SelectFilterProps {
  options: string[];
  onChange?: (value: string) => void;
}
export function SelectFilter({ options, onChange }: SelectFilterProps) {
  return (
    <select
      onChange={(e) => onChange?.(e.target.value)}
      className="appearance-none bg-cream border border-cream-dark rounded-[7px] px-[10px] pr-6 py-[6px] font-sans text-[.76rem] text-ink-mid cursor-pointer outline-none focus:border-gold transition-colors"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='5' fill='none'%3E%3Cpath d='M1 1l3.5 3.5L8 1' stroke='%238A7965' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E\")",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 8px center",
      }}
    >
      {options.map((o) => (
        <option key={o}>{o}</option>
      ))}
    </select>
  );
}

// ── Th ────────────────────────────────────────────────────
export function Th({ children }: { children: React.ReactNode }) {
  return (
    <th className="text-left text-[.63rem] font-bold tracking-[1.1px] uppercase text-ink-soft px-[14px] py-[9px] bg-cream cursor-pointer whitespace-nowrap select-none hover:text-brown transition-colors">
      {children}
    </th>
  );
}

// ── Td ────────────────────────────────────────────────────
export function Td({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <td
      className={`px-[14px] py-[11px] text-[.78rem] sm:text-[.8rem] text-ink-mid border-b border-cream align-middle ${className}`}
    >
      {children}
    </td>
  );
}

// ── Avatar ────────────────────────────────────────────────
export function Avatar({
  initials,
  color,
  size = 28,
}: {
  initials: string;
  color: string;
  size?: number;
}) {
  return (
    <div
      className="rounded-full flex items-center justify-center font-bold text-white flex-shrink-0"
      style={{
        width: size,
        height: size,
        background: color,
        fontSize: size * 0.24,
      }}
    >
      {initials}
    </div>
  );
}
