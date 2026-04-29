alter table checklist_checks
  add column if not exists status text
    check (status in ('done', 'called', 'ordered'));

update checklist_checks set status = 'done' where checked = true and status is null;
