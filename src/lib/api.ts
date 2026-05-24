// ─────────────────────────────────────────────────────────────
// Bloom Admin — Bubble API layer
// All data calls go through these functions.
// Replace NEXT_PUBLIC_BUBBLE_BASE_URL in .env.local
// ─────────────────────────────────────────────────────────────

const BASE = process.env.NEXT_PUBLIC_BUBBLE_BASE_URL ?? "";
const ADMIN_TOKEN_KEY = "bloom_admin_token";

// ── Token helpers ─────────────────────────────────────────────
export function saveToken(token: string) {
  if (typeof window !== "undefined")
    localStorage.setItem(ADMIN_TOKEN_KEY, token);
  document.cookie = `bloom_admin_token=${token}; path=/; SameSite=Strict`;
}
export function getToken(): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(ADMIN_TOKEN_KEY) ?? "";
}
export function clearToken() {
  if (typeof window !== "undefined") localStorage.removeItem(ADMIN_TOKEN_KEY);
}

function h(token?: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token ?? getToken()}`,
  };
}
// GET /obj/group
export interface PagedResponse<T> {
  results: T[];
  count: number; // total records in Bubble
  remaining_count: number; // records after this page
  cursor: number; // offset to use for next page
}

// ── Proxy helper ──────────────────────────────────────────────
// PATCH and DELETE are blocked by Bubble's CORS policy when called
// from a browser. Route them through Next.js /api/bubble instead.
async function bubbleProxy(
  method: "PATCH" | "DELETE",
  path: string,
  body?: Record<string, unknown>,
) {
  const token = getToken();
  const res = await fetch("/api/bubble", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ method, path, body, token }),
  });
  return res.json();
}

function c(
  arr: {
    key: string;
    constraint_type: string;
    value: string | number | boolean;
  }[],
) {
  return encodeURIComponent(JSON.stringify(arr));
}

// ── AUTH ─────────────────────────────────────────────────────
// POST /wf/admin_login → { token, user_id }
export async function adminLogin(email: string, password: string) {
  const res = await fetch(`${BASE}/wf/admin_login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

// ── USERS ────────────────────────────────────────────────────
// GET /obj/user?limit=100&sort_field=Created Date&descending=true
export async function fetchUsers(limit = 100) {
  const res = await fetch(`${BASE}/wf/get_users`, { headers: h() });
  const d = await res.json();
  return d.response?.results ?? [];
}

// GET /obj/user/:id
export async function fetchUser(id: string) {
  const res = await fetch(`${BASE}/obj/user/${id}`, { headers: h() });
  const d = await res.json();
  return d.response;
}

// PATCH /obj/user/:id — suspend, reinstate, change status
export async function updateUser(id: string, data: Record<string, unknown>) {
  return bubbleProxy("PATCH", `/obj/user/${id}`, data);
}

// GET /obj/user count by journey_type
export async function countByStage(stage: string): Promise<number> {
  const res = await fetch(`${BASE}/wf/get_user_count_by_stage?stage=${stage}`, {
    headers: h(),
  });
  const d = await res.json();
  return d.response?.count ?? 0;
}

// GET /obj/user total count
export async function countUsers(): Promise<number> {
  const res = await fetch(`${BASE}/wf/get_user_count`, { headers: h() });
  const d = await res.json();
  return d.response?.count ?? 0;
}

// ── PROTOCOLS ────────────────────────────────────────────────
// GET /obj/protocol?sort_field=Created Date&descending=true&limit=200
export async function fetchProtocols(limit = 200) {
  const res = await fetch(
    `${BASE}/obj/protocol?sort_field=Created%20Date&descending=true&limit=${limit}`,
    { headers: h() },
  );
  const d = await res.json();
  return d.response?.results ?? [];
}

// GET /obj/protocol count today
export async function countTodayProtocols(): Promise<number> {
  const res = await fetch(`${BASE}/wf/get_todays_protocol_count`, {
    headers: h(),
  });
  const d = await res.json();
  return d.response?.count ?? 0;
}

// POST /wf/recalibrate — trigger AI recalibration for a user
export async function recalibrateUser(userId: string) {
  const res = await fetch(`${BASE}/wf/recalibrate`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify({ calling_user: userId }),
  });
  return res.json();
}

