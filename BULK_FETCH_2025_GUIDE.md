# Bulk 2025 Articles Fetch Guide

## Overview

This guide explains how to use the bulk fetch functionality to collect historical cybersecurity articles from 2025. The goal is to accumulate approximately 40-50,000 articles from 2025 to provide comprehensive threat intelligence coverage for the entire year.

**Important:** This is a **one-time backfill operation** to collect historical 2025 data. After this bulk fetch is complete, the regular `fetch-inoreader.js` script will continue to run on schedule and will naturally fetch current 2026 articles (and any late-arriving 2025 articles). No changes to the regular fetch process are needed.

## Current Status

Check the current article count by running:
```bash
cat data/incidents-2025.json | jq 'length'
```

As of the initial implementation, the repository had approximately 1,000 articles from 2025.

- **Target:** 40,000-50,000 articles

## How It Works

The bulk fetch system uses Inoreader's API with pagination to fetch historical articles. Unlike regular RSS feeds that only provide the most recent 50-100 articles, the Inoreader API can paginate through older articles using continuation tokens or time-based pagination.

### Key Features

1. **Pagination Support:** Uses continuation tokens when available, falls back to time-based pagination (`ot` parameter) to fetch thousands of historical articles
2. **Time-Based Pagination:** When continuation tokens aren't available, uses the oldest timestamp from each page to request older articles
3. **Year Filtering:** Only fetches articles published in 2025
4. **Deduplication:** Skips articles that already exist in the database
5. **Automatic Stopping:** Stops when reaching articles before 2025 or when no more articles are available
6. **Rate Limiting:** Respectful delays between requests to avoid overwhelming the API
7. **Progress Tracking:** Shows real-time progress toward the target

## Methods to Fetch Articles

### Method 1: GitHub Actions Workflow (Recommended)

The easiest way is to use the automated GitHub Actions workflow:

1. Go to your repository on GitHub
2. Click the **Actions** tab
3. Select **"Fetch 2025 Articles (Bulk)"** workflow
4. Click **"Run workflow"** button
5. Configure options:
   - **max_iterations:** How many pages to fetch per feed (default: 100)
   - **dry_run:** Set to `true` to test without saving changes
6. Click **"Run workflow"**

The workflow will:
- Fetch articles from all configured Inoreader feeds
- Use pagination to go back through historical articles
- Stop at articles before 2025
- Automatically commit and push new articles

**Typical runtime:** 30-120 minutes depending on the number of articles found

### Method 2: Local Execution

You can also run the bulk fetch script locally:

```bash
# Test with dry run first
npm run fetch-2025-bulk -- --dry-run --max-iterations=10

# Run actual fetch (be patient, this takes time)
npm run fetch-2025-bulk -- --max-iterations=100

# Custom target
npm run fetch-2025-bulk -- --max-iterations=50
```

**Note:** Local execution requires internet access and valid Inoreader feeds.

## Configuration

### RSS Feeds Config

**File:** `config/rss-feeds-config.json`

The `maxItemsPerFeed` has been increased to 500 to allow fetching more historical data when RSS feeds support it.

```json
{
  "maxItemsPerFeed": 500,
  "feeds": [...]
}
```

### Inoreader Config

**File:** `config/inoreader-config.json`

The Inoreader configuration already supports 500 items per request:

```json
{
  "maxItemsPerFeed": 500,
  "feeds": [...]
}
```

## Understanding the Output

During execution, you'll see output like:

```
📡 Processing feed with pagination: Cyber

  📄 Page 1/100
     Starting from most recent articles
  📥 Received 1000 items from feed
  ✅ Page results: 0 new 2025 articles, 0 duplicates, 1000 outside 2025
  📅 Oldest article in this page: 2026-01-12
  ➡️  No continuation token, using time-based pagination (ot=2026-01-12)

  📄 Page 2/100
     Older than: 2026-01-12 (timestamp: 1736640000)
  📥 Received 1000 items from feed
  ✅ Page results: 856 new 2025 articles, 144 duplicates, 0 outside 2025
  📅 Oldest article in this page: 2025-11-15
  ➡️  No continuation token, using time-based pagination (ot=2025-11-15)

  📄 Page 3/100
     Older than: 2025-11-15 (timestamp: 1731628800)
  📥 Received 1000 items from feed
  ✅ Page results: 723 new 2025 articles, 203 duplicates, 74 outside 2025
  📅 Oldest article in this page: 2025-08-22
  ...

  📊 Feed summary:
     Total pages fetched: 15
     Total items fetched: 15000
     New 2025 articles: 8342

📈 Progress: 9405 / 45000 articles
```

### Key Indicators

- **Starting from most recent articles:** First page fetches the newest items
- **Older than: DATE (timestamp: ...):** Using time-based pagination to go back in time
- **New 2025 articles:** Articles from 2025 that weren't already in the database
- **Duplicates:** Articles that already exist (skipped)
- **Outside 2025:** Articles from 2024 or 2026 (skipped)
- **Oldest article in this page:** The oldest article date in the current page
- **Progress:** Current total / Target

