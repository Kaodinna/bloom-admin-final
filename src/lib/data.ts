import type {
  NavItem,
  User,
  Group,
  Post,
  Report,
  SimData,
  SimStage,
} from "@/types";

export const NAV_ITEMS: NavItem[] = [
  {
    href: "/dashboard",
    label: "Dashboard",
    iconKey: "grid",
    section: "Overview",
  },
  // { href: '/timeline',   label: 'AI Timeline Engine', iconKey: 'clock',     section: 'AI Engine', isTimeline: true },
  { href: "/users", label: "Users", iconKey: "users", section: "Management" },
  {
    href: "/community",
    label: "Community",
    iconKey: "community",
    section: "Management",
  },
  {
    href: "/nutrition",
    label: "Nutrition",
    iconKey: "leaf",
    section: "Content Modules",
  },
  {
    href: "/movement",
    label: "Movement",
    iconKey: "bolt",
    section: "Content Modules",
  },
  {
    href: "/datasets",
    label: "Datasets",
    iconKey: "database",
    section: "Content Modules",
  },
  {
    href: "/analytics",
    label: "Analytics",
    iconKey: "chart",
    section: "Platform",
  },
  // {
  //   href: "/settings",
  //   label: "Settings",
  //   iconKey: "gear",
  //   section: "Platform",
  // },
  // {
  //   href: "/admin-roles",
  //   label: "Admin Roles",
  //   iconKey: "star",
  //   section: "Platform",
  // },
  // {
  //   href: "/endpoints",
  //   label: "API Endpoints",
  //   iconKey: "code",
  //   section: "Platform",
  // },
];

// ── Static mock data (replace with real API calls via src/lib/api.ts) ──
export const USERS: User[] = [
  {
    id: "U001",
    initials: "SJ",
    name: "Sarah Johnson",
    email: "sarah.j@example.com",
    color: "#7B9E87",
    stage: "pregnant",
    timeline: "Week 24",
    trimester: "T2",
    joinDate: "Jan 15, 2026",
    status: "active",
  },
  {
    id: "U002",
    initials: "EW",
    name: "Emma Williams",
    email: "emma.w@example.com",
    color: "#C9973A",
    stage: "ttc",
    timeline: "Month 3",
    joinDate: "Feb 3, 2026",
    status: "active",
  },
  {
    id: "U003",
    initials: "MD",
    name: "Marie Dubois",
    email: "marie.d@example.com",
    color: "#9B7EA6",
    stage: "postpartum",
    timeline: "Recovery Week 8",
    joinDate: "Dec 20, 2025",
    status: "active",
  },
  {
    id: "U004",
    initials: "AS",
    name: "Anna Schmidt",
    email: "anna.s@example.com",
    color: "#5C8A7A",
    stage: "pregnant",
    timeline: "Week 12",
    trimester: "T1",
    joinDate: "Mar 1, 2026",
    status: "active",
  },
  {
    id: "U005",
    initials: "SR",
    name: "Sofia Rossi",
    email: "sofia.r@example.com",
    color: "#B8956A",
    stage: "ttc",
    timeline: "Month 1",
    joinDate: "Mar 10, 2026",
    status: "pending",
  },
  {
    id: "U006",
    initials: "LM",
    name: "Laura Müller",
    email: "laura.m@example.com",
    color: "#7A8FA6",
    stage: "postpartum",
    timeline: "Recovery Month 5",
    joinDate: "Oct 12, 2025",
    status: "active",
  },
  {
    id: "U007",
    initials: "JK",
    name: "Julia Kowalski",
    email: "julia.k@example.com",
    color: "#A67B5B",
    stage: "pregnant",
    timeline: "Week 32",
    trimester: "T3",
    joinDate: "Nov 8, 2025",
    status: "suspended",
  },
  {
    id: "U008",
    initials: "IG",
    name: "Isabel García",
    email: "isabel.g@example.com",
    color: "#7A9E6A",
    stage: "ttc",
    timeline: "Month 6",
    joinDate: "Sep 25, 2025",
    status: "active",
  },
];