// ── COMMUNITY ────────────────────────────────────────────────
// GET /obj/group
export async function fetchGroups(
  cursor = 0,
  limit = 50,
): Promise<PagedResponse<any>> {
  const url = `${BASE}/obj/group?sort_field=member_count&descending=true&limit=${limit}&cursor=${cursor}`;
  const res = await fetch(url, { headers: h() });
  const d = await res.json();
  return {
    results: d.response?.results ?? [],
    count: d.response?.count ?? 0,
    remaining_count: d.response?.remaining_count ?? 0,
    cursor: d.response?.cursor ?? 0,
  };
}
// PATCH /obj/post/:id — approve post (clear flagged)
export async function approvePost(postId: string) {
  return bubbleProxy("PATCH", `/obj/post/${postId}`, {
    flagged: false,
    hidden: false,
  });
}
// POST /obj/group — create a new community group
export async function createGroup(data: {
  name: string;
  description: string;
  category: string;
}) {
  const res = await fetch(`${BASE}/wf/create_group`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify(data),
  });
  return res.json();
}
// DELETE /obj/group/:id — delete a group permanently
export async function deleteGroup(id: string) {
  return bubbleProxy("DELETE", `/obj/group/${id}`);
}
// PATCH /obj/group/:id — update group fields
export async function updateGroup(
  id: string,
  data: Partial<{ name: string; description: string; category: string }>,
) {
  return bubbleProxy(
    "PATCH",
    `/obj/group/${id}`,
    data as Record<string, unknown>,
  );
}

// POST /wf/broadcast_group — send a message to all group members
// Requires a Bubble workflow that sends a notification/message to all members
export async function broadcastGroup(groupId: string, message: string) {
  const res = await fetch(`${BASE}/wf/broadcast_group`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify({ group_id: groupId, message }),
  });
  return res.json();
}

// GET /obj/post?constraints — fetch posts filtered by group
export async function fetchGroupPosts(groupId: string) {
  const con = encodeURIComponent(
    JSON.stringify([
      { key: "group", constraint_type: "equals", value: groupId },
    ]),
  );
  const res = await fetch(
    `${BASE}/obj/Communitypost?constraints=${con}&sort_field=Created Date&descending=true&limit=50`,
    { headers: h() },
  );
  const d = await res.json();
  return d.response?.results ?? [];
}

// GET /obj/post?sort_field=Created Date&descending=true&limit=50
export async function fetchPosts(
  cursor = 0,
  limit = 50,
): Promise<PagedResponse<any>> {
  const url = `${BASE}/obj/Communitypost?sort_field=Created%20Date&descending=true&limit=${limit}&cursor=${cursor}`;
  const res = await fetch(url, { headers: h() });
  const d = await res.json();
  return {
    results: d.response?.results ?? [],
    count: d.response?.count ?? 0,
    remaining_count: d.response?.remaining_count ?? 0,
    cursor: d.response?.cursor ?? 0,
  };
}

// PATCH /obj/post/:id — hide or unhide post
export async function moderatePost(
  postId: string,
  data: { hidden?: boolean; flagged?: boolean },
) {
  return bubbleProxy("PATCH", `/obj/post/${postId}`, data);
}

// DELETE /obj/post/:id
export async function deletePost(postId: string) {
  return bubbleProxy("DELETE", `/obj/post/${postId}`);
}

// GET /obj/movement?limit=200
export async function fetchMovement(limit = 200) {
  const res = await fetch(`${BASE}/wf/get_all_movements`, { headers: h() });
  const d = await res.json();
  return d.response?.results ?? [];
}

// GET /obj/meal?limit=200
export async function fetchMeals(limit = 200) {
  const res = await fetch(`${BASE}/wf/get_all_meals`, { headers: h() });
  const d = await res.json();
  return d.response?.results ?? [];
}

// ─────────────────────────────────────────────────────────────
// DATASET CRUD — FemaleJob, MaleJob, PregnancyFood, MilkNutrient
//
// Bubble data types required:
//   femalejob:      id(number), job(text), gender(text), common_risks(text), nutrient_risks(text)
//   malejob:        id(number), job(text), gender(text), common_risks(text), nutrient_risks(text),
//                   sperm_impact(text), hormone_impact(text), recommended_foods(text), supplements(text)
//   pregnancyfood:  id(number), food(text), stage(text), baby_effect(text),
//                   mother_effect(text), nutrients(text), science(text)
//   milknutrient:   name(text), role_mother(text), role_milk(text), benefit_baby(text)
//
// All comma-separated array fields (common_risks, nutrients etc.) are stored as plain text
// and split/joined client-side. This keeps Bubble simple.
// ─────────────────────────────────────────────────────────────

