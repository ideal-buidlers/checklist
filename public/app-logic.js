const PENCIL_OUTLINE_SVG =
  '<svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg"><path d="M11.013 1.427a1.75 1.75 0 0 1 2.474 0l1.086 1.086a1.75 1.75 0 0 1 0 2.474l-8.61 8.61c-.21.21-.47.364-.756.445l-3.251.93a.75.75 0 0 1-.927-.928l.929-3.25c.081-.286.235-.547.445-.758zm1.414 1.06a.25.25 0 0 0-.354 0L10.811 3.75l1.439 1.44 1.263-1.263a.25.25 0 0 0 0-.354zm-.013 3.764-1.44-1.44-5.92 5.922a.25.25 0 0 0-.064.108l-.558 1.953 1.953-.558a.25.25 0 0 0 .108-.064z"/></svg>';
const NOTE_FILLED_SVG =
  '<svg viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M0 3.75C0 2.784.784 2 1.75 2h12.5c.966 0 1.75.784 1.75 1.75v8.5A1.75 1.75 0 0 1 14.25 14H1.75A1.75 1.75 0 0 1 0 12.25Zm1.75-.25a.25.25 0 0 0-.25.25v8.5c0 .138.112.25.25.25h12.5a.25.25 0 0 0 .25-.25v-8.5a.25.25 0 0 0-.25-.25Z"/><path d="M1 5.5h14v1H1z"/><path d="M3 8h5v1H3z"/></svg>';

// File-type icons (small, monochrome)
const ICON_DOC =
  '<svg class="drive-icon" viewBox="0 0 24 24" fill="#1a73e8" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 13h8v1.5H8V13zm0 3h8v1.5H8V16zm0 3h5v1.5H8V19z"/></svg>';
const ICON_SHEET =
  '<svg class="drive-icon" viewBox="0 0 24 24" fill="#0f9d58" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM7 13h4v2H7v-2zm6 0h4v2h-4v-2zM7 16h4v2H7v-2zm6 0h4v2h-4v-2z"/></svg>';
const ICON_SLIDES =
  '<svg class="drive-icon" viewBox="0 0 24 24" fill="#f4b400" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM7 12h10v6H7v-6z"/></svg>';
const ICON_PDF =
  '<svg class="drive-icon" viewBox="0 0 24 24" fill="#db4437" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8.5 13.5h2c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-1V18H8.5v-4.5zm5 0h2c.83 0 1.5.67 1.5 1.5v1.5c0 .83-.67 1.5-1.5 1.5h-2v-4.5z"/></svg>';
const ICON_FOLDER =
  '<svg class="drive-icon" viewBox="0 0 24 24" fill="#5f6368" xmlns="http://www.w3.org/2000/svg"><path d="M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8l-2-2z"/></svg>';
const ICON_GENERIC =
  '<svg class="drive-icon" viewBox="0 0 24 24" fill="#5f6368" xmlns="http://www.w3.org/2000/svg"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>';

function iconForMime(mime) {
  if (!mime) return ICON_GENERIC;
  if (mime.includes("document")) return ICON_DOC;
  if (mime.includes("spreadsheet")) return ICON_SHEET;
  if (mime.includes("presentation")) return ICON_SLIDES;
  if (mime.includes("pdf")) return ICON_PDF;
  if (mime.includes("folder")) return ICON_FOLDER;
  return ICON_GENERIC;
}

// ── Google Drive Integration ────────────────────────────────────────────

// Get Supabase credentials (same as supabase-bridge.js)
const SUPABASE_URL =
  window.__SUPABASE_URL || "https://yywbjhegbxowhzkrazzj.supabase.co";
const SUPABASE_ANON_KEY =
  window.__SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5d2JqaGVnYnhvd2h6a3JhenpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc0NjQ5NDAsImV4cCI6MjA5MzA0MDk0MH0.sUME9IqlISueFNon_-udF2tLSoQpIH2cVpjXsbPYayM";
const DRIVE_FUNCTION_URL = `${SUPABASE_URL}/functions/v1/manage-drive-folders`;

