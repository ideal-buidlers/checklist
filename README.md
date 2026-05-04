# Ideal Builders — House Build Checklist

A self-contained construction-tracking dashboard for managing builds across multiple houses.

## What's in this package

- **Next.js frontend** (`app/`) — React pages with server-side rendering
- **Supabase backend** — PostgreSQL database + Edge Functions for Slack sync and Google Drive integration
- **Google OAuth** — Secure token storage for Drive access
- **Slack integration** — Auto-sync checklist items from Slack messages with AI matching (Claude Haiku)

## What it does

- **Checklist tab** — every house is a column, every construction task is a row. Check tasks off manually or let the Slack auto-sync do it for you. Notes can be attached to any task. Houses, sections, and items are all editable inline.
- **Summary tab** — one card per house with a progress bar, a list of notes (with delete buttons), and linked Google Drive documents for that house.
- **Costs tab (one per house)** — full Estimate vs Paid breakdown by category, plus Lot cost, Sales Price, and an auto-calculated Profit. Categories are shared across houses and editable inline.

## Integrations

- **Slack sync** — Reads messages from configured Slack channels (one per house), uses Claude AI to match messages to checklist items, auto-marks items, and downloads file attachments to Google Drive
- **Google Drive** — Stores house documents in organized folders, auto-creates folders per house, tracks uploaded files to prevent duplicates
- **Supabase** — PostgreSQL database for persistent state, Edge Functions for Slack/Drive operations, Google OAuth token storage

All data syncs to Supabase in real-time. The frontend also caches state in browser localStorage for offline access.

## For AI assistants (Claude, Cascade, etc.)

This section is written for AI coding assistants helping a non-technical user make changes to this project. **Follow these instructions exactly when the user asks you to deploy, push, or publish changes.**

### How this project is deployed

- **Frontend**: Hosted on **Vercel**. Pushing to the `main` branch on GitHub automatically triggers a new deployment. There is no manual deploy step.
- **Edge Functions**: Hosted on **Supabase**. These must be deployed separately using the Supabase CLI.
- **Database**: Hosted on **Supabase**. Schema changes are applied via SQL migrations.

### When the user says "push this to the site" or "deploy this"

Run these commands in order. Always pull first to avoid conflicts:

```bash
# Step 1: Pull latest changes from GitHub
git pull origin main

# Step 2: Stage all changed files
git add -A

# Step 3: Commit with a descriptive message
git commit -m "Brief description of what changed"

# Step 4: Push to GitHub (this auto-deploys to Vercel)
git push origin main
```

If there are merge conflicts after `git pull`, resolve them before committing. If you're unsure, ask the user.

### If Edge Functions were changed

Edge Functions live in `supabase/functions/`. If any files in that directory were modified, **also** deploy them after pushing.

**If you don't have a Supabase session**, run this first:

```bash
supabase login
```

Then follow the browser prompt to authenticate. After that, deploy the functions:

```bash
# Deploy a specific function (replace function-name)
supabase functions deploy function-name

# Common functions in this project:
supabase functions deploy slack-sync
supabase functions deploy manage-drive-folders
```

If the login fails or you see "not authenticated", ask the user for their Supabase project URL and personal access token, then run:

```bash
supabase login --token YOUR_TOKEN
```

### If database migrations were added

Migration files live in `supabase/migrations/`. If a new migration was added, run it in the Supabase SQL Editor (Dashboard → SQL Editor → paste the migration SQL and run it).

### Environment variables

The frontend needs these set in **Vercel** (Settings → Environment Variables):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `SUPABASE_SERVICE_ROLE_KEY`

Edge Functions need secrets set via **Supabase CLI**:

- `supabase secrets set SLACK_BOT_TOKEN=...`
- `supabase secrets set CLAUDE_API_KEY=...`
- `supabase secrets set SB_PROJECT_URL=...`
- `supabase secrets set SB_SERVICE_KEY=...`

### Project structure (quick reference)

| Path                   | What it is                                              |
| ---------------------- | ------------------------------------------------------- |
| `app/`                 | Next.js pages and layout (the website)                  |
| `public/app-logic.js`  | Main client-side JavaScript (checklist, summary, costs) |
| `app/globals.css`      | All styling                                             |
| `supabase/functions/`  | Supabase Edge Functions (Slack sync, Drive management)  |
| `supabase/migrations/` | Database schema changes                                 |
| `scripts/`             | One-off utility scripts                                 |

### Common tasks

| User says                      | What to do                                                                |
| ------------------------------ | ------------------------------------------------------------------------- |
| "Push this to the site"        | `git pull`, `git add -A`, `git commit`, `git push origin main`            |
| "Deploy the Slack function"    | `supabase functions deploy slack-sync`                                    |
| "Deploy the Drive function"    | `supabase functions deploy manage-drive-folders`                          |
| "Run a migration"              | Copy SQL from `supabase/migrations/` → paste in Supabase SQL Editor → Run |
| "Something broke after deploy" | Check Vercel deployment logs and Supabase function logs                   |

## To run locally

1. Install dependencies: `npm install`
2. Set up environment variables in `.env.local` (copy from `.env.local.example`)
3. Start the dev server: `npm run dev`
4. Open `http://localhost:3000` in your browser

State is stored in Supabase (if connected) and also cached in browser localStorage for offline access.

## To build for production

```bash
npm run build
npm start
```

This is automatically done by Vercel when you push to the `main` branch.
