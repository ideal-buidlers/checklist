-- =============================================
-- Allow anon role to access all tables
-- Since we're using simple password auth instead of Supabase auth,
-- we need to allow the anon key to read/write data
-- =============================================

-- Houses
create policy "anon full access" on houses for all using (true);

-- Checklist sections
create policy "anon full access" on checklist_sections for all using (true);

-- Checklist items
create policy "anon full access" on checklist_items for all using (true);

-- Checklist checks
create policy "anon full access" on checklist_checks for all using (true);

-- Cost sections
create policy "anon full access" on cost_sections for all using (true);

-- Cost items
create policy "anon full access" on cost_items for all using (true);

-- Cost entries
create policy "anon full access" on cost_entries for all using (true);

-- Drive excluded files
create policy "anon full access" on drive_excluded_files for all using (true);