async function callDriveFunction(action, params = {}) {
  const response = await fetch(DRIVE_FUNCTION_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
    body: JSON.stringify({ action, ...params }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Drive operation failed");
  }

  return await response.json();
}

async function createDriveFolderForHouse(houseName, houseId) {
  try {
    const result = await callDriveFunction("create-house-folder", {
      houseName,
      houseId,
    });
    return result;
  } catch (err) {
    // Silently fail if no token - folder creation is optional
    if (err.message && err.message.includes("No Google tokens found")) {
      return null;
    }
    throw err;
  }
}

async function listDriveFiles(folderId) {
  const result = await callDriveFunction("list-files", { folderId });
  return result.files || [];
}

async function uploadFileToDrive(folderId, file) {
  // Convert file to base64
  const base64 = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result.split(",")[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const result = await callDriveFunction("upload-file", {
    folderId,
    fileName: file.name,
    fileData: base64,
    mimeType: file.type || "application/octet-stream",
  });
  return result.file;
}

function formatFileSize(bytes) {
  if (!bytes) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function uploadFileToHouse(hIdx) {
  const input = document.getElementById(`file-input-${hIdx}`);
  if (input) {
    input.click();
  }
}

async function handleFileUpload(hIdx, input) {
  const file = input.files?.[0];
  if (!file) return;

  try {
    showBanner("Uploading file...", "info");

    // Get house ID and folder ID
    const houseId = state.houseIds?.[hIdx];
    if (!houseId) {
      throw new Error("House not found");
    }

    const folderData = await window.__db?.getHouseDriveFolder(houseId);
    if (!folderData || !folderData.drive_folder_id) {
      throw new Error(
        "Drive folder not found. Please try creating the house again.",
      );
    }

    // Upload file
    await uploadFileToDrive(folderData.drive_folder_id, file);

    // Refresh file list
    delete driveCache[hIdx];
    await loadDriveFilesForHouse(hIdx);

    showBanner(`File "${file.name}" uploaded successfully!`, "success");
  } catch (err) {
    showBanner(`Upload failed: ${err.message}`, "error");
  }

  // Clear input
  input.value = "";
}

// ────────────────────────────────────────────────────────────────────────

const DEFAULT_SECTIONS = [
  {
    name: "Build Tasks",
    items: [
      "Order the plans from Architect",
      "Retire Gas (add w.o) to existing house",
      "Retire Water to existing house (paid)",
      "Retire Electric (add w.o)",
      "Protect Right a Way Tree - Bham",
      "Apply for Sewer Cap Permit",
      "Apply and pay for Water stop box",
      "Pay for new water service",
      "Apply for Gas Permit",
      "Install temp electric on pole",
      "Apply for Construction Fence Permit",
      "Fence Insp. Ch on swing of gate",
      "Letter of Intent - Bham",
      "Demo Permit",
      "Asbestos Survey",
      "Asbestos Removal (if applicable)",
      "Put Dust Sign on Fence (RO)",
      "Put Address on Fence",
      "Pest Review & Submit Letter (RO)",
      "Birmingham Neighbor Letter",
      "Add in attic insulation after drywall",
      "Insulation Certificate (Bham)",
      "Take out building permit",
      "Install Temp Fence",
      "Install Soil Erosion/Silt Fence",
      "Order Port a potty",
      "Receive Clearance for Electric for Demo",
      "Receive Clearance for Gas for Demo",
      "Receive Building Permit",
      "Survey Lot",
      "Send Build. Survey & Lot Survey to City",
      "Demo House",
      "Excavate",
      "Open hole inspection (Bham) after house is demo",
      "Scope Sewer",
      "Put Footing In",
      "Pin Footing",
      "Footing Inspection",
      "Put Rod in Basement",
      "Pour Basement Walls",
      "Brace Basement Walls",
      "Final Electrical Meter Box (walls have to be up)",
      "Basement Inspection",
      "Backfill",
      "Clear path for gasline (take pic facing street)",
      "Order 1x3 for driveway",
      "Backfill Inspection",
      "Trench Garage",
      "Make Sure Porch is 4' Higher",
      "Order Steel",
      "Rough Carpentry",
      "Get Basement Ready for Plumbing",
      "Order Peastone",
      "Call Inspection for Plumbing",
      "Call Inspection for Peagravel",
      "Order Trusses",
      "Order Shingles",
      "Call rough heater for roof penetration (24h before shingles install)",
      "Order Windows",
      "Order Front, Side Doors",
      "Order Siding",
      "Order Rough Plumbing Material",
      "Sil Plate Inspection",
      "Frame",
      "Install Mechanical",
      "Mechanical Inspection",
      "Rough Heat Fireplace",
      "Heat Inspection",
      "Fireplace Inspection",
      "Rough Plumbing",
      "Rough Plumbing Inspection",
      "Rough Electrical",
      "Rough Electrical Inspection",
      "Remove Temp Electrical",
      "Order Rough Building Lumber",
      "Get Truss and Window Specs",
      "Rough Building",
      "Install Siding",
      "Installed Stop Box",
      "Order Cabinets",
      "Rough Building Inspection",
      "Paint Exterior",
      "Gutters",
      "Open Ceiling Inspection (Porch)",
      "Order Garage Doors",
      "Pour Basement Floors",
      "Come Back and Rough Basement",
      "Rough Elec Upstairs/Basement",
      "Rough Heat Upstairs/Basement",
      "Rough Plumbing Upstairs/Basement",
      "Rough Fireplace",
      "Insulate",
      "Measure Finish Lumber",
      "Permanent Electric",
      "Insulate Inspection",
      "Drywall",
      "Order Fixtures",
      "Order Exterior Stone",
      "Ductwork",
      "Measure/Order Trim",
      "Order Appliances",
      "Order Carpet",
      "Order Wood Floor Material",
      "Prime Interior",
      "Receive Cabinets",
      "Install Cabinets",
      "Measure/Order Quartz",
      "Spot the House",
      "Install Stone",
      "Wall Registers",
      "Measure/Order Ceramic Material",
      "Install Ceramic",
      "Order Shower Door",
      "Caulk",
      "Grade Exterior",
      "Paint Interior",
      "Order Cabinet Knobs",
      "Order Door Knobs",
      "Order Exterior Cement",
      "Install Carpet",
      "Install Wood Floor",
      "Screw Floors",
      "Install Shower Door",
      "Final Grade",
      "Install Appliances",
      "Install Sprinkler",
      "Grass",
      "Install Screens",
      "Order Street Tree - RO",
      "Blower Door Test",
      "Final Electric",
      "Final Heat",
      "Final Plumbing",
      "Final Mechanical/Fireplace",
      "Survey As built",
      "Final Building Inspection",
      "Gutters",
      "Clean windows",
    ],
  },
];

const DEFAULT_HOUSES = [
  "519 E Farnum",
  "627 Forest",
  "1825 Northwood",
  "3532 Linwood",
  "4613 Tonawonda",
  "1013 Woodsboro",
];
const DEFAULT_SLACK_CHANNELS = {
  0: "519_farnum",
  1: "627_forest",
  2: "1825_northwood",
  3: "3532_linwood",
  4: "4613_tonawonda",
  5: "1013_woodsboro",
};

// ===== Default cost categories (editable by the user) =====
const DEFAULT_COST_SECTIONS = [
  {
    name: "Permits & Pre-Construction",
    items: [
      "Architect / Plans",
      "Building Permit",
      "Demo Permit",
      "Asbestos Survey",
      "Asbestos Removal",
      "Survey - Lot",
      "Survey - As Built",
      "Insulation Certificate",
      "Birmingham Pest Review",
      "Sewer Cap Permit",
      "Water Stop Box Permit",
      "Gas Permit",
      "Construction Fence Permit",
    ],
  },
  {
    name: "Utility Retirement & Service",
    items: [
      "Retire Gas",
      "Retire Water",
      "Retire Electric",
      "Temp Electric (Pole)",
      "Permanent Electric",
      "New Water Service",
      "Stop Box Install",
      "Gas Service",
    ],
  },
  {
    name: "Site Prep & Demo",
    items: [
      "Soil Erosion / Silt Fence",
      "Construction Fence",
      "Port-a-Potty",
      "Tree Protection (RoW)",
      "Dust / Address Sign",
      "Demo",
      "Excavation",
      "Backfill",
      "Driveway 1x3 Stone",
      "Final Grade",
    ],
  },
  {
    name: "Foundation",
    items: [
      "Footings",
      "Foundation Walls",
      "Wall Bracing",
      "Basement Floor",
      "Garage Trench",
      "Peastone",
    ],
  },
  {
    name: "Framing & Rough Build",
    items: [
      "Rough Lumber",
      "Trusses",
      "Steel Beams",
      "Framing Labor",
      "Sheathing",
      "Sil Plate",
      "Rough Building",
    ],
  },
  {
    name: "Exterior",
    items: [
      "Shingles",
      "Roofing Labor",
      "Siding Material",
      "Siding Labor",
      "Windows",
      "Front Door",
      "Side / Rear Doors",
      "Garage Doors",
      "Stone (Exterior)",
      "Gutters",
      "Exterior Paint",
      "Exterior Cement",
      "Screens",
    ],
  },
  {
    name: "Mechanicals - Rough",
    items: [
      "Plumbing Rough",
      "Plumbing Material",
      "Electrical Rough",
      "HVAC Rough",
      "HVAC Ductwork",
      "Fireplace Rough",
      "Fireplace Unit",
    ],
  },
  {
    name: "Mechanicals - Finish",
    items: [
      "Plumbing Finish",
      "Plumbing Fixtures",
      "Electrical Finish",
      "Electrical Fixtures",
      "HVAC Finish",
    ],
  },
  {
    name: "Interior Finish",
    items: [
      "Insulation",
      "Attic Insulation",
      "Drywall",
      "Drywall Materials",
      "Prime Interior",
      "Interior Paint",
      "Trim / Finish Carpentry",
      "Finish Lumber",
      "Cabinets",
      "Cabinet Knobs",
      "Quartz / Countertops",
      "Ceramic Tile (Material)",
      "Ceramic Tile (Labor)",
      "Wood Floor Material",
      "Wood Floor Labor",
      "Carpet",
      "Door Knobs",
      "Shower Door",
      "Caulk",
      "Wall Registers",
    ],
  },
  {
    name: "Appliances & Final",
    items: [
      "Appliances",
      "Sprinkler System",
      "Sod / Grass",
      "Street Tree",
      "Window Cleaning",
      "Final Clean",
    ],
  },
  {
    name: "Inspections & Testing",
    items: ["Blower Door Test", "Inspection Fees"],
  },
  {
    name: "Soft Costs / Other",
    items: [
      "Builder Fee / Overhead",
      "Contingency",
      "Marketing / Sale",
      "Realtor Fees",
      "Closing Costs",
      "Title / Legal",
    ],
  },
];

const STORAGE_KEY = "house-build-checklist-v2";

function loadState() {
  // If Supabase bridge loaded data, use it
  if (window.__dbState) {
    const s = window.__dbState;
    window.__dbState = null;
    return s;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const p = JSON.parse(raw);
      if (!p.notes) p.notes = {};
      if (!p.status)
        p.status = p.checks
          ? Object.fromEntries(Object.keys(p.checks).map((k) => [k, "done"]))
          : {};
      if (!p.checkSource) p.checkSource = {};
      if (!p.slackEvidence) p.slackEvidence = {};
      if (!p.slackChannels) p.slackChannels = {};
      if (!p.driveSearchTokens) p.driveSearchTokens = {};
      if (!p.driveExcludedFiles) p.driveExcludedFiles = {};
      if (!p.costSections)
        p.costSections = JSON.parse(JSON.stringify(DEFAULT_COST_SECTIONS));
      if (!p.costs) p.costs = {};
      if (!p.lotCost) p.lotCost = {};
      if (!p.salesPrice) p.salesPrice = {};
      if (!p.itemSortOrder) p.itemSortOrder = {};
      return p;
    }
  } catch (e) {}
  return {
    houses: [...DEFAULT_HOUSES],
    sections: JSON.parse(JSON.stringify(DEFAULT_SECTIONS)),
    status: {},
    notes: {},
    checkSource: {},
    slackEvidence: {},
    slackChannels: { ...DEFAULT_SLACK_CHANNELS },
    driveSearchTokens: {},
    driveExcludedFiles: {},
    costSections: JSON.parse(JSON.stringify(DEFAULT_COST_SECTIONS)),
    costs: {},
    lotCost: {},
    salesPrice: {},
    itemSortOrder: {},
  };
}
function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {}
}
let state = loadState();

// Transient (not persisted) UI state for excluded sections being expanded
const driveExpandedExclusions = {};

// Parse an address into { number, street }. Number is the first numeric token,
// street is the last meaningful word (>1 char, non-numeric, non-directional).
function parseAddress(house) {
  const tokens = String(house).trim().split(/\s+/);
  const numberToken = tokens.find((t) => /^\d+$/.test(t)) || "";
  const directionals = new Set(["E", "W", "N", "S", "NE", "NW", "SE", "SW"]);
  const streetTokens = tokens.filter(
    (t) =>
      !/^\d+$/.test(t) && t.length > 1 && !directionals.has(t.toUpperCase()),
  );
  const street = streetTokens[streetTokens.length - 1] || "";
  return { number: numberToken, street };
}

function getDriveQuery(hIdx) {
  const custom = state.driveSearchTokens[hIdx];
  const escape = (s) => String(s).replace(/'/g, "\\'");
  if (custom && custom.trim()) {
    return `fullText contains '${escape(custom.trim())}'`;
  }
  const { number, street } = parseAddress(state.houses[hIdx]);
  const parts = [];
  if (number) parts.push(`fullText contains '${escape(number)}'`);
  if (street) parts.push(`fullText contains '${escape(street)}'`);
  if (parts.length === 0) {
    return `fullText contains '${escape(state.houses[hIdx] || "")}'`;
  }
  return parts.join(" and ");
}

function describeDriveQuery(hIdx) {
  const custom = state.driveSearchTokens[hIdx];
  if (custom && custom.trim()) return `"${custom.trim()}"`;
  const { number, street } = parseAddress(state.houses[hIdx]);
  const parts = [];
  if (number) parts.push(`"${number}"`);
  if (street) parts.push(`"${street}"`);
  if (parts.length === 0) return `"${state.houses[hIdx] || ""}"`;
  return parts.join(" + ");
}

// ========== Tab management ==========
let activeView = "checklist";

function renderTabs() {
  const strip = document.getElementById("tab-strip");
  let html = "";
  html += `<div class="tab" data-view="checklist">Checklist</div>`;
  html += `<div class="tab" data-view="summary">Summary</div>`;

  if (state.houses.length > 0) {
    html += `<div class="tab-divider"></div>`;
    const activeCostView = activeView.startsWith("costs:") ? activeView : null;
    const activeHouseIdx = activeCostView
      ? parseInt(activeCostView.split(":")[1])
      : -1;
    const activeHouseName =
      activeHouseIdx >= 0 ? state.houses[activeHouseIdx] : "Costs";

    html += `<div class="costs-menu-wrapper">
      <button class="costs-menu-btn ${activeCostView ? "active" : ""}" id="costs-menu-btn">
        <span class="costs-icon">$</span>
        <span>${escapeHtml(activeHouseName)}</span>
        <span class="arrow">▼</span>
      </button>
      <div class="costs-dropdown" id="costs-dropdown">`;

    state.houses.forEach((house, hIdx) => {
      const isActive = activeView === `costs:${hIdx}`;
      html += `<div class="costs-dropdown-item ${isActive ? "active" : ""}" data-view="costs:${hIdx}">
        <span class="costs-icon">$</span>
        <span>${escapeHtml(house)}</span>
      </div>`;
    });

    html += `</div></div>`;
  }

  // Add spacer and hamburger button
  html += `<div class="spacer"></div>`;
  html += `<button class="hamburger-btn" id="hamburger-btn">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50">
      <path d="M 3 9 A 1.0001 1.0001 0 1 0 3 11 L 47 11 A 1.0001 1.0001 0 1 0 47 9 L 3 9 z M 3 24 A 1.0001 1.0001 0 1 0 3 26 L 47 26 A 1.0001 1.0001 0 1 0 47 24 L 3 24 z M 3 39 A 1.0001 1.0001 0 1 0 3 41 L 47 41 A 1.0001 1.0001 0 1 0 47 39 L 3 39 z"></path>
    </svg>
  </button>`;

  strip.innerHTML = html;

  // Populate mobile menu costs
  const mobileCostsList = document.getElementById("mobile-costs-list");
  if (mobileCostsList) {
    let mobileCostsHtml = "";
    state.houses.forEach((house, hIdx) => {
      const isActive = activeView === `costs:${hIdx}`;
      mobileCostsHtml += `<button class="mobile-menu-item ${isActive ? "active" : ""}" data-view="costs:${hIdx}">
        <span class="costs-icon">$</span>
        <span>${escapeHtml(house)}</span>
      </button>`;
    });
    mobileCostsList.innerHTML = mobileCostsHtml;

    // Add click handlers for mobile costs items
    document
      .querySelectorAll("#mobile-costs-list .mobile-menu-item")
      .forEach((item) => {
        item.addEventListener("click", () => {
          setActiveView(item.dataset.view);
          closeMobileMenu();
        });
      });
  }

  document.querySelectorAll("#tab-strip .tab").forEach((tab) => {
    tab.addEventListener("click", () => setActiveView(tab.dataset.view));
  });

  // Hamburger menu button
  const hamburgerBtn = document.getElementById("hamburger-btn");
  if (hamburgerBtn) {
    hamburgerBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openMobileMenu();
    });
  }

  // Costs menu dropdown
  const costsBtn = document.getElementById("costs-menu-btn");
  const costsDropdown = document.getElementById("costs-dropdown");
  if (costsBtn && costsDropdown) {
    costsBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = costsDropdown.classList.toggle("open");
      if (isOpen) {
        const rect = costsBtn.getBoundingClientRect();
        costsDropdown.style.top = rect.bottom + "px";
        costsDropdown.style.left = rect.left + "px";
      }
    });

    document.querySelectorAll(".costs-dropdown-item").forEach((item) => {
      item.addEventListener("click", () => {
        setActiveView(item.dataset.view);
        costsDropdown.classList.remove("open");
      });
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", () => {
      costsDropdown.classList.remove("open");
    });
  }

  // mark active
  document
    .querySelectorAll("#tab-strip .tab")
    .forEach((t) => t.classList.remove("active"));
  const a = document.querySelector(
    `#tab-strip .tab[data-view="${cssEscape(activeView)}"]`,
  );
  if (a) a.classList.add("active");
}