### Pagination Methods

The script uses two pagination methods:

1. **Continuation tokens** (preferred): When the API provides a continuation token, it's used for the next request
2. **Time-based pagination** (fallback): When no continuation token is available, the script uses the `ot` (older than) parameter with the oldest timestamp from the current page to request older articles

### When Does It Stop?

The script stops fetching when:
1. Target article count is reached (45,000 by default)
2. Articles older than 2025-01-01 are encountered (both date string and timestamp checks)
3. No continuation token is provided AND already reached 2025 date range
4. Maximum iterations reached

## Performance Considerations

### Time Estimates

- **Per feed:** 30-60 minutes for 100 iterations
- **3 Inoreader feeds:** 2-3 hours total
- **Network delays:** Additional time for rate limiting

### Iteration Guidelines

- **10 iterations:** Good for testing (~10,000 items per feed)
- **50 iterations:** Moderate fetch (~50,000 items per feed)
- **100 iterations:** Deep historical fetch (~100,000 items per feed)
- **Default (100):** Recommended for reaching target

### Rate Limiting

The script includes:
- 2-second delay between pages within a feed
- 5-second delay between different feeds
- Exponential backoff on errors
- Retry logic (3 attempts per request)

## Monitoring Progress

### Check Current Count

```bash
# Count current 2025 articles
cat data/incidents-2025.json | jq 'length'

# Check date range
cat data/incidents-2025.json | jq '[.[] | .date] | sort | .[0], .[-1]'
```

### After Fetch Completion

```bash
# Verify article count
npm run validate-years

# Run enrichment
npm run enrich-enhanced
```

## Troubleshooting

### Issue: "Already have X articles, which meets or exceeds target"

The target has been reached. To fetch more, you can:
1. Edit `scripts/fetch-2025-bulk.js` and increase `TARGET_ARTICLES`
2. Or accept that the target is met

### Issue: Network errors

If you see many network errors:
- Check internet connection
- Verify Inoreader feeds are accessible
- Increase retry delays in the script

### Issue: Too many duplicates

This is normal as you approach completion. The script will automatically stop when:
- Most articles are duplicates
- Or articles before 2025 are reached

### Issue: Script timeout

For GitHub Actions:
- The workflow has a 6-hour timeout
- If needed, run multiple times with smaller `max_iterations`
- Each run will pick up where it left off (duplicates are skipped)

## Next Steps After Bulk Fetch

1. **Verify the data:**
   ```bash
   npm run validate-years
   ```

2. **Run enrichment:**
   ```bash
   npm run enrich-enhanced
   ```

3. **Check the results:**
   - Review the dashboard at https://maremoo2.github.io/CyberNews-2025/
   - Verify article counts and date ranges

4. **Build and deploy:**
   ```bash
   npm run build
   # The site will auto-deploy via GitHub Actions
   ```

## Summary

The bulk fetch system provides a powerful way to collect historical threat intelligence data. By using pagination (continuation tokens when available, time-based pagination as fallback), it can fetch tens of thousands of articles from throughout 2025, providing comprehensive coverage for security analysis and research.

**Key Benefits:**
- ✅ Comprehensive 2025 coverage (goes back to January 1, 2025)
- ✅ Automated deduplication
- ✅ Respects API rate limits
- ✅ Progress tracking
- ✅ Automatic stopping conditions
- ✅ Integration with existing enrichment pipeline
- ✅ Time-based pagination fallback when continuation tokens aren't available

## Recent Improvements (January 2026)

### Time-Based Pagination

The script was enhanced to use time-based pagination with the `ot` (older than) parameter when continuation tokens are not available from the Inoreader API. This allows the script to:

1. **Go deeper into history:** Instead of stopping after 1000 items when no continuation token is provided, it now uses the oldest timestamp from each page to request older articles
2. **Reach all of 2025:** The script will continue fetching pages, going back in time, until it reaches articles from before January 1, 2025
3. **Handle feeds with recent articles:** Feeds that start with 2026 articles will automatically jump back to 2025 content using the `ot` parameter

### How It Works

1. First page: Fetches the most recent 1000 items
2. If continuation token exists: Use it for next page (preferred method)
3. If no continuation token: Use the oldest timestamp from current page as `ot` parameter
4. Continue until reaching articles before 2025-01-01
5. Stop pagination when target date is reached

This ensures that even if the feeds don't provide continuation tokens, the bulk fetch can still collect all available 2025 articles by systematically walking backwards through time.

## One-Time Operation

Remember: This bulk fetch is designed as a **one-time historical backfill**. Once you've collected all 2025 articles, you don't need to run this script again. The regular scheduled `fetch-inoreader.js` workflow will continue to fetch new articles from 2026 (and any late 2025 articles) automatically.

For questions or issues, please open a GitHub issue.
