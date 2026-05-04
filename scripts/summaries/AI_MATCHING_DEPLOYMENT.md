# AI-Powered Slack Matching - Deployment Guide

## Overview
The Slack integration has been upgraded from regex-based keyword matching to AI-powered semantic analysis using Claude Haiku. This provides intelligent detection of task completions and confirmations from Slack messages.

## What Changed

### 1. Database Migration
- Added `ai_confidence` column to `checklist_checks` table
- Stores Claude's confidence score (0.00-1.00) for each AI match

### 2. Edge Function (`slack-sync`)
- Replaced keyword matching with Claude API calls
- Batch processes all messages per house for efficiency
- Returns confidence scores for each match
- Only auto-checks items with confidence ≥ 0.75

### 3. Client-Side Updates
- UI now displays AI confidence scores in tooltips
- Example: "From Slack #519_farnum: 'Sewer permit approved!' (AI confidence: 95%)"

## Deployment Steps

### Step 1: Run Database Migration
In Supabase SQL Editor, run:
```sql
-- File: supabase/migrations/008_add_ai_confidence.sql
alter table checklist_checks 
add column if not exists ai_confidence decimal(3,2);

comment on column checklist_checks.ai_confidence is 'Confidence score from AI matching (0.00-1.00). NULL for manual checks.';
```

### Step 2: Add Claude API Key to Supabase
1. Go to Supabase Dashboard → Your Project
2. Settings → Edge Functions
3. Add secret:
   - Name: `CLAUDE_API_KEY`
   - Value: Your Claude API key (starts with `sk-ant-`)

### Step 3: Deploy Updated Edge Function
```bash
supabase functions deploy slack-sync
```

### Step 4: Verify Deployment
1. Click "Sync from Slack" button in the app
2. Check Supabase Function Logs for any errors
3. Verify that matched items show confidence scores in tooltips

## Cost Monitoring

### Expected Costs (Claude Haiku)
- **Per sync**: ~$0.0036
- **Daily (5 syncs)**: ~$0.018
- **Monthly**: ~$0.50
- **Yearly**: ~$6

### How to Monitor
1. Go to https://console.anthropic.com/settings/usage
2. Set up budget alerts (recommended: $5/month)
3. Monitor token usage in Supabase function logs

## How It Works

### Old System (Regex)
```
Slack messages → Tokenize → Keyword matching → Auto-check
```

### New System (AI)
```
Slack messages → Claude Haiku → Semantic analysis → Confidence scoring → Auto-check
```

### Prompt Strategy
The system sends Claude:
1. List of unchecked items for the house
2. Recent Slack messages (last 50)
3. Instructions to identify completions/confirmations
4. Request for structured JSON response with confidence scores

### Confidence Thresholds
- **0.9-1.0**: Explicit completion ("done", "finished", "completed")
- **0.75-0.89**: Strong implicit completion ("approved", "installed yesterday")
- **0.6-0.74**: Likely but ambiguous (not auto-checked)
- **Below 0.6**: Ignored

## Advantages Over Regex

✅ **Semantic understanding**: Detects variations like "done", "finished", "completed", "approved"  
✅ **Context awareness**: Understands negations ("not done", "waiting on")  
✅ **Handles questions**: Recognizes confirmations to questions  
✅ **No code changes**: Adapts to new phrasings automatically  
✅ **Audit trail**: Confidence scores provide transparency  
✅ **Minimal cost**: Haiku is extremely cheap (~$0.50/month)

## Troubleshooting

### Issue: "CLAUDE_API_KEY not configured"
**Solution**: Add the API key to Supabase Edge Function secrets (Step 2 above)

### Issue: No matches found
**Possible causes**:
1. Messages don't clearly indicate completion
2. Item names don't match Slack message content
3. Confidence threshold too high

**Solution**: Check Supabase function logs to see Claude's raw response

### Issue: Too many false positives
**Solution**: Increase confidence threshold in Edge Function:
```typescript
// Change line 234 from:
if (match.confidence >= 0.75) {
// To:
if (match.confidence >= 0.85) {
```

### Issue: High API costs
**Possible causes**:
1. Syncing too frequently
2. Too many messages per channel
3. Too many unchecked items

**Solution**: 
- Reduce sync frequency
- Limit message history to 25 instead of 50
- Check items manually to reduce batch size

## Testing

### Test with Sample Messages
1. Post in Slack: "Sewer permit is done"
2. Click "Sync from Slack"
3. Verify item is auto-checked with confidence score

### View Claude's Analysis
Check Supabase function logs to see:
- Input prompt sent to Claude
- Claude's JSON response
- Matched items and confidence scores

## Rollback Plan

If issues arise, you can revert to the old regex system:

1. Restore previous version of `slack-sync/index.ts` from git
2. Redeploy: `supabase functions deploy slack-sync`
3. The `ai_confidence` column will remain but won't be populated

## Support

- **Claude API Docs**: https://docs.anthropic.com/
- **Supabase Edge Functions**: https://supabase.com/docs/guides/functions
- **Cost Calculator**: https://console.anthropic.com/settings/cost-estimator
