-- Add sort_order column to checklist_checks table
ALTER TABLE checklist_checks ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Create index for efficient sorting
CREATE INDEX idx_checklist_checks_sort_order ON checklist_checks(house_id, sort_order);
