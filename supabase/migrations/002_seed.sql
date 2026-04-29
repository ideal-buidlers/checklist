-- =============================================
-- Seed: Houses
-- =============================================
insert into houses (name, slack_channel, sort_order) values
  ('519 E Farnum',   '519_farnum',    0),
  ('627 Forest',     '627_forest',    1),
  ('1825 Northwood', '1825_northwood',2),
  ('3532 Linwood',   '3532_linwood',  3),
  ('4613 Tonawonda', '4613_tonawonda',4),
  ('1013 Woodsboro', '1013_woodsboro',5)
on conflict do nothing;

-- =============================================
-- Seed: Checklist sections + items
-- =============================================

-- Section 1
with s as (
  insert into checklist_sections (name, sort_order) values ('Pre-Work / Permits', 0)
  returning id
)
insert into checklist_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Retire Gas (add w.o) to existing house', 0),
  ('Retire Water to existing house (paid)', 1),
  ('Retire Electric (add w.o)', 2),
  ('Protect Right a Way Tree - Bham', 3),
  ('Apply for Sewer Cap Permit', 4),
  ('Apply and pay for Water stop box', 5),
  ('Pay for new water service', 6),
  ('Apply for Gas Permit', 7),
  ('Install temp electric on pole', 8),
  ('Apply for Construction Fence Permit', 9),
  ('Fence Insp. Ch on swing of gate', 10),
  ('Letter of Intent - Bham', 11),
  ('Demo Permit', 12),
  ('Asbestos Survey', 13),
  ('Asbestos Removal (if applicable)', 14),
  ('Put Dust Sign on Fence (RO)', 15),
  ('Put Address on Fence', 16),
  ('Pest Review & Submit Letter (RO)', 17),
  ('Birmingham Neighbor Letter', 18),
  ('Add in attic insulation after drywall', 19),
  ('Insulation Certificate (Bham)', 20),
  ('Take out building permit', 21),
  ('Install Temp Fence', 22)
) as v(name, ord);

-- Section 2
with s as (
  insert into checklist_sections (name, sort_order) values ('Soil Erosion & Demo', 1)
  returning id
)
insert into checklist_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Install Soil Erosion/Silt Fence', 0),
  ('Order Port a potty', 1),
  ('Receive Clearance for Electric for Demo', 2),
  ('Receive Clearance for Gas for Demo', 3),
  ('Receive Building Permit', 4),
  ('Survey Lot', 5),
  ('Send Build. Survey & Lot Survey to City', 6),
  ('Demo House', 7),
  ('Excavate', 8),
  ('Open hole inspection (Bham) after house is demo', 9)
) as v(name, ord);

-- Section 3
with s as (
  insert into checklist_sections (name, sort_order) values ('Sewer', 2)
  returning id
)
insert into checklist_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Scope Sewer', 0)
) as v(name, ord);

