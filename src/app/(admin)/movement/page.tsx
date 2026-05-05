"use client";
import { useEffect, useState } from "react";
import type { MovementTab } from "@/types";
import { useToast } from "@/lib/toast";
import { PageHeader, StatCard, Tabs } from "@/components/ui";
import { fetchMovement } from "@/lib/api";

// ── Static practice library — AI selection logic reference ───
const PRACTICES = [
  {
    icon: "🧘",
    iconBg: "#E0F4F4",
    name: "Prenatal Yoga",
    desc: "Breath, flexibility & pelvic preparation",
    duration: "~30 min",
    intensity: "Gentle",
    intClass: "bg-sage-light text-sage",
    stages: ["Pregnancy — All Trimesters"],
    logic:
      "Triggered at all pregnancy stages. Intensity auto-adjusted by trimester. Pelvic floor focus intensified in T3.",
    routine: [
      ["Cat-Cow breath", "3 min"],
      ["Warrior I (modified)", "5 min"],
      ["Side-lying hip stretch", "4 min each side"],
      ["Seated pelvic floor engagement", "5 min"],
      ["Supported Savasana", "8 min"],
    ],
  },
  {
    icon: "🌿",
    iconBg: "#F5EDD8",
    name: "Functional Strength",
    desc: "Stability without compression",
    duration: "~25 min",
    intensity: "Moderate",
    intClass: "bg-gold-dim text-gold",
    stages: ["T1–T2 Pregnancy"],
    logic:
      "Unlocked after T1 Week 6 check. Blocked in T3. AI replaces with Gentle Yoga if user is in high-stress week.",
    routine: [
      ["Glute bridges", "3×12"],
      ["Wall squats (modified)", "3×10"],
      ["Bird dog hold", "30s×3"],
      ["Side-lying clamshells", "3×15"],
    ],
  },
  {
    icon: "🌬",
    iconBg: "#EDE6F5",
    name: "Breathwork & Nervous System",
    desc: "Vagal activation and deep rest",
    duration: "~15 min",
    intensity: "Restorative",
    intClass: "bg-violet-light text-violet",
    stages: ["All Stages — TTC, Pregnancy, Postpartum"],
    logic:
      "Available at all stages. AI prioritises this when user is in postpartum weeks 1–2 or when protocol.movement signals rest.",
    routine: [
      ["4-7-8 Breathing", "4 min"],
      ["Humming breath (Bhramari)", "3 min"],
      ["Body scan + diaphragmatic", "5 min"],
      ["Savasana with breath awareness", "3 min"],
    ],
  },
  {
    icon: "💚",
    iconBg: "#E8F2EC",
    name: "Mobility & Flow",
    desc: "Joint health and postural ease",
    duration: "~20 min",
    intensity: "Gentle",
    intClass: "bg-sage-light text-sage",
    stages: ["T2–T3 Pregnancy", "Postpartum Week 6+"],
    logic:
      "Selected during third trimester and postpartum active recovery. Prioritises hip and thoracic mobility.",
    routine: [
      ["Hip circles (seated)", "3 min"],
      ["Thoracic rotation stretch", "4 min"],
      ["Pigeon pose (supported)", "3 min each side"],
      ["Neck & shoulder release", "4 min"],
    ],
  },
  {
    icon: "🏃",
    iconBg: "#F5EDD8",
    name: "Light Walking Protocol",
    desc: "Safe cardio for all stages",
    duration: "20–30 min",
    intensity: "Light",
    intClass: "bg-gold-dim text-gold",
    stages: ["TTC", "T1–T2 Pregnancy", "Postpartum Week 3+"],
    logic:
      "Base movement for TTC users. Safe in all trimesters. Postpartum: introduced from Week 3 onward after rest phase.",
    routine: [
      ["Warm-up walk", "5 min"],
      ["Brisk walking", "15–20 min"],
      ["Cool-down + stretching", "5 min"],
    ],
  },
  {
    icon: "🤸",
    iconBg: "#EDE6F5",
    name: "Pelvic Floor Restoration",
    desc: "Recovery and reconnection",
    duration: "~10 min",
    intensity: "Restorative",
    intClass: "bg-violet-light text-violet",
    stages: ["Postpartum Week 1+"],
    logic:
      "Core postpartum practice. AI triggers from Week 1 onward. Progresses in complexity week by week through the recovery phase.",
    routine: [
      ["Diaphragmatic breathing", "3 min"],
      ["Heel slides", "2×10"],
      ["Pelvic floor engagement", "5 min"],
    ],
  },
];