function cssEscape(s) {
  // Minimal escape for attribute selectors with ":" etc
  return String(s).replace(/[\\"]/g, "\\$&");
}

function setActiveView(view) {
  if (!view) return;
  activeView = view;
  document
    .querySelectorAll("#tab-strip .tab")
    .forEach((t) => t.classList.remove("active"));
  const a = document.querySelector(
    `#tab-strip .tab[data-view="${cssEscape(view)}"]`,
  );
  if (a) a.classList.add("active");
  const isChecklist = view === "checklist";
  const isSummary = view === "summary";
  const isCosts = view.startsWith("costs:");
  document.getElementById("pane-checklist").style.display = isChecklist
    ? "block"
    : "none";
  document.getElementById("pane-summary").style.display = isSummary
    ? "block"
    : "none";
  document.getElementById("pane-costs").style.display = isCosts
    ? "block"
    : "none";
  document.getElementById("toolbar-checklist").style.display = isChecklist
    ? "flex"
    : "none";
  document.getElementById("legend").style.display = isChecklist
    ? "flex"
    : "none";
  if (isSummary) {
    renderSummary();
    loadAllDriveDocs();
  }
  if (isCosts) {
    const hIdx = +view.split(":")[1];
    renderCostsForHouse(hIdx);
  }
}

function statusLabel(status) {
  if (status === "done") return "X";
  if (status === "called") return "C";
  if (status === "ordered") return "O";
  return "";
}

function renderChecklist() {
  const table = document.getElementById("checklist-table");
  if (!table) {
    return;
  }

  // Show helpful message if database is empty
  if (state.sections.length === 0) {
    table.innerHTML = `
      <div style="padding: 40px; text-align: center; color: #666;">
        <h2>Database is empty</h2>
        <p>Your database needs to be seeded with initial data.</p>
        <p>Run the following command to populate the database:</p>
        <pre style="background: #f5f5f5; padding: 15px; border-radius: 6px; margin: 20px auto; max-width: 500px;">npx supabase db push</pre>
        <p style="margin-top: 20px;">Or run the seed migration (002_seed.sql) in your Supabase dashboard.</p>
      </div>
    `;
    return;
  }

  let html = "<thead><tr>";
  html += `<th class="item-header">Item</th>`;
  state.houses.forEach((house, hIdx) => {
    const channel = state.slackChannels[hIdx] || "";
    html += `<th class="house-col">
      <div class="house-header">
        <span class="house-name" contenteditable="true" data-house-idx="${hIdx}">${escapeHtml(house)}</span>
        <button class="btn danger" data-action="remove-house" data-house-idx="${hIdx}" title="Remove house">×</button>
      </div>
      <div class="slack-channel-input">
        <span class="hash">#</span>
        <input type="text" placeholder="slack-channel" value="${escapeHtml(channel)}" data-slack-channel="${hIdx}">
      </div>
    </th>`;
  });
  html += "</tr></thead><tbody>";

  // Flatten all items from all sections into a single sorted list
  const allItems = [];
  state.sections.forEach((section, sIdx) => {
    section.items.forEach((item, iIdx) => {
      allItems.push({
        item,
        sIdx,
        iIdx,
        sortOrder: state.itemSortOrder?.[sIdx]?.[iIdx] ?? sIdx * 1000 + iIdx,
      });
    });
  });

  // Sort by sort_order
  allItems.sort((a, b) => a.sortOrder - b.sortOrder);

  // Render all items in sorted order
  allItems.forEach(({ item, sIdx, iIdx }) => {
    html += `<tr class="item-row"><td class="item-cell">
      <span contenteditable="true" data-section-idx="${sIdx}" data-item-idx="${iIdx}" data-edit="item">${escapeHtml(item)}</span>
      <span class="item-actions">
        <button class="btn secondary" data-action="move-item-up" data-section-idx="${sIdx}" data-item-idx="${iIdx}" title="Move up">↑</button>
        <button class="btn secondary" data-action="move-item-down" data-section-idx="${sIdx}" data-item-idx="${iIdx}" title="Move down">↓</button>
        <button class="btn danger" data-action="remove-item" data-section-idx="${sIdx}" data-item-idx="${iIdx}" title="Remove item">×</button>
      </span>
    </td>`;
    state.houses.forEach((_, hIdx) => {
      const k = `${hIdx}|${sIdx}|${iIdx}`;
      const status = state.status[k] || null;
      const note = state.notes[k] || "";
      const hasNote = note.length > 0;
      const source = state.checkSource[k] || "manual";
      const fromSlack = !!status && source === "slack";
      const ev = state.slackEvidence[k];
      let cellTitle = "";
      if (fromSlack && ev) {
        const confidenceText = ev.confidence
          ? ` (AI confidence: ${Math.round(ev.confidence * 100)}%)`
          : "";
        cellTitle = `From Slack #${ev.channel}: "${ev.text}"${confidenceText}`;
      }
      html += `<td class="check-cell ${hasNote ? "has-note" : ""} ${fromSlack ? "from-slack" : ""}" data-key="${k}" title="${escapeHtml(cellTitle)}">
        <div class="cell-inner">
          <button class="status-btn status-${status || "none"}" data-key="${k}" data-h="${hIdx}" data-s="${sIdx}" data-i="${iIdx}" title="Set status">${statusLabel(status)}</button>
          <button class="note-btn ${hasNote ? "has-note" : ""}"
            data-key="${k}" data-h="${hIdx}" data-s="${sIdx}" data-i="${iIdx}"
            title="${hasNote ? escapeHtml(note).slice(0, 200) : "Add note"}">${hasNote ? NOTE_FILLED_SVG : PENCIL_OUTLINE_SVG}</button>
        </div>
      </td>`;
    });
    html += "</tr>";
  });
  html += "</tbody>";
  table.innerHTML = html;
  attachChecklistEvents();
}

function applyStatus(key, newStatus) {
  const [hIdx, sIdx, iIdx] = key.split("|").map(Number);
  if (newStatus) {
    state.status[key] = newStatus;
    // Set to manual when user confirms (green), keep slack only for unconfirmed
    state.checkSource[key] = "manual";
  } else {
    delete state.status[key];
    delete state.checkSource[key];
    delete state.slackEvidence[key];
  }
  saveState();
  if (window.__db)
    window.__db.persistStatus(
      hIdx,
      sIdx,
      iIdx,
      newStatus || null,
      state.checkSource[key],
      state.slackEvidence[key],
      state.notes[key],
    );
  renderChecklist();
}

let activeStatusPopover = null;

function openStatusPopover(btn) {
  closeStatusPopover();
  const key = btn.dataset.key;
  const current = state.status[key] || null;
  const popup = document.createElement("div");
  popup.className = "status-popup";
  popup.innerHTML = `
    <button class="status-option status-done ${current === "done" ? "active" : ""}" data-val="done">✕ Done</button>
    <button class="status-option status-called ${current === "called" ? "active" : ""}" data-val="called">C Called</button>
    <button class="status-option status-ordered ${current === "ordered" ? "active" : ""}" data-val="ordered">O Ordered</button>
    <button class="status-option status-clear ${!current ? "active" : ""}" data-val="">— Clear</button>
  `;
  popup.querySelectorAll(".status-option").forEach((opt) => {
    opt.addEventListener("click", (e) => {
      e.stopPropagation();
      applyStatus(key, opt.dataset.val || null);
      closeStatusPopover();
    });
  });
  document.body.appendChild(popup);
  activeStatusPopover = popup;
  // Position below the button
  const r = btn.getBoundingClientRect();
  popup.style.top = r.bottom + 4 + "px";
  popup.style.left = r.left + "px";
  // Close on outside click
  setTimeout(() => {
    document.addEventListener("click", closeStatusPopover, { once: true });
  }, 0);
}

function closeStatusPopover() {
  if (activeStatusPopover) {
    activeStatusPopover.remove();
    activeStatusPopover = null;
  }
}

function attachChecklistEvents() {
  document.querySelectorAll(".status-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openStatusPopover(btn);
    });
  });
  document.querySelectorAll(".note-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      openNotePopover(btn);
    });
  });
  document
    .querySelectorAll('button[data-action="remove-house"]')
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const hIdx = +btn.dataset.houseIdx;
        if (
          !confirm(
            `Remove house "${state.houses[hIdx]}"? This will delete all its checks, notes, and cost data.`,
          )
        )
          return;
        if (window.__db) await window.__db.deleteHouse(hIdx);
        state.houses.splice(hIdx, 1);
        state.status = remapByHouse(state.status, hIdx);
        state.notes = remapByHouse(state.notes, hIdx);
        state.checkSource = remapByHouse(state.checkSource, hIdx);
        state.slackEvidence = remapByHouse(state.slackEvidence, hIdx);
        const newCh = {},
          newDt = {},
          newEx = {};
        Object.keys(state.slackChannels).forEach((k) => {
          const h = +k;
          if (h === hIdx) return;
          newCh[h > hIdx ? h - 1 : h] = state.slackChannels[k];
        });
        Object.keys(state.driveSearchTokens).forEach((k) => {
          const h = +k;
          if (h === hIdx) return;
          newDt[h > hIdx ? h - 1 : h] = state.driveSearchTokens[k];
        });
        Object.keys(state.driveExcludedFiles).forEach((k) => {
          const h = +k;
          if (h === hIdx) return;
          newEx[h > hIdx ? h - 1 : h] = state.driveExcludedFiles[k];
        });
        state.slackChannels = newCh;
        state.driveSearchTokens = newDt;
        state.driveExcludedFiles = newEx;
        state.costs = remapKeyedByHouse(state.costs, hIdx);
        state.lotCost = remapKeyedByHouse(state.lotCost, hIdx);
        state.salesPrice = remapKeyedByHouse(state.salesPrice, hIdx);
        driveCache = {};
        if (activeView.startsWith("costs:")) {
          const viewedIdx = +activeView.split(":")[1];
          if (viewedIdx === hIdx) {
            activeView = "checklist";
          } else if (viewedIdx > hIdx) {
            activeView = `costs:${viewedIdx - 1}`;
          }
        }
        saveState();
        renderTabs();
        renderChecklist();
        setActiveView(activeView);
      });
    });
  document
    .querySelectorAll('button[data-action="remove-item"]')
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const sIdx = +btn.dataset.sectionIdx,
          iIdx = +btn.dataset.itemIdx;
        const itemName = state.sections[sIdx].items[iIdx];
        if (!confirm(`Remove item "${itemName}"?`)) return;
        if (window.__db) await window.__db.deleteChecklistItem(sIdx, iIdx);
        state.sections[sIdx].items.splice(iIdx, 1);
        state.status = remapByItem(state.status, sIdx, iIdx);
        state.notes = remapByItem(state.notes, sIdx, iIdx);
        state.checkSource = remapByItem(state.checkSource, sIdx, iIdx);
        state.slackEvidence = remapByItem(state.slackEvidence, sIdx, iIdx);
        saveState();
        renderChecklist();
      });
    });
  document.querySelectorAll('input[data-action="add-item"]').forEach((inp) => {
    inp.addEventListener("keydown", async (e) => {
      if (e.key !== "Enter") return;
      const val = inp.value.trim();
      if (!val) return;
      const sIdx = +inp.dataset.sectionIdx;
      state.sections[sIdx].items.push(val);
      if (window.__db) await window.__db.addChecklistItem(sIdx, val);
      saveState();
      renderChecklist();
    });
  });
  document
    .querySelectorAll('button[data-action="move-item-up"]')
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const sIdx = +btn.dataset.sectionIdx,
          iIdx = +btn.dataset.itemIdx;
        if (iIdx === 0) return;
        const items = state.sections[sIdx].items;
        [items[iIdx - 1], items[iIdx]] = [items[iIdx], items[iIdx - 1]];
        // Update sort order in Supabase for all houses and in checklist_items
        for (let hIdx = 0; hIdx < state.houses.length; hIdx++) {
          if (window.__db) {
            await window.__db.persistSortOrder(hIdx, sIdx, iIdx - 1, iIdx);
            await window.__db.persistSortOrder(hIdx, sIdx, iIdx, iIdx - 1);
          }
        }
        // Update sort order in checklist_items table
        if (window.__db) {
          await window.__db.persistItemSortOrder(sIdx, iIdx - 1, iIdx);
          await window.__db.persistItemSortOrder(sIdx, iIdx, iIdx - 1);
        }
        saveState();
        renderChecklist();
      });
    });
  document
    .querySelectorAll('button[data-action="move-item-down"]')
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const sIdx = +btn.dataset.sectionIdx,
          iIdx = +btn.dataset.itemIdx;
        const items = state.sections[sIdx].items;
        if (iIdx >= items.length - 1) return;
        [items[iIdx], items[iIdx + 1]] = [items[iIdx + 1], items[iIdx]];
        // Update sort order in Supabase for all houses and in checklist_items
        for (let hIdx = 0; hIdx < state.houses.length; hIdx++) {
          if (window.__db) {
            await window.__db.persistSortOrder(hIdx, sIdx, iIdx, iIdx + 1);
            await window.__db.persistSortOrder(hIdx, sIdx, iIdx + 1, iIdx);
          }
        }
        // Update sort order in checklist_items table
        if (window.__db) {
          await window.__db.persistItemSortOrder(sIdx, iIdx, iIdx + 1);
          await window.__db.persistItemSortOrder(sIdx, iIdx + 1, iIdx);
        }
        saveState();
        renderChecklist();
      });
    });
  document
    .querySelectorAll("span.house-name[contenteditable]")
    .forEach((span) => {
      span.addEventListener("blur", () => {
        const hIdx = +span.dataset.houseIdx;
        const v = span.textContent.trim();
        if (v) state.houses[hIdx] = v;
        else span.textContent = state.houses[hIdx];
        if (v && window.__db) window.__db.persistHouseField(hIdx, { name: v });
        saveState();
        renderTabs();
      });
      span.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          span.blur();
        }
      });
    });
  document.querySelectorAll('span[data-edit="item"]').forEach((span) => {
    span.addEventListener("blur", () => {
      const sIdx = +span.dataset.sectionIdx,
        iIdx = +span.dataset.itemIdx;
      const v = span.textContent.trim();
      if (v) state.sections[sIdx].items[iIdx] = v;
      else span.textContent = state.sections[sIdx].items[iIdx];
      saveState();
    });
    span.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        span.blur();
      }
    });
  });
  document.querySelectorAll("input[data-slack-channel]").forEach((inp) => {
    inp.addEventListener("blur", () => {
      const hIdx = +inp.dataset.slackChannel;
      const v = inp.value.trim().replace(/^#/, "");
      if (v) state.slackChannels[hIdx] = v;
      else delete state.slackChannels[hIdx];
      if (window.__db)
        window.__db.persistHouseField(hIdx, { slack_channel: v || null });
      saveState();
    });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") inp.blur();
    });
  });
}

