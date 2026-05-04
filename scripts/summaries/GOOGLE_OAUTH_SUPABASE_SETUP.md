# Google OAuth + Supabase Integration Setup

## Overview

Google OAuth is now decoupled from the login flow. It's a standalone process that can be triggered independently via a URL. Refresh tokens are stored in Supabase for use in Edge Functions.

## Prerequisites

1. Google Cloud OAuth credentials (Client ID and Secret)
2. Supabase project with service role key
3. Environment variables configured

## Environment Variables

Add these to your `.env.local`:

```
# Google OAuth
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

**Important:** `SUPABASE_SERVICE_ROLE_KEY` is a server-side only variable. Never expose it to the client.

## Setup Steps

### 1. Create the Supabase Table

Run the migration to create the `google_tokens` table:

```bash
supabase migration up
```

Or manually execute the SQL from `supabase/migrations/006_create_google_tokens.sql` in your Supabase dashboard.

The table structure:
- `id` (bigint, primary key) - Always set to 1 for single token storage
- `refresh_token` (text) - Google refresh token
- `access_token` (text) - Current access token
- `expires_at` (timestamp) - When the access token expires
- `updated_at` (timestamp) - Last update time

### 2. Configure Google Cloud Console

1. Go to **APIs & Services** → **OAuth consent screen**
2. Add scopes:
   - `https://www.googleapis.com/auth/drive`
   - `https://www.googleapis.com/auth/gmail.readonly`
   - `https://www.googleapis.com/auth/userinfo.email`
   - `https://www.googleapis.com/auth/userinfo.profile`

3. Go to **Credentials** and verify your OAuth 2.0 Client:
   - **Authorized JavaScript origins**:
     - `http://localhost:3000` (dev)
     - `https://your-vercel-domain.vercel.app` (production)
   - **Authorized redirect URIs**:
     - `http://localhost:3000/api/auth/callback/google` (dev)
     - `https://your-vercel-domain.vercel.app/api/auth/callback/google` (production)

4. Enable required APIs:
   - Google Drive API
   - Gmail API

### 3. Test Locally

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Trigger OAuth by visiting:
   ```
   http://localhost:3000/api/auth/google
   ```

3. Complete the Google consent screen

4. You'll be redirected back with `?google_auth=success` in the URL

5. Check Supabase to verify the tokens were stored in the `google_tokens` table

## How It Works

### OAuth Flow

1. User visits `/api/auth/google`
2. Redirected to Google's consent screen
3. User grants permissions
4. Google redirects to `/api/auth/callback/google` with authorization code
5. Your app exchanges code for tokens
6. Tokens are stored in Supabase `google_tokens` table
7. User is redirected back to dashboard with `?google_auth=success`

### Using Tokens in Edge Functions

To access the refresh token in an Edge Function:

```javascript
import { createClient } from "@supabase/supabase-js";

export async function getGoogleTokens() {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
  );

  const { data, error } = await supabase
    .from("google_tokens")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) throw error;
  return data;
}
```

## Refreshing Access Tokens

When the access token expires, use the refresh token to get a new one:

```javascript
async function refreshAccessToken(refreshToken) {
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }).toString(),
  });

  const tokens = await response.json();
  
  // Update the access token in Supabase
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  await supabase
    .from("google_tokens")
    .update({
      access_token: tokens.access_token,
      expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
    })
    .eq("id", 1);

  return tokens.access_token;
}
```

## Deployment to Vercel

1. Add environment variables to Vercel project settings:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `NEXT_PUBLIC_APP_URL` (your Vercel domain)
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Update Google Cloud Console with your Vercel domain

3. Deploy:
   ```bash
   git push
   ```

## Troubleshooting

**"No refresh token received"**
- Ensure `access_type=offline` and `prompt=consent` are in the OAuth request
- Clear browser cookies and try again

**"Failed to store tokens in Supabase"**
- Verify `SUPABASE_SERVICE_ROLE_KEY` is set correctly
- Check that the `google_tokens` table exists
- Verify RLS policies allow service role access

**"Invalid redirect URI"**
- Ensure the redirect URI matches exactly in Google Cloud Console
- Check for trailing slashes and protocol (http vs https)

## Files Modified/Created

- ✅ `/app/api/auth/google/route.js` - OAuth initiation
- ✅ `/app/api/auth/callback/google/route.js` - OAuth callback (now stores in Supabase)
- ✅ `/app/auth.js` - Simplified (removed Google prompt logic)
- ✅ `/app/login/page.js` - Simplified (password login only)
- ✅ `/supabase/migrations/006_create_google_tokens.sql` - Database table
