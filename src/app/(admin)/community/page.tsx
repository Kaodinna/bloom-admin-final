"use client";
import { useEffect, useState, useCallback } from "react";
import type { CommunityTab } from "@/types";
import { REPORTS } from "@/lib/data";
import { useToast } from "@/lib/toast";
import {
  PageHeader,
  StatCard,
  Tabs,
  TableWrap,
  Th,
  Td,
  Avatar,
  Badge,
  Dropdown,
} from "@/components/ui";
import {
  fetchPosts,
  fetchGroups,
  moderatePost,
  deletePost,
  approvePost,
  createGroup,
  deleteGroup,
  updateGroup,
  broadcastGroup,
  fetchGroupPosts,
  type PagedResponse,
} from "@/lib/api";

const PAGE_SIZE = 50;

interface BubblePost {
  _id: string;
  content: string;
  likes?: number;
  author_name?: string;
  group?: string;
  image_url?: string;
  flagged?: boolean;
  hidden?: boolean;
  "Created Date"?: number;
}
interface BubbleGroup {
  _id: string;
  name: string;
  description?: string;
  category?: string;
  member_count?: number;
  "Created Date"?: number;
}

const CATEGORY_OPTIONS = [
  "General",
  "City Group",
  "Pregnancy",
  "Postpartum",
  "Trying to Conceive",
  "Wellness",
  "Support",
];
const GOLD = "#C9973A";
const RUST = "#B85C38";

// ── Pagination bar ────────────────────────────────────────────
function Pagination({
  page,
  totalPages,
  total,
  pageSize,
  loading,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  pageSize: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-cream-dark bg-cream rounded-b-xl">
      <span className="text-[.72rem] text-ink-soft">
        Showing{" "}
        <strong>
          {from}–{to}
        </strong>{" "}
        of <strong>{total}</strong>
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={onPrev}
          disabled={page === 1 || loading}
          className="text-[.74rem] font-semibold border border-cream-dark text-ink-mid rounded-[7px] px-3 py-1.5 bg-transparent hover:bg-cream-dark cursor-pointer font-sans disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <span className="text-[.72rem] text-ink-mid px-1">
          {page} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page === totalPages || loading}
          className="text-[.74rem] font-semibold border border-cream-dark text-ink-mid rounded-[7px] px-3 py-1.5 bg-transparent hover:bg-cream-dark cursor-pointer font-sans disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

// ── Modal shell ───────────────────────────────────────────────
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div
      className="fixed inset-0 bg-ink/40 z-[200] flex items-center justify-center backdrop-blur-sm p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-ivory rounded-[16px] w-full max-w-[500px] shadow-md overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-cream">
          <div className="font-serif text-[1.15rem] text-ink">{title}</div>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-ink-soft text-[1.3rem] cursor-pointer leading-none hover:text-ink"
          >
            ×
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-3">
      <label className="text-[.65rem] font-bold uppercase tracking-[.8px] text-ink-soft block mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-cream border border-cream-dark rounded-[8px] px-3 py-2 text-[.79rem] text-ink outline-none focus:border-gold transition-colors font-sans"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full bg-cream border border-cream-dark rounded-[8px] px-3 py-2 text-[.79rem] text-ink outline-none focus:border-gold transition-colors font-sans resize-none"
    />
  );
}

function PrimaryBtn({
  children,
  onClick,
  disabled,
  color = GOLD,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  color?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="text-[.79rem] font-semibold text-white rounded-[9px] px-4 py-2 border-none cursor-pointer font-sans hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: color }}
    >
      {children}
    </button>
  );
}

function GhostBtn({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="text-[.79rem] font-semibold border border-cream-dark text-ink-mid rounded-[9px] px-4 py-2 bg-transparent hover:bg-cream cursor-pointer font-sans"
    >
      {children}
    </button>
  );
}

