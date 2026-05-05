"use client";
import { useEffect, useState } from "react";
import { PageHeader, StatCard, Card, CardTitle } from "@/components/ui";
import { fetchMeals } from "@/lib/api";
import { useToast } from "@/lib/toast";

const NUTRIENTS = [
  {
    stage: "All Stages",
    name: "Folate (B9)",
    desc: "Neural tube formation, egg development. 400mcg daily. AI prioritises during TTC and T1.",
    sources: ["Spinach", "Asparagus", "Lentils", "Avocado"],
    color: "text-rust",
  },
  {
    stage: "T2 (Wk 13–26)",
    name: "DHA (Omega-3)",
    desc: "Brain architecture. AI peaks this at Week 17–20 neural formation window. Dataset: Salmon, Walnuts.",
    sources: ["Salmon", "Walnuts", "Chia seeds", "Flaxseeds"],
    color: "text-rust",
  },
  {
    stage: "Preconception",
    name: "CoQ10",
    desc: "90-day pre-conception window for egg quality. 600mg with food.",
    sources: ["Organ meat", "Fatty fish", "Supplement"],
    color: "text-gold",
  },
  {
    stage: "Postpartum",
    name: "Iron",
    desc: "Post-birth replenishment. AI switches to iron priority at Recovery Week 1. Blood→milk quality.",
    sources: ["Red meat", "Lentils", "Spinach", "Vitamin C"],
    color: "text-rust",
  },
  {
    stage: "Brain Dev",
    name: "Choline",
    desc: "Memory centre development. Often deficient in standard prenatal vitamins. Evening milk is richer.",
    sources: ["Eggs", "Duck eggs", "Broccoli", "Lean meat"],
    color: "text-gold",
  },
  {
    stage: "Bone Dev (T2-T3)",
    name: "Calcium",
    desc: "Skeletal mineralisation. Pair with Vitamin D. AI increases at Week 13 skeleton hardening.",
    sources: ["Greek yogurt", "Sesame seeds", "Almonds", "Kale"],
    color: "text-gold",
  },
  {
    stage: "Postpartum Milk",
    name: "Prolactin support",
    desc: "Evening feeds peak prolactin. Dataset milk-boosters: Oats, Fennel, Dates, Eggs, Salmon.",
    sources: ["Oats", "Fennel", "Dates", "Salmon"],
    color: "text-sage",
  },
  {
    stage: "Wk 36+",
    name: "Magnesium",
    desc: "Cervical ripening preparation. Dates (week 36+) clinically linked to shorter labour.",
    sources: ["Dates", "Pumpkin seeds", "Cashews", "Dark chocolate"],
    color: "text-teal",
  },
];

interface BubbleMeal {
  _id: string;
  meal_type?: string;
  name?: string;
  nutrients?: string;
  baby_benefit?: string;
  "Created Date"?: number;
}

