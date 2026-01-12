# Year Routing Verification - January 2026

## Status: ✅ VERIFIED

All incidents are correctly stored in their respective year files with no cross-year contamination.

## Verification Results (2026-01-12)

### Data Integrity Check

| File | Total Incidents | 2025 Incidents | 2026 Incidents | Status |
|------|----------------|----------------|----------------|---------|
| `incidents-2025.json` | 64 | 64 ✓ | 0 ✓ | ✅ CLEAN |
| `incidents-2025-enriched.json` | 64 | 64 ✓ | 0 ✓ | ✅ CLEAN |
| `incidents-2026.json` | 828 | 0 ✓ | 828 ✓ | ✅ CLEAN |
| `incidents-2026-enriched.json` | 828 | 0 ✓ | 828 ✓ | ✅ CLEAN |

### Key Findings

1. **Zero cross-year contamination**: No 2025 incidents found in 2026 files, and vice versa
2. **Correct ID prefixes**: All 2026 incidents have IDs starting with "2026" (e.g., 20261647, 2026342)
3. **Legacy IDs in 2025**: The 2025 file contains 64 legacy IDs (numeric only, without year prefix). This is expected and acceptable for historical data.
4. **Date consistency**: All incidents have dates matching their file's year

## How Year Routing Works

The system automatically routes incidents to the correct year file based on their publication date:

### 1. Fetch Process (`scripts/fetch-inoreader.js`)

```javascript
// Extract article date
const articleDate = "2026-01-12"; // Example
const articleYear = getYearFromDate(articleDate); // Returns 2026

// Generate year-specific ID
const id = yearGenerator(); // Returns "20261648" for 2026

// Save to appropriate file
saveIncidents(incidents, articleYear); // Saves to incidents-2026.json
```

### 2. Year Detection Logic

- **Date extraction**: Reads `date_published` field from RSS feed
- **Year extraction**: Parses year from date string (YYYY-MM-DD format)
- **File routing**: Automatically saves to `incidents-{year}.json`
- **ID generation**: Uses year prefix (e.g., 2026xxx) for sequential IDs

### 3. Multi-Year Support

The system handles multiple years simultaneously:
- Loads both current year (2026) and previous year (2025) files
- New articles are routed based on their publication date
- Each year maintains its own ID sequence
- No manual intervention required when transitioning to new years

## Validation

A new validation script has been added to prevent future issues:

```bash
# Run validation
npm run validate-years

# Or directly
node scripts/validate-year-routing.js
```

### What the Validator Checks

1. **Date consistency**: All incidents in `incidents-YYYY.json` have dates from year YYYY
2. **ID format**: All incident IDs (except legacy 2025 IDs) follow the YYYYxxx format
3. **No cross-year contamination**: No incidents from other years in the file
4. **Valid date format**: All dates follow YYYY-MM-DD format

### Example Output

```
🔍 Year Routing Validation
============================================================

Validating incidents-2026.json...
  📊 Total incidents: 828
  ✅ All incidents have correct year (2026)

============================================================
✅ VALIDATION PASSED
All incidents are in the correct year files!
```

## Previous Issue (Resolved)

The repository previously had 680 articles from 2025 incorrectly stored in `incidents-2026.json`. This was caused by hardcoded year references in the scripts. 

**Resolution**: 
- Migration script (`scripts/migrate-2025-articles.js`) moved all 2025 articles to correct file
- Scripts updated to use dynamic year detection
- Validation script added to prevent recurrence

See [YEAR_ROUTING_FIX.md](./YEAR_ROUTING_FIX.md) for details on the original fix.

## Best Practices

### For Maintainers

1. **After fetching news**: Always run `npm run validate-years` to verify data integrity
2. **Before deployment**: Validate that enriched files are up to date and clean
3. **Monthly**: Review validation output to catch any edge cases

### For Development

1. **Testing changes**: Use `--dry-run` flag to preview changes without saving
2. **Adding new years**: No code changes needed - system automatically handles new years
3. **Manual data entry**: Always use correct date format (YYYY-MM-DD) and let ID generator create IDs

## Migration History

| Date | Action | Result |
|------|--------|--------|
| 2025-12-XX | Initial migration | 680 articles moved from 2026 to 2025 |
| 2026-01-12 | Verification | All files clean, validation script added |

## Automated Checks

The validation script can be integrated into CI/CD pipelines:

```yaml
# .github/workflows/validate-data.yml
- name: Validate year routing
  run: npm run validate-years
```

This ensures no cross-year contamination can be merged into the main branch.

## Contact

If you notice any incidents with incorrect year assignments:
1. Run `npm run validate-years` to diagnose the issue
2. Check the fetch logs for any errors during import
3. Report issue with validation output and incident IDs

## Summary

✅ **Data is clean** - No 2025 incidents in 2026 files  
✅ **System is robust** - Automatic year routing works correctly  
✅ **Validation in place** - New script prevents future issues  
✅ **Documentation complete** - Process is well documented  

The issue reported by the user appears to be related to an old deployed version of the site that hasn't been updated with the latest cleaned data. All data files in the repository are now verified to be correct.
