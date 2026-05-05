export type NavRoute =
  | '/'
  | '/dashboard'
  | '/timeline'
  | '/users'
  | '/community'
  | '/nutrition'
  | '/movement'
  | '/analytics'
  | '/settings'
  | '/admin-roles'
  | '/endpoints'
  | '/datasets'

export type LifecycleStage = 'pregnant' | 'ttc' | 'postpartum'
export type AccountStatus   = 'active' | 'pending' | 'suspended'
export type ActivityLevel   = 'High' | 'Moderate' | 'Low'
export type CommunityTab    = 'groups' | 'posts' | 'reports'
export type MovementTab     = 'all' | 'pregnancy' | 'ttc' | 'postpartum'
export type ToastType       = 'success' | 'warning' | 'error' | 'info'
export type SimStage        = 'pregnant' | 'ttc' | 'postpartum'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

export interface NavItem {
  href: NavRoute
  label: string
  iconKey: string
  badge?: number
  isTimeline?: boolean
  section: string
}

export interface User {
  id: string
  initials: string
  name: string
  email: string
  color: string
  stage: LifecycleStage
  timeline: string
  trimester?: string
  joinDate: string
  status: AccountStatus
}

export interface Group {
  id: string
  emoji: string
  emojiBg: string
  name: string
  subtitle: string
  typeBadge: string
  typeBadgeClass: string
  members: number
  createdDate: string
  activityLevel: ActivityLevel
  activityPct: number
}

export interface Post {
  id: string
  initials: string
  avatarBg: string
  author: string
  group: string
  stageInfo: string
  timestamp: string
  content: string
  tags: string[]
  media?: { type: 'image' | 'video'; filename: string; meta: string }
  likes: number
  comments: number
  flagged?: boolean
  reportCount?: number
  approved?: boolean
}

export interface Report {
  id: string
  contentTitle: string
  contentPreview: string
  group: string
  reporterInitials: string
  reporterBg: string
  reporterName: string
  reporterCount: string
  reason: string
  reasonStyle: 'rust' | 'gold' | 'neutral'
  date: string
  status: 'pending' | 'under-review' | 'resolved'
  dismissedWith?: string
}

export interface SimData {
  label: string
  movement: string[]
  nutrition: string[]
  journey: string[]
}