function remapByHouse(map, removedIdx) {
  const out = {};
  Object.keys(map).forEach((k) => {
    const [h, s, i] = k.split("|").map(Number);
    if (h === removedIdx) return;
    out[`${h > removedIdx ? h - 1 : h}|${s}|${i}`] = map[k];
  });
  return out;
}
function remapByItem(map, sIdx, removedIdx) {
  const out = {};
  Object.keys(map).forEach((k) => {
    const [h, s, i] = k.split("|").map(Number);
    if (s === sIdx && i === removedIdx) return;
    const newI = s === sIdx && i > removedIdx ? i - 1 : i;
    out[`${h}|${s}|${newI}`] = map[k];
  });
  return out;
}
// For maps keyed by raw house index (costs, lotCost, salesPrice, etc.)
function remapKeyedByHouse(map, removedIdx) {
  const out = {};
  Object.keys(map).forEach((k) => {
    const h = +k;
    if (h === removedIdx) return;
    out[h > removedIdx ? h - 1 : h] = map[k];
  });
  return out;
}
// For cost maps keyed by "csIdx|ciIdx" — shift item indices when one is removed
function remapCostsByItem(map, removedCs, removedCi) {
  const out = {};
  Object.keys(map).forEach((k) => {
    const [cs, ci] = k.split("|").map(Number);
    if (cs === removedCs && ci === removedCi) return;
    const newCi = cs === removedCs && ci > removedCi ? ci - 1 : ci;
    out[`${cs}|${newCi}`] = map[k];
  });
  return out;
}

