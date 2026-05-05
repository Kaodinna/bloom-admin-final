import { PageHeader, Card, CardTitle } from '@/components/ui'

const METHOD_COLORS: Record<string, string> = {
  GET: '#2D6B4A', POST: '#C9973A', PATCH: '#1F7A7A', DELETE: '#B85C38',
}

interface Endpoint {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  path: string
  desc: string
  params?: string
  returns?: string
  note?: string
}
interface Section { title: string; icon: string; endpoints: Endpoint[] }

const SECTIONS: Section[] = [
  {
    title: 'Authentication', icon: '🔐',
    endpoints: [
      { method:'POST', path:'/wf/signup', desc:'Create new user account', params:'{ email, password }', returns:'{ token, user_id }' },
      { method:'POST', path:'/wf/login',  desc:'Log in existing user',    params:'{ email, password }', returns:'{ token, user_id }' },
      { method:'POST', path:'/wf/admin_login', desc:'Admin login — validates is_admin field on User', params:'{ email, password }', returns:'{ token, user_id }', note:'User must have is_admin = true in Bubble' },
    ],
  },
  {
    title: 'User Profile', icon: '👤',
    endpoints: [
      { method:'GET',   path:'/obj/user/me',  desc:'Get current user profile', returns:'{ _id, first_name, age, journey_type, current_week, skin_type, fertility_score, current_protocol, female_job_risks, male_job_risks, ... }' },
      { method:'PATCH', path:'/obj/user/me',  desc:'Update current user profile fields', params:'{ first_name?, age?, journey_type?, current_week?, skin_type?, onboarding_done?, ... }', returns:'204 No Content' },
      { method:'GET',   path:'/obj/user',     desc:'Admin: list all users', params:'?limit=50&sort_field=Created Date&descending=true', returns:'{ results: User[], count: number }' },
      { method:'GET',   path:'/obj/user/:id', desc:'Admin: get specific user by Bubble _id', returns:'User record' },
      { method:'PATCH', path:'/obj/user/:id', desc:'Admin: update user (suspend, change status)', params:'{ status?, journey_type?, onboarding_done? }', note:'Admin token required' },
    ],
  },
  {
    title: 'Onboarding & Protocol Generation', icon: '🤖',
    endpoints: [
      { method:'POST', path:'/wf/onboarding_complete', desc:'Save full profile + schedule AI score + protocol. Called once after onboarding step 5', params:'{ calling_user, first_name, age, journey_type, city, job_type, activity_level, diet_type, skin_type, current_week, partner_age, partner_job_type, female_job_risks, female_nutrients, male_job_risks, male_nutrients, male_foods, male_supplements, male_sperm_impact, male_hormone_impact, baby_impact }', returns:'{ status: "success" }' },
      { method:'POST', path:'/wf/process_protocol', desc:'Generate AI daily protocol. Called by useProtocol hook when no protocol exists for today', params:'{ calling_user, week_context, food_matches, milk_logic, milk_boosters }', returns:'{ status: "success" }', note:'Async — protocol written to Bubble after ~5–10s. Frontend polls GET /obj/protocol' },
      { method:'POST', path:'/wf/process_score',    desc:'Generate AI fertility/optimization score 0–100', params:'{ calling_user }', returns:'{ status: "success" }' },
      { method:'POST', path:'/wf/recalibrate',      desc:'Re-run score + protocol (week update, profile change, dashboard button)', params:'{ calling_user, week_context, food_matches, milk_logic, milk_boosters }', returns:'{ status: "success" }' },
      { method:'GET',  path:'/obj/protocol', desc:'Get protocols. Use constraints to get today\'s protocol for a user', params:'?constraints=[{"key":"user","constraint_type":"equals","value":"<userId>"},{"key":"date","constraint_type":"equals","value":"<today>"}]&sort_field=Created Date&descending=true&limit=1', returns:'{ results: [{ _id, nutrition_plan, supplements, movement, avoid_today, fertility_tip, female_risk_summary, male_risk_summary, baby_focus, job_vitamins, job_foods }] }' },
    ],
  },
  {
    title: 'Nutrition & Meals', icon: '🥗',
    endpoints: [
      { method:'POST', path:'/wf/generate_nutrition', desc:'Trigger AI meal generation. Returns raw JSON string — frontend parses and creates Meal records', params:'{ calling_user, week_context, food_matches, food_detail, milk_logic, key_nutrients_milk, blood_support, milk_boosters, evening_feeding, oral_health, environment, electrical }', returns:'{ result: "{\\"breakfast\\":{...},\\"lunch\\":{...},\\"dinner\\":{...},\\"snacks\\":{...}}" }' },
      { method:'GET',  path:'/obj/meal', desc:'Get meals for a protocol', params:'?constraints=[{"key":"protocol","constraint_type":"equals","value":"<protocolId>"}]&sort_field=Created Date', returns:'{ results: [{ _id, meal_type, name, description, nutrients, baby_benefit, mother_benefit }] }' },
      { method:'POST', path:'/obj/meal', desc:'Create meal record (called by frontend after parsing AI response)', params:'{ protocol, meal_type, name, description, nutrients, baby_benefit, mother_benefit }', returns:'{ id: "<new _id>" }' },
    ],
  },
  {
    title: 'Movement', icon: '⚡',
    endpoints: [
      { method:'POST', path:'/wf/generate_movement', desc:'Trigger AI movement generation. Returns raw JSON — frontend creates Movement records', params:'{ calling_user }', returns:'{ result: "{\\"practices\\":[{...},{...},{...}]}" }' },
      { method:'GET',  path:'/obj/movement', desc:'Get movement practices for a protocol', params:'?constraints=[{"key":"protocol","constraint_type":"equals","value":"<protocolId>"}]', returns:'{ results: [{ _id, practice_id, title, subtitle, duration, category, exercises_json, why, guidance }] }' },
      { method:'POST', path:'/obj/movement', desc:'Create movement practice record', params:'{ protocol, practice_id, title, subtitle, duration, category, exercises_json, why, guidance }', returns:'{ id: "<new _id>" }' },
    ],
  },
  {
    title: 'Journey & Milestones', icon: '🗺️',
    endpoints: [
      { method:'POST', path:'/wf/generate_journey', desc:'Trigger AI journey roadmap. Returns raw JSON — frontend creates Phase + Milestone records', params:'{ calling_user }', returns:'{ result: "{\\"phases\\":[{...}]}" }' },
      { method:'GET',  path:'/obj/journeyphase', desc:'Get journey phases for a user', params:'?constraints=[{"key":"user","constraint_type":"equals","value":"<userId>"}]&sort_field=phase_number', returns:'{ results: [{ _id, phase_number, title, week_range, status }] }' },
      { method:'POST', path:'/obj/journeyphase', desc:'Create journey phase record', params:'{ user, protocol, phase_number, title, week_range, status }', returns:'{ id: "<new _id>" }' },
      { method:'GET',  path:'/obj/milestone', desc:'Get milestones for a phase', params:'?constraints=[{"key":"phase","constraint_type":"equals","value":"<phaseId>"}]', returns:'{ results: [{ _id, week_label, title, summary, status, what_happening, focus_goals, actions }] }' },
      { method:'POST', path:'/obj/milestone', desc:'Create milestone record', params:'{ phase, week_label, title, summary, status, what_happening, focus_goals, actions }', returns:'{ id: "<new _id>" }' },
      { method:'GET',  path:'/obj/milestone/:id', desc:'Get single milestone (milestone detail page)', returns:'Milestone record' },
      { method:'POST', path:'/wf/generate_week_detail', desc:'AI week-specific content for pregnancy page', params:'{ calling_user }', returns:'{ result: "<JSON string>" }' },
      { method:'GET',  path:'/obj/weekdetail', desc:'Get week detail — filter by user + week_number', params:'?constraints=[{"key":"user","constraint_type":"equals","value":"<userId>"},{"key":"week_number","constraint_type":"equals","value":<week>}]&limit=1', returns:'{ results: WeekDetail[] }' },
      { method:'POST', path:'/obj/weekdetail', desc:'Create week detail record', params:'{ user, week_number, trimester, baby_milestone, nutrition_focus, movement_focus, supplements, appointments, avoid_today, job_note }', returns:'{ id: "<new _id>" }' },
      { method:'POST', path:'/wf/generate_recovery_detail', desc:'AI week-specific content for postpartum recovery page', params:'{ calling_user }', returns:'{ result: "<JSON string>" }' },
      { method:'GET',  path:'/obj/recoverydetail', desc:'Get recovery detail — filter by user + week_number', params:'?constraints=[{"key":"user","constraint_type":"equals","value":"<userId>"},{"key":"week_number","constraint_type":"equals","value":<week>}]&limit=1', returns:'{ results: RecoveryDetail[] }' },
      { method:'POST', path:'/obj/recoverydetail', desc:'Create recovery detail record', params:'{ user, week_number, phase, hormone_note, nutrition_focus, movement_focus, supplements, priorities, checkups, avoid_today, job_note }', returns:'{ id: "<new _id>" }' },
    ],
  },
  {
    title: 'Community', icon: '👥',
    endpoints: [
      { method:'GET',    path:'/obj/group', desc:'Get all groups sorted by member count', params:'?sort_field=member_count&descending=true&limit=50', returns:'{ results: Group[] }' },
      { method:'POST',   path:'/wf/join_group',  desc:'Add current user to group, increment member_count', params:'{ group_id }', returns:'{ status: "success" }' },
      { method:'POST',   path:'/wf/leave_group', desc:'Remove current user from group, decrement member_count', params:'{ group_id }', returns:'{ status: "success" }' },
      { method:'GET',    path:'/obj/post', desc:'Get posts — filter by group for group feed', params:'?constraints=[{"key":"group","constraint_type":"equals","value":"<groupId>"}]&sort_field=Created Date&descending=true&limit=30', returns:'{ results: [{ _id, content, likes, author_name, group, image_url }] }' },
      { method:'POST',   path:'/obj/post', desc:'Create post (with optional image_url from Cloudinary)', params:'{ content, group, author_name, image_url? }', returns:'{ id: "<new _id>" }' },
      { method:'PATCH',  path:'/obj/post/:id', desc:'Admin: moderate post (hide, clear flag)', params:'{ hidden?, flagged? }', note:'Admin token required' },
      { method:'DELETE', path:'/obj/post/:id', desc:'Admin: permanently delete post', note:'Admin token required' },
      { method:'POST',   path:'/wf/like_post', desc:'Increment post likes counter', params:'{ post_id }', returns:'{ status: "success" }' },
      { method:'GET',    path:'/obj/comment', desc:'Get comments for a post', params:'?constraints=[{"key":"post","constraint_type":"equals","value":"<postId>"}]', returns:'{ results: Comment[] }' },
      { method:'POST',   path:'/obj/comment', desc:'Create comment on a post', params:'{ post, content }', returns:'{ id: "<new _id>" }' },
      { method:'GET',    path:'/obj/message', desc:'Get group chat messages', params:'?constraints=[{"key":"group","constraint_type":"equals","value":"<groupId>"}]&sort_field=Created Date&limit=50', returns:'{ results: Message[] }' },
      { method:'POST',   path:'/obj/message', desc:'Send message in group chat', params:'{ group, content }', returns:'{ id: "<new _id>" }' },
    ],
  },
  {
    title: 'Common Errors & Fixes', icon: '🔧',
    endpoints: [
      { method:'GET',   path:'/obj/user/me', desc:'401 Unauthorized — token missing or expired', note:'Fix: Re-login, use fresh token in Authorization header' },
      { method:'PATCH', path:'/obj/user/me', desc:'200 OK but fields not saved — privacy rule missing', note:'Fix: Data → Privacy → User → Current User → Modify all fields = YES' },
      { method:'GET',   path:'/obj/protocol', desc:'Empty results — constraints format or date mismatch', note:'Fix: URL-encode constraints JSON. Verify date field format matches Bubble storage' },
      { method:'POST',  path:'/obj/meal', desc:'403 Forbidden — Meal type missing Create permission', note:'Fix: Data → Privacy → Meal → Current User: Create = YES' },
      { method:'POST',  path:'/obj/post', desc:'403 Forbidden — Post type missing Create permission', note:'Fix: Data → Privacy → Post → Everyone: Create = YES' },
      { method:'POST',  path:'/wf/*', desc:'404 Workflow not found — name mismatch or not exposed', note:'Fix: Backend Workflows → check "Expose as public API" is checked. Names are case-sensitive' },
      { method:'GET',   path:'/obj/message', desc:'Empty results — filtering on wrong field', note:'Fix: Filter on group (Group linked field), not thread (old text field)' },
    ],
  },
]

