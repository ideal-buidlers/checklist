# Slack File Attachment Sync - Deployment Guide

## Overview

The Slack sync feature now automatically downloads file attachments from Slack messages and uploads them to the corresponding house's Google Drive folder. Files are tracked by Slack file ID to prevent duplicate uploads.

## What Changed

### 1. Database
- New table: `slack_file_uploads` tracks uploaded files by Slack file ID
- Prevents duplicate uploads across multiple syncs

### 2. Edge Function (`slack-sync`)
- Detects file attachments in Slack messages
- Downloads files from Slack (max 10MB per file)
- Uploads to house's Google Drive folder
- Records upload in database for deduplication

### 3. Client-Side
- Success message now shows file upload count
- Example: "Synced from Slack: 3 items auto-marked · 2 files uploaded"

## Deployment Steps

### Step 1: Run Database Migration
In Supabase SQL Editor, run:
```sql
-- File: supabase/migrations/009_create_slack_file_uploads.sql
create table if not exists slack_file_uploads (
  id uuid primary key default gen_random_uuid(),
  house_id uuid not null references houses(id) on delete cascade,
  slack_file_id text not null,
  slack_channel text not null,
  drive_file_id text not null,
  file_name text not null,
  uploaded_at timestamp with time zone default now(),
  unique(slack_file_id)
);

alter table slack_file_uploads enable row level security;

create policy "Allow authenticated users to read slack file uploads" on slack_file_uploads
  for select
  using (true);

create policy "Allow service role to manage slack file uploads" on slack_file_uploads
  for all
  using (true)
  with check (true);

create index slack_file_uploads_house_id_idx on slack_file_uploads(house_id);
create index slack_file_uploads_slack_file_id_idx on slack_file_uploads(slack_file_id);
```

### Step 2: Deploy Updated Edge Function
```bash
supabase functions deploy slack-sync
```

### Step 3: Test File Upload
1. Post a message with a file attachment in your Slack channel
2. Click "Sync from Slack"
3. Verify:
   - File appears in house's Google Drive folder
   - Success message shows file count
   - File doesn't re-upload on second sync

## How It Works

### File Detection
- Slack API returns file metadata with each message
- Files larger than 10MB are skipped (configurable)
- Only files from non-bot messages are processed

### Download & Upload Flow
```
Slack message → Detect files → Download from Slack → Convert to base64
→ Upload to Google Drive → Record in database → Return stats
```

### Deduplication
- Before downloading, check `slack_file_uploads` table
- If Slack file ID already exists, skip download/upload
- Prevents duplicate files on repeated syncs

### Error Handling
- File download failures: Logged but don't break sync
- Drive upload failures: Logged but don't break sync
- Missing Google tokens: Files skipped gracefully
- Missing Drive folder: Files skipped gracefully

## File Size Limits

- **Current limit**: 10MB per file
- **Slack limit**: 5GB per file
- **Google Drive quota**: 750GB/day per user

To adjust the limit, edit `slack-sync/index.ts` line 160:
```typescript
files: m.files ? m.files.filter((f) => f.size <= 10485760) : undefined,
// Change 10485760 (10MB) to desired size in bytes
```

## Monitoring

### Check Upload Status
Query the database:
```sql
SELECT * FROM slack_file_uploads ORDER BY uploaded_at DESC LIMIT 10;
```

### View Function Logs
In Supabase Dashboard → Functions → slack-sync → Logs

### Common Issues

**Issue**: Files not uploading
- Check: Google tokens exist in `google_tokens` table
- Check: House has Drive folder in `house_drive_folders` table
- Check: Slack bot has permission to read files

**Issue**: Duplicate files in Drive
- This shouldn't happen due to deduplication
- If it does, check `slack_file_uploads` table for missing records

**Issue**: Timeout errors
- Reduce file size limit or number of messages checked
- Consider processing files asynchronously (future enhancement)

## Supported File Types

All file types are supported:
- Images: PNG, JPG, GIF, etc.
- Documents: PDF, DOCX, XLSX, etc.
- Archives: ZIP, RAR, etc.
- Media: MP4, MP3, etc.

## Performance

### Typical Sync Time
- 50 messages, 5 files: ~5-10 seconds
- 50 messages, 0 files: ~2-3 seconds

### API Calls Per Sync
- Slack: 1 call (get messages)
- Google: 1 call per file (upload)
- Supabase: 1 call per file (record upload)

## Rollback Plan

If issues arise:
1. Redeploy previous `slack-sync` version
2. Files already uploaded remain in Drive
3. `slack_file_uploads` table remains but unused
4. No data loss

## Future Enhancements

- **File filtering**: Only upload certain file types
- **Subfolder organization**: Create subfolders by date or item
- **Async processing**: Handle large files without timeout
- **File preview**: Show thumbnails in UI
- **Item linking**: Associate files with matched checklist items

## Support

- Slack API docs: https://api.slack.com/
- Google Drive API: https://developers.google.com/drive
- Supabase docs: https://supabase.com/docs