let activeNoteContext = null;
function openNotePopover(btn) {
  const hIdx = +btn.dataset.h,
    sIdx = +btn.dataset.s,
    iIdx = +btn.dataset.i;
  const key = `${hIdx}|${sIdx}|${iIdx}`;
  activeNoteContext = { key, btn };
  document.getElementById("popover-house").textContent =
    state.houses[hIdx] || "";
  document.getElementById("popover-item").textContent =
    state.sections[sIdx].items[iIdx] || "";
  const ta = document.getElementById("popover-textarea");
  ta.value = state.notes[key] || "";
  document.getElementById("popover-backdrop").classList.add("open");
  const pop = document.getElementById("note-popover");
  pop.classList.add("open");
  const r = btn.getBoundingClientRect();
  let left = r.right + 8,
    top = r.top;
  if (left + 320 > window.innerWidth - 12)
    left = Math.max(12, r.left - 320 - 8);
  if (top + 200 > window.innerHeight - 12)
    top = Math.max(12, window.innerHeight - 200 - 12);
  pop.style.left = left + "px";
  pop.style.top = top + "px";
  setTimeout(() => ta.focus(), 0);
}
function closeNotePopover() {
  document.getElementById("note-popover").classList.remove("open");
  document.getElementById("popover-backdrop").classList.remove("open");
  activeNoteContext = null;
}
function saveNotePopover() {
  if (!activeNoteContext) return;
  const v = document.getElementById("popover-textarea").value.trim();
  if (v) state.notes[activeNoteContext.key] = v;
  else delete state.notes[activeNoteContext.key];
  saveState();
  const [nh, ns, ni] = activeNoteContext.key.split("|").map(Number);
  if (window.__db)
    window.__db.persistNote(nh, ns, ni, state.notes[activeNoteContext.key]);
  closeNotePopover();
  renderChecklist();
  renderSummary();
}
function deleteNotePopover() {
  if (!activeNoteContext) return;
  delete state.notes[activeNoteContext.key];
  saveState();
  const [nh, ns, ni] = activeNoteContext.key.split("|").map(Number);
  if (window.__db) window.__db.persistNote(nh, ns, ni, null);
  closeNotePopover();
  renderChecklist();
  renderSummary();
}
document
  .getElementById("popover-cancel")
  .addEventListener("click", closeNotePopover);
document
  .getElementById("popover-save")
  .addEventListener("click", saveNotePopover);
document
  .getElementById("popover-delete")
  .addEventListener("click", deleteNotePopover);
document.getElementById("popover-backdrop").addEventListener("click", (e) => {
  // Close whichever popover is open
  if (document.getElementById("note-popover").classList.contains("open")) {
    closeNotePopover();
  }
  if (document.getElementById("house-popover").classList.contains("open")) {
    closeHousePopover();
  }
});
document.getElementById("popover-textarea").addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    e.preventDefault();
    saveNotePopover();
  }
  if (e.key === "Escape") closeNotePopover();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    if (document.getElementById("note-popover").classList.contains("open")) {
      closeNotePopover();
    }
    if (document.getElementById("house-popover").classList.contains("open")) {
      closeHousePopover();
    }
  }
});

// ========== Add House Modal ==========
function openHousePopover() {
  document.getElementById("house-name-input").value = "";
  document.getElementById("house-slack-input").value = "";
  document.getElementById("house-popover").classList.add("open");
  document.getElementById("popover-backdrop").classList.add("open");
  setTimeout(() => document.getElementById("house-name-input").focus(), 50);
}

function closeHousePopover() {
  document.getElementById("house-popover").classList.remove("open");
  document.getElementById("popover-backdrop").classList.remove("open");
}

async function saveHousePopover() {
  const name = document.getElementById("house-name-input").value.trim();
  const slackChannel = document
    .getElementById("house-slack-input")
    .value.trim();

  if (!name) {
    showBanner("Please enter a house name/address", "error");
    return;
  }

  // Add to state
  const hIdx = state.houses.length;
  state.houses.push(name);

  if (slackChannel) {
    state.slackChannels[hIdx] = slackChannel;
  }

  // Add to database
  if (window.__db) {
    try {
      const newHouse = await window.__db.addHouse(name);
      // Update slack channel if provided
      if (slackChannel && newHouse) {
        await window.__db.persistHouseField(hIdx, {
          slack_channel: slackChannel,
        });
      }

      // Create Google Drive folder (async, don't block on failure)
      if (newHouse && newHouse.id) {
        createDriveFolderForHouse(name, newHouse.id).catch((err) => {
          // Don't show error to user - folder creation is optional
        });
      }
    } catch (err) {
      showBanner("Failed to add house to database: " + err.message, "error");
      // Rollback state change
      state.houses.pop();
      if (slackChannel) delete state.slackChannels[hIdx];
      return;
    }
  }

  saveState();
  renderTabs();
  renderChecklist();
  closeHousePopover();
  showBanner(`House "${name}" added successfully!`, "success");
}

document
  .getElementById("add-house-btn")
  .addEventListener("click", openHousePopover);
document
  .getElementById("house-popover-cancel")
  .addEventListener("click", closeHousePopover);
document
  .getElementById("house-popover-save")
  .addEventListener("click", saveHousePopover);

document.getElementById("house-name-input").addEventListener("keydown", (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
    e.preventDefault();
    saveHousePopover();
  }
  if (e.key === "Escape") closeHousePopover();
});

document
  .getElementById("house-slack-input")
  .addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      saveHousePopover();
    }
    if (e.key === "Escape") closeHousePopover();
  });

// ========== Mobile Menu ==========
function openMobileMenu() {
  document.getElementById("mobile-menu").classList.add("open");
  document.getElementById("mobile-menu-backdrop").classList.add("open");
}

function closeMobileMenu() {
  document.getElementById("mobile-menu").classList.remove("open");
  document.getElementById("mobile-menu-backdrop").classList.remove("open");
}

// Mobile menu close button
document.addEventListener("click", (e) => {
  const closeBtn = document.getElementById("mobile-menu-close");
  if (closeBtn && e.target === closeBtn) {
    closeMobileMenu();
  }
});

// Mobile menu backdrop
document.addEventListener("click", (e) => {
  const backdrop = document.getElementById("mobile-menu-backdrop");
  if (backdrop && e.target === backdrop) {
    closeMobileMenu();
  }
});

// Mobile sync slack
document.addEventListener("click", (e) => {
  const syncBtn = document.getElementById("mobile-sync-slack");
  if (syncBtn && e.target.closest("#mobile-sync-slack")) {
    closeMobileMenu();
    syncFromSlack();
  }
});

// Mobile add house
document.addEventListener("click", (e) => {
  const addBtn = document.getElementById("mobile-add-house");
  if (addBtn && e.target.closest("#mobile-add-house")) {
    closeMobileMenu();
    openHousePopover();
  }
});

// Mobile logout
document.addEventListener("click", (e) => {
  const logoutBtn = document.getElementById("mobile-logout");
  if (logoutBtn && e.target.closest("#mobile-logout")) {
    closeMobileMenu();
    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
  }
});

// ========== Slack integration ==========
function showBanner(text, type = "info") {
  const b = document.getElementById("banner");
  b.className = `banner show ${type}`;
  b.textContent = text;
}
function hideBanner() {
  const b = document.getElementById("banner");
  b.className = "banner";
  b.textContent = "";
}
function setAutoSyncStatus(text) {
  document.getElementById("auto-sync-status").textContent = text;
}