export default function EndpointsPage() {
  return (
    <>
      <PageHeader
        title="API Endpoints"
        sub="Complete Bubble Data API + Workflow API reference — all endpoints the Bloom app uses"
        action={
          <span className="text-[.74rem] text-ink-soft font-mono bg-cream border border-cream-dark px-2.5 py-1.5 rounded-[7px]">
            Base: /version-test/api/1.1
          </span>
        }
      />

      {/* Auth banner */}
      <div className="bg-[#F5EDD8] border border-[#E8D4A0] rounded-xl px-[18px] py-[13px] mb-5 flex items-start gap-3">
        <span className="text-xl flex-shrink-0">🔑</span>
        <div>
          <div className="font-bold text-[.85rem] text-[#8A5C20]">Authentication required on all requests</div>
          <div className="text-[.74rem] text-[#8A5C20] mt-[2px] leading-[1.4]">
            Add header: <code className="font-mono bg-[#EED9A8] px-1 rounded">Authorization: Bearer &lt;token&gt;</code>
            {' '}— token returned from <code className="font-mono bg-[#EED9A8] px-1 rounded">/wf/login</code>.
            Signup and Login endpoints are public (no token needed).
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-5">
        {SECTIONS.map(section => (
          <Card key={section.title}>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{section.icon}</span>
              <CardTitle>{section.title}</CardTitle>
            </div>
            <div className="flex flex-col gap-2">
              {section.endpoints.map((ep, i) => (
                <div key={i} className="border border-cream-dark rounded-[10px] overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-2.5 bg-cream">
                    <span className="font-mono font-bold text-[.7rem] px-2 py-[3px] rounded-[5px] flex-shrink-0 text-white"
                      style={{ background: METHOD_COLORS[ep.method] }}>
                      {ep.method}
                    </span>
                    <code className="font-mono text-[.8rem] text-ink font-semibold">{ep.path}</code>
                  </div>
                  <div className="px-4 py-3 flex flex-col gap-1.5">
                    <p className="text-[.78rem] text-ink-mid leading-[1.4]">{ep.desc}</p>
                    {ep.params && (
                      <div className="flex items-start gap-2">
                        <span className="text-[.63rem] font-bold text-ink-soft uppercase tracking-wide flex-shrink-0 mt-[2px] w-12">Body</span>
                        <code className="text-[.69rem] text-[#5C3A8A] bg-[#F5F0FF] px-2 py-1 rounded leading-[1.6] font-mono break-all">{ep.params}</code>
                      </div>
                    )}
                    {ep.returns && (
                      <div className="flex items-start gap-2">
                        <span className="text-[.63rem] font-bold text-ink-soft uppercase tracking-wide flex-shrink-0 mt-[2px] w-12">Returns</span>
                        <code className="text-[.69rem] text-[#1A5C3A] bg-[#F0FAF5] px-2 py-1 rounded leading-[1.6] font-mono break-all">{ep.returns}</code>
                      </div>
                    )}
                    {ep.note && (
                      <div className="flex items-start gap-2 pt-1 border-t border-cream mt-0.5">
                        <span className="text-[.63rem] font-bold text-[#8A5C20] uppercase tracking-wide flex-shrink-0 mt-[2px] w-12">Note</span>
                        <span className="text-[.72rem] text-[#8A5C20] leading-[1.4]">{ep.note}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </>
  )
}
