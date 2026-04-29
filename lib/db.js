import { createClient } from './supabase'

function db() {
  return createClient()
}

// ─── Houses ──────────────────────────────────────────────────────────────────

export async function getHouses() {
  const { data, error } = await db()
    .from('houses')
    .select('*')
    .order('sort_order')
  if (error) throw error
  return data
}

export async function upsertHouse(house) {
  const { data, error } = await db()
    .from('houses')
    .upsert(house)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteHouse(id) {
  const { error } = await db().from('houses').delete().eq('id', id)
  if (error) throw error
}

export async function updateHouseField(id, fields) {
  const { error } = await db().from('houses').update(fields).eq('id', id)
  if (error) throw error
}

// ─── Checklist sections + items ──────────────────────────────────────────────

export async function getChecklistSections() {
  const { data: sections, error: sErr } = await db()
    .from('checklist_sections')
    .select('*')
    .order('sort_order')
  if (sErr) throw sErr

  const { data: items, error: iErr } = await db()
    .from('checklist_items')
    .select('*')
    .eq('is_template', true)
    .order('sort_order')
  if (iErr) throw iErr

  return sections.map(s => ({
    ...s,
    items: items.filter(i => i.section_id === s.id),
  }))
}

export async function getHouseCustomItems(houseId) {
  const { data, error } = await db()
    .from('checklist_items')
    .select('*')
    .eq('is_template', false)
    .eq('house_id', houseId)
    .order('sort_order')
  if (error) throw error
  return data
}

export async function addChecklistItem(sectionId, name, houseId = null) {
  const { data, error } = await db()
    .from('checklist_items')
    .insert({
      section_id: sectionId,
      name,
      is_template: houseId === null,
      house_id: houseId,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteChecklistItem(id) {
  const { error } = await db().from('checklist_items').delete().eq('id', id)
  if (error) throw error
}

// ─── Checklist checks ────────────────────────────────────────────────────────

export async function getChecks(houseId) {
  const { data, error } = await db()
    .from('checklist_checks')
    .select('*')
    .eq('house_id', houseId)
  if (error) throw error
  return data
}

export async function getAllChecks() {
  const { data, error } = await db()
    .from('checklist_checks')
    .select('*')
  if (error) throw error
  return data
}

export async function upsertCheck({ houseId, itemId, checked, source, slackEvidence, note }) {
  const { error } = await db()
    .from('checklist_checks')
    .upsert(
      {
        house_id: houseId,
        item_id: itemId,
        checked,
        source: source ?? null,
        slack_evidence: slackEvidence ?? null,
        note: note ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'house_id,item_id' }
    )
  if (error) throw error
}

// ─── Cost sections + items ───────────────────────────────────────────────────

export async function getCostSections() {
  const { data: sections, error: sErr } = await db()
    .from('cost_sections')
    .select('*')
    .order('sort_order')
  if (sErr) throw sErr

  const { data: items, error: iErr } = await db()
    .from('cost_items')
    .select('*')
    .eq('is_template', true)
    .order('sort_order')
  if (iErr) throw iErr

  return sections.map(s => ({
    ...s,
    items: items.filter(i => i.section_id === s.id),
  }))
}

export async function getHouseCustomCostItems(houseId) {
  const { data, error } = await db()
    .from('cost_items')
    .select('*')
    .eq('is_template', false)
    .eq('house_id', houseId)
    .order('sort_order')
  if (error) throw error
  return data
}

export async function addCostItem(sectionId, name, houseId = null) {
  const { data, error } = await db()
    .from('cost_items')
    .insert({
      section_id: sectionId,
      name,
      is_template: houseId === null,
      house_id: houseId,
    })
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteCostItem(id) {
  const { error } = await db().from('cost_items').delete().eq('id', id)
  if (error) throw error
}

// ─── Cost entries ────────────────────────────────────────────────────────────

export async function getCostEntries(houseId) {
  const { data, error } = await db()
    .from('cost_entries')
    .select('*')
    .eq('house_id', houseId)
  if (error) throw error
  return data
}

export async function upsertCostEntry({ houseId, costItemId, estimate, paid }) {
  const { error } = await db()
    .from('cost_entries')
    .upsert(
      {
        house_id: houseId,
        cost_item_id: costItemId,
        estimate: estimate ?? null,
        paid: paid ?? null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'house_id,cost_item_id' }
    )
  if (error) throw error
}

// ─── Drive exclusions ────────────────────────────────────────────────────────

export async function getDriveExclusions(houseId) {
  const { data, error } = await db()
    .from('drive_excluded_files')
    .select('*')
    .eq('house_id', houseId)
  if (error) throw error
  return data
}

export async function addDriveExclusion(houseId, fileId, fileName) {
  const { error } = await db()
    .from('drive_excluded_files')
    .upsert({ house_id: houseId, file_id: fileId, file_name: fileName },
             { onConflict: 'house_id,file_id' })
  if (error) throw error
}

export async function removeDriveExclusion(houseId, fileId) {
  const { error } = await db()
    .from('drive_excluded_files')
    .delete()
    .eq('house_id', houseId)
    .eq('file_id', fileId)
  if (error) throw error
}

// ─── Load full app state from Supabase ───────────────────────────────────────

export async function loadAppState() {
  const [houses, checklistSections, costSections, allChecks] = await Promise.all([
    getHouses(),
    getChecklistSections(),
    getCostSections(),
    getAllChecks(),
  ])

  const checks = {}
  const notes = {}
  const checkSource = {}
  const slackEvidence = {}

  for (const check of allChecks) {
    const key = `${check.house_id}:${check.item_id}`
    if (check.checked) checks[key] = true
    if (check.note) notes[key] = check.note
    if (check.source) checkSource[key] = check.source
    if (check.slack_evidence) slackEvidence[key] = check.slack_evidence
  }

  const slackChannels = {}
  const driveSearchTokens = {}
  const lotCost = {}
  const salesPrice = {}

  for (const h of houses) {
    if (h.slack_channel) slackChannels[h.id] = h.slack_channel
    if (h.drive_search_token) driveSearchTokens[h.id] = h.drive_search_token
    if (h.lot_cost != null) lotCost[h.id] = h.lot_cost
    if (h.sales_price != null) salesPrice[h.id] = h.sales_price
  }

  return {
    houses,
    checklistSections,
    costSections,
    checks,
    notes,
    checkSource,
    slackEvidence,
    slackChannels,
    driveSearchTokens,
    lotCost,
    salesPrice,
  }
}