export const GROUPS: Group[] = [
  {
    id: "g1",
    emoji: "🌿",
    emojiBg: "#E8F2EC",
    name: "Zurich Mothers",
    subtitle: "Week 15 Support · City",
    typeBadge: "City",
    typeBadgeClass: "sage",
    members: 247,
    createdDate: "Jan 10, 2026",
    activityLevel: "High",
    activityPct: 88,
  },
  {
    id: "g2",
    emoji: "📅",
    emojiBg: "#F5EDD8",
    name: "October 2025 Due Dates",
    subtitle: "Due Month · Cohort",
    typeBadge: "Due Month",
    typeBadgeClass: "gold",
    members: 412,
    createdDate: "Sep 1, 2025",
    activityLevel: "High",
    activityPct: 92,
  },
  {
    id: "g3",
    emoji: "⚡",
    emojiBg: "#E0F4F4",
    name: "Prenatal Fitness",
    subtitle: "Movement & Wellness",
    typeBadge: "Wellness",
    typeBadgeClass: "teal",
    members: 1240,
    createdDate: "Nov 15, 2025",
    activityLevel: "High",
    activityPct: 95,
  },
  {
    id: "g4",
    emoji: "🏙",
    emojiBg: "#F5E8E2",
    name: "Basel — Fertility & Preg",
    subtitle: "City · Basel",
    typeBadge: "City",
    typeBadgeClass: "sage",
    members: 134,
    createdDate: "Feb 3, 2026",
    activityLevel: "Moderate",
    activityPct: 52,
  },
  {
    id: "g5",
    emoji: "💜",
    emojiBg: "#EDE6F5",
    name: "Postpartum Support Circle",
    subtitle: "Recovery & Wellness",
    typeBadge: "Support",
    typeBadgeClass: "rust",
    members: 876,
    createdDate: "Oct 20, 2025",
    activityLevel: "Low",
    activityPct: 28,
  },
  {
    id: "g6",
    emoji: "🌱",
    emojiBg: "#E8F2EC",
    name: "Mum's Daily Circle",
    subtitle: "All trimesters · 420 members",
    typeBadge: "Wellness",
    typeBadgeClass: "sage",
    members: 420,
    createdDate: "Dec 1, 2025",
    activityLevel: "High",
    activityPct: 75,
  },
];

export const POSTS: Post[] = [
  {
    id: "p1",
    initials: "EW",
    avatarBg: "#B85C38",
    author: "Emma Williams",
    group: "Prenatal Fitness",
    stageInfo: "Trying · Month 3",
    timestamp: "Yesterday, 2:14 PM",
    content:
      "Has anyone tried the supplement protocol listed in the app? I got conflicting advice from my doctor and want to share an alternative source I found…",
    tags: ["#supplements", "#week15", "#advice"],
    likes: 47,
    comments: 12,
    flagged: true,
    reportCount: 3,
  },
  {
    id: "p2",
    initials: "AK",
    avatarBg: "#2D6B4A",
    author: "Anna K.",
    group: "Zurich Mothers",
    stageInfo: "Pregnant · Week 15",
    timestamp: "Today, 10:32 AM",
    content:
      "Just had my week 15 scan and everything looks perfect 🫶 Baby is measuring right on track!",
    tags: ["#week15", "#scan", "#milestones"],
    likes: 89,
    comments: 21,
    approved: true,
    media: {
      type: "image",
      filename: "scan_week15.jpg",
      meta: "Image · 1 attachment · AI reviewed — no flags",
    },
  },
  {
    id: "p3",
    initials: "SB",
    avatarBg: "#7B9E87",
    author: "Sofia B.",
    group: "Prenatal Fitness",
    stageInfo: "Pregnant · Week 14",
    timestamp: "Today, 9:18 AM",
    content:
      "Gentle hip mobility video from this morning — 15 minutes, no equipment.",
    tags: ["#movement", "#tips", "#week14"],
    likes: 69,
    comments: 21,
    approved: true,
    media: {
      type: "video",
      filename: "hip_mobility_week14.mp4",
      meta: "Video · 13:52 · AI reviewed — no flags",
    },
  },
  {
    id: "p4",
    initials: "LP",
    avatarBg: "#9B7EA6",
    author: "Lisa P.",
    group: "Mum's Daily Circle",
    stageInfo: "Pregnant · Week 22",
    timestamp: "Yesterday, 6:44 PM",
    content:
      "Iron-rich Sunday meal prep 🥬 Lentil soup, spinach & egg frittata, tahini dressing.",
    tags: ["#nutrition", "#mealprep", "#iron"],
    likes: 62,
    comments: 19,
    approved: true,
  },
];