async function syncFromSlack(opts = { silent: false }) {
  const btn = document.getElementById("sync-slack-btn");
  let orig;
  if (!opts.silent) {
    btn.disabled = true;
    orig = btn.textContent;
    btn.textContent = "Syncing…";
    hideBanner();
  }
  setAutoSyncStatus("Syncing from Slack…");

  try {
    const housesWithChannels = state.houses
      .map((house, hIdx) => ({
        house,
        hIdx,
        channel: state.slackChannels[hIdx],
      }))
      .filter((h) => h.channel);
    if (housesWithChannels.length === 0) {
      if (!opts.silent)
        showBanner(
          "No Slack channels configured. Type a channel name under each house first.",
          "error",
        );
      setAutoSyncStatus("");
      return;
    }
    // Build payload: each house with its unchecked items
    const payload = housesWithChannels
      .map(({ house, hIdx, channel }) => {
        const items = [];
        state.sections.forEach((section, sIdx) => {
          section.items.forEach((item, iIdx) => {
            const k = `${hIdx}|${sIdx}|${iIdx}`;
            if (!state.status[k]) items.push({ sIdx, iIdx, text: item });
          });
        });
        return { hIdx, house, channel, items };
      })
      .filter((h) => h.items.length > 0);

    let totalNew = 0;
    const errors = [];

    if (payload.length === 0) {
      setAutoSyncStatus("");
      if (!opts.silent) showBanner("All items already have a status.", "info");
      return;
    }

    const supabaseUrl = window.__SUPABASE_URL;
    if (!supabaseUrl) {
      throw new Error("Supabase URL not configured");
    }
    const fnUrl = `${supabaseUrl}/functions/v1/slack-sync`;
    const token = window.__SUPABASE_ANON_KEY;
    let fnResult;
    try {
      const res = await fetch(fnUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ houses: payload }),
      });
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`Edge Function error ${res.status}: ${errorText}`);
      }
      fnResult = await res.json();
    } catch (err) {
      throw new Error(`Slack sync failed: ${err.message || err}`);
    }

    if (fnResult.errors) errors.push(...fnResult.errors);
    const filesUploaded = fnResult.filesUploaded || 0;
    const filesSkipped = fnResult.filesSkipped || 0;

    for (const match of fnResult.results || []) {
      const {
        hIdx,
        sIdx,
        iIdx,
        channel,
        text,
        author,
        ts,
        confidence,
        status,
      } = match;
      const k = `${hIdx}|${sIdx}|${iIdx}`;
      if (state.status[k]) continue;
      state.status[k] = status;
      state.checkSource[k] = "slack";
      state.slackEvidence[k] = { channel, text, author, ts, confidence };
      // Save the Slack message that triggered the match as a note
      const slackNote = `[Slack #${channel}] ${text}`;
      state.notes[k] = state.notes[k]
        ? `${state.notes[k]}\n${slackNote}`
        : slackNote;
      if (window.__db)
        window.__db.persistNote(hIdx, sIdx, iIdx, state.notes[k]);
      if (window.__db)
        window.__db.persistStatus(
          hIdx,
          sIdx,
          iIdx,
          status,
          "slack",
          state.slackEvidence[k],
          state.notes[k],
          confidence,
        );
      totalNew++;
    }
    saveState();
    renderChecklist();
    const now = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setAutoSyncStatus(
      `Last synced ${now}${totalNew > 0 ? ` · ${totalNew} new` : ""}`,
    );
    if (totalNew === 0 && filesUploaded === 0 && errors.length === 0) {
      if (!opts.silent)
        showBanner("Sync complete — no new items matched.", "info");
    } else if (totalNew > 0 || filesUploaded > 0) {
      const itemsText =
        totalNew > 0
          ? `${totalNew} item${totalNew === 1 ? "" : "s"} auto-marked`
          : "";
      const filesText =
        filesUploaded > 0
          ? `${filesUploaded} file${filesUploaded === 1 ? "" : "s"} uploaded`
          : "";
      const separator = itemsText && filesText ? " · " : "";
      const errSuffix = errors.length
        ? `  (${errors.length} issue${errors.length === 1 ? "" : "s"}: ${errors.join("; ")})`
        : "";
      showBanner(
        `Synced from Slack: ${itemsText}${separator}${filesText}. Click items to confirm.${errSuffix}`,
        "success",
      );
    } else if (!opts.silent) {
      showBanner(`Sync issues: ${errors.join("; ")}`, "error");
    }
  } catch (err) {
    if (!opts.silent) showBanner(`Sync failed: ${err.message || err}`, "error");
    setAutoSyncStatus("Sync failed");
  } finally {
    if (!opts.silent) {
      btn.disabled = false;
      btn.textContent = orig;
    }
  }
}
document
  .getElementById("sync-slack-btn")
  .addEventListener("click", () => syncFromSlack({ silent: false }));

// ========== Drive integration ==========
let driveCache = {}; // hIdx -> { loading, files: [], error, queryDesc }

async function loadDriveDocsForHouse(hIdx) {
  if (driveCache[hIdx] && !driveCache[hIdx].loading) return; // already loaded
  driveCache[hIdx] = { loading: true, files: [] };
  renderSummary();
  const query = getDriveQuery(hIdx);
  const queryDesc = describeDriveQuery(hIdx);
  try {
    const res = await window.cowork.callMcpTool(
      "mcp__c55e9052-d590-47c3-aecd-c1060de5044c__search_files",
      { query, pageSize: 25, excludeContentSnippets: true },
    );
    if (res.isError) {
      driveCache[hIdx] = {
        loading: false,
        files: [],
        error: "Drive search failed",
        queryDesc,
      };
    } else {
      const allFiles = res.structuredContent?.files || [];
      const excluded = state.driveExcludedFiles[hIdx] || {};
      const files = allFiles.filter((f) => f && f.id && !excluded[f.id]);
      files.sort((a, b) =>
        (b.modifiedTime || "").localeCompare(a.modifiedTime || ""),
      );
      driveCache[hIdx] = { loading: false, files, queryDesc };
    }
  } catch (err) {
    driveCache[hIdx] = {
      loading: false,
      files: [],
      error: String(err.message || err),
      queryDesc,
    };
  }
  renderSummary();
}

async function loadAllDriveDocs() {
  for (let hIdx = 0; hIdx < state.houses.length; hIdx++) {
    await loadDriveFilesForHouse(hIdx);
  }
}

async function loadDriveFilesForHouse(hIdx) {
  if (driveCache[hIdx] && !driveCache[hIdx].loading) return;

  driveCache[hIdx] = { loading: true, files: [] };
  renderSummary();

  try {
    // Get house ID from database
    const houseId = state.houseIds?.[hIdx];
    if (!houseId) {
      driveCache[hIdx] = {
        loading: false,
        files: [],
        error: "House not found in database",
      };
      renderSummary();
      return;
    }

    // Get folder ID from database
    let folderData = await window.__db?.getHouseDriveFolder(houseId);

    // If no folder exists, try to create it
    if (!folderData || !folderData.drive_folder_id) {
      try {
        const houseName = state.houses[hIdx];
        await createDriveFolderForHouse(houseName, houseId);
        // Wait a moment for database to sync, then fetch the newly created folder data
        await new Promise((resolve) => setTimeout(resolve, 500));
        folderData = await window.__db?.getHouseDriveFolder(houseId);
      } catch (err) {
        // If creation fails (e.g., no token), just show empty state
        driveCache[hIdx] = { loading: false, files: [], error: null };
        renderSummary();
        return;
      }
    }

    // If still no folder, show empty state
    if (!folderData || !folderData.drive_folder_id) {
      driveCache[hIdx] = { loading: false, files: [], error: null };
      renderSummary();
      return;
    }

    // List files in folder
    const files = await listDriveFiles(folderData.drive_folder_id);
    driveCache[hIdx] = { loading: false, files, error: null };
  } catch (err) {
    // Check if error is due to missing token
    if (err.message && err.message.includes("No Google tokens found")) {
      driveCache[hIdx] = { loading: false, files: [], error: null };
    } else {
      driveCache[hIdx] = { loading: false, files: [], error: err.message };
    }
  }

  renderSummary();
}

function changeDriveSearchToken(hIdx) {
  const desc = describeDriveQuery(hIdx);
  const current = state.driveSearchTokens[hIdx] || "";
  const v = prompt(
    `Custom Drive search for ${state.houses[hIdx]}\n\n` +
      `Default searches for both the house number AND street name (currently: ${desc}).\n` +
      `Type a custom phrase below to override (e.g., "4613 Tonawonda" or a Drive folder name).\n` +
      `Leave blank to use the default.`,
    current,
  );
  if (v === null) return;
  const t = v.trim();
  if (t) state.driveSearchTokens[hIdx] = t;
  else delete state.driveSearchTokens[hIdx];
  if (window.__db)
    window.__db.persistHouseField(hIdx, { drive_search_token: t || null });
  saveState();
  delete driveCache[hIdx];
  loadDriveDocsForHouse(hIdx);
}

function excludeDriveFile(hIdx, fileId) {
  const drive = driveCache[hIdx];
  if (!drive || !drive.files) return;
  const file = drive.files.find((f) => f.id === fileId);
  if (!file) return;
  if (!state.driveExcludedFiles[hIdx]) state.driveExcludedFiles[hIdx] = {};
  state.driveExcludedFiles[hIdx][fileId] = {
    title: file.title || "Untitled",
    mimeType: file.mimeType || "",
    excludedAt: new Date().toISOString(),
  };
  drive.files = drive.files.filter((f) => f.id !== fileId);
  if (window.__db)
    window.__db.addDriveExclusion(hIdx, fileId, file.title || null);
  saveState();
  renderSummary();
}

function restoreDriveFile(hIdx, fileId) {
  if (!state.driveExcludedFiles[hIdx]) return;
  delete state.driveExcludedFiles[hIdx][fileId];
  if (Object.keys(state.driveExcludedFiles[hIdx]).length === 0) {
    delete state.driveExcludedFiles[hIdx];
  }
  if (window.__db) window.__db.removeDriveExclusion(hIdx, fileId);
  saveState();
  delete driveCache[hIdx];
  loadDriveDocsForHouse(hIdx);
}

function toggleExcludedSection(hIdx) {
  driveExpandedExclusions[hIdx] = !driveExpandedExclusions[hIdx];
  renderSummary();
}

window.changeDriveSearchToken = changeDriveSearchToken;
window.excludeDriveFile = excludeDriveFile;
window.restoreDriveFile = restoreDriveFile;
window.toggleExcludedSection = toggleExcludedSection;

function formatDate(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (e) {
    return "";
  }
}