const STAGE_FILTER: Record<MovementTab, (p: (typeof PRACTICES)[0]) => boolean> =
  {
    all: () => true,
    pregnancy: (p) =>
      p.stages.some(
        (s) =>
          s.toLowerCase().includes("pregnancy") ||
          s.toLowerCase().includes("trimester"),
      ),
    ttc: (p) =>
      p.stages.some(
        (s) =>
          s.toLowerCase().includes("ttc") ||
          s.toLowerCase().includes("all stage"),
      ),
    postpartum: (p) =>
      p.stages.some((s) => s.toLowerCase().includes("postpartum")),
  };

interface BubbleMovement {
  _id: string;
  title?: string;
  category?: string;
  duration?: string;
  "Created Date"?: number;
}

function PracticeCard({ p }: { p: (typeof PRACTICES)[0] }) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-ivory border border-cream-dark rounded-xl p-4 mb-[10px] hover:shadow-md transition-shadow">
      <div className="flex items-start gap-[11px]">
        <div
          className="w-10 h-10 rounded-[9px] flex items-center justify-center text-[1rem] flex-shrink-0"
          style={{ background: p.iconBg }}
        >
          {p.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="font-bold text-[.87rem] text-ink">{p.name}</div>
            <button
              onClick={() => toast("Edit practice in generate_movement prompt")}
              className="text-[.67rem] font-semibold border border-cream-dark text-ink-mid rounded-[7px] px-2 py-[3px] bg-transparent hover:bg-cream cursor-pointer font-sans"
            >
              Edit
            </button>
          </div>
          <div className="text-[.73rem] text-ink-soft mt-[2px]">{p.desc}</div>
          <div className="flex items-center gap-[9px] mt-[7px] flex-wrap">
            <span className="text-[.7rem] text-gold font-semibold">
              ⏱ {p.duration}
            </span>
            <span
              className={`text-[.65rem] font-bold px-2 py-[2px] rounded-full ${p.intClass}`}
            >
              {p.intensity}
            </span>
            {p.stages.map((s) => (
              <span key={s} className="text-[.63rem] text-ink-soft">
                {s}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-[9px] px-[9px] py-[9px] bg-cream rounded-[7px] text-[.71rem] text-ink-soft leading-[1.43]">
        <strong className="text-ink-mid">AI selection logic:</strong> {p.logic}
      </div>

      {open && (
        <div className="mt-3 flex flex-col gap-[5px]">
          {p.routine.map(([name, time]) => (
            <div
              key={name}
              className="flex items-center justify-between bg-cream rounded-[8px] px-3 py-[9px] hover:bg-cream-dark transition-colors"
            >
              <div className="flex items-center gap-[7px] text-[.78rem] text-ink-mid">
                <div className="w-[6px] h-[6px] bg-gold rounded-full flex-shrink-0" />
                {name}
              </div>
              <div className="text-[.71rem] text-ink-soft font-medium">
                {time}
              </div>
            </div>
          ))}
          <div className="flex gap-[7px] mt-[10px]">
            <button
              onClick={() =>
                toast("Edit in Bubble API Connector → generate_movement prompt")
              }
              className="text-[.72rem] font-semibold border border-cream-dark text-ink-mid rounded-[9px] px-[11px] py-[5px] bg-transparent hover:bg-cream cursor-pointer font-sans"
            >
              Edit Routine
            </button>
            <button
              onClick={() => toast("Published", "success")}
              className="text-[.72rem] font-semibold bg-gold text-white rounded-[9px] px-[11px] py-[5px] border-none cursor-pointer font-sans hover:opacity-85"
            >
              Publish
            </button>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((o) => !o)}
        className="mt-[7px] text-[.7rem] text-gold cursor-pointer bg-transparent border-none font-sans font-medium hover:opacity-75"
      >
        {open ? "▾ Close routine" : "▸ View full routine"}
      </button>
    </div>
  );
}

export default function MovementPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<MovementTab>("all");
  const [recent, setRecent] = useState<BubbleMovement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMovement(10)
      .then((m) => {
        setRecent(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = PRACTICES.filter(STAGE_FILTER[tab]);

  const TABS = [
    { id: "all" as MovementTab, label: "All Practices" },
    { id: "pregnancy" as MovementTab, label: "Pregnancy" },
    { id: "ttc" as MovementTab, label: "TTC" },
    { id: "postpartum" as MovementTab, label: "Postpartum" },
  ];

  return (
    <>
      <PageHeader
        title="Movement Module"
        sub={`${PRACTICES.length} practice templates`}
        // action={
        //   <button
        //     onClick={() =>
        //       toast("Add practice: update generate_movement prompt in Bubble")
        //     }
        //     className="bg-gold text-white text-[.79rem] font-semibold rounded-[9px] px-4 py-[7px] border-none cursor-pointer font-sans hover:opacity-85"
        //   >
        //     + Add Practice
        //   </button>
        // }
      />

      {/* <div className="bg-gradient-to-br from-teal-light to-[#EBF8F8] border border-[#B8E0E0] rounded-xl px-[18px] py-[14px] mb-5 flex items-center gap-3">
        <div className="w-9 h-9 bg-teal rounded-[9px] flex items-center justify-center text-[.95rem] flex-shrink-0">🔗</div>
        <div>
          <div className="font-bold text-[.85rem] text-teal">Connected to AI Timeline Engine via /wf/generate_movement</div>
          <div className="text-[.74rem] text-[#2A6060] mt-[1px]">
            Practice selection and intensity limits are read by the AI daily. Safety rules: T3 intensity cap 50% · Recovery week 1–2 movement blocked · Breathwork prioritised when protocol.movement signals rest.
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-4 gap-[13px] mb-5">
        <StatCard
          label="Practice Templates"
          value={PRACTICES.length.toString()}
          delta="Active in AI prompt"
          deltaUp
          icon="📋"
          iconBg="#F5EDD8"
        />
        <StatCard
          label="Generated Today (Bubble)"
          value={loading ? "…" : recent.length.toString()}
          delta="Live from /obj/movement"
          deltaUp
          icon="⚡"
          iconBg="#E0F4F4"
        />
        <StatCard
          label="Stages Covered"
          value="3"
          delta="TTC · Pregnancy · Postpartum"
          deltaUp
          icon="🗺️"
          iconBg="#E8F2EC"
        />
        <StatCard
          label="Safety Rules Active"
          value="4"
          delta="T3 cap · Recovery block · etc."
          deltaUp
          icon="🛡️"
          iconBg="#EDE6F5"
        />
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      <div className="mb-5">
        {filtered.length === 0 ? (
          <div className="bg-ivory border border-cream-dark rounded-xl p-6 text-center text-[.83rem] text-ink-soft">
            No practices in this filter
          </div>
        ) : (
          filtered.map((p) => <PracticeCard key={p.name} p={p} />)
        )}
      </div>

      {/* Recent generated records from Bubble */}
      <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden">
        <div className="px-[18px] py-[13px] border-b border-cream bg-cream">
          <div className="font-bold text-[.85rem] text-ink">
            Recent Generated Sessions (Live from Bubble /obj/movement)
          </div>
        </div>
        <div className="divide-y divide-cream">
          {loading ? (
            <div className="px-5 py-4 text-[.78rem] text-ink-soft">
              Loading from Bubble…
            </div>
          ) : recent.length === 0 ? (
            <div className="px-5 py-4 text-[.78rem] text-ink-soft">
              No movement records found — add NEXT_PUBLIC_BUBBLE_BASE_URL to
              .env.local
            </div>
          ) : (
            recent.map((m) => (
              <div key={m._id} className="px-5 py-3 flex items-center gap-3">
                <div className="w-8 h-8 rounded-[8px] bg-cream flex items-center justify-center text-[.85rem] flex-shrink-0">
                  ⚡
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-[.79rem] text-ink">
                    {m.title ?? "—"}
                  </div>
                  <div className="text-[.63rem] text-ink-soft">
                    {m.category ?? "—"} · {m.duration ?? "—"}
                  </div>
                </div>
                <div className="text-[.62rem] text-ink-xs">
                  {m["Created Date"]
                    ? new Date(m["Created Date"]).toLocaleDateString()
                    : "—"}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