export const REPORTS: Report[] = [
  {
    id: "r1",
    contentTitle: "Post by Emma Williams",
    group: "Prenatal Fitness",
    contentPreview:
      '"Has anyone tried the supplement protocol listed in the app? I got conflicting advice…"',
    reporterInitials: "AS",
    reporterBg: "#5C8A7A",
    reporterName: "Anna Schmidt",
    reporterCount: "+ 2 others",
    reason: "Medical Misinformation",
    reasonStyle: "rust",
    date: "Mar 19, 2026",
    status: "pending",
  },
  {
    id: "r2",
    contentTitle: "Post by Marie L.",
    group: "October 2025 Due Dates",
    contentPreview:
      '"I skipped my prenatal vitamins for a week and honestly felt better…"',
    reporterInitials: "EW",
    reporterBg: "#C9973A",
    reporterName: "Emma Williams",
    reporterCount: "1 report",
    reason: "Medical Misinformation",
    reasonStyle: "rust",
    date: "Mar 20, 2026",
    status: "pending",
  },
  {
    id: "r3",
    contentTitle: "Comment by Unknown User",
    group: "Zurich Mothers",
    contentPreview: '"This app is scamming you all, I found better advice on…"',
    reporterInitials: "SJ",
    reporterBg: "#7B9E87",
    reporterName: "Sarah Johnson",
    reporterCount: "1 report",
    reason: "Spam / Promotion",
    reasonStyle: "gold",
    date: "Mar 19, 2026",
    status: "under-review",
  },
  {
    id: "r4",
    contentTitle: "Post by Natalie R.",
    group: "Mum's Daily Circle",
    contentPreview: '"Reminder that rest is also a practice…"',
    reporterInitials: "??",
    reporterBg: "#B0A496",
    reporterName: "Anonymous",
    reporterCount: "1 report",
    reason: "Inappropriate",
    reasonStyle: "neutral",
    date: "Mar 15, 2026",
    status: "resolved",
    dismissedWith: "Dismissed",
  },
];

// ── Simulator ──────────────────────────────────────────────
interface SimMap {
  pregnant: { early: SimData; mid: SimData; late: SimData };
  ttc: { all: SimData };
  postpartum: { early: SimData; late: SimData };
}

export const SIM_DATA: SimMap = {
  pregnant: {
    early: {
      label: "T1 · Week 1–12",
      movement: [
        "Gentle walking only",
        "No high-impact activity",
        "Light stretching",
        "Pelvic floor awareness",
      ],
      nutrition: [
        "Folate 400mcg/day priority",
        "Vitamin B6 for nausea",
        "Ginger-rich foods",
        "Small frequent meals",
      ],
      journey: [
        "Neural tube formation milestone",
        "First heartbeat week 6",
        "Morning sickness management",
        "OB/GP booking reminder",
      ],
    },
    mid: {
      label: "T2 · Week 13–26",
      movement: [
        "Prenatal Yoga (30 min)",
        "Functional Strength (moderate)",
        "Breathwork & Nervous System",
        "Pelvic mobility sessions",
      ],
      nutrition: [
        "DHA priority — brain development",
        "Choline for memory formation",
        "Iron-rich meals 3×/week",
        "Calcium + Vitamin D",
      ],
      journey: [
        "Anatomy scan milestone (Week 20)",
        "Baby size tracking weekly",
        "Movement felt by Week 18+",
        "Birth plan early preparation",
      ],
    },
    late: {
      label: "T3 · Week 27–40",
      movement: [
        "Intensity capped at 50%",
        "Birth preparation yoga",
        "Pelvic floor strengthening",
        "No lying flat on back",
      ],
      nutrition: [
        "Calcium priority — bone formation",
        "Vitamin K for delivery prep",
        "Hydration 2.5L minimum",
        "Omega-3 for brain maturation",
      ],
      journey: [
        "Hospital bag checklist",
        "Birth preferences finalised",
        "Postpartum plan preparation",
        "Baby development: lung maturation",
      ],
    },
  },
  ttc: {
    all: {
      label: "Trying to Conceive",
      movement: [
        "Pelvic mobility daily",
        "Light cardio (zone 2)",
        "Avoid high-intensity in luteal phase",
        "Yoga + breathwork focus",
      ],
      nutrition: [
        "Folate 400mcg essential",
        "CoQ10 600mg with food",
        "Reduce alcohol + caffeine",
        "Iron-rich diet foundation",
      ],
      journey: [
        "Cycle day tracking active",
        "Fertility window: Day 11–15",
        "BBT charting recommended",
        "Baseline bloods milestone",
      ],
    },
  },
  postpartum: {
    early: {
      label: "Recovery Week 1–2",
      movement: [
        "Movement BLOCKED",
        "Rest only — no exercise",
        "Breathing exercises only",
        "Gentle walking from Day 5",
      ],
      nutrition: [
        "Iron replenishment priority",
        "Hormone restoration foods",
        "Hydration 3L/day (breastfeeding)",
        "Vitamin D + Calcium",
      ],
      journey: [
        "Newborn feeding schedule",
        "Postpartum check Week 1",
        "Pelvic floor assessment",
        "Mental health check-in",
      ],
    },
    late: {
      label: "Recovery Week 6+",
      movement: [
        "Pelvic floor activation",
        "Gentle Pilates",
        "Bodyweight strength (gradual)",
        "Return-to-run assessment Week 12",
      ],
      nutrition: [
        "Full nutrition protocol resumes",
        "Omega-3 for postpartum mood",
        "Magnesium for sleep quality",
        "Gut health focus",
      ],
      journey: [
        "6-week postpartum check milestone",
        "Return-to-movement clearance",
        "Baby development tracking begins",
        "Contraception discussion prompt",
      ],
    },
  },
};