export default function NutritionPage() {
  const { toast } = useToast();
  const [meals, setMeals] = useState<BubbleMeal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMeals(20)
      .then((m) => {
        setMeals(m);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const mealCounts = meals.reduce<Record<string, number>>((acc, m) => {
    const t = m.meal_type ?? "unknown";
    acc[t] = (acc[t] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Nutrition Module"
        sub="100-food pregnancy dataset · Week-matched AI recommendations · Blood→Milk optimization"
        action={
          <button
            onClick={() =>
              toast("Food dataset at src/data/pregnancy_foods.json")
            }
            className="bg-gold text-white text-[.79rem] font-semibold rounded-[9px] px-4 py-[7px] border-none cursor-pointer font-sans hover:opacity-85"
          >
            📁 View Dataset
          </button>
        }
      />

      {/* AI Connection */}
      {/* <div className="bg-gradient-to-br from-sage-light to-[#F0FAF5] border border-[#C8E8D4] rounded-xl px-[18px] py-[14px] mb-5 flex items-center gap-3">
        <div className="w-9 h-9 bg-sage rounded-[9px] flex items-center justify-center text-[.95rem] flex-shrink-0">🔗</div>
        <div>
          <div className="font-bold text-[.85rem] text-sage">Connected to AI Timeline Engine + 100-food Dataset</div>
          <div className="text-[.74rem] text-[#3A7A55] mt-[1px]">
            Frontend computes week_context + food_matches + food_detail from pregnancy_foods.json and passes to generate_nutrition prompt.
            Postpartum users also receive blood→milk optimization context (milk_logic, milk_boosters, evening_feeding).
          </div>
        </div>
      </div> */}

      <div className="grid grid-cols-3 gap-[13px] mb-5">
        <StatCard
          label="Total Meals Generated"
          value={loading ? "…" : meals.length.toString()}
          delta="Live from Bubble /obj/meal"
          deltaUp
          icon="🥗"
          iconBg="#E8F2EC"
        />
        <StatCard
          label="Breakfasts"
          value={loading ? "…" : (mealCounts.breakfast ?? 0).toString()}
          delta="With baby_benefit field"
          deltaUp
          icon="🌅"
          iconBg="#F5EDD8"
        />
        <StatCard
          label="Dinners"
          value={loading ? "…" : (mealCounts.dinner ?? 0).toString()}
          delta="With mother_benefit field"
          deltaUp
          icon="🌙"
          iconBg="#EDE6F5"
        />
      </div>

      {/* Nutrient database */}
      <div className="text-[.68rem] font-bold uppercase tracking-[.8px] text-ink-soft mb-3">
        Nutrient Intelligence Database (AI Prompt Context)
      </div>
      <div className="grid grid-cols-2 gap-[13px] mb-5">
        {NUTRIENTS.map((n) => (
          <div
            key={n.name}
            className="bg-ivory border border-cream-dark rounded-xl p-4 hover:shadow-md transition-shadow"
          >
            <div
              className={`text-[.61rem] font-bold tracking-[.9px] uppercase ${n.color} mb-1`}
            >
              ● {n.stage}
            </div>
            <div className="font-bold text-[.86rem] text-ink mb-[3px]">
              {n.name}
            </div>
            <div className="text-[.73rem] text-ink-soft leading-[1.4] mb-[10px]">
              {n.desc}
            </div>
            <div className="flex flex-wrap gap-[5px]">
              {n.sources.map((s) => (
                <span
                  key={s}
                  className="bg-gold-dim text-brown text-[.64rem] font-medium px-2 py-[3px] rounded-full"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Recent meals from Bubble */}
      <Card>
        <CardTitle>Recent Generated Meals (Live from Bubble)</CardTitle>
        {loading ? (
          <p className="text-[.78rem] text-ink-soft mt-3">Loading…</p>
        ) : meals.length === 0 ? (
          <p className="text-[.78rem] text-ink-soft mt-3">
            No meals found — add NEXT_PUBLIC_BUBBLE_BASE_URL to .env.local
          </p>
        ) : (
          meals.slice(0, 8).map((m, i) => (
            <div
              key={m._id}
              className={`py-2.5 flex items-start gap-3 ${i < 7 ? "border-b border-cream" : ""}`}
            >
              <div className="w-8 h-8 rounded-[8px] flex items-center justify-center text-[.8rem] flex-shrink-0 bg-cream">
                {m.meal_type === "breakfast"
                  ? "🌅"
                  : m.meal_type === "lunch"
                    ? "☀️"
                    : m.meal_type === "dinner"
                      ? "🌙"
                      : "🍎"}
              </div>
              <div className="flex-1">
                <div className="font-semibold text-[.79rem] text-ink">
                  {m.name ?? "—"}
                </div>
                <div className="text-[.63rem] text-ink-soft">
                  {m.nutrients ?? "—"}
                </div>
                {m.baby_benefit && (
                  <div className="text-[.63rem] text-[#2D6B4A] mt-0.5 italic">
                    {m.baby_benefit.slice(0, 80)}…
                  </div>
                )}
              </div>
              <div className="text-[.62rem] text-ink-xs capitalize">
                {m.meal_type}
              </div>
            </div>
          ))
        )}
      </Card>
    </>
  );
}