-- Section 4
with s as (
  insert into checklist_sections (name, sort_order) values ('Foundation & Rough', 3)
  returning id
)
insert into checklist_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Put Footing In', 0),
  ('Pin Footing', 1),
  ('Footing Inspection', 2),
  ('Put Rod in Basement', 3),
  ('Pour Basement Walls', 4),
  ('Brace Basement Walls', 5),
  ('Final Electrical Meter Box (walls have to be up)', 6),
  ('Basement Inspection', 7),
  ('Backfill', 8),
  ('Clear path for gasline (take pic facing street)', 9),
  ('Order 1x3 for driveway', 10),
  ('Backfill Inspection', 11),
  ('Trench Garage', 12),
  ('Make Sure Porch is 4'' Higher', 13),
  ('Order Steel', 14),
  ('Rough Carpentry', 15),
  ('Get Basement Ready for Plumbing', 16),
  ('Order Peastone', 17),
  ('Call Inspection for Plumbing', 18),
  ('Call Inspection for Peagravel', 19),
  ('Order Trusses', 20),
  ('Order Shingles', 21),
  ('Call rough heater for roof penetration (24h before shingles install)', 22),
  ('Order Windows', 23),
  ('Order Front, Side Doors', 24),
  ('Order Siding', 25),
  ('Order Rough Plumbing Material', 26),
  ('Sil Plate Inspection', 27),
  ('Frame', 28),
  ('Install Mechanical', 29),
  ('Mechanical Inspection', 30),
  ('Rough Heat Fireplace', 31),
  ('Heat Inspection', 32),
  ('Fireplace Inspection', 33),
  ('Rough Plumbing', 34),
  ('Rough Plumbing Inspection', 35),
  ('Rough Electrical', 36),
  ('Rough Electrical Inspection', 37),
  ('Remove Temp Electrical', 38),
  ('Order Rough Building Lumber', 39),
  ('Get Truss and Window Specs', 40),
  ('Rough Building', 41),
  ('Install Siding', 42),
  ('Installed Stop Box', 43),
  ('Order Cabinets', 44),
  ('Rough Building Inspection', 45),
  ('Paint Exterior', 46),
  ('Gutters', 47),
  ('Open Ceiling Inspection (Porch)', 48),
  ('Order Garage Doors', 49),
  ('Pour Basement Floors', 50),
  ('Come Back and Rough Basement', 51),
  ('Rough Elec Upstairs/Basement', 52),
  ('Rough Heat Upstairs/Basement', 53),
  ('Rough Plumbing Upstairs/Basement', 54),
  ('Rough Fireplace', 55),
  ('Insulate', 56),
  ('Measure Finish Lumber', 57),
  ('Permanent Electric', 58),
  ('Insulate Inspection', 59),
  ('Drywall', 60),
  ('Order Fixtures', 61),
  ('Order Exterior Stone', 62),
  ('Ductwork', 63),
  ('Measure/Order Trim', 64),
  ('Order Appliances', 65),
  ('Order Carpet', 66),
  ('Order Wood Floor Material', 67),
  ('Prime Interior', 68)
) as v(name, ord);

-- Section 5
with s as (
  insert into checklist_sections (name, sort_order) values ('Cabinets & Stone', 4)
  returning id
)
insert into checklist_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Receive Cabinets', 0),
  ('Install Cabinets', 1),
  ('Measure/Order Quartz', 2),
  ('Spot the House', 3),
  ('Install Stone', 4),
  ('Wall Registers', 5),
  ('Measure/Order Ceramic Material', 6)
) as v(name, ord);

-- Section 6
with s as (
  insert into checklist_sections (name, sort_order) values ('Finishing & Final', 5)
  returning id
)
insert into checklist_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Install Ceramic', 0),
  ('Order Shower Door', 1),
  ('Caulk', 2),
  ('Grade Exterior', 3),
  ('Paint Interior', 4),
  ('Order Cabinet Knobs', 5),
  ('Order Door Knobs', 6),
  ('Order Exterior Cement', 7),
  ('Install Carpet', 8),
  ('Install Wood Floor', 9),
  ('Screw Floors', 10),
  ('Install Shower Door', 11),
  ('Final Grade', 12),
  ('Install Appliances', 13),
  ('Install Sprinkler', 14),
  ('Grass', 15),
  ('Install Screens', 16),
  ('Order Street Tree - RO', 17),
  ('Blower Door Test', 18),
  ('Final Electric', 19),
  ('Final Heat', 20),
  ('Final Plumbing', 21),
  ('Final Mechanical/Fireplace', 22),
  ('Survey As built', 23),
  ('Final Building Inspection', 24),
  ('Clean windows', 25),
  ('BUILDER TO DO', 26),
  ('Order the plans from Architect', 27)
) as v(name, ord);

-- =============================================
-- Seed: Cost sections + items
-- =============================================

