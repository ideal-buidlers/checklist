-- Add sort_order column to checklist_items table to track item ordering
ALTER TABLE checklist_items ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Create index for efficient sorting
CREATE INDEX idx_checklist_items_sort_order ON checklist_items(sort_order);
