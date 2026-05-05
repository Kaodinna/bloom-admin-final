'use client'

import React, { useEffect, useState } from 'react'
import type { SimStage } from '@/types'
import { getSimData } from '@/lib/data'
import { useToast } from '@/lib/toast'
import { PageHeader, BarRow } from '@/components/ui'
import { countUsers, countByStage, countTodayProtocols } from '@/lib/api'

const WEEK_HEIGHTS = [15,20,25,35,40,45,50,55,60,65,70,75,72,68,65,60,58,55,52,50,55,60,65,68,70,65,60,55,50,45,40,35,30,28,25,22,20,18,15,12]
const WEEK_COLORS  = [...Array(12).fill('#C9973A'), ...Array(14).fill('#2D6B4A'), ...Array(14).fill('#B85C38')]

const RULES = [
  {
    tag: 'Trying to Conceive', tagClass: 'bg-gold-dim text-brown', title: 'Conception Window Rules',
    desc: 'AI tracks cycle day and fertility window to adapt all three output modules.',
    rules: [
      { cond: 'IF cycle day 11–15',     action: 'Prioritise folate, pelvic mobility, ovulation tracking' },
      { cond: 'IF month ≥ 2',           action: 'Add CoQ10 nutrition focus + functional strength movement' },
      { cond: 'IF conception detected', action: 'Transition timeline to Pregnant Week 1 automatically' },
    ],
  },
  {
    tag: 'Pregnant', tagClass: 'bg-sage-light text-sage', title: 'Weekly Progression Rules (Week 1–40)',
    desc: 'The AI advances the pregnancy week daily and regenerates all three modules. Example: Week 15 → 16 updates movement safety, nutrition focus, and baby development content simultaneously.',
    rules: [
      { cond: 'IF week 1–12 (T1)',    action: 'Gentle movement only · Folate priority · Neural tube focus' },
      { cond: 'IF week 13–26 (T2)',   action: 'Moderate movement · DHA + Choline · Brain development content' },
      { cond: 'IF week 27–40 (T3)',   action: 'Intensity cap 50% · Calcium priority · Birth preparation milestones' },
      { cond: 'IF week = 40+ / birth',action: 'Transition to Postpartum Recovery Week 1' },
    ],
  },
  {
    tag: 'Postpartum', tagClass: 'bg-rust-light text-rust', title: 'Recovery Timeline Rules',
    desc: 'Post-birth timeline tracks recovery week and adapts hormone restoration, pelvic floor reactivation, and newborn care content.',
    rules: [
      { cond: 'IF recovery week 1–2', action: 'Rest only · No movement · Hormone restoration nutrition' },
      { cond: 'IF recovery week 3–6', action: 'Breathwork · Pelvic floor · Iron replenishment focus' },
      { cond: 'IF recovery week 6+',  action: 'Gradual strength reactivation · Full nutrition protocol resumes' },
    ],
  },
]

