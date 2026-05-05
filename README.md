# Bloom Admin — Next.js 14 + TypeScript + Tailwind CSS

AI-powered pregnancy optimization platform admin dashboard, built with the Next.js App Router.

## Tech Stack

| Layer       | Choice |
|-------------|--------|
| Framework   | Next.js 14 (App Router) |
| Language    | TypeScript 5 (strict) |
| Styling     | Tailwind CSS v3 with custom Bloom design tokens |
| Fonts       | DM Serif Display + DM Sans (Google Fonts) |
| State       | React `useState` per component — no external state lib |
| Toast       | Custom context (`src/lib/toast.tsx`) |

## Getting Started

```bash
npm install
npm run dev
# → http://localhost:3000  (redirects to /dashboard)
```

## Project Structure

```
src/
├── app/                         ← Next.js App Router
│   ├── layout.tsx               ← Root layout: Sidebar + Topbar + ToastProvider
│   ├── page.tsx                 ← Redirects / → /dashboard
│   ├── globals.css              ← Tailwind directives + custom utilities
│   │
│   ├── dashboard/page.tsx       ← Overview, stats, AI engine health
│   ├── timeline/page.tsx        ← AI Timeline Engine (core page)
│   │                               • Lifecycle distribution + week strip
│   │                               • Daily output modules
│   │                               • Stage-based logic rules
│   │                               • Inline output simulator
│   ├── protocols/page.tsx       ← Prompt templates, recalibration
│   ├── users/page.tsx           ← User table + profile modal + delete
│   ├── community/page.tsx       ← Groups | Posts | Reports tabs
│   ├── nutrition/page.tsx       ← Nutrient database + AI connection
│   ├── movement/page.tsx        ← Practice library + expandable routines
│   ├── notifications/page.tsx   ← Alert feed with action links
│   ├── analytics/page.tsx       ← KPIs, engagement, module health
│   ├── settings/page.tsx        ← Toggle rows for all AI + platform config
│   └── admin-roles/page.tsx     ← Team management table
│
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx          ← Fixed sidebar, active route via usePathname()
│   │   └── Topbar.tsx           ← Sticky search bar + admin pill
│   └── ui/
│       └── index.tsx            ← Shared components:
│                                   StatCard, MiniChart, BarRow, DonutChart
│                                   ActivityList, Toggle, Dropdown, Badge
│                                   Tabs, EngineStatusRow, PageHeader, Card
│                                   CardTitle, TableWrap, TableToolbar
│                                   SearchInput, SelectFilter, Th, Td, Avatar
│
├── lib/
│   ├── data.ts                  ← All mock data + getSimData()
│   └── toast.tsx                ← ToastProvider + useToast hook
│
└── types/
    └── index.ts                 ← All TypeScript interfaces and unions
```

## Routing

Each folder inside `src/app/` is a Next.js route:

| URL              | Page                  |
|------------------|-----------------------|
| `/`              | → redirect `/dashboard` |
| `/dashboard`     | Dashboard overview    |
| `/timeline`      | AI Timeline Engine    |
| `/protocols`     | AI Protocols          |
| `/users`         | Users management      |
| `/community`     | Community (3 tabs)    |
| `/nutrition`     | Nutrition module      |
| `/movement`      | Movement module       |
| `/notifications` | Notifications         |
| `/analytics`     | Analytics             |
| `/settings`      | System settings       |
| `/admin-roles`   | Admin roles           |

## Design Tokens (Tailwind)

Custom colors in `tailwind.config.ts`:

| Token         | Value     | Usage |
|---------------|-----------|-------|
| `gold`        | `#C9973A` | Primary accent, CTAs |
| `gold-dim`    | `#F5EDD8` | Hover backgrounds |
| `cream`       | `#F8F4EE` | Page background |
| `cream-dark`  | `#EDE7DC` | Borders |
| `ivory`       | `#FFFCF8` | Card backgrounds |
| `ink`         | `#1C1510` | Headings |
| `ink-mid`     | `#4A3D30` | Body text |
| `ink-soft`    | `#8A7965` | Labels, captions |
| `sage`        | `#2D6B4A` | Pregnant / success |
| `teal`        | `#1F7A7A` | Movement module |
| `rust`        | `#B85C38` | Alerts / postpartum |
| `violet`      | `#6A4C8A` | Beta / misc |

## Key Features

- **AI Timeline Engine page** — interactive simulator with stage selector + week slider that renders live AI output previews across all three modules
- **Users** — row click opens profile modal; Delete Account shows native confirm dialog and removes row with fade animation
- **Community** — Groups tab (View/Edit/Archive/Delete), Posts tab (feed with image/video media previews, warn/mute/remove), Reports tab (moderation queue with dismiss/remove/suspend)
- **Active nav** — Sidebar uses `usePathname()` to highlight the current route
- **Toast system** — global context, 4 variants (success/warning/error/info), auto-dismiss
- **Expandable routines** — Movement practice cards expand/collapse with `useState`
- **Toggles** — each Setting toggle maintains its own local on/off state
