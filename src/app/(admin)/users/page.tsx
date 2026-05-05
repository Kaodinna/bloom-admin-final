"use client";
import { useEffect, useState } from "react";
import { useToast } from "@/lib/toast";
import {
  PageHeader,
  Badge,
  Dropdown,
  Avatar,
  TableWrap,
  TableToolbar,
  SearchInput,
  SelectFilter,
  Th,
  Td,
} from "@/components/ui";
import { fetchUsers, updateUser, recalibrateUser } from "@/lib/api";

interface BubbleUser {
  _id: string;
  first_name?: string;
  email?: string;
  authentication?: {
    email?: {
      email: string;
    };
  };
  journey_type?: string;
  current_week?: number;
  fertility_score?: number;
  skin_type?: string;
  city?: string;
  job_type?: string;
  onboarding_done?: boolean;
  "Created Date"?: number;
  status?: string;
}

function stageLabel(jt?: string) {
  if (jt === "currently_pregnant") return "Pregnant";
  if (jt === "trying_to_conceive") return "Trying to Conceive";
  if (jt === "postpartum") return "Postpartum";
  return "Unknown";
}
function stageBadge(jt?: string): "pregnant" | "ttc" | "postpartum" | "active" {
  if (jt === "currently_pregnant") return "pregnant";
  if (jt === "trying_to_conceive") return "ttc";
  if (jt === "postpartum") return "postpartum";
  return "active";
}
function timeline(user: BubbleUser) {
  const jt = user.journey_type;
  if (jt === "currently_pregnant")
    return user.current_week ? `Week ${user.current_week}` : "Pregnant";
  if (jt === "postpartum")
    return user.current_week
      ? `Recovery Wk ${user.current_week}`
      : "Postpartum";
  return "TTC";
}
function initials(name?: string) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
const COLORS = [
  "#7B9E87",
  "#C9973A",
  "#9B7EA6",
  "#5C8A7A",
  "#B8956A",
  "#7A8FA6",
  "#A67B5B",
  "#7A9E6A",
];