export function getSimData(stage: SimStage, week: number): SimData {
  if (stage === "pregnant") {
    if (week <= 12) return SIM_DATA.pregnant.early;
    if (week <= 26) return SIM_DATA.pregnant.mid;
    return SIM_DATA.pregnant.late;
  }
  if (stage === "ttc") return SIM_DATA.ttc.all;
  if (week <= 2) return SIM_DATA.postpartum.early;
  return SIM_DATA.postpartum.late;
}

// ── Notifications ──────────────────────────────────────────
import type { NavRoute } from "@/types";
interface NotificationData {
  id: string;
  icon: string;
  iconBg: string;
  title: string;
  body: string;
  time: string;
  unread: boolean;
  actionLabel?: string;
  actionPage?: NavRoute;
}
export const NOTIFICATIONS: NotificationData[] = [
  {
    id: "n1",
    icon: "⏱",
    iconBg: "#F5EDD8",
    title: "AI Timeline daily recalibration complete",
    body: "12,847 timelines recalibrated. 14 users advanced a week. Movement + nutrition + journey updated for all.",
    time: "2 minutes ago",
    unread: true,
    actionLabel: "Monitor →",
    actionPage: "/timeline",
  },
  {
    id: "n2",
    icon: "🚩",
    iconBg: "#F5E8E2",
    title: "Community post flagged",
    body: "Emma Williams' post about supplement alternatives flagged by 3 users.",
    time: "8 minutes ago",
    unread: true,
    actionLabel: "Review →",
    actionPage: "/community",
  },
  {
    id: "n3",
    icon: "🤖",
    iconBg: "#F5EDD8",
    title: "AI Protocol anomaly — Week 32 supplement dosage",
    body: "Protocol generated unusually high supplement dosage for 14 users at Week 32. Safety filter flagged.",
    time: "3 hours ago",
    unread: true,
    actionLabel: "Investigate →",
    actionPage: "/datasets",
  },
  {
    id: "n4",
    icon: "⚡",
    iconBg: "#E0F4F4",
    title: "Movement safety filter triggered — T3 intensity cap",
    body: "847 T3 users had movement intensity automatically capped to 50% during today's recalibration.",
    time: "5 minutes ago",
    unread: true,
  },
  {
    id: "n5",
    icon: "📊",
    iconBg: "#EDE7DC",
    title: "Weekly analytics report ready",
    body: "Your platform summary for week ending March 14, 2026.",
    time: "Mar 14, 2026",
    unread: false,
    actionLabel: "View →",
    actionPage: "/analytics",
  },
];
