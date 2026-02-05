# Manual Run Override Implementation

## Problem Statement

When users manually triggered the Daily Digest or Weekly Analysis workflows through GitHub Actions UI (workflow_dispatch), the workflows would skip execution if data files already existed. This prevented users from forcing regeneration of AI analysis when needed, leaving messages like:

- "No AI-generated insights available yet. Check back after the analysis runs."
- "No analysis data available yet. Check back after the weekly analysis runs."

## Root Cause

Both workflows had existence checks that would skip processing if:
- **Daily Digest**: Today's digest file already existed locally
- **Weekly Analysis**: Current week's files already existed on the remote main branch

These checks didn't distinguish between scheduled runs (where skipping is desired to avoid duplicates) and manual runs (where users explicitly want to regenerate).

## Solution

Modified both workflows to detect manual runs using `github.event_name == 'workflow_dispatch'` and bypass the existence checks:

### Daily Digest Workflow Changes

**File**: `.github/workflows/daily-digest.yml`

Added conditional logic in the "Check if digest already exists" step:
```yaml
# Manual runs (workflow_dispatch) should always regenerate
if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
  echo "exists=false" >> $GITHUB_OUTPUT
  echo "🔄 Manual run detected - forcing regeneration"
elif [ -f "public/data/daily/${TODAY}.json" ]; then
  echo "exists=true" >> $GITHUB_OUTPUT
  echo "⚠️ Digest for $TODAY already exists. Skipping."
else
  echo "exists=false" >> $GITHUB_OUTPUT
fi
```

### Weekly Analysis Workflow Changes

**File**: `.github/workflows/weekly-analysis.yml`

Added conditional logic in the "Check for changes and prevent duplicates" step:
```yaml
# Manual runs (workflow_dispatch) should always process and commit
if [ "${{ github.event_name }}" == "workflow_dispatch" ]; then
  echo "DEBUG: Manual run detected - forcing processing and commit"
  # Skip the existence checks entirely for manual runs
  AGGREGATE_EXISTS=0
  ANALYSIS_EXISTS=0
  BRIEF_EXISTS=0
else
  # Check if this week's files already exist on the REMOTE main branch
  # ... existing logic ...
fi
```

## Behavior

### Manual Runs (workflow_dispatch)
- ✅ Always regenerate data files
- ✅ Always commit and push changes
- ✅ Always trigger deployment
- ✅ Override any existing files

### Scheduled Runs (cron schedule)
- ✅ Check for existing files
- ✅ Skip processing if already done
- ✅ Avoid duplicate commits
- ✅ Preserve existing behavior

## Testing

To test the implementation:

1. **Manual Daily Digest Run**:
   - Go to Actions → Daily Digest → Run workflow
   - Should see "🔄 Manual run detected - forcing regeneration" in logs
   - Should regenerate today's digest even if it already exists

2. **Manual Weekly Analysis Run**:
   - Go to Actions → Weekly Intelligence Analysis → Run workflow
   - Should see "DEBUG: Manual run detected - forcing processing and commit" in logs
   - Should regenerate current week's analysis and brief

3. **Scheduled Runs**:
   - Wait for automatic scheduled runs
   - Should see normal skip logic when files exist
   - Should not create duplicate commits

## Files Modified

- `.github/workflows/daily-digest.yml`
- `.github/workflows/weekly-analysis.yml`

## Security Review

✅ Code review completed - no issues found
✅ CodeQL security scan - no vulnerabilities detected

## Impact

- **No breaking changes**: Scheduled runs maintain existing behavior
- **Enhanced UX**: Users can now force regeneration when needed
- **Better debugging**: Clear log messages indicate when manual override is active