// ── Female Jobs ───────────────────────────────────────────────
export async function fetchFemaleJobs(
  cursor = 0,
  limit = 50,
): Promise<PagedResponse<any>> {
  const res = await fetch(
    `${BASE}/obj/femalejob?sort_field=Created%20Date&limit=${limit}&cursor=${cursor}`,
    { headers: h() },
  );
  const d = await res.json();
  return {
    results: d.response?.results ?? [],
    count:
      (d.response?.cursor ?? 0) +
      (d.response?.count ?? 0) +
      (d.response?.remaining ?? 0),
    remaining_count: d.response?.remaining ?? 0, // Bubble sends "remaining" not "remaining_count"
    cursor: d.response?.cursor ?? 0,
  };
}
export async function createFemaleJob(data: {
  job: string;
  common_risks: string[];
  nutrient_risks: string[];
}) {
  const res = await fetch(`${BASE}/wf/createFemaleJobs`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify({ ...data, gender: "female" }),
  });
  return res.json();
}
export async function updateFemaleJob(
  id: string,
  data: Partial<{
    job: string;
    common_risks: string[];
    nutrient_risks: string[];
  }>,
) {
  return bubbleProxy(
    "PATCH",
    `/obj/femalejob/${id}`,
    data as Record<string, unknown>,
  );
}
export async function deleteFemaleJob(id: string) {
  return bubbleProxy("DELETE", `/obj/femalejob/${id}`);
}
// ── Male Jobs ─────────────────────────────────────────────────
export async function fetchMaleJobs(
  cursor = 0,
  limit = 50,
): Promise<PagedResponse<any>> {
  const res = await fetch(
    `${BASE}/obj/malejob?sort_field=Created%20Date&limit=${limit}&cursor=${cursor}`,
    { headers: h() },
  );
  const d = await res.json();
  return {
    results: d.response?.results ?? [],
    count:
      (d.response?.cursor ?? 0) +
      (d.response?.count ?? 0) +
      (d.response?.remaining ?? 0),
    remaining_count: d.response?.remaining ?? 0, // Bubble sends "remaining" not "remaining_count"
    cursor: d.response?.cursor ?? 0,
  };
}
export async function createMaleJob(data: {
  job: string;
  common_risks: string[];
  nutrient_risks: string[];
  sperm_impact: string;
  hormone_impact: string;
  recommended_foods: string[];
  supplements: string[];
}) {
  const res = await fetch(`${BASE}/wf/createMaleJobs`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify({ ...data, gender: "male" }),
  });
  return res.json();
}
export async function updateMaleJob(
  id: string,
  data: Record<string, string | string[]>,
) {
  return bubbleProxy(
    "PATCH",
    `/obj/malejob/${id}`,
    data as Record<string, unknown>,
  );
}
export async function deleteMaleJob(id: string) {
  return bubbleProxy("DELETE", `/obj/malejob/${id}`);
}