// ── Create Group Modal ────────────────────────────────────────
function CreateGroupModal({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("General");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await createGroup({ name, description: desc, category });
      toast("Group created", "success");
      onCreated();
      onClose();
    } catch {
      toast("Failed to create group", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Create New Group" onClose={onClose}>
      <Field label="Group Name">
        <Input
          value={name}
          onChange={setName}
          placeholder="e.g. Berlin Mothers"
        />
      </Field>
      <Field label="Description">
        <Textarea
          value={desc}
          onChange={setDesc}
          placeholder="What is this group for?"
        />
      </Field>
      <Field label="Category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-cream border border-cream-dark rounded-[8px] px-3 py-2 text-[.79rem] text-ink outline-none font-sans focus:border-gold"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <div className="flex gap-2 justify-end">
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn onClick={handleCreate} disabled={saving || !name.trim()}>
          {saving ? "Creating…" : "Create Group"}
        </PrimaryBtn>
      </div>
    </Modal>
  );
}

// ── Edit Group Modal ──────────────────────────────────────────
function EditGroupModal({
  group,
  onClose,
  onSaved,
}: {
  group: BubbleGroup;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { toast } = useToast();
  const [name, setName] = useState(group.name);
  const [desc, setDesc] = useState(group.description ?? "");
  const [category, setCategory] = useState(group.category ?? "General");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateGroup(group._id, { name, description: desc, category });
      toast("Group updated", "success");
      onSaved();
      onClose();
    } catch {
      toast("Failed to update", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal title="Edit Group" onClose={onClose}>
      <Field label="Group Name">
        <Input value={name} onChange={setName} />
      </Field>
      <Field label="Description">
        <Textarea value={desc} onChange={setDesc} />
      </Field>
      <Field label="Category">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full bg-cream border border-cream-dark rounded-[8px] px-3 py-2 text-[.79rem] text-ink outline-none font-sans focus:border-gold"
        >
          {CATEGORY_OPTIONS.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>
      </Field>
      <div className="flex gap-2 justify-end">
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Save Changes"}
        </PrimaryBtn>
      </div>
    </Modal>
  );
}

// ── Delete Group Modal ────────────────────────────────────────
function DeleteGroupModal({
  group,
  onClose,
  onDeleted,
}: {
  group: BubbleGroup;
  onClose: () => void;
  onDeleted: () => void;
}) {
  const { toast } = useToast();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteGroup(group._id);
      toast("Group deleted", "error");
      onDeleted();
      onClose();
    } catch {
      toast("Failed to delete", "error");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Modal title="Delete Group" onClose={onClose}>
      <div className="bg-[#FEE2E2] border border-[#FECACA] rounded-[10px] px-4 py-3 mb-4">
        <div className="font-semibold text-[.85rem] text-red-700 mb-1">
          This cannot be undone
        </div>
        <div className="text-[.76rem] text-red-600">
          Deleting <strong>{group.name}</strong> will permanently remove the
          group and all its messages from Bubble. Posts made in this group will
          remain but lose their group reference.
        </div>
      </div>
      <div className="text-[.79rem] text-ink-mid mb-4">
        Members: <strong>{group.member_count?.toLocaleString() ?? 0}</strong> ·
        Category: <strong>{group.category ?? "General"}</strong>
      </div>
      <div className="flex gap-2 justify-end">
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn onClick={handleDelete} disabled={deleting} color={RUST}>
          {deleting ? "Deleting…" : "Delete Group"}
        </PrimaryBtn>
      </div>
    </Modal>
  );
}

// ── Message Group Modal ───────────────────────────────────────
function MessageGroupModal({
  group,
  onClose,
}: {
  group: BubbleGroup;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!message.trim()) return;
    setSending(true);
    try {
      await broadcastGroup(group._id, message);
      toast(`Message sent to ${group.member_count ?? 0} members`, "success");
      onClose();
    } catch {
      toast(
        "Broadcast failed — ensure /wf/broadcast_group exists in Bubble",
        "error",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal title={`Message Members — ${group.name}`} onClose={onClose}>
      <div className="text-[.75rem] text-ink-soft mb-3">
        Sends a broadcast to all{" "}
        <strong>{group.member_count?.toLocaleString() ?? 0}</strong> members via
        the Bubble{" "}
        <code className="font-mono text-[.68rem]">broadcast_group</code>{" "}
        workflow.
      </div>
      <Field label="Message">
        <Textarea
          value={message}
          onChange={setMessage}
          placeholder="e.g. Hi everyone — we've updated the group guidelines…"
          rows={5}
        />
      </Field>
      <div className="text-[.68rem] text-ink-soft mb-4">
        {message.length} characters
      </div>
      <div className="flex gap-2 justify-end">
        <GhostBtn onClick={onClose}>Cancel</GhostBtn>
        <PrimaryBtn onClick={handleSend} disabled={sending || !message.trim()}>
          {sending ? "Sending…" : `Send to ${group.member_count ?? 0} Members`}
        </PrimaryBtn>
      </div>
    </Modal>
  );
}

// ── Group Posts Modal (with its own pagination) ───────────────
function GroupPostsModal({
  group,
  onClose,
}: {
  group: BubbleGroup;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const [posts, setPosts] = useState<BubblePost[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const load = useCallback(
    async (p: number) => {
      setLoading(true);
      try {
        const cursor = (p - 1) * PAGE_SIZE;
        // fetchGroupPosts doesn't paginate yet — we'll add cursor support inline
        const con = encodeURIComponent(
          JSON.stringify([
            { key: "group", constraint_type: "equals", value: group._id },
          ]),
        );
        const BASE = process.env.NEXT_PUBLIC_BUBBLE_BASE_URL ?? "";
        const token =
          typeof window !== "undefined"
            ? (localStorage.getItem("bloom_admin_token") ?? "")
            : "";
        const res = await fetch(
          `${BASE}/obj/Communitypost?constraints=${con}&sort_field=Created%20Date&descending=true&limit=${PAGE_SIZE}&cursor=${cursor}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const d = await res.json();
        setPosts(d.response?.results ?? []);
        setTotal(d.response?.count ?? 0);
      } catch {
        toast("Could not load posts", "error");
      } finally {
        setLoading(false);
      }
    },
    [group._id],
  );

  useEffect(() => {
    load(page);
  }, [page, load]);

  async function handleHide(postId: string) {
    try {
      await moderatePost(postId, { hidden: true });
      setPosts((p) => p.filter((x) => x._id !== postId));
      toast("Post hidden", "warning");
    } catch {
      toast("Failed", "error");
    }
  }
  async function handleDelete(postId: string) {
    if (!confirm("Delete post permanently?")) return;
    try {
      await deletePost(postId);
      setPosts((p) => p.filter((x) => x._id !== postId));
      toast("Post deleted", "error");
    } catch {
      toast("Failed", "error");
    }
  }

  return (
    <Modal title={`Posts — ${group.name} (${total})`} onClose={onClose}>
      {loading ? (
        <div className="text-center py-6 text-ink-soft text-[.78rem]">
          Loading posts…
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-6 text-ink-soft text-[.78rem]">
          No posts in this group yet
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-3">
            {posts.map((post) => (
              <div
                key={post._id}
                className={`rounded-[10px] p-3 border ${post.flagged ? "border-[#E8C8C0] bg-[#FDF5F4]" : "border-cream-dark bg-cream"}`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div>
                    <span className="font-semibold text-[.78rem] text-ink">
                      {post.author_name ?? "Member"}
                    </span>
                    {post.flagged && (
                      <span className="ml-2 text-[.6rem] font-bold bg-[#FDECEA] text-rust px-1.5 py-0.5 rounded-full">
                        ⚑ Flagged
                      </span>
                    )}
                    <div className="text-[.61rem] text-ink-soft">
                      {post["Created Date"]
                        ? new Date(post["Created Date"]).toLocaleString()
                        : ""}
                    </div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button
                      onClick={() => handleHide(post._id)}
                      className="text-[.65rem] font-semibold border border-cream-dark text-ink-mid rounded-[6px] px-2 py-0.5 bg-transparent hover:bg-cream cursor-pointer font-sans"
                    >
                      Hide
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-[.65rem] font-semibold border rounded-[6px] px-2 py-0.5 cursor-pointer font-sans"
                      style={{
                        borderColor: `${RUST}40`,
                        color: RUST,
                        background: "transparent",
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-[.74rem] text-ink-mid leading-[1.4]">
                  {post.content}
                </p>
                <div className="text-[.61rem] text-ink-soft mt-1">
                  ❤ {post.likes ?? 0}
                </div>
              </div>
            ))}
          </div>
          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              pageSize={PAGE_SIZE}
              loading={loading}
              onPrev={() => setPage((p) => p - 1)}
              onNext={() => setPage((p) => p + 1)}
            />
          )}
        </>
      )}
    </Modal>
  );
}

// ── Main Page ─────────────────────────────────────────────────
export default function CommunityPage() {
  const { toast } = useToast();
  const [tab, setTab] = useState<CommunityTab>("groups");
  const [posts, setPosts] = useState<BubblePost[]>([]);
  const [groups, setGroups] = useState<BubbleGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Pagination state for groups
  const [groupPage, setGroupPage] = useState(1);
  const [groupTotal, setGroupTotal] = useState(0);

  // Pagination state for posts
  const [postPage, setPostPage] = useState(1);
  const [postTotal, setPostTotal] = useState(0);

  // Modals
  const [showCreate, setShowCreate] = useState(false);
  const [editGroup, setEditGroup] = useState<BubbleGroup | null>(null);
  const [deleteGrp, setDeleteGrp] = useState<BubbleGroup | null>(null);
  const [messageGrp, setMessageGrp] = useState<BubbleGroup | null>(null);
  const [viewPostsGrp, setViewPostsGrp] = useState<BubbleGroup | null>(null);

  const groupTotalPages = Math.max(1, Math.ceil(groupTotal / PAGE_SIZE));
  const postTotalPages = Math.max(1, Math.ceil(postTotal / PAGE_SIZE));

  const loadGroups = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const cursor = (page - 1) * PAGE_SIZE;
      const data = await fetchGroups(cursor, PAGE_SIZE);
      setGroups(data.results);
      setGroupTotal(data.count);
    } catch {
      toast("Could not load groups", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  const loadPosts = useCallback(async (page: number) => {
    setLoading(true);
    try {
      const cursor = (page - 1) * PAGE_SIZE;
      const data = await fetchPosts(cursor, PAGE_SIZE);
      setPosts(data.results);
      setPostTotal(data.count);
    } catch {
      toast("Could not load posts", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load on mount and on tab switch
  useEffect(() => {
    if (tab === "groups") loadGroups(groupPage);
    if (tab === "posts") loadPosts(postPage);
  }, [tab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reload when page changes
  useEffect(() => {
    loadGroups(groupPage);
  }, [groupPage]); // eslint-disable-line
  useEffect(() => {
    loadPosts(postPage);
  }, [postPage]); // eslint-disable-line

  async function handleModeratePost(
    postId: string,
    action: "hide" | "approve" | "delete",
  ) {
    try {
      if (action === "delete") {
        if (!confirm("Delete this post permanently?")) return;
        await deletePost(postId);
        setPosts((p) => p.filter((x) => x._id !== postId));
        setPostTotal((t) => t - 1);
        toast("Post deleted", "error");
      } else if (action === "hide") {
        await moderatePost(postId, { hidden: true });
        setPosts((p) =>
          p.map((x) => (x._id === postId ? { ...x, hidden: true } : x)),
        );
        toast("Post hidden from feed", "warning");
      } else {
        await approvePost(postId);
        setPosts((p) =>
          p.map((x) =>
            x._id === postId ? { ...x, flagged: false, hidden: false } : x,
          ),
        );
        toast("Post approved", "success");
      }
    } catch {
      toast("Action failed", "error");
    }
  }

  const flaggedPosts = posts?.filter((p) => p.flagged);
  const filteredGroups = groups?.filter((g) =>
    g.name?.toLowerCase().includes(search.toLowerCase()),
  );
  const filteredPosts = posts?.filter(
    (p) =>
      p.content?.toLowerCase().includes(search.toLowerCase()) ||
      p.author_name?.toLowerCase().includes(search.toLowerCase()),
  );

  const TABS = [
    {
      id: "groups" as CommunityTab,
      label: `Groups (${groupTotal || groups.length})`,
    },
    {
      id: "posts" as CommunityTab,
      label: `Posts (${postTotal || posts.length})`,
    },
    { id: "reports" as CommunityTab, label: `Reports (${REPORTS.length})` },
  ];

  return (
    <>
      <PageHeader
        title="Community"
        sub={`${groupTotal} groups · ${postTotal} posts · ${flaggedPosts.length} flagged`}
        action={
          <button
            onClick={() => setShowCreate(true)}
            className="bg-gold text-white text-[.79rem] font-semibold rounded-[9px] px-4 py-[7px] border-none cursor-pointer font-sans hover:opacity-85"
          >
            + New Group
          </button>
        }
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-[13px] mb-5">
        <StatCard
          label="Total Groups"
          value={groupTotal.toString()}
          delta="All community groups"
          deltaUp
          icon="👥"
          iconBg="#E8F2EC"
        />
        <StatCard
          label="Total Posts"
          value={postTotal.toString()}
          delta="All posts"
          deltaUp
          icon="📝"
          iconBg="#F5EDD8"
        />
        <StatCard
          label="Flagged Posts"
          value={flaggedPosts.length.toString()}
          delta={flaggedPosts.length > 0 ? "Needs review" : "None flagged"}
          deltaUp={flaggedPosts.length === 0}
          icon="🚩"
          iconBg="#F5E8E2"
        />
        <StatCard
          label="Pending Reports"
          value={REPORTS.filter(
            (r) => r.status === "pending",
          ).length.toString()}
          delta="Awaiting action"
          icon="⚠️"
          iconBg="#F5E8E2"
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={
            tab === "groups" ? "Search this page…" : "Search this page…"
          }
          className="text-[.78rem] bg-cream border border-cream-dark rounded-[9px] px-3 py-2 outline-none w-64 font-sans focus:border-gold transition-colors"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-[.72rem] text-ink-soft bg-transparent border-none cursor-pointer hover:text-ink"
          >
            Clear
          </button>
        )}
        <span className="text-[.7rem] text-ink-soft ml-1">
          Search applies to current page only
        </span>
      </div>

      <Tabs tabs={TABS} active={tab} onChange={setTab} />

      {/* ── GROUPS ──────────────────────────────────────── */}
      {tab === "groups" && (
        <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-cream-dark">
                  <Th>Group</Th>
                  <Th>Category</Th>
                  <Th>Members</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-ink-soft text-[.78rem]"
                    >
                      Loading from Bubble…
                    </td>
                  </tr>
                ) : filteredGroups.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="text-center py-8 text-ink-soft text-[.78rem]"
                    >
                      No groups found
                    </td>
                  </tr>
                ) : (
                  filteredGroups.map((g) => (
                    <tr
                      key={g._id}
                      className="border-b border-cream hover:bg-[#FDFAF6] last:border-0 cursor-pointer"
                      onClick={() => setViewPostsGrp(g)}
                    >
                      <Td>
                        <div className="font-semibold text-ink text-[.79rem]">
                          {g.name}
                        </div>
                        <div className="text-[.63rem] text-ink-soft mt-0.5">
                          {g.description ?? "—"}
                        </div>
                      </Td>
                      <Td>
                        <Badge variant="active">
                          {g.category ?? "General"}
                        </Badge>
                      </Td>
                      <Td>
                        <span className="font-semibold text-ink">
                          {g.member_count?.toLocaleString() ?? "0"}
                        </span>
                      </Td>
                      <Td className="text-ink-soft">
                        {g["Created Date"]
                          ? new Date(g["Created Date"]).toLocaleDateString()
                          : "—"}
                      </Td>
                      <Td>
                        <div onClick={(e) => e.stopPropagation()}>
                          <Dropdown
                            items={[
                              {
                                label: "📋 View Posts",
                                onClick: () => setViewPostsGrp(g),
                              },
                              {
                                label: "✏ Edit Group",
                                onClick: () => setEditGroup(g),
                              },
                              {
                                label: "✉ Message Members",
                                onClick: () => setMessageGrp(g),
                              },
                              {
                                label: "🗑 Delete Group",
                                onClick: () => setDeleteGrp(g),
                                danger: true,
                              },
                            ]}
                          />
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <Pagination
            page={groupPage}
            totalPages={groupTotalPages}
            total={groupTotal}
            pageSize={PAGE_SIZE}
            loading={loading}
            onPrev={() => setGroupPage((p) => p - 1)}
            onNext={() => setGroupPage((p) => p + 1)}
          />
        </div>
      )}

      {/* ── POSTS ───────────────────────────────────────── */}
      {tab === "posts" && (
        <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden shadow-sm">
          <div className="flex flex-col gap-0 divide-y divide-cream">
            {loading ? (
              <div className="p-6 text-center text-ink-soft text-[.78rem]">
                Loading from Bubble…
              </div>
            ) : filteredPosts.length === 0 ? (
              <div className="p-6 text-center text-ink-soft text-[.78rem]">
                No posts found
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div
                  key={post._id}
                  className={`p-4 transition-colors ${post.flagged ? "bg-[#FDF5F4]" : post.hidden ? "opacity-60" : ""}`}
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-8 h-8 rounded-full bg-[#E8D4A0] flex items-center justify-center text-[.7rem] font-bold text-[#8A5C20] flex-shrink-0">
                      {(post.author_name ?? "U").slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-[.8rem] text-ink">
                          {post.author_name ?? "Community Member"}
                        </span>
                        {post.flagged && (
                          <span className="text-[.62rem] font-bold bg-[#FDECEA] text-rust px-1.5 py-0.5 rounded-full">
                            ⚑ Flagged
                          </span>
                        )}
                        {post.hidden && (
                          <span className="text-[.62rem] font-bold bg-cream text-ink-soft px-1.5 py-0.5 rounded-full">
                            Hidden
                          </span>
                        )}
                      </div>
                      <div className="text-[.63rem] text-ink-soft">
                        {post["Created Date"]
                          ? new Date(post["Created Date"]).toLocaleString()
                          : "—"}
                        {post.group && ` · Group: ${post.group.slice(0, 16)}`}
                      </div>
                    </div>
                    <Dropdown
                      items={[
                        {
                          label: "✓ Approve",
                          onClick: () =>
                            handleModeratePost(post._id, "approve"),
                        },
                        {
                          label: "👁 Hide Post",
                          onClick: () => handleModeratePost(post._id, "hide"),
                        },
                        {
                          label: "🗑 Delete Post",
                          onClick: () => handleModeratePost(post._id, "delete"),
                          danger: true,
                        },
                      ]}
                    />
                  </div>
                  <p className="text-[.78rem] text-ink-mid leading-[1.4] mb-2 ml-11">
                    {post.content}
                  </p>
                  {post.image_url && (
                    <div className="ml-11 text-[.63rem] text-ink-soft">
                      📎 Image attached
                    </div>
                  )}
                  <div className="ml-11 mt-1">
                    <span className="text-[.63rem] text-ink-soft">
                      ❤ {post.likes ?? 0}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
          <Pagination
            page={postPage}
            totalPages={postTotalPages}
            total={postTotal}
            pageSize={PAGE_SIZE}
            loading={loading}
            onPrev={() => setPostPage((p) => p - 1)}
            onNext={() => setPostPage((p) => p + 1)}
          />
        </div>
      )}

      {/* ── REPORTS ─────────────────────────────────────── */}
      {tab === "reports" && (
        <div className="flex flex-col gap-3">
          {REPORTS.map((report) => (
            <div
              key={report.id}
              className="bg-ivory border border-cream-dark rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <div className="font-semibold text-[.82rem] text-ink">
                    {report.contentTitle}
                  </div>
                  <div className="text-[.63rem] text-ink-soft mt-0.5">
                    {report.group} · {report.date}
                  </div>
                </div>
                <Badge
                  variant={
                    report.reasonStyle === "rust"
                      ? "postpartum"
                      : report.reasonStyle === "gold"
                        ? "ttc"
                        : "active"
                  }
                >
                  {report.reason}
                </Badge>
              </div>
              <p className="text-[.73rem] text-ink-mid italic mb-3">
                {report.contentPreview}
              </p>
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Avatar
                    initials={report.reporterInitials}
                    color={report.reporterBg}
                    size={22}
                  />
                  <span className="text-[.68rem] text-ink-soft">
                    {report.reporterName} · {report.reporterCount}
                  </span>
                </div>
                {report.status !== "resolved" ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => toast("Post hidden", "warning")}
                      className="text-[.7rem] font-semibold border border-cream-dark text-ink-mid rounded-[7px] px-3 py-1 bg-transparent hover:bg-cream cursor-pointer font-sans"
                    >
                      Hide Content
                    </button>
                    <button
                      onClick={() => toast("Report dismissed", "success")}
                      className="text-[.7rem] font-semibold rounded-[7px] px-3 py-1 border-none cursor-pointer font-sans text-white"
                      style={{ background: GOLD }}
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => toast("User warned", "error")}
                      className="text-[.7rem] font-semibold rounded-[7px] px-3 py-1 border-none cursor-pointer font-sans text-white"
                      style={{ background: RUST }}
                    >
                      Warn User
                    </button>
                  </div>
                ) : (
                  <Badge variant="active">
                    Resolved · {report.dismissedWith}
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── MODALS ──────────────────────────────────────── */}
      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setGroupPage(1);
            loadGroups(1);
          }}
        />
      )}
      {editGroup && (
        <EditGroupModal
          group={editGroup}
          onClose={() => setEditGroup(null)}
          onSaved={() => loadGroups(groupPage)}
        />
      )}
      {deleteGrp && (
        <DeleteGroupModal
          group={deleteGrp}
          onClose={() => setDeleteGrp(null)}
          onDeleted={() => {
            setGroupPage(1);
            loadGroups(1);
          }}
        />
      )}
      {messageGrp && (
        <MessageGroupModal
          group={messageGrp}
          onClose={() => setMessageGrp(null)}
        />
      )}
      {viewPostsGrp && (
        <GroupPostsModal
          group={viewPostsGrp}
          onClose={() => setViewPostsGrp(null)}
        />
      )}
    </>
  );
}