// ========== Summary ==========
function renderSummary() {
  const root = document.getElementById("summary-content");
  if (state.houses.length === 0) {
    root.innerHTML = `<div class="empty-state">No houses yet. Add one on the Checklist tab.</div>`;
    return;
  }
  let totalItems = 0;
  state.sections.forEach((s) => (totalItems += s.items.length));
  let html = `<h2>Summary by House</h2><div class="house-cards">`;
  state.houses.forEach((house, hIdx) => {
    let doneCount = 0,
      noteCount = 0;
    const bySection = state.sections.map((s, sIdx) => {
      const rows = [];
      s.items.forEach((item, iIdx) => {
        const k = `${hIdx}|${sIdx}|${iIdx}`;
        const status = state.status[k] || null;
        const checked = !!status;
        const note = state.notes[k] || "";
        const source = state.checkSource[k] || "manual";
        if (checked) doneCount++;
        if (note) noteCount++;
        rows.push({ item, status, checked, note, key: k, hIdx, sIdx, iIdx });
      });
      return { section: s.name, rows };
    });
    const pct = totalItems ? Math.round((doneCount / totalItems) * 100) : 0;
    html += `<div class="house-card">
      <h3>${escapeHtml(house)} <span class="count-badge">${doneCount} / ${totalItems} done · ${noteCount} note${noteCount === 1 ? "" : "s"}</span></h3>
      <div class="progress"><div style="width:${pct}%"></div></div>`;
    const noteSections = bySection.filter((s) => s.rows.some((r) => r.note));
    if (noteSections.length === 0) {
      html += `<div style="font-size:12px; color:#888;">No notes yet.</div>`;
    } else {
      html += `<ul class="summary-list">`;
      noteSections.forEach((s) => {
        const noteRows = s.rows.filter((r) => r.note);
        if (noteRows.length === 0) return;
        html += `<li class="heading">${escapeHtml(s.section)}</li>`;
        noteRows.forEach((r) => {
          html += `<li class="item-line">
            <span class="item-text">${escapeHtml(r.item)}</span>
            <div class="note-display">
              ${escapeHtml(r.note)}
              <button class="btn-delete-note" data-key="${r.key}" data-h="${r.hIdx}" data-s="${r.sIdx}" data-i="${r.iIdx}" title="Delete note">×</button>
            </div>
          </li>`;
        });
      });
      html += `</ul>`;
    }

    // Drive documents section
    const drive = driveCache[hIdx];
    html += `<div class="drive-section">
      <h4>
        <span>Drive Documents</span>
        <button class="btn-upload-file" onclick="uploadFileToHouse(${hIdx})" style="font-size: 12px; padding: 4px 8px; margin-left: 8px;">+ Upload</button>
      </h4>`;
    if (!drive) {
      html += `<div class="drive-loading">Loading…</div>`;
    } else if (drive.loading) {
      html += `<div class="drive-loading">Loading files…</div>`;
    } else if (drive.error) {
      html += `<div class="drive-error">${escapeHtml(drive.error)}</div>`;
    } else if (drive.files.length === 0) {
      html += `<div class="drive-empty">No files yet. Click Upload to add files.</div>`;
    } else {
      html += `<div class="drive-grid">`;
      drive.files.forEach((f) => {
        const icon = iconForMime(f.mimeType);
        const url = f.webViewLink || "#";
        const date = formatDate(f.modifiedTime);
        const size = formatFileSize(f.size);
        html += `<div class="drive-card">
          <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="drive-card-link">
            <div class="drive-card-icon">${icon}</div>
            <div class="drive-card-info">
              <div class="drive-card-name" title="${escapeHtml(f.name || "Untitled")}">${escapeHtml(f.name || "Untitled")}</div>
              <div class="drive-card-meta">${size} · ${date}</div>
            </div>
          </a>
        </div>`;
      });
      html += `</div>`;
    }
    html += `</div>`;
    html += `<input type="file" id="file-input-${hIdx}" style="display: none;" onchange="handleFileUpload(${hIdx}, this)">`;

    html += `</div>`;
  });
  html += `</div>`;
  root.innerHTML = html;

  // Attach event listeners for delete note buttons in summary
  root.querySelectorAll(".btn-delete-note").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const key = btn.dataset.key;
      const hIdx = +btn.dataset.h;
      const sIdx = +btn.dataset.s;
      const iIdx = +btn.dataset.i;
      if (confirm("Delete this note?")) {
        delete state.notes[key];
        saveState();
        if (window.__db) window.__db.persistNote(hIdx, sIdx, iIdx, null);
        renderChecklist();
        renderSummary();
      }
    });
  });
}

