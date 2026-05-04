# Drive Cleanup Script

## Purpose

One-time script to delete files from Google Drive that don't contain "final" in their name. This cleans up files that were uploaded before the "final" filter was added to the Slack sync.

## Setup

### 1. Install Python dependencies

```bash
pip install google-auth google-auth-httplib2 google-api-python-client requests
```

### 2. Set environment variables

The script uses your existing Google OAuth tokens from Supabase (no separate OAuth setup needed!):

```bash
export SUPABASE_URL="https://your-project.supabase.co"
export SUPABASE_SERVICE_KEY="your-service-role-key"
```

Find these in Supabase Dashboard → Settings → API

### 3. Run the script

**Preview what would be deleted (safe):**

```bash
cd scripts
python cleanup_drive_files.py --dry-run
```

**Actually delete files:**

```bash
python cleanup_drive_files.py
```

**Delete files only in a specific folder:**

```bash
python cleanup_drive_files.py --folder-id YOUR_FOLDER_ID
```

## How it works

1. Authenticates with Google Drive using OAuth
2. Scans all files (or files in a specific folder)
3. Identifies files that don't contain "final" (case-insensitive) in their name
4. Shows you a list of files to be deleted
5. Asks for confirmation before deleting
6. Deletes the files

## Safety features

- **Dry run mode**: Preview files without deleting
- **Confirmation prompt**: Requires typing "yes" to proceed
- **Excludes folders**: Only deletes files, not folders
- **Skips trashed files**: Won't delete files already in trash

## Examples

Files that will be **deleted**:

- ❌ `blueprint_draft.pdf`
- ❌ `plans_v1.dwg`
- ❌ `design.jpg`

Files that will be **kept**:

- ✅ `blueprint_final.pdf`
- ✅ `Final_Design.jpg`
- ✅ `plans-FINAL-v2.dwg`

## Troubleshooting

**"Missing environment variables"**

- Make sure you've set `SUPABASE_URL` and `SUPABASE_SERVICE_KEY`
- Check they're exported in your current terminal session

**"No Google tokens found in Supabase"**

- Make sure you've connected your Google account in the web app first
- Check the `google_tokens` table in Supabase has a record

**"Module not found"**

- Install the required packages: `pip install google-auth google-auth-httplib2 google-api-python-client requests`

## After running

Once you've cleaned up the files, you can delete the script itself (it's a one-time cleanup).

The script uses your existing Supabase tokens, so no cleanup of credential files needed!
