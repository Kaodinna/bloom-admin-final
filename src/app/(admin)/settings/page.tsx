'use client'

import React from 'react'
import { useToast } from '@/lib/toast'
import { PageHeader, Toggle } from '@/components/ui'

function SettingsSection({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="bg-ivory rounded-xl border border-cream-dark overflow-hidden mb-4">
      <div className="px-[18px] py-[13px] border-b border-cream bg-cream">
        <div className="font-bold text-[.85rem] text-ink">{title}</div>
        {desc && <div className="text-[.71rem] text-ink-soft mt-[1px]">{desc}</div>}
      </div>
      {children}
    </div>
  )
}

function SettingsRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-[14px] px-[18px] py-3 border-b border-cream last:border-0 hover:bg-[#FDFAF6] transition-colors">
      <div className="flex-1">
        <div className="text-[.8rem] font-medium text-ink-mid">{label}</div>
        {sub && <div className="text-[.68rem] text-ink-soft mt-[1px]">{sub}</div>}
      </div>
      {children}
    </div>
  )
}

export default function SettingsPage() {
  const { toast } = useToast()

  return (
    <>
      <PageHeader
        title="Settings"
        sub="Configure AI timeline engine, modules, safety filters, and platform behaviour"
      />

      <SettingsSection title="AI Timeline Engine" desc="Core engine that drives all daily personalization — controls daily recalibration cycle">
        <SettingsRow label="Enable Daily Auto-Recalibration" sub="Recalculates all user outputs every day at midnight">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
        <SettingsRow label="Timeline Transition Logic" sub="Auto-advance users between stages (TTC → Pregnant → Postpartum)">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
        <SettingsRow label="Recalibration Time" sub="When the daily engine runs">
          <select className="appearance-none bg-cream border border-cream-dark rounded-[7px] px-[10px] pr-6 py-[6px] font-sans text-[.76rem] text-ink-mid cursor-pointer outline-none"
            onChange={() => toast('Time updated')}
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='5' fill='none'%3E%3Cpath d='M1 1l3.5 3.5L8 1' stroke='%238A7965' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}>
            <option>Midnight (00:00)</option><option>3:00 AM</option><option>6:00 AM</option>
          </select>
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="AI Nutrition Module" desc="AI reads this module to generate daily nutrition plans">
        <SettingsRow label="Enable AI Nutrition Generation" sub="Auto-generate personalised nutrition plans from timeline">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
        <SettingsRow label="Require Admin Review" sub="Hold nutrition plans for review before delivery">
          <Toggle onChange={() => toast('Setting updated')} />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Movement Module — Safety Filters" desc="Critical safety rules applied before any movement output is delivered">
        <SettingsRow label="Enable AI Movement Generation" sub="Auto-select and adapt movement practices from timeline">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
        <SettingsRow label="T3 Intensity Cap (%)" sub="Maximum AI-assigned intensity for Third Trimester users">
          <input type="number" defaultValue={50} onChange={() => toast('Value updated')}
            className="w-[72px] bg-cream border border-cream-dark rounded-[7px] px-[11px] py-[6px] font-sans text-[.78rem] text-ink outline-none focus:border-gold transition-colors" />
        </SettingsRow>
        <SettingsRow label="Recovery Week 1–2 Movement Block" sub="Block all movement output for postpartum users in first 2 weeks">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
        <SettingsRow label="Cortisol Safety Override" sub="Replace dynamic sessions with Restorative when cortisol signal is elevated">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Community Moderation" desc="Automated safety filters and content policies">
        <SettingsRow label="Auto-flag Medical Misinformation" sub="AI scans posts for potentially unsafe medical advice">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
        <SettingsRow label="Three-Strike Auto-Suspension" sub="Automatically suspend accounts with 3 guideline violations">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
        <SettingsRow label="New Member Post Limit" sub="Max posts per day for accounts under 7 days old">
          <input type="number" defaultValue={3} onChange={() => toast('Value updated')}
            className="w-[72px] bg-cream border border-cream-dark rounded-[7px] px-[11px] py-[6px] font-sans text-[.78rem] text-ink outline-none focus:border-gold transition-colors" />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Notifications & Alerts" desc="Control which events trigger admin notifications">
        <SettingsRow label="User Registration Alerts" sub="Notify when new users join the platform">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
        <SettingsRow label="AI Anomaly Alerts" sub="Alert when AI output falls outside safe ranges (nutrition + movement)">
          <Toggle defaultOn onChange={() => toast('Setting updated')} />
        </SettingsRow>
        <SettingsRow label="Weekly Analytics Email" sub="Recipient address for automated weekly reports">
          <input type="email" defaultValue="admin@bloomapp.com" onChange={() => toast('Email updated')}
            className="bg-cream border border-cream-dark rounded-[7px] px-[11px] py-[6px] font-sans text-[.78rem] text-ink outline-none focus:border-gold transition-colors min-w-[200px]" />
        </SettingsRow>
      </SettingsSection>

      <SettingsSection title="Bubble API Configuration" desc="Backend connection — set NEXT_PUBLIC_BUBBLE_BASE_URL in .env.local">
        <SettingsRow label="Bubble Base URL" sub="https://your-app.bubbleapps.io/version-test/api/1.1">
          <code className="text-[.7rem] font-mono bg-cream border border-cream-dark px-2 py-1 rounded-[5px] text-ink-mid">
            NEXT_PUBLIC_BUBBLE_BASE_URL
          </code>
        </SettingsRow>
        <SettingsRow label="Admin Login Endpoint" sub="POST /wf/admin_login — requires is_admin = true on User record">
          <span className="text-[.7rem] text-ink-soft">/wf/admin_login</span>
        </SettingsRow>
        <SettingsRow label="Data API — User type" sub="Enable in Bubble: Data → API → User → GET enabled">
          <span className="text-[.7rem] text-[#2D6B4A] font-semibold">Required</span>
        </SettingsRow>
        <SettingsRow label="Data API — All types" sub="Meal, Movement, Protocol, Post, Group, Comment, Message, JourneyPhase, Milestone, WeekDetail, RecoveryDetail">
          <span className="text-[.7rem] text-[#2D6B4A] font-semibold">GET + POST required</span>
        </SettingsRow>
        <SettingsRow label="Workflow API" sub="recalibrate, generate_nutrition, generate_movement, generate_journey, generate_week_detail, generate_recovery_detail, admin_login">
          <span className="text-[.7rem] text-[#2D6B4A] font-semibold">Must be public</span>
        </SettingsRow>
      </SettingsSection>

      <div className="flex gap-[9px] mt-1">
        <button onClick={() => toast('Settings saved', 'success')} className="bg-gold text-white text-[.79rem] font-semibold rounded-[9px] px-4 py-[7px] border-none cursor-pointer font-sans hover:opacity-85 transition-opacity">Save Changes</button>
        <button onClick={() => toast('Reset to defaults', 'warning')} className="text-[.79rem] font-semibold border border-cream-dark text-ink-mid rounded-[9px] px-4 py-[7px] bg-transparent hover:bg-cream cursor-pointer font-sans transition-colors">Reset Defaults</button>
      </div>
    </>
  )
}
