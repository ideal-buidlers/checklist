/**
 * supabase-bridge.js
 *
 * Loads app state from Supabase and keeps it in sync.
 * Exposes window.__dbReady (Promise) that app-logic.js waits on before rendering.
 * Overrides saveState() so every mutation is persisted to Supabase in addition to
 * (optionally) localStorage.
 */

(function () {
  const SUPABASE_URL = window.__SUPABASE_URL;
  const SUPABASE_KEY = window.__SUPABASE_ANON_KEY;

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.warn(
      "[bridge] No Supabase credentials — falling back to localStorage only",
    );
    window.__dbReady = Promise.resolve(null);
    return;
  }

  // ── No need to wait for user auth token - using simple password auth ──────────────

  function getAuthToken() {
    return Promise.resolve(SUPABASE_KEY);
  }

  // ── Minimal fetch-based Supabase client (no SDK needed in public JS) ────────

  function headers() {
    return {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    };
  }

  async function query(table, params = "") {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?${params}`, {
      headers: { ...headers(), Prefer: "" },
    });
    if (!res.ok)
      throw new Error(`${table} GET ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async function upsert(table, body, onConflict) {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/${table}?on_conflict=${encodeURIComponent(onConflict)}`,
      {
        method: "POST",
        headers: {
          ...headers(),
          Prefer: "resolution=merge-duplicates,return=minimal",
        },
        body: JSON.stringify(body),
      },
    );
    if (!res.ok)
      throw new Error(`${table} UPSERT ${res.status}: ${await res.text()}`);
  }

  async function patch(table, id, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: { ...headers(), Prefer: "return=minimal" },
      body: JSON.stringify(body),
    });
    if (!res.ok)
      throw new Error(`${table} PATCH ${res.status}: ${await res.text()}`);
  }

  async function insert(table, body) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
      method: "POST",
      headers: headers(),
      body: JSON.stringify(body),
    });
    if (!res.ok)
      throw new Error(`${table} INSERT ${res.status}: ${await res.text()}`);
    return res.json();
  }

  async function del(table, id) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: { ...headers(), Prefer: "return=minimal" },
    });
    if (!res.ok)
      throw new Error(`${table} DELETE ${res.status}: ${await res.text()}`);
  }

  // ── Load full state from Supabase ───────────────────────────────────────────

  async function loadFromSupabase() {
    console.log("[bridge] Loading data from Supabase...");
    const [
      houses,
      clSections,
      clItems,
      checks,
      costSections,
      costItems,
      costEntries,
      driveExcl,
    ] = await Promise.all([
      query("houses", "order=sort_order"),
      query("checklist_sections", "order=sort_order"),
      query("checklist_items", "is_template=eq.true&order=sort_order"),
      query("checklist_checks", "select=*"),
      query("cost_sections", "order=sort_order"),
      query("cost_items", "order=sort_order"),
      query("cost_entries", "select=*"),
      query("drive_excluded_files", "select=*"),
    ]);

    console.log("[bridge] Loaded data:", {
      houses: houses.length,
      clSections: clSections.length,
      clItems: clItems.length,
      checks: checks.length,
      costSections: costSections.length,
      costItems: costItems.length,
      costEntries: costEntries.length,
      driveExcl: driveExcl.length,
    });

    // ── Build index-keyed state that app-logic.js expects ──────────────────────

    // houses: array of names (string) — app uses hIdx (integer)
    const houseNames = houses.map((h) => h.name);
    const houseIds = houses.map((h) => h.id); // parallel array for UUID lookup

    // sections: [{ name, items: [string] }]
    const sections = clSections.map((s) => ({
      id: s.id,
      name: s.name,
      items: clItems.filter((i) => i.section_id === s.id).map((i) => i.name),
      itemIds: clItems.filter((i) => i.section_id === s.id).map((i) => i.id),
    }));

    // status / notes / checkSource / slackEvidence keyed by "hIdx|sIdx|iIdx"
    const statusMap = {},
      notesMap = {},
      sourceMap = {},
      evidenceMap = {};

    // Build reverse map: itemId → { sIdx, iIdx }
    const itemPosMap = {};
    sections.forEach((s, sIdx) => {
      s.itemIds.forEach((id, iIdx) => {
        itemPosMap[id] = { sIdx, iIdx };
      });
    });

    checks.forEach((c) => {
      const hIdx = houseIds.indexOf(c.house_id);
      const pos = itemPosMap[c.item_id];
      if (hIdx === -1 || !pos) return;
      const k = `${hIdx}|${pos.sIdx}|${pos.iIdx}`;
      if (c.status) statusMap[k] = c.status;
      else if (c.checked) statusMap[k] = "done";
      if (c.note) notesMap[k] = c.note;
      if (c.source) sourceMap[k] = c.source;
      if (c.slack_evidence) {
        try {
          evidenceMap[k] = JSON.parse(c.slack_evidence);
        } catch {
          evidenceMap[k] = c.slack_evidence;
        }
      }
    });

    // slackChannels keyed by hIdx
    const slackChannels = {};
    houses.forEach((h, idx) => {
      if (h.slack_channel) slackChannels[idx] = h.slack_channel;
    });

    // driveSearchTokens keyed by hIdx
    const driveSearchTokens = {};
    houses.forEach((h, idx) => {
      if (h.drive_search_token) driveSearchTokens[idx] = h.drive_search_token;
    });

    // lotCost / salesPrice keyed by hIdx
    const lotCost = {},
      salesPrice = {};
    houses.forEach((h, idx) => {
      if (h.lot_cost != null || h.lot_paid != null) {
        lotCost[idx] = {};
        if (h.lot_cost != null) lotCost[idx].estimate = Number(h.lot_cost);
        if (h.lot_paid != null) lotCost[idx].paid = Number(h.lot_paid);
      }
      if (h.sales_price != null) salesPrice[idx] = Number(h.sales_price);
    });

    // costSections: [{ name, items: [{name, houseId}], itemIds: [] }]
    const costSectionsState = costSections.map((s) => {
      const items = costItems.filter((i) => i.section_id === s.id);
      return {
        id: s.id,
        name: s.name,
        items: items.map((i) => ({ name: i.name, houseId: i.house_id })),
        itemIds: items.map((i) => i.id),
      };
    });

    // costs keyed by hIdx → { "csIdx|ciIdx": { estimate, paid } }
    const costsMap = {};
    // Build reverse: costItemId → { csIdx, ciIdx }
    const costItemPosMap = {};
    costSectionsState.forEach((s, csIdx) => {
      s.itemIds.forEach((id, ciIdx) => {
        costItemPosMap[id] = { csIdx, ciIdx };
      });
    });
    costEntries.forEach((e) => {
      const hIdx = houseIds.indexOf(e.house_id);
      const pos = costItemPosMap[e.cost_item_id];
      if (hIdx === -1 || !pos) return;
      if (!costsMap[hIdx]) costsMap[hIdx] = {};
      const k = `${pos.csIdx}|${pos.ciIdx}`;
      costsMap[hIdx][k] = {
        estimate: e.estimate != null ? Number(e.estimate) : undefined,
        paid: e.paid != null ? Number(e.paid) : undefined,
      };
    });

    // driveExcludedFiles keyed by hIdx → { fileId: { title, mimeType, excludedAt } }
    const driveExcludedFiles = {};
    driveExcl.forEach((row) => {
      const hIdx = houseIds.indexOf(row.house_id);
      if (hIdx === -1) return;
      if (!driveExcludedFiles[hIdx]) driveExcludedFiles[hIdx] = {};
      driveExcludedFiles[hIdx][row.file_id] = {
        title: row.file_name || "Untitled",
      };
    });

    // Store UUIDs on window so save hooks can look them up
    window.__houseIds = houseIds;
    window.__sections = sections; // with .itemIds
    window.__costSections = costSectionsState; // with .itemIds

    return {
      houses: houseNames,
      houseIds: houseIds,
      sections: sections.map((s) => ({ name: s.name, items: [...s.items] })),
      status: statusMap,
      notes: notesMap,
      checkSource: sourceMap,
      slackEvidence: evidenceMap,
      slackChannels,
      driveSearchTokens,
      driveExcludedFiles,
      costSections: costSectionsState.map((s) => ({
        name: s.name,
        items: s.items.map((i) => i.name),
        itemHouseIds: s.items.map((i) => i.houseId),
      })),
      costs: costsMap,
      lotCost,
      salesPrice,
    };
  }

  // ── Persist helpers ──────────────────────────────────────────────────────────

  function getHouseId(hIdx) {
    return (window.__houseIds || [])[hIdx];
  }
  function getItemId(sIdx, iIdx) {
    return ((window.__sections || [])[sIdx]?.itemIds || [])[iIdx];
  }
  function getCostItemId(csIdx, ciIdx) {
    return ((window.__costSections || [])[csIdx]?.itemIds || [])[ciIdx];
  }

  async function persistStatus(
    hIdx,
    sIdx,
    iIdx,
    status,
    source,
    slackEvidence,
    note,
    aiConfidence,
  ) {
    const houseId = getHouseId(hIdx);
    const itemId = getItemId(sIdx, iIdx);
    if (!houseId || !itemId) return;
    try {
      await upsert(
        "checklist_checks",
        {
          house_id: houseId,
          item_id: itemId,
          status: status || null,
          checked: !!status,
          source: source || null,
          slack_evidence: slackEvidence ? JSON.stringify(slackEvidence) : null,
          note: note || null,
          ai_confidence: aiConfidence || null,
          updated_at: new Date().toISOString(),
        },
        "house_id,item_id",
      );
    } catch (e) {
      console.error("[bridge] persistStatus", e);
    }
  }

  async function persistNote(hIdx, sIdx, iIdx, note) {
    const houseId = getHouseId(hIdx);
    const itemId = getItemId(sIdx, iIdx);
    if (!houseId || !itemId) return;
    try {
      await upsert(
        "checklist_checks",
        {
          house_id: houseId,
          item_id: itemId,
          note: note || null,
          updated_at: new Date().toISOString(),
        },
        "house_id,item_id",
      );
    } catch (e) {
      console.error("[bridge] persistNote", e);
    }
  }

  async function persistSortOrder(hIdx, sIdx, iIdx, sortOrder) {
    const houseId = getHouseId(hIdx);
    const itemId = getItemId(sIdx, iIdx);
    if (!houseId || !itemId) return;
    try {
      await upsert(
        "checklist_checks",
        {
          house_id: houseId,
          item_id: itemId,
          sort_order: sortOrder,
          updated_at: new Date().toISOString(),
        },
        "house_id,item_id",
      );
    } catch (e) {
      console.error("[bridge] persistSortOrder", e);
    }
  }

  async function persistItemSortOrder(sIdx, iIdx, sortOrder) {
    const itemId = getItemId(sIdx, iIdx);
    if (!itemId) return;
    try {
      await patch("checklist_items", itemId, {
        sort_order: sortOrder,
      });
    } catch (e) {
      console.error("[bridge] persistItemSortOrder", e);
    }
  }

  async function persistCostEntry(hIdx, csIdx, ciIdx, estimate, paid) {
    const houseId = getHouseId(hIdx);
    const costItemId = getCostItemId(csIdx, ciIdx);
    if (!houseId || !costItemId) return;
    try {
      await upsert(
        "cost_entries",
        {
          house_id: houseId,
          cost_item_id: costItemId,
          estimate: estimate != null ? Number(estimate) : null,
          paid: paid != null ? Number(paid) : null,
          updated_at: new Date().toISOString(),
        },
        "house_id,cost_item_id",
      );
    } catch (e) {
      console.error("[bridge] persistCostEntry", e);
    }
  }

  async function persistHouseField(hIdx, fields) {
    const houseId = getHouseId(hIdx);
    if (!houseId) return;
    try {
      await patch("houses", houseId, fields);
    } catch (e) {
      console.error("[bridge] persistHouseField", e);
    }
  }

  // Expose persist functions for app-logic.js to call after mutations
  window.__db = {
    persistStatus,
    persistNote,
    persistSortOrder,
    persistItemSortOrder,
    persistCostEntry,
    persistHouseField,
    addHouse: async (name) => {
      const maxOrder = (window.__houseIds || []).length;
      try {
        const rows = await insert("houses", { name, sort_order: maxOrder });
        const newHouse = Array.isArray(rows) ? rows[0] : rows;
        window.__houseIds = [...(window.__houseIds || []), newHouse.id];
        return newHouse;
      } catch (e) {
        console.error("[bridge] addHouse", e);
      }
    },
    deleteHouse: async (hIdx) => {
      const houseId = getHouseId(hIdx);
      if (!houseId) return;
      try {
        await del("houses", houseId);
      } catch (e) {
        console.error("[bridge] deleteHouse", e);
      }
      window.__houseIds = (window.__houseIds || []).filter(
        (_, i) => i !== hIdx,
      );
    },
    addChecklistItem: async (sIdx, itemName) => {
      const sectionId = (window.__sections || [])[sIdx]?.id;
      if (!sectionId) return;
      const maxOrder = ((window.__sections || [])[sIdx]?.itemIds || []).length;
      try {
        const rows = await insert("checklist_items", {
          section_id: sectionId,
          name: itemName,
          sort_order: maxOrder,
          is_template: true,
        });
        const newItem = Array.isArray(rows) ? rows[0] : rows;
        window.__sections[sIdx].items.push(itemName);
        window.__sections[sIdx].itemIds.push(newItem.id);
      } catch (e) {
        console.error("[bridge] addChecklistItem", e);
      }
    },
    deleteChecklistItem: async (sIdx, iIdx) => {
      const itemId = getItemId(sIdx, iIdx);
      if (!itemId) return;
      try {
        await del("checklist_items", itemId);
      } catch (e) {
        console.error("[bridge] deleteChecklistItem", e);
      }
      window.__sections[sIdx].items.splice(iIdx, 1);
      window.__sections[sIdx].itemIds.splice(iIdx, 1);
    },
    addCostItem: async (csIdx, itemName, houseId = null) => {
      const sectionId = (window.__costSections || [])[csIdx]?.id;
      if (!sectionId) return;
      const maxOrder = ((window.__costSections || [])[csIdx]?.itemIds || [])
        .length;
      try {
        const rows = await insert("cost_items", {
          section_id: sectionId,
          name: itemName,
          sort_order: maxOrder,
          is_template: houseId ? false : true,
          house_id: houseId,
        });
        const newItem = Array.isArray(rows) ? rows[0] : rows;
        window.__costSections[csIdx].items.push({ name: itemName, houseId });
        window.__costSections[csIdx].itemIds.push(newItem.id);
      } catch (e) {
        console.error("[bridge] addCostItem", e);
      }
    },
    deleteCostItem: async (csIdx, ciIdx) => {
      const itemId = getCostItemId(csIdx, ciIdx);
      if (!itemId) return;
      try {
        await del("cost_items", itemId);
      } catch (e) {
        console.error("[bridge] deleteCostItem", e);
      }
      window.__costSections[csIdx].items.splice(ciIdx, 1);
      window.__costSections[csIdx].itemIds.splice(ciIdx, 1);
    },
    addDriveExclusion: async (hIdx, fileId, fileName) => {
      const houseId = getHouseId(hIdx);
      if (!houseId) return;
      try {
        await upsert(
          "drive_excluded_files",
          { house_id: houseId, file_id: fileId, file_name: fileName || null },
          "house_id,file_id",
        );
      } catch (e) {
        console.error("[bridge] addDriveExclusion", e);
      }
    },
    removeDriveExclusion: async (hIdx, fileId) => {
      const houseId = getHouseId(hIdx);
      if (!houseId) return;
      try {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/drive_excluded_files?house_id=eq.${houseId}&file_id=eq.${encodeURIComponent(fileId)}`,
          {
            method: "DELETE",
            headers: { ...headers(), Prefer: "return=minimal" },
          },
        );
        if (!res.ok) throw new Error(await res.text());
      } catch (e) {
        console.error("[bridge] removeDriveExclusion", e);
      }
    },
    getHouseDriveFolder: async (houseId) => {
      try {
        const data = await query(
          "house_drive_folders",
          `house_id=eq.${houseId}`,
        );
        return data && data.length > 0 ? data[0] : null;
      } catch (e) {
        console.error("[bridge] getHouseDriveFolder", e);
        return null;
      }
    },
  };

  // ── Bootstrap ────────────────────────────────────────────────────────────────

  window.__dbReady = getAuthToken()
    .then(() => {
      console.log("[bridge] Auth token ready, loading from Supabase...");
      return loadFromSupabase();
    })
    .then((dbState) => {
      console.log("[bridge] Database state loaded successfully:", dbState);
      if (dbState) {
        window.__dbState = dbState;
      }
      return dbState;
    })
    .catch((err) => {
      console.error("[bridge] Failed to load from Supabase:", err);
      console.error("[bridge] Error details:", err.message, err.stack);
      return null;
    });
})();
