"use client";
import { useEffect, useState, useCallback } from "react";
import { PageHeader } from "@/components/ui";
import { useToast } from "@/lib/toast";
import {
  fetchFemaleJobs,
  createFemaleJob,
  updateFemaleJob,
  deleteFemaleJob,
  bulkUploadFemaleJobs,
  fetchMaleJobs,
  createMaleJob,
  updateMaleJob,
  deleteMaleJob,
  bulkUploadMaleJobs,
  fetchPregnancyFoods,
  createPregnancyFood,
  updatePregnancyFood,
  deletePregnancyFood,
  bulkUploadFoods,
  fetchMilkNutrients,
  createMilkNutrient,
  updateMilkNutrient,
  deleteMilkNutrient,
  bulkUploadMilkNutrients,
  fetchBloodActions,
  createBloodAction,
  updateBloodAction,
  deleteBloodAction,
  bulkUploadBloodActions,
  fetchBloodThinningFoods,
  createBloodThinningFood,
  updateBloodThinningFood,
  deleteBloodThinningFood,
  bulkUploadBloodThinningFoods,
  fetchMilkBoosters,
  createMilkBooster,
  updateMilkBooster,
  deleteMilkBooster,
  bulkUploadMilkBoosters,
} from "@/lib/api";

// ── Local JSON for bulk upload seed ──────────────────────────
import femaleJobsRaw from "../../../../public/datasets/female_jobs.json";
import maleJobsRaw from "../../../../public/datasets/male_jobs.json";
import pregnancyFoods from "../../../../public/datasets/pregnancy_foods.json";
import milkDataRaw from "../../../../public/datasets/postpartum_milk.json";

type Tab = "female-jobs" | "male-jobs" | "foods" | "milk";

const GOLD = "#C9973A";
const GREEN = "#2D6B4A";
const TEAL = "#1F7A7A";
const RUST = "#B85C38";
const VIOLET = "#7B5EA6";

const STAGE_OPTIONS = [
  "all stages",
  "week 1-8",
  "week 5-12",
  "week 5-20",
  "week 5+",
  "week 10+",
  "week 10-25",
  "week 12+",
  "week 15+",
  "week 20+",
  "week 30+",
  "week 36+",
  "moderate",
  "small amounts",
  "limited",
];

// ── Shared UI primitives ──────────────────────────────────────
function Pill({
  label,
  color,
  onRemove,
}: {
  label: string;
  color: string;
  onRemove?: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[.65rem] font-medium px-2 py-[3px] rounded-full"
      style={{ background: `${color}15`, color }}
    >
      {label}
      {onRemove && (
        <button
          onClick={onRemove}
          className="bg-transparent border-none cursor-pointer text-current leading-none ml-0.5 opacity-60 hover:opacity-100"
        >
          ×
        </button>
      )}
    </span>
  );
}