// ========== Costs view ==========
function parseNumber(s) {
  if (s == null) return 0;
  const cleaned = String(s).replace(/[^0-9.\-]/g, "");
  if (!cleaned) return 0;
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}
function formatNumber(n) {
  if (typeof n !== "number" || isNaN(n)) n = 0;
  return n.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
function formatCurrency(n) {
  if (typeof n !== "number" || isNaN(n)) n = 0;
  const abs = Math.abs(n);
  const sign = n < 0 ? "−" : "";
  return `${sign}$${formatNumber(abs)}`;
}

function computeCostsTotals(hIdx) {
  const costs = state.costs[hIdx] || {};
  const lot = state.lotCost[hIdx] || { estimate: 0, paid: 0 };
  const sale = Number(state.salesPrice[hIdx]) || 0;
  let estTotal = 0,
    paidTotal = 0;
  state.costSections.forEach((s, sIdx) => {
    s.items.forEach((_, iIdx) => {
      const k = `${sIdx}|${iIdx}`;
      const v = costs[k] || {};
      estTotal += Number(v.estimate) || 0;
      paidTotal += Number(v.paid) || 0;
    });
  });
  const lotEst = Number(lot.estimate) || 0;
  const lotPaid = Number(lot.paid) || 0;
  const grandEst = estTotal + lotEst;
  const grandPaid = paidTotal + lotPaid;
  const profit = sale - grandEst;
  return {
    estTotal,
    paidTotal,
    lotEst,
    lotPaid,
    grandEst,
    grandPaid,
    sale,
    profit,
  };
}

function renderCostsForHouse(hIdx) {
  const root = document.getElementById("pane-costs");
  if (hIdx == null || hIdx >= state.houses.length || hIdx < 0) {
    root.innerHTML = `<div class="empty-state">House not found.</div>`;
    return;
  }
  const house = state.houses[hIdx];
  const costs = state.costs[hIdx] || {};
  const lot = state.lotCost[hIdx] || { estimate: 0, paid: 0 };
  const t = computeCostsTotals(hIdx);

  // Get house ID for this house index
  const houseId = window.__houseIds?.[hIdx] || null;

  // Flatten cost items - show global items (no houseId) + this house's specific items
  const allCostItems = [];
  state.costSections.forEach((s, sIdx) => {
    const itemHouseIds = s.itemHouseIds || [];
    s.items.forEach((item, iIdx) => {
      const itemHouseId = itemHouseIds[iIdx];
      // Include if global (no houseId) or belongs to this house
      if (!itemHouseId || itemHouseId === houseId) {
        allCostItems.push({
          item,
          sIdx,
          iIdx,
          name: item,
          isHouseSpecific: !!itemHouseId,
        });
      }
    });
  });
  allCostItems.sort((a, b) => a.name.localeCompare(b.name));

  let html = `<div class="costs-pane-inner">
    <div class="costs-header">
      <div>
        <h2>Costs — ${escapeHtml(house)}</h2>
        <div class="costs-subtitle">Click any cell to edit.</div>
      </div>
      <div class="costs-quickstats">
        <div class="stat">Total Estimate <strong>${formatCurrency(t.grandEst)}</strong></div>
        <div class="stat">Total Paid <strong>${formatCurrency(t.grandPaid)}</strong></div>
        <div class="stat">Profit <strong class="${t.profit > 0 ? "profit-positive" : t.profit < 0 ? "profit-negative" : "profit-zero"}">${formatCurrency(t.profit)}</strong></div>
      </div>
    </div>
    <table class="costs-table">
      <thead>
        <tr>
          <th>Item</th>
          <th class="amount">Estimate</th>
          <th class="amount">Paid</th>
          <th class="actions-col"></th>
        </tr>
      </thead>
      <tbody>`;

  allCostItems.forEach(({ item, sIdx, iIdx, isHouseSpecific }) => {
    const k = `${sIdx}|${iIdx}`;
    const v = costs[k] || {};
    const e = Number(v.estimate) || 0;
    const p = Number(v.paid) || 0;
    const houseBadge = isHouseSpecific
      ? `<span class="house-badge" title="House-specific item">🏠</span> `
      : "";
    html += `<tr class="cost-row${isHouseSpecific ? " house-specific" : ""}" data-cost-key="${k}">
      <td>
        ${houseBadge}<span class="cost-category-text" contenteditable="true" data-cost-edit="category" data-cs="${sIdx}" data-ci="${iIdx}">${escapeHtml(item)}</span>
      </td>
      <td class="cost-cell"><input type="text" inputmode="decimal" class="cost-input ${e ? "has-value" : ""}"
        data-cost-input="estimate" data-h="${hIdx}" data-key="${k}"
        value="${e ? formatNumber(e) : ""}" placeholder="—"></td>
      <td class="cost-cell"><input type="text" inputmode="decimal" class="cost-input ${p ? "has-value" : ""}"
        data-cost-input="paid" data-h="${hIdx}" data-key="${k}"
        value="${p ? formatNumber(p) : ""}" placeholder="—"></td>
      <td class="cost-row-actions">
        <button data-cost-action="remove" data-cs="${sIdx}" data-ci="${iIdx}" title="Remove this item">×</button>
      </td>
    </tr>`;
  });

  // Add new cost item row with global/house-specific toggle
  html += `<tr class="add-cost-row">
    <td colspan="4">
      <div style="display: flex; gap: 8px; align-items: center;">
        <input type="text" class="cost-add-input" id="new-cost-input" placeholder="+ Add new cost item…">
        <label style="display: flex; align-items: center; gap: 4px; font-size: 12px; cursor: pointer;">
          <input type="checkbox" id="new-cost-house-specific" checked>
          <span>House-specific only</span>
        </label>
        <button class="btn" id="add-cost-btn" style="font-size: 12px; padding: 4px 10px;">Add</button>
      </div>
    </td>
  </tr>`;

  html += `</tbody>
      <tfoot>
        <tr class="lot-row">
          <td><strong>Lot</strong></td>
          <td class="cost-cell"><input type="text" inputmode="decimal" class="cost-input ${t.lotEst ? "has-value" : ""}"
            data-cost-input="lot-estimate" data-h="${hIdx}"
            value="${t.lotEst ? formatNumber(t.lotEst) : ""}" placeholder="—"></td>
          <td class="cost-cell"><input type="text" inputmode="decimal" class="cost-input ${t.lotPaid ? "has-value" : ""}"
            data-cost-input="lot-paid" data-h="${hIdx}"
            value="${t.lotPaid ? formatNumber(t.lotPaid) : ""}" placeholder="—"></td>
          <td></td>
        </tr>
        <tr class="totals-row">
          <td>Subtotal (Categories)</td>
          <td class="amount-cell">${formatCurrency(t.estTotal)}</td>
          <td class="amount-cell">${formatCurrency(t.paidTotal)}</td>
          <td></td>
        </tr>
        <tr class="totals-row grand">
          <td>Total (Categories + Lot)</td>
          <td class="amount-cell">${formatCurrency(t.grandEst)}</td>
          <td class="amount-cell">${formatCurrency(t.grandPaid)}</td>
          <td></td>
        </tr>
      </tfoot>
    </table>

    <div class="sales-block">
      <div class="field">
        <label>Sales Price</label>
        <input type="text" inputmode="decimal" class="sales-input" id="sales-input" data-h="${hIdx}"
          value="${t.sale ? formatNumber(t.sale) : ""}" placeholder="$0">
        <div class="field-sub">Manual — what this house should sell for.</div>
      </div>
      <div class="field">
        <label>Estimated Profit</label>
        <div class="field-value ${t.profit > 0 ? "profit-positive" : t.profit < 0 ? "profit-negative" : "profit-zero"}">${formatCurrency(t.profit)}</div>
        <div class="field-sub">Sales Price − (Total Estimate + Lot)</div>
      </div>
    </div>
  </div>`;

  root.innerHTML = html;
  attachCostsHandlers(hIdx);
}

function attachCostsHandlers(hIdx) {
  // Estimate / paid inputs (categories + lot)
  document.querySelectorAll("#pane-costs [data-cost-input]").forEach((inp) => {
    const handler = () => {
      const which = inp.dataset.costInput;
      const num = parseNumber(inp.value);
      if (which === "estimate" || which === "paid") {
        const k = inp.dataset.key;
        if (!state.costs[hIdx]) state.costs[hIdx] = {};
        if (!state.costs[hIdx][k]) state.costs[hIdx][k] = {};
        if (num) state.costs[hIdx][k][which] = num;
        else delete state.costs[hIdx][k][which];
        if (!state.costs[hIdx][k].estimate && !state.costs[hIdx][k].paid) {
          delete state.costs[hIdx][k];
        }
        if (Object.keys(state.costs[hIdx]).length === 0)
          delete state.costs[hIdx];
        if (window.__db) {
          const [csIdx, ciIdx] = k.split("|").map(Number);
          const entry = (state.costs[hIdx] || {})[k] || {};
          window.__db.persistCostEntry(
            hIdx,
            csIdx,
            ciIdx,
            entry.estimate,
            entry.paid,
          );
        }
      } else if (which === "lot-estimate" || which === "lot-paid") {
        const field = which === "lot-estimate" ? "estimate" : "paid";
        if (!state.lotCost[hIdx]) state.lotCost[hIdx] = {};
        if (num) state.lotCost[hIdx][field] = num;
        else delete state.lotCost[hIdx][field];
        if (!state.lotCost[hIdx].estimate && !state.lotCost[hIdx].paid) {
          delete state.lotCost[hIdx];
        }
        if (window.__db)
          window.__db.persistHouseField(hIdx, {
            lot_cost: state.lotCost[hIdx]?.estimate ?? null,
            lot_paid: state.lotCost[hIdx]?.paid ?? null,
          });
      }
      saveState();
      renderCostsForHouse(hIdx);
    };
    inp.addEventListener("blur", handler);
    inp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        inp.blur();
      }
    });
    inp.addEventListener("focus", () => setTimeout(() => inp.select(), 0));
  });

  // Sales price input
  const salesInp = document.getElementById("sales-input");
  if (salesInp) {
    const handler = () => {
      const num = parseNumber(salesInp.value);
      if (num) state.salesPrice[hIdx] = num;
      else delete state.salesPrice[hIdx];
      if (window.__db)
        window.__db.persistHouseField(hIdx, { sales_price: num || null });
      saveState();
      renderCostsForHouse(hIdx);
    };
    salesInp.addEventListener("blur", handler);
    salesInp.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        salesInp.blur();
      }
    });
    salesInp.addEventListener("focus", () =>
      setTimeout(() => salesInp.select(), 0),
    );
  }

  // Inline category-name editing
  document
    .querySelectorAll('#pane-costs [data-cost-edit="category"]')
    .forEach((span) => {
      span.addEventListener("blur", () => {
        const cs = +span.dataset.cs,
          ci = +span.dataset.ci;
        const v = span.textContent.trim();
        if (v) state.costSections[cs].items[ci] = v;
        else span.textContent = state.costSections[cs].items[ci];
        saveState();
      });
      span.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          span.blur();
        }
      });
    });

  // Remove category
  document
    .querySelectorAll('#pane-costs [data-cost-action="remove"]')
    .forEach((btn) => {
      btn.addEventListener("click", async () => {
        const cs = +btn.dataset.cs,
          ci = +btn.dataset.ci;
        const name = state.costSections[cs].items[ci];
        const isHouseSpecific =
          state.costSections[cs].itemHouseIds?.[ci] != null;
        const confirmMsg = isHouseSpecific
          ? `Remove house-specific cost item "${name}"?`
          : `Remove global cost item "${name}"? This will remove it from ALL houses.`;
        if (!confirm(confirmMsg)) return;
        if (window.__db) await window.__db.deleteCostItem(cs, ci);
        state.costSections[cs].items.splice(ci, 1);
        if (state.costSections[cs].itemHouseIds) {
          state.costSections[cs].itemHouseIds.splice(ci, 1);
        }
        Object.keys(state.costs).forEach((h) => {
          state.costs[h] = remapCostsByItem(state.costs[h], cs, ci);
          if (Object.keys(state.costs[h]).length === 0) delete state.costs[h];
        });
        saveState();
        renderCostsForHouse(hIdx);
      });
    });

  // Add category - new UI with global/house-specific toggle
  const addCostBtn = document.getElementById("add-cost-btn");
  const newCostInput = document.getElementById("new-cost-input");
  const houseSpecificCheckbox = document.getElementById(
    "new-cost-house-specific",
  );

  if (addCostBtn && newCostInput) {
    const doAdd = async () => {
      const v = newCostInput.value.trim();
      if (!v) return;

      const isHouseSpecific = houseSpecificCheckbox?.checked ?? true;
      const houseId = isHouseSpecific ? window.__houseIds?.[hIdx] : null;

      // Add to first cost section (or create structure if needed)
      const cs = 0;
      if (!state.costSections[cs]) {
        state.costSections[cs] = { name: "Costs", items: [], itemHouseIds: [] };
      }
      if (!state.costSections[cs].itemHouseIds) {
        state.costSections[cs].itemHouseIds = [];
      }

      state.costSections[cs].items.push(v);
      state.costSections[cs].itemHouseIds.push(houseId);

      if (window.__db) await window.__db.addCostItem(cs, v, houseId);
      saveState();
      renderCostsForHouse(hIdx);
    };

    addCostBtn.addEventListener("click", doAdd);
    newCostInput.addEventListener("keydown", async (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        await doAdd();
      }
    });
  }
}

function escapeHtml(s) {
  return String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
}

function waitForDbReady(maxMs = 15000) {
  return new Promise((resolve) => {
    if (window.__dbReady) {
      resolve(window.__dbReady);
      return;
    }
    const start = Date.now();
    const iv = setInterval(() => {
      if (window.__dbReady) {
        clearInterval(iv);
        resolve(window.__dbReady);
        return;
      }
      if (Date.now() - start > maxMs) {
        clearInterval(iv);
        resolve(Promise.resolve());
      }
    }, 50);
  });
}

waitForDbReady()
  .then((ready) => {
    return ready || Promise.resolve();
  })
  .then(() => {
    state = loadState();

    // If state is empty, try to use database state
    if (
      state.houses.length === 0 &&
      state.sections.length === 0 &&
      window.__dbState
    ) {
      state = {
        houses: window.__dbState.houses || [],
        sections: window.__dbState.sections || [],
        status: window.__dbState.status || {},
        notes: window.__dbState.notes || {},
        checkSource: window.__dbState.checkSource || {},
        slackEvidence: window.__dbState.slackEvidence || {},
        slackChannels: window.__dbState.slackChannels || {},
        driveSearchTokens: window.__dbState.driveSearchTokens || {},
        driveExcludedFiles: window.__dbState.driveExcludedFiles || {},
        costSections: window.__dbState.costSections || [],
        costs: window.__dbState.costs || {},
        lotCost: window.__dbState.lotCost || {},
        salesPrice: window.__dbState.salesPrice || {},
      };
    }

    renderTabs();
    renderChecklist();
    setActiveView("checklist");
  })
  .catch((err) => {
    // Fallback: try to render with localStorage state
    state = loadState();
    renderTabs();
    renderChecklist();
    setActiveView("checklist");
  });