// ── Pregnancy Foods ───────────────────────────────────────────
export async function fetchPregnancyFoods(limit = 150) {
  const res = await fetch(`${BASE}/wf/getPregnancyfood`, { headers: h() });
  const d = await res.json();
  return d.response?.results ?? [];
}
export async function createPregnancyFood(data: {
  food: string;
  stage: string;
  baby_effect: string;
  mother_effect: string;
  nutrients: string[];
  science: string;
}) {
  const res = await fetch(`${BASE}/wf/createPregnancyfood`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updatePregnancyFood(
  id: string,
  data: Record<string, string | string[]>,
) {
  return bubbleProxy(
    "PATCH",
    `/obj/pregnancyfood/${id}`,
    data as Record<string, unknown>,
  );
}
export async function deletePregnancyFood(id: string) {
  return bubbleProxy("DELETE", `/obj/pregnancyfood/${id}`);
}

// ── Milk Nutrients ────────────────────────────────────────────
export async function fetchMilkNutrients() {
  const res = await fetch(`${BASE}/wf/get_milknutrient`, {
    headers: h(),
  });
  const d = await res.json();
  return d.response?.results ?? [];
}
export async function createMilkNutrient(data: {
  name: string;
  role_mother: string;
  role_milk: string;
  benefit_baby: string;
}) {
  const res = await fetch(`${BASE}/wf/create_milknutrient`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateMilkNutrient(
  id: string,
  data: Record<string, string>,
) {
  return bubbleProxy(
    "PATCH",
    `/obj/milknutrient/${id}`,
    data as Record<string, unknown>,
  );
}
export async function deleteMilkNutrient(id: string) {
  return bubbleProxy("DELETE", `/obj/milknutrient/${id}`);
}

// ── Bulk upload helpers ───────────────────────────────────────
// Called once from the datasets page to seed Bubble from JSON.
// Run only when Bubble has 0 records (first-time setup).

export async function bulkUploadFemaleJobs(jobs: any[]) {
  const results = [];
  for (const job of jobs) {
    const r = await createFemaleJob({
      job: job.job,
      common_risks: Array.isArray(job.common_risks)
        ? job.common_risks
        : [job.common_risks ?? ""],
      nutrient_risks: Array.isArray(job.nutrient_risks)
        ? job.nutrient_risks
        : [job.nutrient_risks ?? ""],
    });
    results.push(r);
  }
  return results;
}

export async function bulkUploadMaleJobs(jobs: any[]) {
  const results = [];
  for (const job of jobs) {
    const fi = job.fertility_impact ?? {};
    const r = await createMaleJob({
      job: job.job,
      common_risks: Array.isArray(job.common_risks)
        ? job.common_risks
        : [job.common_risks ?? ""],
      nutrient_risks: Array.isArray(job.nutrient_risks)
        ? job.nutrient_risks
        : [job.nutrient_risks ?? ""],
      sperm_impact: fi.sperm ?? fi.sperm_count ?? "",
      hormone_impact: fi.hormones ?? fi.hormone_impact ?? "",
      recommended_foods: Array.isArray(job.recommended_foods)
        ? job.recommended_foods
        : [job.recommended_foods ?? ""],
      supplements: Array.isArray(job.supplements)
        ? job.supplements
        : [job.supplements ?? ""],
    });
    results.push(r);
  }
  return results;
}

export async function bulkUploadFoods(foods: any[]) {
  const results = [];
  for (const food of foods) {
    const r = await createPregnancyFood({
      food: food.food,
      stage: food.stage,
      baby_effect: food.baby_effect,
      mother_effect: food.mother_effect,
      nutrients: Array.isArray(food.nutrients)
        ? food.nutrients
        : [food.nutrients ?? ""],
      science: food.science ?? "",
    });
    results.push(r);
  }
  return results;
}

export async function bulkUploadMilkNutrients(nutrients: any[]) {
  const results = [];
  for (const n of nutrients) {
    const r = await createMilkNutrient({
      name: n.name,
      role_mother: n.role_mother,
      role_milk: n.role_milk,
      benefit_baby: n.benefit_baby,
    });
    results.push(r);
  }
  return results;
}

// ── Blood Optimization Actions ────────────────────────────────
// Bubble type: bloodaction — fields: action (text)
export async function fetchBloodActions() {
  const res = await fetch(`${BASE}/wf/get_bloodAction`, { headers: h() });
  const d = await res.json();
  return d.response?.results ?? [];
}
export async function createBloodAction(action: string) {
  const res = await fetch(`${BASE}/wf/create_bloodAction`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify({ action }),
  });
  return res.json();
}
export async function updateBloodAction(id: string, action: string) {
  return bubbleProxy("PATCH", `/obj/bloodaction/${id}`, { action });
}
export async function deleteBloodAction(id: string) {
  return bubbleProxy("DELETE", `/obj/bloodaction/${id}`);
}
export async function bulkUploadBloodActions(actions: string[]) {
  for (const action of actions) await createBloodAction(action);
}

// ── Blood Thinning Foods ──────────────────────────────────────
// Bubble type: bloodthinningfood — fields: food (text), effect (text)
// effect is optional — most thinning foods in dataset have no separate effect field
export async function fetchBloodThinningFoods() {
  const res = await fetch(`${BASE}/wf/get_bloodthinningfood`, {
    headers: h(),
  });
  const d = await res.json();
  return d.response?.results ?? [];
}
export async function createBloodThinningFood(data: {
  food: string;
  effect?: string;
}) {
  const res = await fetch(`${BASE}/wf/create_bloodthinningfood`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateBloodThinningFood(
  id: string,
  data: { food?: string; effect?: string },
) {
  return bubbleProxy(
    "PATCH",
    `/obj/bloodthinningfood/${id}`,
    data as Record<string, unknown>,
  );
}
export async function deleteBloodThinningFood(id: string) {
  return bubbleProxy("DELETE", `/obj/bloodthinningfood/${id}`);
}
export async function bulkUploadBloodThinningFoods(foods: string[]) {
  for (const food of foods) await createBloodThinningFood({ food });
}

// ── Milk Boosting Foods ───────────────────────────────────────
// Bubble type: milkbooster — fields: food (text), effect (text)
export async function fetchMilkBoosters() {
  const res = await fetch(`${BASE}/wf/get_milkbooster`, { headers: h() });
  const d = await res.json();
  return d.response?.results ?? [];
}
export async function createMilkBooster(data: {
  food: string;
  effect: string;
}) {
  const res = await fetch(`${BASE}/wf/create_milkbooster`, {
    method: "POST",
    headers: h(),
    body: JSON.stringify(data),
  });
  return res.json();
}
export async function updateMilkBooster(
  id: string,
  data: { food?: string; effect?: string },
) {
  return bubbleProxy(
    "PATCH",
    `/obj/milkbooster/${id}`,
    data as Record<string, unknown>,
  );
}
export async function deleteMilkBooster(id: string) {
  return bubbleProxy("DELETE", `/obj/milkbooster/${id}`);
}
export async function bulkUploadMilkBoosters(
  foods: { food: string; effect: string }[],
) {
  for (const f of foods) await createMilkBooster(f);
}