export default function TimelinePage() {
  const { toast } = useToast()
  const [simStage, setSimStage] = useState<SimStage>('pregnant')
  const [simWeek,  setSimWeek]  = useState(20)
  const [simMax,   setSimMax]   = useState(40)

  const [totalUsers, setTotalUsers] = useState('—')
  const [pregnant,   setPregnant]   = useState(0)
  const [ttc,        setTtc]        = useState(0)
  const [postpartum, setPostpartum] = useState(0)
  const [protocols,  setProtocols]  = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const [tot, p, t, pp, proto] = await Promise.all([
          countUsers(),
          countByStage('currently_pregnant'),
          countByStage('trying_to_conceive'),
          countByStage('postpartum'),
          countTodayProtocols(),
        ])
        setTotalUsers(tot.toLocaleString())
        setPregnant(p); setTtc(t); setPostpartum(pp); setProtocols(proto)
      } catch {
        // fallback to zeros — API not connected
      }
    }
    load()
  }, [])

  const simData   = getSimData(simStage, simWeek)
  const weekLabel = simStage === 'pregnant'   ? `Week ${simWeek}`
                  : simStage === 'ttc'        ? `Month ${simWeek}`
                  : `Recovery Week ${simWeek}`

  function handleStageChange(s: SimStage) {
    setSimStage(s)
    if      (s === 'ttc')       { setSimMax(12); setSimWeek(3)  }
    else if (s === 'postpartum'){ setSimMax(20); setSimWeek(4)  }
    else                        { setSimMax(40); setSimWeek(20) }
  }

  const total = pregnant + ttc + postpartum || 1
  const stageRows = [
    { stage: 'Stage 1', name: 'Trying to Conceive', count: `${ttc.toLocaleString()} users · Conception month`,    pct: Math.round(ttc        / total * 100), color: '#C9973A' },
    { stage: 'Stage 2', name: 'Pregnant',           count: `${pregnant.toLocaleString()} users · Week 1–40`,      pct: Math.round(pregnant   / total * 100), color: '#2D6B4A' },
    { stage: 'Stage 3', name: 'Postpartum',         count: `${postpartum.toLocaleString()} users · Recovery Wk+`, pct: Math.round(postpartum / total * 100), color: '#B85C38' },
  ]

  const moduleCards = [
    {
      icon: '⚡', bg: '#E0F4F4', title: 'Movement', sub: 'Daily exercise routine',
      badge: '#E0F4F4/#1F7A7A', count: 'AI generated daily', href: '/movement',
      items: [
        'Practice type selected by pregnancy stage + safety rules',
        'Intensity capped based on trimester week',
        'Pelvic floor focus adjusted week-by-week',
        'Energy + cortisol signals modify session type',
      ],
    },
    {
      icon: '🥗', bg: '#E8F2EC', title: 'Nutrition', sub: 'Daily nutrient focus',
      badge: '#E8F2EC/#2D6B4A', count: `${protocols.toLocaleString()} plans today`, href: '/nutrition',
      items: [
        'Nutrient priorities shift by baby development stage',
        '100-food dataset matched to current pregnancy week',
        'Blood→milk optimization for postpartum users',
        'Folate/DHA/Iron priorities recalculated daily',
      ],
    },
    {
      icon: '🗺', bg: '#F5EDD8', title: 'Way to Baby (Journey)', sub: 'Dynamic roadmap',
      badge: '#F5EDD8/#C9973A', count: `${totalUsers} journeys active`, href: '/timeline',
      items: [
        'Roadmap milestones update as timeline advances',
        'Baby development content tied to exact week',
        'Stage-specific goals recalculated on progression',
        'Postpartum recovery logic activates after birth',
      ],
    },
  ]

  return (
    <>
      {/* Hero banner */}
      <div className="timeline-banner relative bg-gradient-to-br from-ink via-[#3A2A18] to-ink rounded-[16px] p-[22px_26px] mb-5 overflow-hidden">
        <div className="relative z-10 flex items-start justify-between gap-5">
          <div>
            <div className="text-[.62rem] font-bold tracking-[2px] uppercase text-gold-light mb-[5px]">Core System</div>
            <div className="font-serif text-[1.65rem] text-white leading-[1.12] mb-[5px]">AI Timeline Engine</div>
            <div className="text-[.8rem] text-white/60 max-w-[480px] leading-[1.5]">
              A dynamic personalization engine that tracks each user&apos;s lifecycle position and automatically
              recalculates Movement, Nutrition, and Journey outputs every day.
            </div>
            <div className="flex gap-4 mt-[14px]">
              {[
                [totalUsers,                          'Active Timelines'],
                ['3',                                 'Lifecycle Stages'],
                ['Daily',                             'Recalibration'],
                [protocols > 0 ? protocols.toLocaleString() : '3', 'Output Modules'],
              ].map(([v, l]) => (
                <div key={l} className="text-center px-[18px] py-3 bg-white/[0.07] rounded-[10px] border border-gold/20">
                  <div className="font-serif text-[1.6rem] text-gold leading-none">{v}</div>
                  <div className="text-[.62rem] text-white/55 uppercase tracking-[1px] mt-[2px]">{l}</div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-white/[0.06] border border-gold/25 rounded-[12px] p-[14px_18px] min-w-[180px]">
              <div className="text-[.62rem] font-bold tracking-[1.5px] uppercase text-white/40 mb-[10px]">Module Status</div>
              {['Timeline Engine','Nutrition Module','Movement Module','Journey Module','Baby Development','Postpartum Logic'].map(m => (
                <div key={m} className="flex items-center justify-between mb-[7px]">
                  <div className="text-[.75rem] text-white/70">{m}</div>
                  <div className="w-[7px] h-[7px] rounded-full bg-sage pulse-dot" />
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-[10px]">
              <button onClick={() => toast('Scroll down to simulator')}
                className="bg-gold text-white text-[.72rem] font-semibold px-[11px] py-[5px] rounded-[9px] border-none cursor-pointer font-sans hover:opacity-85 transition-opacity">
                ▶ Simulate
              </button>
              <button onClick={() => toast('Force recalibrating…', 'success')}
                className="bg-white/10 text-white/70 text-[.72rem] font-semibold px-[11px] py-[5px] rounded-[9px] border-none cursor-pointer font-sans hover:bg-white/15 transition-colors">
                🔄 Recalibrate
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Lifecycle Distribution */}
      <div className="bg-ivory rounded-xl border border-cream-dark p-5 mb-5 shadow-sm">
        <div className="flex items-center justify-between mb-[18px]">
          <div>
            <div className="font-serif text-[1.05rem] text-ink">Lifecycle Stage Distribution</div>
            <div className="text-[.73rem] text-ink-soft mt-[2px]">Live user counts by journey stage</div>
          </div>
          <button onClick={() => toast('Distribution exported', 'success')}
            className="text-[.72rem] font-semibold border border-cream-dark text-ink-mid rounded-[9px] px-[11px] py-[5px] hover:bg-cream transition-colors bg-transparent cursor-pointer font-sans">
            ↓ Export
          </button>
        </div>

        <div className="flex border border-cream-dark rounded-[10px] overflow-hidden mb-4">
          {stageRows.map((p, i) => (
            <div key={p.name}
              className={`flex-1 p-[14px_16px] cursor-pointer hover:bg-gold-dim transition-colors ${i < 2 ? 'border-r border-cream-dark' : ''}`}
              onClick={() => toast(`Filtering by ${p.name}…`)}>
              <div className="text-[.63rem] font-bold tracking-[1.2px] uppercase text-ink-soft mb-1">{p.stage}</div>
              <div className="text-[.85rem] font-semibold text-ink mb-1">{p.name}</div>
              <div className="text-[.72rem] text-ink-soft">{p.count}</div>
              <div className="h-1 bg-cream-dark rounded-full mt-2 overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: p.color }} />
              </div>
              <div className="text-[.68rem] font-bold mt-1" style={{ color: p.color }}>{p.pct}%</div>
            </div>
          ))}
        </div>

        {/* Week strip */}
        <div className="flex justify-between text-[.68rem] font-semibold text-ink-soft mb-2">
          <span>Pregnant users by week (Week 1 → 40)</span>
          <span className="text-ink-xs">{pregnant > 0 ? `${pregnant.toLocaleString()} users total` : 'Week distribution'}</span>
        </div>
        <div className="flex gap-[2px] items-end h-[52px]">
          {WEEK_HEIGHTS.map((h, i) => (
            <div key={i} className="week-bar flex-1"
              title={`Week ${i + 1}`}
              style={{ height: `${h}px`, background: WEEK_COLORS[i], opacity: 0.7 }}
              onClick={() => toast(`Week ${i + 1} — approx ${Math.round(h * 30)}+ users`)} />
          ))}
        </div>
        <div className="flex justify-between text-[.6rem] text-ink-xs mt-[3px]">
          <span>W1</span><span>W10</span><span>W20</span><span>W30</span><span>W40</span>
        </div>
      </div>

      {/* Daily Output Modules */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-serif text-[1.1rem] text-ink">Daily AI Output Modules</div>
          <div className="text-[.75rem] text-ink-soft mt-[2px]">
            What the AI generates every day — connected through the timeline variable
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-[14px] mb-5">
        {moduleCards.map(m => {
          const [badgeBg, badgeColor] = m.badge.split('/')
          return (
            <div key={m.title} className="bg-ivory border border-cream-dark rounded-xl overflow-hidden shadow-sm">
              <div className="px-[15px] py-[13px] flex items-center gap-[10px] border-b border-cream">
                <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center text-[.95rem] flex-shrink-0"
                  style={{ background: m.bg }}>
                  {m.icon}
                </div>
                <div>
                  <div className="font-bold text-[.84rem] text-ink">{m.title}</div>
                  <div className="text-[.68rem] text-ink-soft mt-[1px]">{m.sub}</div>
                </div>
              </div>
              <div className="px-[15px] py-[13px]">
                {m.items.map(item => (
                  <div key={item} className="flex items-start gap-[7px] mb-2 text-[.77rem] text-ink-mid leading-[1.4]">
                    <div className="w-[5px] h-[5px] rounded-full bg-gold flex-shrink-0 mt-[5px]" />
                    {item}
                  </div>
                ))}
                <span className="inline-block text-[.62rem] font-bold px-[7px] py-[2px] rounded-full mt-[2px]"
                  style={{ background: badgeBg, color: badgeColor }}>
                  Updates daily
                </span>
              </div>
              <div className="px-[15px] py-[10px] border-t border-cream flex items-center justify-between">
                <div className="text-[.65rem] text-ink-xs flex items-center gap-1">
                  <span className="w-[5px] h-[5px] bg-sage rounded-full inline-block pulse-dot" />
                  {m.count}
                </div>
                <a href={m.href}
                  className="text-[.67rem] font-semibold border border-cream-dark text-ink-mid rounded-[7px] px-2 py-[3px] hover:bg-cream transition-colors no-underline">
                  Manage →
                </a>
              </div>
            </div>
          )
        })}
      </div>

      {/* Logic Rules */}
      <div className="font-serif text-[1.1rem] text-ink mb-[5px]">Stage-Based Logic Rules</div>
      <div className="text-[.75rem] text-ink-soft mb-[14px]">
        Rules that govern what the AI outputs — admins can override or adjust
      </div>
      {RULES.map(r => (
        <div key={r.title} className="bg-ivory border border-cream-dark rounded-xl p-4 mb-[10px]">
          <div className="flex items-center gap-[10px] mb-[10px]">
            <span className={`inline-flex items-center px-2 py-[3px] rounded-full text-[.65rem] font-bold ${r.tagClass}`}>
              {r.tag}
            </span>
            <span className="font-bold text-[.85rem] text-ink">{r.title}</span>
            <button onClick={() => toast('Opening rule editor…')}
              className="ml-auto text-[.67rem] font-semibold border border-cream-dark text-ink-mid rounded-[7px] px-2 py-[3px] bg-transparent hover:bg-cream cursor-pointer font-sans">
              Edit Rules
            </button>
          </div>
          <div className="text-[.77rem] text-ink-soft leading-[1.45] mb-[10px]">{r.desc}</div>
          <div className="flex flex-col gap-[5px]">
            {r.rules.map(rule => (
              <div key={rule.cond}
                className="flex items-center gap-2 text-[.75rem] text-ink-mid px-[10px] py-[6px] bg-cream rounded-[7px]">
                <span className="text-ink-soft text-[.7rem]">{rule.cond}</span>
                <span className="text-gold font-bold">→</span>
                <span className="text-ink-mid font-medium">{rule.action}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Simulator */}
      <div className="font-serif text-[1.1rem] text-ink mt-5 mb-[5px]">Output Preview Simulator</div>
      <div className="text-[.75rem] text-ink-soft mb-[14px]">Preview what the AI generates for any timeline position</div>
      <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden shadow-sm">
        <div className="bg-gradient-to-br from-gold-dim to-[#FDF8EF] border-b border-gold-light px-5 py-4 flex items-center gap-[14px]">
          <div className="w-[38px] h-[38px] bg-gold rounded-[10px] flex items-center justify-center text-[1.05rem] flex-shrink-0 shadow-gold">
            ▶
          </div>
          <div>
            <div className="font-bold text-[.92rem] text-ink">Simulate Timeline Output</div>
            <div className="text-[.72rem] text-ink-soft mt-[1px]">
              Select a stage and position to preview all three AI modules
            </div>
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <div>
              <div className="text-[.68rem] font-semibold text-ink-soft uppercase tracking-[.8px] mb-1">Stage</div>
              <select
                value={simStage}
                onChange={e => handleStageChange(e.target.value as SimStage)}
                className="appearance-none bg-cream border border-cream-dark rounded-[7px] px-[10px] pr-6 py-[6px] font-sans text-[.76rem] text-ink-mid cursor-pointer outline-none focus:border-gold"
                style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='9' height='5' fill='none'%3E%3Cpath d='M1 1l3.5 3.5L8 1' stroke='%238A7965' stroke-width='1.4' stroke-linecap='round'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center' }}
              >
                <option value="pregnant">Pregnant</option>
                <option value="ttc">Trying to Conceive</option>
                <option value="postpartum">Postpartum</option>
              </select>
            </div>

            <div className="flex-1">
              <div className="text-[.68rem] font-semibold text-ink-soft uppercase tracking-[.8px] mb-1">
                {simStage === 'pregnant' ? 'Pregnancy Week'
                 : simStage === 'ttc'   ? 'Month'
                 : 'Recovery Week'}:&nbsp;
                <span className="text-gold font-bold">{weekLabel}</span>
              </div>
              <input
                type="range"
                className="calib-slider w-full bg-cream-dark"
                min={1} max={simMax} value={simWeek}
                onChange={e => setSimWeek(Number(e.target.value))}
              />
            </div>

            <button onClick={() => toast('Preview refreshed', 'success')}
              className="bg-teal text-white text-[.72rem] font-semibold px-[11px] py-[5px] rounded-[9px] border-none cursor-pointer font-sans hover:opacity-85">
              Refresh
            </button>
          </div>

          <div className="bg-cream rounded-xl p-4 animate-fade-up">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-gold text-white text-[.72rem] font-bold px-[10px] py-1 rounded-full">
                {simData.label}
              </span>
              <span className="text-[.72rem] text-ink-soft">AI output preview</span>
            </div>
            <div className="grid grid-cols-3 gap-[10px]">
              {[
                { label: '⚡ Movement', color: '#1F7A7A', items: simData.movement },
                { label: '🥗 Nutrition', color: '#2D6B4A', items: simData.nutrition },
                { label: '🗺 Journey',   color: '#C9973A', items: simData.journey  },
              ].map(pillar => (
                <div key={pillar.label} className="bg-ivory rounded-[10px] p-[13px] border border-cream-dark">
                  <div className="text-[.62rem] font-bold tracking-[1px] uppercase mb-[6px]"
                    style={{ color: pillar.color }}>
                    {pillar.label}
                  </div>
                  {pillar.items.map(item => (
                    <div key={item}
                      className="text-[.75rem] text-ink-mid py-1 border-b border-cream last:border-0 leading-[1.4]">
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