with s as (
  insert into cost_sections (name, sort_order) values ('Permits & Pre-Construction', 0)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Architect / Plans', 0), ('Building Permit', 1), ('Demo Permit', 2),
  ('Asbestos Survey', 3), ('Asbestos Removal', 4), ('Survey - Lot', 5),
  ('Survey - As Built', 6), ('Insulation Certificate', 7), ('Birmingham Pest Review', 8),
  ('Sewer Cap Permit', 9), ('Water Stop Box Permit', 10), ('Gas Permit', 11),
  ('Construction Fence Permit', 12)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Utility Retirement & Service', 1)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Retire Gas', 0), ('Retire Water', 1), ('Retire Electric', 2),
  ('Temp Electric (Pole)', 3), ('Permanent Electric', 4),
  ('New Water Service', 5), ('Stop Box Install', 6), ('Gas Service', 7)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Site Prep & Demo', 2)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Soil Erosion / Silt Fence', 0), ('Construction Fence', 1), ('Port-a-Potty', 2),
  ('Tree Protection (RoW)', 3), ('Dust / Address Sign', 4), ('Demo', 5),
  ('Excavation', 6), ('Backfill', 7), ('Driveway 1x3 Stone', 8), ('Final Grade', 9)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Foundation', 3)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Footings', 0), ('Foundation Walls', 1), ('Wall Bracing', 2),
  ('Basement Floor', 3), ('Garage Trench', 4), ('Peastone', 5)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Framing & Rough Build', 4)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Rough Lumber', 0), ('Trusses', 1), ('Steel Beams', 2),
  ('Framing Labor', 3), ('Sheathing', 4), ('Sil Plate', 5), ('Rough Building', 6)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Exterior', 5)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Shingles', 0), ('Roofing Labor', 1), ('Siding Material', 2), ('Siding Labor', 3),
  ('Windows', 4), ('Front Door', 5), ('Side / Rear Doors', 6), ('Garage Doors', 7),
  ('Stone (Exterior)', 8), ('Gutters', 9), ('Exterior Paint', 10),
  ('Exterior Cement', 11), ('Screens', 12)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Mechanicals - Rough', 6)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Plumbing Rough', 0), ('Plumbing Material', 1), ('Electrical Rough', 2),
  ('HVAC Rough', 3), ('HVAC Ductwork', 4), ('Fireplace Rough', 5), ('Fireplace Unit', 6)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Mechanicals - Finish', 7)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Plumbing Finish', 0), ('Plumbing Fixtures', 1), ('Electrical Finish', 2),
  ('Electrical Fixtures', 3), ('HVAC Finish', 4)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Interior Finish', 8)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Insulation', 0), ('Attic Insulation', 1), ('Drywall', 2), ('Drywall Materials', 3),
  ('Prime Interior', 4), ('Interior Paint', 5), ('Trim / Finish Carpentry', 6),
  ('Finish Lumber', 7), ('Cabinets', 8), ('Cabinet Knobs', 9), ('Quartz / Countertops', 10),
  ('Ceramic Tile (Material)', 11), ('Ceramic Tile (Labor)', 12),
  ('Wood Floor Material', 13), ('Wood Floor Labor', 14), ('Carpet', 15),
  ('Door Knobs', 16), ('Shower Door', 17), ('Caulk', 18), ('Wall Registers', 19)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Appliances & Final', 9)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Appliances', 0), ('Sprinkler System', 1), ('Sod / Grass', 2),
  ('Street Tree', 3), ('Window Cleaning', 4), ('Final Clean', 5)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Inspections & Testing', 10)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Blower Door Test', 0), ('Inspection Fees', 1)
) as v(name, ord);

with s as (
  insert into cost_sections (name, sort_order) values ('Soft Costs / Other', 11)
  returning id
)
insert into cost_items (section_id, name, sort_order) select s.id, v.name, v.ord from s,
(values
  ('Builder Fee / Overhead', 0), ('Contingency', 1), ('Marketing / Sale', 2),
  ('Realtor Fees', 3), ('Closing Costs', 4), ('Title / Legal', 5)
) as v(name, ord);