function UserModal({
  user,
  onClose,
  onAction,
}: {
  user: BubbleUser | null;
  onClose: () => void;
  onAction: () => void;
}) {
  const { toast } = useToast();
  if (!user) return null;

  async function suspend() {
    await updateUser(user?._id ?? "", { status: "suspended" });
    toast("User suspended", "warning");
    onAction();
    onClose();
  }
  async function reinstate() {
    await updateUser(user?._id ?? "", { status: "active" });
    toast("User reinstated", "success");
    onAction();
    onClose();
  }
  async function recalibrate() {
    await recalibrateUser(user?._id ?? "");
    toast("AI recalibration triggered", "success");
    onClose();
  }

  return (
    <div
      className="fixed inset-0 bg-ink/40 z-[200] flex items-center justify-center backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-ivory rounded-[16px] p-[26px] w-[520px] max-w-[90vw] shadow-md relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-[14px] right-[16px] bg-transparent border-none text-[1.3rem] cursor-pointer text-ink-soft"
        >
          ×
        </button>

        <div className="font-serif text-[1.3rem] text-ink mb-[3px]">
          {user.first_name ?? "Unknown"}
        </div>
        <div className="text-[.78rem] text-ink-soft mb-[18px]">
          {stageLabel(user.journey_type)} · {timeline(user)}
        </div>

        <div className="grid grid-cols-3 gap-[10px] mb-4">
          {[
            { label: "Stage", value: stageLabel(user.journey_type) },
            {
              label: "Week",
              value: user.current_week ? `Week ${user.current_week}` : "—",
              color: "#C9973A",
            },
            {
              label: "Score",
              value: user.fertility_score ? `${user.fertility_score}` : "—",
              color: "#2D6B4A",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-cream rounded-[9px] px-[13px] py-[11px]"
            >
              <div className="text-[.61rem] font-bold tracking-[.9px] uppercase text-ink-soft mb-[3px]">
                {s.label}
              </div>
              <div
                className="font-serif text-[1.15rem] leading-none"
                style={{ color: (s as { color?: string }).color ?? "#1C1510" }}
              >
                {s.value}
              </div>
            </div>
          ))}
        </div>

        <div className="text-[.71rem] font-bold uppercase tracking-[1px] text-ink-soft mb-2">
          Profile Details
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[
            ["Email", user.authentication?.email?.email ?? "—"],
            ["City", user.city ?? "—"],
            ["Job", user.job_type ?? "—"],
            ["Skin type", user.skin_type ?? "—"],
            ["Onboarding", user.onboarding_done ? "Complete" : "Pending"],
            [
              "Joined",
              user["Created Date"]
                ? new Date(user["Created Date"]).toLocaleDateString()
                : "—",
            ],
          ].map(([l, v]) => (
            <div key={l as string} className="text-[.73rem]">
              <span className="text-ink-soft">{l as string}: </span>
              <span className="text-ink font-medium">{v as string}</span>
            </div>
          ))}
        </div>

        <div className="flex gap-2 justify-end mt-[18px]">
          {user.status === "suspended" ? (
            <button
              onClick={reinstate}
              className="text-[.79rem] font-semibold border border-cream-dark text-ink-mid rounded-[9px] px-4 py-[7px] bg-transparent hover:bg-cream cursor-pointer font-sans"
            >
              ✓ Reinstate
            </button>
          ) : (
            <button
              onClick={suspend}
              className="text-[.79rem] font-semibold border border-cream-dark text-ink-mid rounded-[9px] px-4 py-[7px] bg-transparent hover:bg-cream cursor-pointer font-sans"
            >
              ⊘ Suspend
            </button>
          )}
          <button
            onClick={recalibrate}
            className="text-[.79rem] font-semibold border border-cream-dark text-ink-mid rounded-[9px] px-4 py-[7px] bg-transparent hover:bg-cream cursor-pointer font-sans"
          >
            🔄 Recalibrate AI
          </button>
          <button
            onClick={onClose}
            className="text-[.79rem] font-semibold bg-gold text-white rounded-[9px] px-4 py-[7px] border-none cursor-pointer font-sans"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function UsersPage() {
  const { toast } = useToast();
  const [users, setUsers] = useState<BubbleUser[]>([]);
  const [search, setSearch] = useState("");
  const [stage, setStage] = useState("All Stages");
  const [selected, setSelected] = useState<BubbleUser | null>(null);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await fetchUsers();
      setUsers(data);
    } catch {
      toast("Could not load users — check API connection", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const STAGE_MAP: Record<string, string> = {
    Pregnant: "currently_pregnant",
    Trying: "trying_to_conceive",
    Postpartum: "postpartum",
  };

  const filtered = users.filter((u) => {
    const name = u.first_name?.toLowerCase() ?? "";
    const matchSearch =
      name.includes(search.toLowerCase()) ||
      u._id.includes(search) ||
      (u.email?.includes(search) ?? false);
    const matchStage =
      stage === "All Stages" || u.journey_type === STAGE_MAP[stage];
    return matchSearch && matchStage;
  });

  async function handleSuspend(u: BubbleUser) {
    await updateUser(u._id, { status: "suspended" });
    toast(`${u.first_name} suspended`, "warning");
    load();
  }

  function getMenuItems(u: BubbleUser) {
    return [
      { label: "👤 View Profile", onClick: () => setSelected(u) },
      {
        label: "🔄 Recalibrate AI",
        onClick: async () => {
          await recalibrateUser(u._id);
          toast("Recalibration triggered", "success");
        },
      },
      u.status === "suspended"
        ? {
            label: "✓ Reinstate",
            onClick: async () => {
              await updateUser(u._id, { status: "active" });
              toast("Reinstated", "success");
              load();
            },
          }
        : { label: "⊘ Suspend", onClick: () => handleSuspend(u), danger: true },
    ];
  }

  return (
    <>
      <PageHeader
        title="Users"
        sub={`Manage Bloom accounts · ${loading ? "…" : users.length} total users`}
        // action={
        //   <button
        //     onClick={() => toast("Add user form — connect to /wf/signup")}
        //     className="bg-gold text-white text-[.79rem] font-semibold rounded-[9px] px-4 py-[7px] border-none cursor-pointer font-sans hover:opacity-85"
        //   >
        //     + Add User
        //   </button>
        // }
      />

      <TableWrap>
        <TableToolbar>
          <SearchInput
            placeholder="Search by name, email, ID…"
            value={search}
            onChange={setSearch}
          />
          <SelectFilter
            options={["All Stages", "Pregnant", "Trying", "Postpartum"]}
            onChange={setStage}
          />
          <span className="text-[.7rem] text-ink-soft ml-auto whitespace-nowrap">
            {loading
              ? "Loading…"
              : `Showing ${filtered.length} of ${users.length}`}
          </span>
        </TableToolbar>

        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-cream-dark">
              <Th>User</Th>
              <Th>Journey Stage</Th>
              <Th>Timeline</Th>
              <Th>Score</Th>
              <Th>City</Th>
              <Th>Onboarding</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-ink-soft text-[.78rem]"
                >
                  Loading users from Bubble…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  className="text-center py-8 text-ink-soft text-[.78rem]"
                >
                  No users found
                </td>
              </tr>
            ) : (
              filtered.map((user, idx) => (
                <tr
                  key={user._id}
                  className="border-b border-cream hover:bg-[#FDFAF6] transition-colors cursor-pointer last:border-0"
                  onClick={() => setSelected(user)}
                >
                  <Td>
                    <div className="flex items-center gap-2">
                      <Avatar
                        initials={initials(user.first_name)}
                        color={COLORS[idx % COLORS.length]}
                        size={28}
                      />
                      <div>
                        <div className="font-semibold text-ink text-[.79rem]">
                          {user.first_name ?? "Unknown"}
                        </div>
                        <div className="text-[.63rem] text-ink-soft">
                          {user?.authentication?.email?.email ??
                            user._id.slice(0, 12)}
                        </div>
                      </div>
                    </div>
                  </Td>
                  <Td>
                    <Badge variant={stageBadge(user.journey_type)}>
                      {stageLabel(user.journey_type)}
                    </Badge>
                  </Td>
                  <Td className="text-ink-soft">{timeline(user)}</Td>
                  <Td className="text-ink-soft">
                    {user.fertility_score ? (
                      <span
                        className="font-semibold"
                        style={{
                          color:
                            user.fertility_score >= 70 ? "#2D6B4A" : "#C9973A",
                        }}
                      >
                        {user.fertility_score}/100
                      </span>
                    ) : (
                      "—"
                    )}
                  </Td>
                  <Td className="text-ink-soft">{user.city ?? "—"}</Td>
                  <Td>
                    <Badge
                      variant={user.onboarding_done ? "active" : "pending"}
                    >
                      {user.onboarding_done ? "Complete" : "Pending"}
                    </Badge>
                  </Td>
                  <Td>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Dropdown items={getMenuItems(user)} />
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableWrap>

      <UserModal
        user={selected}
        onClose={() => setSelected(null)}
        onAction={load}
      />
    </>
  );
}