function TagInput({
  value,
  onChange,
  color,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  color: string;
  placeholder: string;
}) {
  const [input, setInput] = useState("");
  function add() {
    const t = input.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setInput("");
  }
  return (
    <div className="flex flex-wrap gap-1 items-center border border-cream-dark rounded-[8px] px-2.5 py-1.5 bg-cream min-h-[36px]">
      {value.map((v) => (
        <Pill
          key={v}
          label={v}
          color={color}
          onRemove={() => onChange(value.filter((x) => x !== v))}
        />
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={value.length === 0 ? placeholder : "Add…"}
        className="border-none outline-none bg-transparent text-[.74rem] text-ink font-sans min-w-[80px] flex-1"
      />
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
    <div>
      <label className="text-[.63rem] font-bold uppercase tracking-[.8px] text-ink-soft block mb-1">
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
      className="w-full bg-cream border border-cream-dark rounded-[8px] px-3 py-2 text-[.78rem] text-ink outline-none focus:border-gold transition-colors font-sans"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={2}
      className="w-full bg-cream border border-cream-dark rounded-[8px] px-3 py-2 text-[.78rem] text-ink outline-none focus:border-gold transition-colors font-sans resize-none"
    />
  );
}

function BtnPrimary({
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
      className="text-[.74rem] font-semibold text-white rounded-[8px] px-3.5 py-1.5 border-none cursor-pointer font-sans hover:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed"
      style={{ background: color }}
    >
      {children}
    </button>
  );
}

function BtnGhost({
  children,
  onClick,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="text-[.74rem] font-semibold rounded-[8px] px-3.5 py-1.5 border cursor-pointer font-sans hover:bg-cream transition-colors bg-transparent"
      style={{
        borderColor: danger ? `${RUST}50` : "var(--cream-dark)",
        color: danger ? RUST : "var(--ink-mid)",
      }}
    >
      {children}
    </button>
  );
}

// ── Bulk upload banner ────────────────────────────────────────
function BulkBanner({
  count,
  label,
  onUpload,
  uploading,
}: {
  count: number;
  label: string;
  onUpload: () => void;
  uploading: boolean;
}) {
  if (count > 0) return null;
  return (
    <div className="bg-[#F5EDD8] border border-[#E8D4A0] rounded-xl px-4 py-3.5 mb-4 flex items-center gap-3">
      <span className="text-xl">📤</span>
      <div className="flex-1">
        <div className="font-bold text-[.82rem] text-[#8A5C20]">
          No {label} in Bubble yet
        </div>
        <div className="text-[.72rem] text-[#8A5C20] mt-0.5">
          Click to bulk upload all records from the JSON dataset. This only
          needs to be done once.
        </div>
      </div>
      <BtnPrimary onClick={onUpload} disabled={uploading} color={GOLD}>
        {uploading ? "Uploading…" : `Upload all from JSON`}
      </BtnPrimary>
    </div>
  );
}

// ── FEMALE JOBS TAB ───────────────────────────────────────────
interface FJob {
  _id: string;
  job: string;
  common_risks: string[];
  nutrient_risks: string[];
}

const JOBS_PAGE_SIZE = 50;

function Pagination({
  page,
  totalPages,
  total,
  loading,
  onPrev,
  onNext,
}: {
  page: number;
  totalPages: number;
  total: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  if (totalPages <= 1) return null;
  const from = (page - 1) * JOBS_PAGE_SIZE + 1;
  const to = Math.min(page * JOBS_PAGE_SIZE, total);
  return (
    <div className="flex items-center justify-between px-4 py-2.5 border-t border-cream-dark bg-cream rounded-b-xl">
      <span className="text-[.71rem] text-ink-soft">
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
          className="text-[.72rem] font-semibold border border-cream-dark text-ink-mid rounded-[7px] px-3 py-1 bg-transparent hover:bg-cream-dark cursor-pointer font-sans disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          ← Prev
        </button>
        <span className="text-[.71rem] text-ink-mid">
          {page} / {totalPages}
        </span>
        <button
          onClick={onNext}
          disabled={page === totalPages || loading}
          className="text-[.72rem] font-semibold border border-cream-dark text-ink-mid rounded-[7px] px-3 py-1 bg-transparent hover:bg-cream-dark cursor-pointer font-sans disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Next →
        </button>
      </div>
    </div>
  );
}

function FemaleJobsTab() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<FJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);

  const [newJob, setNewJob] = useState("");
  const [newRisks, setNewRisks] = useState<string[]>([]);
  const [newNuts, setNewNuts] = useState<string[]>([]);
  const [editJob, setEditJob] = useState("");
  const [editRisks, setEditRisks] = useState<string[]>([]);
  const [editNuts, setEditNuts] = useState<string[]>([]);

  const totalPages = Math.max(1, Math.ceil(total / JOBS_PAGE_SIZE));

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const cursor = (p - 1) * JOBS_PAGE_SIZE;
      const d = await fetchFemaleJobs(cursor, JOBS_PAGE_SIZE);
      setJobs(d.results);
      setTotal(d.count);
    } catch {
      toast("Could not load female jobs", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  async function handleBulkUpload() {
    setUploading(true);
    try {
      await bulkUploadFemaleJobs(femaleJobsRaw.female_jobs);
      toast(`Uploaded ${femaleJobsRaw.female_jobs.length} jobs`, "success");
      setPage(1);
      load(1);
    } catch {
      toast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd() {
    if (!newJob.trim()) return;
    try {
      await createFemaleJob({
        job: newJob,
        common_risks: newRisks,
        nutrient_risks: newNuts,
      });
      toast("Job added", "success");
      setNewJob("");
      setNewRisks([]);
      setNewNuts([]);
      setShowAdd(false);
      load(page);
    } catch {
      toast("Failed to add", "error");
    }
  }

  function startEdit(j: FJob) {
    setEditId(j._id);
    setEditJob(j.job ?? "");
    setEditRisks(j.common_risks ?? []);
    setEditNuts(j.nutrient_risks ?? []);
  }

  async function handleSave(id: string) {
    try {
      await updateFemaleJob(id, {
        job: editJob,
        common_risks: editRisks,
        nutrient_risks: editNuts,
      });
      toast("Saved", "success");
      setEditId(null);
      load(page);
    } catch {
      toast("Save failed", "error");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteFemaleJob(id);
      toast("Deleted", "error");
      load(page);
    } catch {
      toast("Delete failed", "error");
    }
  }

  const filtered = jobs.filter(
    (j) =>
      j.job?.toLowerCase().includes(search.toLowerCase()) ||
      j.common_risks?.join(" ").toLowerCase().includes(search.toLowerCase()) ||
      j.nutrient_risks?.join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <BulkBanner
        count={total}
        label="female jobs"
        onUpload={handleBulkUpload}
        uploading={uploading}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search jobs, risks, nutrients…"
            className="text-[.76rem] bg-cream border border-cream-dark rounded-[9px] px-3 py-2 outline-none w-56 font-sans focus:border-gold transition-colors"
          />
          <span className="text-[.7rem] text-ink-soft">
            {filtered.length} of {jobs.length}
          </span>
        </div>
        <BtnPrimary onClick={() => setShowAdd((s) => !s)}>+ Add Job</BtnPrimary>
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#F5EDD8] border border-[#E8D4A0] rounded-xl p-4 mb-4 grid grid-cols-3 gap-3 items-end">
          <Field label="Job Title">
            <Input
              value={newJob}
              onChange={setNewJob}
              placeholder="e.g. Teacher"
            />
          </Field>
          <Field label="Common Risks (Enter to add)">
            <TagInput
              value={newRisks}
              onChange={setNewRisks}
              color={RUST}
              placeholder="e.g. stress"
            />
          </Field>
          <Field label="Nutrient Risks (Enter to add)">
            <TagInput
              value={newNuts}
              onChange={setNewNuts}
              color={GOLD}
              placeholder="e.g. vitamin D"
            />
          </Field>
          <div className="col-span-3 flex gap-2">
            <BtnPrimary onClick={handleAdd}>Save Job</BtnPrimary>
            <BtnGhost onClick={() => setShowAdd(false)}>Cancel</BtnGhost>
          </div>
        </div>
      )}

      <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-cream-dark bg-cream">
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft w-[200px]">
                Job
              </th>
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft">
                Common Risks
              </th>
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft">
                Nutrient Risks
              </th>
              <th className="px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-[.78rem] text-ink-soft"
                >
                  Loading from Bubble…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center py-8 text-[.78rem] text-ink-soft"
                >
                  {search
                    ? "No jobs match your search"
                    : "No female jobs in Bubble yet — click Upload to seed"}
                </td>
              </tr>
            ) : (
              filtered.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-cream hover:bg-[#FDFAF6] last:border-0"
                >
                  {editId === job._id ? (
                    <>
                      <td className="px-4 py-2.5">
                        <Input value={editJob} onChange={setEditJob} />
                      </td>
                      <td className="px-4 py-2.5">
                        <TagInput
                          value={editRisks}
                          onChange={setEditRisks}
                          color={RUST}
                          placeholder="Add risk"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <TagInput
                          value={editNuts}
                          onChange={setEditNuts}
                          color={GOLD}
                          placeholder="Add nutrient"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <BtnPrimary
                            onClick={() => handleSave(job._id)}
                            color={GREEN}
                          >
                            Save
                          </BtnPrimary>
                          <BtnGhost onClick={() => setEditId(null)}>
                            Cancel
                          </BtnGhost>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2.5 font-semibold text-[.79rem] text-ink">
                        {job.job}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(job.common_risks ?? []).map((r: string) => (
                            <Pill key={r} label={r} color={RUST} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(job.nutrient_risks ?? []).map((n: string) => (
                            <Pill key={n} label={n} color={GOLD} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <BtnGhost onClick={() => startEdit(job)}>
                            Edit
                          </BtnGhost>
                          <BtnGhost
                            onClick={() => handleDelete(job._id, job.job)}
                            danger
                          >
                            Del
                          </BtnGhost>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          loading={loading}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      </div>
    </div>
  );
}

// ── Male Jobs Form Fields (extracted to avoid nested component error) ──
interface MaleFormFieldsProps {
  form: MJobForm;
  setField: (key: keyof MJobForm) => (v: string | string[]) => void;
}
function MaleFormFields({ form, setField }: MaleFormFieldsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Field label="Job Title">
        <Input
          value={form.job}
          onChange={setField("job")}
          placeholder="e.g. Construction Worker"
        />
      </Field>
      <Field label="Common Risks">
        <TagInput
          value={form.common_risks}
          onChange={setField("common_risks")}
          color={RUST}
          placeholder="Add risk"
        />
      </Field>
      <Field label="Nutrient Risks">
        <TagInput
          value={form.nutrient_risks}
          onChange={setField("nutrient_risks")}
          color={GOLD}
          placeholder="Add nutrient"
        />
      </Field>
      <Field label="Sperm Impact">
        <Input
          value={form.sperm_impact}
          onChange={setField("sperm_impact")}
          placeholder="e.g. heat reduces sperm count"
        />
      </Field>
      <Field label="Hormone Impact">
        <Input
          value={form.hormone_impact}
          onChange={setField("hormone_impact")}
          placeholder="e.g. stress increases cortisol"
        />
      </Field>
      <Field label="Recommended Foods">
        <TagInput
          value={form.recommended_foods}
          onChange={setField("recommended_foods")}
          color={GREEN}
          placeholder="Add food"
        />
      </Field>
      <Field label="Supplements">
        <TagInput
          value={form.supplements}
          onChange={setField("supplements")}
          color={VIOLET}
          placeholder="Add supplement"
        />
      </Field>
    </div>
  );
}

// ── MALE JOBS TAB ─────────────────────────────────────────────
interface MJob {
  _id: string;
  job: string;
  common_risks: string[];
  nutrient_risks: string[];
  sperm_impact: string;
  hormone_impact: string;
  recommended_foods: string[];
  supplements: string[];
}

interface MJobForm {
  job: string;
  common_risks: string[];
  nutrient_risks: string[];
  sperm_impact: string;
  hormone_impact: string;
  recommended_foods: string[];
  supplements: string[];
}

const EMPTY_MJOB: MJobForm = {
  job: "",
  common_risks: [],
  nutrient_risks: [],
  sperm_impact: "",
  hormone_impact: "",
  recommended_foods: [],
  supplements: [],
};

function MaleJobsTab() {
  const { toast } = useToast();
  const [jobs, setJobs] = useState<MJob[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<MJobForm>(EMPTY_MJOB);

  const totalPages = Math.max(1, Math.ceil(total / JOBS_PAGE_SIZE));

  const load = useCallback(async (p: number) => {
    setLoading(true);
    try {
      const cursor = (p - 1) * JOBS_PAGE_SIZE;
      const d = await fetchMaleJobs(cursor, JOBS_PAGE_SIZE);
      setJobs(d.results);
      setTotal(d.count);
    } catch {
      toast("Could not load male jobs", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [page, load]);

  function f(key: keyof MJobForm) {
    return (v: string | string[]) =>
      setForm((p) => ({ ...p, [key]: v }) as MJobForm);
  }

  async function handleBulkUpload() {
    setUploading(true);
    try {
      await bulkUploadMaleJobs(maleJobsRaw.male_jobs);
      toast(`Uploaded ${maleJobsRaw.male_jobs.length} jobs`, "success");
      setPage(1);
      load(1);
    } catch {
      toast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  async function handleAdd() {
    if (!form.job.trim()) return;
    try {
      await createMaleJob({
        job: form.job,
        common_risks: form.common_risks as string[],
        nutrient_risks: form.nutrient_risks as string[],
        sperm_impact: form.sperm_impact as string,
        hormone_impact: form.hormone_impact as string,
        recommended_foods: form.recommended_foods as string[],
        supplements: form.supplements as string[],
      });
      toast("Job added", "success");
      setForm(EMPTY_MJOB);
      setShowAdd(false);
      load(page);
    } catch {
      toast("Failed to add", "error");
    }
  }

  function startEdit(j: MJob) {
    setEditId(j._id);
    setForm({
      job: j.job ?? "",
      common_risks: j.common_risks ?? [],
      nutrient_risks: j.nutrient_risks ?? [],
      sperm_impact: j.sperm_impact ?? "",
      hormone_impact: j.hormone_impact ?? "",
      recommended_foods: j.recommended_foods ?? [],
      supplements: j.supplements ?? [],
    });
  }

  async function handleSave(id: string) {
    try {
      await updateMaleJob(id, {
        job: form.job as string,
        common_risks: form.common_risks as string[],
        nutrient_risks: form.nutrient_risks as string[],
        sperm_impact: form.sperm_impact as string,
        hormone_impact: form.hormone_impact as string,
        recommended_foods: form.recommended_foods as string[],
        supplements: form.supplements as string[],
      });
      toast("Saved", "success");
      setEditId(null);
      setForm(EMPTY_MJOB);
      load(page);
    } catch {
      toast("Save failed", "error");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deleteMaleJob(id);
      toast("Deleted", "error");
      load(page);
    } catch {
      toast("Delete failed", "error");
    }
  }

  const filtered = jobs.filter(
    (j) =>
      j.job?.toLowerCase().includes(search.toLowerCase()) ||
      j.common_risks?.join(" ").toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <BulkBanner
        count={total}
        label="male jobs"
        onUpload={handleBulkUpload}
        uploading={uploading}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search male jobs…"
            className="text-[.76rem] bg-cream border border-cream-dark rounded-[9px] px-3 py-2 outline-none w-56 font-sans focus:border-gold transition-colors"
          />
          <span className="text-[.7rem] text-ink-soft">
            {filtered.length} of {jobs.length}
          </span>
        </div>
        <BtnPrimary
          onClick={() => {
            setShowAdd((s) => !s);
            setEditId(null);
          }}
          color={VIOLET}
        >
          + Add Job
        </BtnPrimary>
      </div>

      {showAdd && (
        <div className="bg-[#EDE6F5] border border-[#C8B8E0] rounded-xl p-4 mb-4">
          <div className="font-bold text-[.82rem] text-ink mb-3">
            New Male Job
          </div>
          <MaleFormFields form={form} setField={f} />
          <div className="flex gap-2 mt-3">
            <BtnPrimary onClick={handleAdd} color={VIOLET}>
              Save Job
            </BtnPrimary>
            <BtnGhost
              onClick={() => {
                setShowAdd(false);
                setForm(EMPTY_MJOB);
              }}
            >
              Cancel
            </BtnGhost>
          </div>
        </div>
      )}

      <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-cream-dark bg-cream">
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft w-[160px]">
                Job
              </th>
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft">
                Common Risks
              </th>
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft">
                Nutrient Risks
              </th>
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft">
                Sperm Impact
              </th>
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft">
                Hormone Impact
              </th>
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft">
                Rec. Foods
              </th>
              <th className="text-left px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft">
                Supplements
              </th>
              <th className="px-4 py-2.5 text-[.63rem] font-bold uppercase tracking-wide text-ink-soft w-[120px]">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-[.78rem] text-ink-soft"
                >
                  Loading from Bubble…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center py-8 text-[.78rem] text-ink-soft"
                >
                  {search
                    ? "No jobs match your search"
                    : "No male jobs in Bubble yet — click Upload to seed"}
                </td>
              </tr>
            ) : (
              filtered.map((job) => (
                <tr
                  key={job._id}
                  className="border-b border-cream hover:bg-[#FDFAF6] last:border-0"
                >
                  {editId === job._id ? (
                    <>
                      <td className="px-4 py-2.5">
                        <Input value={form.job} onChange={f("job")} />
                      </td>
                      <td className="px-4 py-2.5">
                        <TagInput
                          value={form.common_risks}
                          onChange={f("common_risks")}
                          color={RUST}
                          placeholder="Add risk"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <TagInput
                          value={form.nutrient_risks}
                          onChange={f("nutrient_risks")}
                          color={GOLD}
                          placeholder="Add nutrient"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <Input
                          value={form.sperm_impact}
                          onChange={f("sperm_impact")}
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <Input
                          value={form.hormone_impact}
                          onChange={f("hormone_impact")}
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <TagInput
                          value={form.recommended_foods}
                          onChange={f("recommended_foods")}
                          color={GREEN}
                          placeholder="Add food"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <TagInput
                          value={form.supplements}
                          onChange={f("supplements")}
                          color={VIOLET}
                          placeholder="Add supplement"
                        />
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <BtnPrimary
                            onClick={() => handleSave(job._id)}
                            color={GREEN}
                          >
                            Save
                          </BtnPrimary>
                          <BtnGhost
                            onClick={() => {
                              setEditId(null);
                              setForm(EMPTY_MJOB);
                            }}
                          >
                            Cancel
                          </BtnGhost>
                        </div>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-4 py-2.5 font-semibold text-[.79rem] text-ink">
                        {job.job}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(job.common_risks ?? []).map((r: string) => (
                            <Pill key={r} label={r} color={RUST} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(job.nutrient_risks ?? []).map((n: string) => (
                            <Pill key={n} label={n} color={GOLD} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-[.73rem] text-ink-mid">
                        {job.sperm_impact}
                      </td>
                      <td className="px-4 py-2.5 text-[.73rem] text-ink-mid">
                        {job.hormone_impact}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(job.recommended_foods ?? []).map((food: string) => (
                            <Pill key={food} label={food} color={GREEN} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex flex-wrap gap-1">
                          {(job.supplements ?? []).map((s: string) => (
                            <Pill key={s} label={s} color={VIOLET} />
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex gap-1.5">
                          <BtnGhost onClick={() => startEdit(job)}>
                            Edit
                          </BtnGhost>
                          <BtnGhost
                            onClick={() =>
                              handleDelete(job._id, job.job)
                            }
                            danger
                          >
                            Del
                          </BtnGhost>
                        </div>
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
        <Pagination
          page={page}
          totalPages={totalPages}
          total={total}
          loading={loading}
          onPrev={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
        />
      </div>
    </div>
  );
}

// ── PREGNANCY FOODS TAB ───────────────────────────────────────
interface PFood {
  _id: string;
  food: string;
  stage: string;
  baby_effect: string;
  mother_effect: string;
  nutrients: string;
  science: string;
}

const EMPTY_FOOD = {
  food: "",
  stage: "week 20+",
  baby_effect: "",
  mother_effect: "",
  nutrients: [],
  science: "",
};

function FoodsTab() {
  const { toast } = useToast();
  const [items, setItems] = useState<PFood[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [stageFilter, setStageFilter] = useState("All");
  const [editId, setEditId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState<any>(EMPTY_FOOD);

  const load = useCallback(async () => {
    try {
      const d = await fetchPregnancyFoods();
      setItems(d);
    } catch {
      toast("Could not load foods", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleBulkUpload() {
    setUploading(true);
    try {
      await bulkUploadFoods(pregnancyFoods.foods);
      toast(`Uploaded ${pregnancyFoods.foods.length} foods`, "success");
      load();
    } catch {
      toast("Upload failed", "error");
    } finally {
      setUploading(false);
    }
  }

  function stageColor(stage: string): string {
    if (stage === "all stages") return GREEN;
    if (stage.includes("36") || stage.includes("30")) return RUST;
    if (stage.includes("20")) return GOLD;
    return TEAL;
  }

  const filtered = items.filter((f) => {
    const matchSearch =
      f.food?.toLowerCase().includes(search.toLowerCase()) ||
      f.baby_effect?.toLowerCase().includes(search.toLowerCase()) ||
      f.nutrients?.toLowerCase().includes(search.toLowerCase());
    const matchStage = stageFilter === "All" || f.stage === stageFilter;
    return matchSearch && matchStage;
  });

  async function handleAdd() {
    if (!form.food.trim()) return;
    try {
      await createPregnancyFood({
        food: form.food,
        stage: form.stage,
        baby_effect: form.baby_effect,
        mother_effect: form.mother_effect,
        nutrients: Array.isArray(form.nutrients)
          ? form.nutrients
          : [form.nutrients],
        science: form.science,
      });
      toast("Food added", "success");
      setForm(EMPTY_FOOD);
      setShowAdd(false);
      load();
    } catch {
      toast("Failed to add", "error");
    }
  }

  function startEdit(f: PFood) {
    setEditId(f._id);
    setForm({
      ...f,
      nutrients: Array.isArray(f.nutrients)
        ? f.nutrients
        : (f.nutrients ?? "").split(", ").filter(Boolean),
    });
  }

  async function handleSave(id: string) {
    try {
      await updatePregnancyFood(id, {
        food: form.food,
        stage: form.stage,
        baby_effect: form.baby_effect,
        mother_effect: form.mother_effect,
        nutrients: Array.isArray(form.nutrients)
          ? form.nutrients
          : [form.nutrients],
        science: form.science,
      });
      toast("Saved", "success");
      setEditId(null);
      setForm(EMPTY_FOOD);
      load();
    } catch {
      toast("Save failed", "error");
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"?`)) return;
    try {
      await deletePregnancyFood(id);
      toast("Deleted", "error");
      load();
    } catch {
      toast("Delete failed", "error");
    }
  }

  function FormBlock() {
    return (
      <div className="grid grid-cols-2 gap-3">
        <Field label="Food Name">
          <Input
            value={form.food}
            onChange={(v) => setForm((p: any) => ({ ...p, food: v }))}
            placeholder="e.g. Salmon"
          />
        </Field>
        <Field label="Pregnancy Stage">
          <select
            value={form.stage}
            onChange={(e) =>
              setForm((p: any) => ({ ...p, stage: e.target.value }))
            }
            className="w-full bg-cream border border-cream-dark rounded-[8px] px-3 py-2 text-[.78rem] text-ink outline-none font-sans"
          >
            {STAGE_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="Baby Effect">
          <Textarea
            value={form.baby_effect}
            onChange={(v) => setForm((p: any) => ({ ...p, baby_effect: v }))}
            placeholder="e.g. enhances brain growth"
          />
        </Field>
        <Field label="Mother Effect">
          <Textarea
            value={form.mother_effect}
            onChange={(v) => setForm((p: any) => ({ ...p, mother_effect: v }))}
            placeholder="e.g. supports mood stability"
          />
        </Field>
        <Field label="Nutrients (Enter to add)">
          <TagInput
            value={Array.isArray(form.nutrients) ? form.nutrients : []}
            onChange={(v) => setForm((p: any) => ({ ...p, nutrients: v }))}
            color={GOLD}
            placeholder="e.g. DHA"
          />
        </Field>
        <Field label="Science Note">
          <Input
            value={form.science}
            onChange={(v) => setForm((p: any) => ({ ...p, science: v }))}
            placeholder="e.g. DHA is critical for brain development"
          />
        </Field>
      </div>
    );
  }

  return (
    <div>
      <BulkBanner
        count={items.length}
        label="pregnancy foods"
        onUpload={handleBulkUpload}
        uploading={uploading}
      />

      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search foods, effects…"
            className="text-[.76rem] bg-cream border border-cream-dark rounded-[9px] px-3 py-2 outline-none w-52 font-sans"
          />
          <select
            value={stageFilter}
            onChange={(e) => setStageFilter(e.target.value)}
            className="text-[.74rem] bg-cream border border-cream-dark rounded-[9px] px-2.5 py-2 outline-none font-sans"
          >
            <option>All</option>
            {STAGE_OPTIONS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <span className="text-[.7rem] text-ink-soft">
            {filtered.length} of {items.length}
          </span>
        </div>
        <BtnPrimary
          onClick={() => {
            setShowAdd((s) => !s);
            setEditId(null);
          }}
          color={GREEN}
        >
          + Add Food
        </BtnPrimary>
      </div>

      {showAdd && (
        <div className="bg-[#E8F2EC] border border-[#C8E0D0] rounded-xl p-4 mb-4">
          <div className="font-bold text-[.82rem] text-ink mb-3">
            New Pregnancy Food
          </div>
          <FormBlock />
          <div className="flex gap-2 mt-3">
            <BtnPrimary onClick={handleAdd} color={GREEN}>
              Save Food
            </BtnPrimary>
            <BtnGhost
              onClick={() => {
                setShowAdd(false);
                setForm(EMPTY_FOOD);
              }}
            >
              Cancel
            </BtnGhost>
          </div>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-[.78rem] text-ink-soft">
          Loading from Bubble…
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {filtered.slice(0, 60).map((food) => (
            <div
              key={food._id}
              className="bg-ivory border border-cream-dark rounded-xl overflow-hidden"
            >
              {editId === food._id ? (
                <div className="p-4">
                  <FormBlock />
                  <div className="flex gap-2 mt-3">
                    <BtnPrimary
                      onClick={() => handleSave(food._id)}
                      color={GREEN}
                    >
                      Save
                    </BtnPrimary>
                    <BtnGhost
                      onClick={() => {
                        setEditId(null);
                        setForm(EMPTY_FOOD);
                      }}
                    >
                      Cancel
                    </BtnGhost>
                  </div>
                </div>
              ) : (
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <div className="font-bold text-[.85rem] text-ink">
                        {food.food}
                      </div>
                      <span
                        className="text-[.63rem] font-semibold px-2 py-[2px] rounded-full"
                        style={{
                          background: `${stageColor(food.stage)}15`,
                          color: stageColor(food.stage),
                        }}
                      >
                        {food.stage}
                      </span>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <BtnGhost onClick={() => startEdit(food)}>Edit</BtnGhost>
                      <BtnGhost
                        onClick={() => handleDelete(food._id, food.food)}
                        danger
                      >
                        Del
                      </BtnGhost>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {(Array.isArray(food.nutrients)
                      ? food.nutrients
                      : (food.nutrients ?? "").split(", ").filter(Boolean)
                    ).map((n: string) => (
                      <Pill key={n} label={n} color={GOLD} />
                    ))}
                  </div>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-start gap-2">
                      <span className="text-[.59rem] font-bold uppercase tracking-wide text-[#2D6B4A] flex-shrink-0 w-12 mt-[1px]">
                        Baby
                      </span>
                      <span className="text-[.72rem] text-ink-mid leading-[1.35]">
                        {food.baby_effect}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-[.59rem] font-bold uppercase tracking-wide text-[#C9973A] flex-shrink-0 w-12 mt-[1px]">
                        Mother
                      </span>
                      <span className="text-[.72rem] text-ink-mid leading-[1.35]">
                        {food.mother_effect}
                      </span>
                    </div>
                    {food.science && (
                      <div className="flex items-start gap-2">
                        <span className="text-[.59rem] font-bold uppercase tracking-wide text-ink-soft flex-shrink-0 w-12 mt-[1px]">
                          Science
                        </span>
                        <span className="text-[.68rem] text-ink-xs italic leading-[1.35]">
                          {food.science}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {filtered.length > 60 && (
        <div className="text-center py-3 text-[.71rem] text-ink-soft">
          Showing 60 of {filtered.length}
        </div>
      )}
    </div>
  );
}

// ── MILK NUTRIENTS TAB ────────────────────────────────────────
interface MilkN {
  _id: string;
  name: string;
  role_mother: string;
  role_milk: string;
  benefit_baby: string;
}
const EMPTY_MILK = {
  name: "",
  role_mother: "",
  role_milk: "",
  benefit_baby: "",
};

function MilkTab() {
  const { toast } = useToast();
  const milk = milkDataRaw.postpartum_milk_optimization;

  // ── Key Nutrients state ──────────────────────────────────
  const [nutrients, setNutrients] = useState<MilkN[]>([]);
  const [nutrLoading, setNutrLoading] = useState(true);
  const [nutrUploading, setNutrUploading] = useState(false);
  const [nutrEditId, setNutrEditId] = useState<string | null>(null);
  const [nutrShowAdd, setNutrShowAdd] = useState(false);
  const [nutrForm, setNutrForm] = useState(EMPTY_MILK);

  // ── Blood Actions state ──────────────────────────────────
  const [bloodActions, setBloodActions] = useState<
    { _id: string; action: string }[]
  >([]);
  const [baLoading, setBaLoading] = useState(true);
  const [baUploading, setBaUploading] = useState(false);
  const [baEditId, setBaEditId] = useState<string | null>(null);
  const [baNewVal, setBaNewVal] = useState("");
  const [baEditVal, setBaEditVal] = useState("");
  const [baShowAdd, setBaShowAdd] = useState(false);

  // ── Blood Thinning Foods state ───────────────────────────
  const [thinFoods, setThinFoods] = useState<
    { _id: string; food: string; effect?: string }[]
  >([]);
  const [tfLoading, setTfLoading] = useState(true);
  const [tfUploading, setTfUploading] = useState(false);
  const [tfEditId, setTfEditId] = useState<string | null>(null);
  const [tfNewFood, setTfNewFood] = useState("");
  const [tfEditFood, setTfEditFood] = useState("");
  const [tfShowAdd, setTfShowAdd] = useState(false);

  // ── Milk Boosters state ──────────────────────────────────
  const [boosters, setBoosters] = useState<
    { _id: string; food: string; effect: string }[]
  >([]);
  const [mbLoading, setMbLoading] = useState(true);
  const [mbUploading, setMbUploading] = useState(false);
  const [mbEditId, setMbEditId] = useState<string | null>(null);
  const [mbNewFood, setMbNewFood] = useState("");
  const [mbNewEffect, setMbNewEffect] = useState("");
  const [mbEditFood, setMbEditFood] = useState("");
  const [mbEditEffect, setMbEditEffect] = useState("");
  const [mbShowAdd, setMbShowAdd] = useState(false);

  // ── Load all ─────────────────────────────────────────────
  const loadNutrients = useCallback(async () => {
    try {
      setNutrients(await fetchMilkNutrients());
    } catch {
    } finally {
      setNutrLoading(false);
    }
  }, []);
  const loadActions = useCallback(async () => {
    try {
      setBloodActions(await fetchBloodActions());
    } catch {
    } finally {
      setBaLoading(false);
    }
  }, []);
  const loadThinFoods = useCallback(async () => {
    try {
      setThinFoods(await fetchBloodThinningFoods());
    } catch {
    } finally {
      setTfLoading(false);
    }
  }, []);
  const loadBoosters = useCallback(async () => {
    try {
      setBoosters(await fetchMilkBoosters());
    } catch {
    } finally {
      setMbLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNutrients();
    loadActions();
    loadThinFoods();
    loadBoosters();
  }, [loadNutrients, loadActions, loadThinFoods, loadBoosters]);

  const nf = (key: keyof typeof EMPTY_MILK) => (v: string) =>
    setNutrForm((p) => ({ ...p, [key]: v }));

  return (
    <div className="flex flex-col gap-6">
      {/* ── Context banner ─────────────────────────────── */}
      <div className="bg-[#EDE6F5] border border-[#C8B8E0] rounded-xl px-4 py-3 text-[.74rem] text-[#5A3A8A]">
        <strong>Blood → Milk → Baby:</strong> {milk.concept.core_logic}
        <span className="ml-2 text-[.68rem] opacity-75">
          All five sections below feed into the AI prompt for postpartum users
          via{" "}
          <code className="font-mono bg-[#DDD0F0] px-1 rounded">
            getMilkContext()
          </code>
          .
        </span>
      </div>

      {/* ── SECTION 1 — Key Nutrients ───────────────────── */}
      <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-cream bg-cream">
          <div>
            <div className="font-bold text-[.85rem] text-ink">
              Key Nutrients — Blood → Milk → Baby Chain
            </div>
            <div className="text-[.7rem] text-ink-soft mt-0.5">
              Passed to AI as{" "}
              <code className="font-mono bg-cream-dark px-1 rounded">
                key_nutrients_milk
              </code>{" "}
              · Bubble type:{" "}
              <code className="font-mono bg-cream-dark px-1 rounded">
                milknutrient
              </code>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {nutrients.length === 0 && (
              <BtnPrimary
                onClick={async () => {
                  setNutrUploading(true);
                  try {
                    await bulkUploadMilkNutrients(milk.key_nutrients);
                    toast("Uploaded nutrients", "success");
                    loadNutrients();
                  } catch {
                    toast("Upload failed", "error");
                  } finally {
                    setNutrUploading(false);
                  }
                }}
                disabled={nutrUploading}
                color={GOLD}
              >
                {nutrUploading ? "Uploading…" : "↑ Upload from JSON"}
              </BtnPrimary>
            )}
            <BtnPrimary
              onClick={() => {
                setNutrShowAdd((s) => !s);
                setNutrEditId(null);
              }}
              color={VIOLET}
            >
              + Add
            </BtnPrimary>
          </div>
        </div>

        {nutrShowAdd && (
          <div className="p-4 border-b border-cream bg-[#F9F6FF]">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Field label="Nutrient Name">
                <Input
                  value={nutrForm.name}
                  onChange={nf("name")}
                  placeholder="e.g. iron"
                />
              </Field>
              <Field label="Role in Mother's Blood">
                <Input
                  value={nutrForm.role_mother}
                  onChange={nf("role_mother")}
                  placeholder="e.g. rebuilds blood after birth"
                />
              </Field>
              <Field label="Role in Milk">
                <Input
                  value={nutrForm.role_milk}
                  onChange={nf("role_milk")}
                  placeholder="e.g. improves oxygen transport"
                />
              </Field>
              <Field label="Baby Benefit">
                <Input
                  value={nutrForm.benefit_baby}
                  onChange={nf("benefit_baby")}
                  placeholder="e.g. supports brain and growth"
                />
              </Field>
            </div>
            <div className="flex gap-2">
              <BtnPrimary
                onClick={async () => {
                  if (!nutrForm.name.trim()) return;
                  try {
                    await createMilkNutrient(nutrForm);
                    toast("Added", "success");
                    setNutrForm(EMPTY_MILK);
                    setNutrShowAdd(false);
                    loadNutrients();
                  } catch {
                    toast("Failed", "error");
                  }
                }}
                color={VIOLET}
              >
                Save
              </BtnPrimary>
              <BtnGhost
                onClick={() => {
                  setNutrShowAdd(false);
                  setNutrForm(EMPTY_MILK);
                }}
              >
                Cancel
              </BtnGhost>
            </div>
          </div>
        )}

        {nutrLoading ? (
          <div className="px-4 py-6 text-center text-[.76rem] text-ink-soft">
            Loading from Bubble…
          </div>
        ) : (
          <div className="divide-y divide-cream">
            {nutrients.map((item) => (
              <div key={item._id} className="px-4 py-3">
                {nutrEditId === item._id ? (
                  <div>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Field label="Nutrient Name">
                        <Input value={nutrForm.name} onChange={nf("name")} />
                      </Field>
                      <Field label="Role in Mother's Blood">
                        <Input
                          value={nutrForm.role_mother}
                          onChange={nf("role_mother")}
                        />
                      </Field>
                      <Field label="Role in Milk">
                        <Input
                          value={nutrForm.role_milk}
                          onChange={nf("role_milk")}
                        />
                      </Field>
                      <Field label="Baby Benefit">
                        <Input
                          value={nutrForm.benefit_baby}
                          onChange={nf("benefit_baby")}
                        />
                      </Field>
                    </div>
                    <div className="flex gap-2">
                      <BtnPrimary
                        onClick={async () => {
                          try {
                            await updateMilkNutrient(item._id, nutrForm);
                            toast("Saved", "success");
                            setNutrEditId(null);
                            loadNutrients();
                          } catch {
                            toast("Failed", "error");
                          }
                        }}
                        color={GREEN}
                      >
                        Save
                      </BtnPrimary>
                      <BtnGhost
                        onClick={() => {
                          setNutrEditId(null);
                          setNutrForm(EMPTY_MILK);
                        }}
                      >
                        Cancel
                      </BtnGhost>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div
                      className="font-bold text-[.82rem] flex-shrink-0 w-32"
                      style={{ color: VIOLET }}
                    >
                      {item.name}
                    </div>
                    <div className="grid grid-cols-3 gap-3 flex-1">
                      {[
                        {
                          label: "Mother",
                          value: item.role_mother,
                          color: GOLD,
                        },
                        { label: "Milk", value: item.role_milk, color: VIOLET },
                        {
                          label: "Baby",
                          value: item.benefit_baby,
                          color: GREEN,
                        },
                      ].map((row) => (
                        <div key={row.label}>
                          <div
                            className="text-[.59rem] font-bold uppercase tracking-wide mb-0.5"
                            style={{ color: row.color }}
                          >
                            {row.label}
                          </div>
                          <div className="text-[.72rem] text-ink-mid leading-[1.3]">
                            {row.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <BtnGhost
                        onClick={() => {
                          setNutrEditId(item._id);
                          setNutrForm({
                            name: item.name,
                            role_mother: item.role_mother,
                            role_milk: item.role_milk,
                            benefit_baby: item.benefit_baby,
                          });
                        }}
                      >
                        Edit
                      </BtnGhost>
                      <BtnGhost
                        onClick={async () => {
                          if (!confirm(`Delete "${item.name}"?`)) return;
                          try {
                            await deleteMilkNutrient(item._id);
                            toast("Deleted", "error");
                            loadNutrients();
                          } catch {
                            toast("Failed", "error");
                          }
                        }}
                        danger
                      >
                        Del
                      </BtnGhost>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 2 — Blood Optimization Actions ──────── */}
      <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-cream bg-cream">
          <div>
            <div className="font-bold text-[.85rem] text-ink">
              Blood Optimization Actions
            </div>
            <div className="text-[.7rem] text-ink-soft mt-0.5">
              Passed to AI as{" "}
              <code className="font-mono bg-cream-dark px-1 rounded">
                blood_support
              </code>{" "}
              · Bubble type:{" "}
              <code className="font-mono bg-cream-dark px-1 rounded">
                bloodaction
              </code>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {bloodActions.length === 0 && (
              <BtnPrimary
                onClick={async () => {
                  setBaUploading(true);
                  try {
                    await bulkUploadBloodActions(
                      milk.blood_optimization.actions,
                    );
                    toast("Uploaded", "success");
                    loadActions();
                  } catch {
                    toast("Upload failed", "error");
                  } finally {
                    setBaUploading(false);
                  }
                }}
                disabled={baUploading}
                color={GOLD}
              >
                {baUploading ? "Uploading…" : "↑ Upload from JSON"}
              </BtnPrimary>
            )}
            <BtnPrimary
              onClick={() => {
                setBaShowAdd((s) => !s);
                setBaEditId(null);
              }}
              color={RUST}
            >
              + Add Action
            </BtnPrimary>
          </div>
        </div>

        {baShowAdd && (
          <div className="p-4 border-b border-cream bg-[#FDF5F4] flex gap-3 items-end">
            <div className="flex-1">
              <Field label="Action description">
                <Input
                  value={baNewVal}
                  onChange={setBaNewVal}
                  placeholder="e.g. increase iron intake"
                />
              </Field>
            </div>
            <BtnPrimary
              onClick={async () => {
                if (!baNewVal.trim()) return;
                try {
                  await createBloodAction(baNewVal);
                  toast("Added", "success");
                  setBaNewVal("");
                  setBaShowAdd(false);
                  loadActions();
                } catch {
                  toast("Failed", "error");
                }
              }}
              color={RUST}
            >
              Save
            </BtnPrimary>
            <BtnGhost
              onClick={() => {
                setBaShowAdd(false);
                setBaNewVal("");
              }}
            >
              Cancel
            </BtnGhost>
          </div>
        )}

        {baLoading ? (
          <div className="px-4 py-6 text-center text-[.76rem] text-ink-soft">
            Loading from Bubble…
          </div>
        ) : (
          <div className="divide-y divide-cream">
            {bloodActions.map((item) => (
              <div
                key={item._id}
                className="px-4 py-2.5 flex items-center gap-3"
              >
                {baEditId === item._id ? (
                  <>
                    <div className="flex-1">
                      <Input value={baEditVal} onChange={setBaEditVal} />
                    </div>
                    <BtnPrimary
                      onClick={async () => {
                        try {
                          await updateBloodAction(item._id, baEditVal);
                          toast("Saved", "success");
                          setBaEditId(null);
                          loadActions();
                        } catch {
                          toast("Failed", "error");
                        }
                      }}
                      color={GREEN}
                    >
                      Save
                    </BtnPrimary>
                    <BtnGhost onClick={() => setBaEditId(null)}>
                      Cancel
                    </BtnGhost>
                  </>
                ) : (
                  <>
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: RUST }}
                    />
                    <div className="flex-1 text-[.78rem] text-ink-mid">
                      {item.action}
                    </div>
                    <BtnGhost
                      onClick={() => {
                        setBaEditId(item._id);
                        setBaEditVal(item.action);
                      }}
                    >
                      Edit
                    </BtnGhost>
                    <BtnGhost
                      onClick={async () => {
                        if (!confirm("Delete this action?")) return;
                        try {
                          await deleteBloodAction(item._id);
                          toast("Deleted", "error");
                          loadActions();
                        } catch {
                          toast("Failed", "error");
                        }
                      }}
                      danger
                    >
                      Del
                    </BtnGhost>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 3 — Blood Thinning Support Foods ────── */}
      <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-cream bg-cream">
          <div>
            <div className="font-bold text-[.85rem] text-ink">
              Blood Thinning Support Foods
            </div>
            <div className="text-[.7rem] text-ink-soft mt-0.5">
              Context:{" "}
              <span className="text-ink-mid italic">
                {milk.blood_thinning_support.context}
              </span>{" "}
              → Goal:{" "}
              <span className="text-ink-mid italic">
                {milk.blood_thinning_support.goal}
              </span>{" "}
              · Bubble type:{" "}
              <code className="font-mono bg-cream-dark px-1 rounded">
                bloodthinningfood
              </code>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {thinFoods.length === 0 && (
              <BtnPrimary
                onClick={async () => {
                  setTfUploading(true);
                  try {
                    await bulkUploadBloodThinningFoods(
                      milk.blood_thinning_support.supporting_foods,
                    );
                    toast("Uploaded", "success");
                    loadThinFoods();
                  } catch {
                    toast("Upload failed", "error");
                  } finally {
                    setTfUploading(false);
                  }
                }}
                disabled={tfUploading}
                color={GOLD}
              >
                {tfUploading ? "Uploading…" : "↑ Upload from JSON"}
              </BtnPrimary>
            )}
            <BtnPrimary
              onClick={() => {
                setTfShowAdd((s) => !s);
                setTfEditId(null);
              }}
              color={TEAL}
            >
              + Add Food
            </BtnPrimary>
          </div>
        </div>

        {/* Effect note */}
        <div className="px-4 py-2 border-b border-cream bg-[#F0FAFA] text-[.71rem] text-[#1F7A7A]">
          Effect: <em>{milk.blood_thinning_support.effect}</em>
        </div>

        {tfShowAdd && (
          <div className="p-4 border-b border-cream bg-[#F0FAFA] flex gap-3 items-end">
            <div className="flex-1">
              <Field label="Food name">
                <Input
                  value={tfNewFood}
                  onChange={setTfNewFood}
                  placeholder="e.g. garlic"
                />
              </Field>
            </div>
            <BtnPrimary
              onClick={async () => {
                if (!tfNewFood.trim()) return;
                try {
                  await createBloodThinningFood({ food: tfNewFood });
                  toast("Added", "success");
                  setTfNewFood("");
                  setTfShowAdd(false);
                  loadThinFoods();
                } catch {
                  toast("Failed", "error");
                }
              }}
              color={TEAL}
            >
              Save
            </BtnPrimary>
            <BtnGhost
              onClick={() => {
                setTfShowAdd(false);
                setTfNewFood("");
              }}
            >
              Cancel
            </BtnGhost>
          </div>
        )}

        {tfLoading ? (
          <div className="px-4 py-6 text-center text-[.76rem] text-ink-soft">
            Loading from Bubble…
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 p-4">
            {thinFoods.map((item) => (
              <div
                key={item._id}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border"
                style={{ background: `${TEAL}10`, borderColor: `${TEAL}30` }}
              >
                {tfEditId === item._id ? (
                  <>
                    <input
                      value={tfEditFood}
                      onChange={(e) => setTfEditFood(e.target.value)}
                      className="bg-transparent border-none outline-none text-[.74rem] text-ink w-24 font-sans"
                    />
                    <button
                      onClick={async () => {
                        try {
                          await updateBloodThinningFood(item._id, {
                            food: tfEditFood,
                          });
                          toast("Saved", "success");
                          setTfEditId(null);
                          loadThinFoods();
                        } catch {
                          toast("Failed", "error");
                        }
                      }}
                      className="text-[.65rem] font-bold text-green-700 bg-transparent border-none cursor-pointer"
                    >
                      ✓
                    </button>
                    <button
                      onClick={() => setTfEditId(null)}
                      className="text-[.65rem] text-ink-soft bg-transparent border-none cursor-pointer"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <>
                    <span
                      className="text-[.76rem] font-medium"
                      style={{ color: TEAL }}
                    >
                      {item.food}
                    </span>
                    <button
                      onClick={() => {
                        setTfEditId(item._id);
                        setTfEditFood(item.food);
                      }}
                      className="text-[.6rem] text-ink-soft bg-transparent border-none cursor-pointer ml-1 hover:text-ink"
                    >
                      ✎
                    </button>
                    <button
                      onClick={async () => {
                        if (!confirm(`Delete "${item.food}"?`)) return;
                        try {
                          await deleteBloodThinningFood(item._id);
                          toast("Deleted", "error");
                          loadThinFoods();
                        } catch {}
                      }}
                      className="text-[.6rem] text-rust bg-transparent border-none cursor-pointer hover:opacity-75"
                    >
                      ×
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── SECTION 4 — Milk Boosting Foods ─────────────── */}
      <div className="bg-ivory border border-cream-dark rounded-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 border-b border-cream bg-cream">
          <div>
            <div className="font-bold text-[.85rem] text-ink">
              Milk-Boosting Foods
            </div>
            <div className="text-[.7rem] text-ink-soft mt-0.5">
              Passed to AI as{" "}
              <code className="font-mono bg-cream-dark px-1 rounded">
                milk_boosters
              </code>{" "}
              · Prioritised in postpartum meal generation · Bubble type:{" "}
              <code className="font-mono bg-cream-dark px-1 rounded">
                milkbooster
              </code>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            {boosters.length === 0 && (
              <BtnPrimary
                onClick={async () => {
                  setMbUploading(true);
                  try {
                    await bulkUploadMilkBoosters(milk.milk_boosting_foods);
                    toast("Uploaded", "success");
                    loadBoosters();
                  } catch {
                    toast("Upload failed", "error");
                  } finally {
                    setMbUploading(false);
                  }
                }}
                disabled={mbUploading}
                color={GOLD}
              >
                {mbUploading ? "Uploading…" : "↑ Upload from JSON"}
              </BtnPrimary>
            )}
            <BtnPrimary
              onClick={() => {
                setMbShowAdd((s) => !s);
                setMbEditId(null);
              }}
              color={GREEN}
            >
              + Add Food
            </BtnPrimary>
          </div>
        </div>

        {mbShowAdd && (
          <div className="p-4 border-b border-cream bg-[#F0FAF5] grid grid-cols-2 gap-3 items-end">
            <Field label="Food name">
              <Input
                value={mbNewFood}
                onChange={setMbNewFood}
                placeholder="e.g. oats"
              />
            </Field>
            <Field label="Effect on milk">
              <Input
                value={mbNewEffect}
                onChange={setMbNewEffect}
                placeholder="e.g. stimulates milk production (prolactin)"
              />
            </Field>
            <div className="col-span-2 flex gap-2">
              <BtnPrimary
                onClick={async () => {
                  if (!mbNewFood.trim() || !mbNewEffect.trim()) return;
                  try {
                    await createMilkBooster({
                      food: mbNewFood,
                      effect: mbNewEffect,
                    });
                    toast("Added", "success");
                    setMbNewFood("");
                    setMbNewEffect("");
                    setMbShowAdd(false);
                    loadBoosters();
                  } catch {
                    toast("Failed", "error");
                  }
                }}
                color={GREEN}
              >
                Save
              </BtnPrimary>
              <BtnGhost
                onClick={() => {
                  setMbShowAdd(false);
                  setMbNewFood("");
                  setMbNewEffect("");
                }}
              >
                Cancel
              </BtnGhost>
            </div>
          </div>
        )}

        {mbLoading ? (
          <div className="px-4 py-6 text-center text-[.76rem] text-ink-soft">
            Loading from Bubble…
          </div>
        ) : (
          <div className="divide-y divide-cream">
            {boosters.map((item) => (
              <div key={item._id} className="px-4 py-3 flex items-start gap-4">
                {mbEditId === item._id ? (
                  <>
                    <div className="flex-1 grid grid-cols-2 gap-3">
                      <Field label="Food">
                        <Input value={mbEditFood} onChange={setMbEditFood} />
                      </Field>
                      <Field label="Effect">
                        <Input
                          value={mbEditEffect}
                          onChange={setMbEditEffect}
                        />
                      </Field>
                    </div>
                    <div className="flex gap-1.5 mt-5">
                      <BtnPrimary
                        onClick={async () => {
                          try {
                            await updateMilkBooster(item._id, {
                              food: mbEditFood,
                              effect: mbEditEffect,
                            });
                            toast("Saved", "success");
                            setMbEditId(null);
                            loadBoosters();
                          } catch {
                            toast("Failed", "error");
                          }
                        }}
                        color={GREEN}
                      >
                        Save
                      </BtnPrimary>
                      <BtnGhost onClick={() => setMbEditId(null)}>
                        Cancel
                      </BtnGhost>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="font-bold text-[.82rem] text-ink w-24 flex-shrink-0">
                      {item.food}
                    </div>
                    <div className="flex-1 text-[.76rem] text-ink-mid leading-[1.4]">
                      {item.effect}
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <BtnGhost
                        onClick={() => {
                          setMbEditId(item._id);
                          setMbEditFood(item.food);
                          setMbEditEffect(item.effect);
                        }}
                      >
                        Edit
                      </BtnGhost>
                      <BtnGhost
                        onClick={async () => {
                          if (!confirm(`Delete "${item.food}"?`)) return;
                          try {
                            await deleteMilkBooster(item._id);
                            toast("Deleted", "error");
                            loadBoosters();
                          } catch {}
                        }}
                        danger
                      >
                        Del
                      </BtnGhost>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
const TABS: { id: Tab; label: string; color: string; desc: string }[] = [
  {
    id: "female-jobs",
    label: "Female Jobs (500)",
    color: GOLD,
    desc: "Job risks + nutrient deficiencies for mothers",
  },
  {
    id: "male-jobs",
    label: "Male Jobs (500)",
    color: VIOLET,
    desc: "Fertility impact + sperm health per job",
  },
  {
    id: "foods",
    label: "Pregnancy Foods (100)",
    color: GREEN,
    desc: "Week-matched foods with baby & mother effects",
  },
  {
    id: "milk",
    label: "Milk / Blood Nutrients",
    color: RUST,
    desc: "Blood→milk→baby optimization chain",
  },
];

export default function DatasetsPage() {
  const [tab, setTab] = useState<Tab>("female-jobs");

  return (
    <>
      <PageHeader
        title="Datasets"
        sub="Editable knowledge bases the AI reads at runtime — changes here affect tomorrow's recommendations"
      />

      {/* Tabs */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="flex items-center gap-2 px-4 py-2 rounded-[9px] text-[.78rem] font-semibold border transition-all cursor-pointer font-sans"
            style={
              tab === t.id
                ? { background: t.color, borderColor: t.color, color: "#fff" }
                : {
                    background: "transparent",
                    borderColor: "var(--cream-dark)",
                    color: "var(--ink-mid)",
                  }
            }
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "female-jobs" && <FemaleJobsTab />}
      {tab === "male-jobs" && <MaleJobsTab />}
      {tab === "foods" && <FoodsTab />}
      {tab === "milk" && <MilkTab />}
    </>
  );
}
