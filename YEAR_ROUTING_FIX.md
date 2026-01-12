# Year Routing Fix - Implementation Summary

## Problem Statement
The repository had 680 articles from 2025 incorrectly stored in `incidents-2026.json` with IDs prefixed with "2026". This was caused by hardcoded year references in the scripts that always assumed the current year is 2026.

## Changes Made

### 1. Script Updates - Dynamic Year Detection

#### `scripts/fetch-inoreader.js`
- **Removed**: Hardcoded `INCIDENTS_FILE` constant pointing to `incidents-2026.json`
- **Added**: Helper functions for dynamic year detection:
  - `getIncidentsFilePath(year)` - Returns correct file path based on year
  - `getYearFromDate(dateStr)` - Extracts year from ISO date string (YYYY-MM-DD)
  - `loadAllExistingIncidents()` - Loads both current and previous year files
- **Updated**: `processFeed()` function to:
  - Extract article date before generating ID
  - Use year-specific ID generators (e.g., 2025xxx for 2025 articles)
  - Group new articles by year
  - Return `newItemsByYear` instead of flat `newItems` array
- **Updated**: `main()` function to:
  - Save articles to appropriate year file based on their dates
  - Display year distribution in summary

#### `scripts/aggregate-news.js`
- **Removed**: Hardcoded paths:
  - `NEWS_DIR = 'news/2026'`
  - `OUTPUT_FILE = 'data/news-aggregated-2026.json'`
- **Added**: Dynamic year detection from command line args or current year
- **Updated**: All references to `"2026"` string replaced with `YEAR` variable
- **Usage**: Can now be called with year argument: `node scripts/aggregate-news.js 2025`

#### `scripts/extract-missing-incidents.js`
- **Removed**: Hardcoded paths to 2026 files
- **Added**: Dynamic year detection from command line args or current year
- **Updated**: 
  - File paths to use `YEAR` variable
  - ID generation to use correct year prefix
  - Fallback date to use `YEAR` instead of hardcoded "2026-01-02"
- **Usage**: Can now be called with year argument: `node scripts/extract-missing-incidents.js 2025`

### 2. Data Migration - `scripts/migrate-2025-articles.js`

Created a new migration script that:
- Scans `incidents-2026.json` for articles with 2025 dates
- Re-IDs them with proper 2025xxx format (starting from max ID + 1 in 2025 file)
- Moves them to `incidents-2025-enriched.json`
- Removes them from `incidents-2026.json`
- Supports `--dry-run` mode for safe testing

**Migration Results**:
- ✅ Moved 680 articles from 2025 (now in incidents-2025-enriched.json)
- ✅ 804 articles remain in incidents-2026.json (all from 2026)
- ✅ incidents-2025-enriched.json now has 744 total articles:
  - 680 with proper 2025xxx IDs (newly migrated)
  - 64 with legacy IDs (1-619 range, were already there)

### 3. Data Integrity Verification

After migration:
- ✅ `incidents-2026.json`: 804 articles, all from 2026, all IDs start with "2026"
- ✅ `incidents-2025-enriched.json`: 744 articles, all from 2025
- ✅ No 2025 articles remain in 2026 file
- ✅ No 2026 articles in 2025 file

## Usage Examples

### Fetch News (automatically routes by year)
```bash
# Dry run to see what would be fetched
npm run fetch-news -- --dry-run

# Actual fetch (articles automatically go to correct year file)
npm run fetch-news
```

### Aggregate News for Specific Year
```bash
# For 2026 (default is current year)
node scripts/aggregate-news.js 2026

# For 2025
node scripts/aggregate-news.js 2025
```

### Extract Missing Incidents for Specific Year
```bash
# For 2026 (default is current year)
node scripts/extract-missing-incidents.js 2026

# For 2025
node scripts/extract-missing-incidents.js 2025
```

### Migrate Articles (if needed again in future)
```bash
# Dry run first
node scripts/migrate-2025-articles.js --dry-run

# Actual migration
node scripts/migrate-2025-articles.js
```

## Future Benefits

1. **Automatic Year Handling**: When we move into 2027, scripts will automatically:
   - Create and use `incidents-2027.json`
   - Generate IDs with 2027xxx prefix
   - Route articles to correct year file based on publication date

2. **No Manual Intervention**: Year changes require no code updates

3. **Backward Compatible**: Can still process historical data by specifying year

4. **Data Integrity**: Articles are always stored in the correct year file with matching IDs

## Testing

All scripts have been:
- ✅ Syntax validated with `node -c`
- ✅ Linted with ESLint (no errors)
- ✅ Tested with dry-run mode
- ✅ Data integrity verified with jq queries

## Files Modified

1. `scripts/fetch-inoreader.js` - Major refactor for year-based routing
2. `scripts/aggregate-news.js` - Dynamic year detection
3. `scripts/extract-missing-incidents.js` - Dynamic year detection
4. `scripts/migrate-2025-articles.js` - New migration utility
5. `data/incidents-2026.json` - Cleaned (680 articles removed)
6. `data/incidents-2025-enriched.json` - Updated (680 articles added)
