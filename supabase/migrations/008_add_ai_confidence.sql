-- Add AI confidence column to checklist_checks
alter table checklist_checks 
add column if not exists ai_confidence decimal(3,2);

-- Add comment for documentation
comment on column checklist_checks.ai_confidence is 'Confidence score from AI matching (0.00-1.00). NULL for manual checks.';
