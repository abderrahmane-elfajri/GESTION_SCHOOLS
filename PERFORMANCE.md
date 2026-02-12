# Performance Optimization Guide

## Applied Optimizations

### 1. ✅ Page Caching
- **Dashboard**: Revalidates every 60 seconds
- **Students List**: Revalidates every 30 seconds
- Reduces unnecessary API calls

### 2. ✅ Certificate Generation
- **Double-click prevention**: Buttons disabled during generation
- **Font caching**: Reuses loaded fonts across PDFs
- **Loading states**: Visual feedback during generation
- **Auto-download**: Improved UX with automatic file download

### 3. ✅ Next.js Configuration
- **SWC Minification**: Faster builds
- **Compression**: Smaller bundle sizes
- **Package optimization**: pdf-lib, exceljs, and Supabase optimized

### 4. ✅ Database Indexes (Run SQL file)
```bash
# Apply database indexes for better query performance
# File: supabase/add-performance-indexes.sql
```

## Network Issues Detected

The terminal shows **ECONNRESET** errors - these indicate network connectivity problems with Supabase:

```
TypeError: fetch failed
[cause]: Error: read ECONNRESET
```

### Solutions for Network Issues:

#### Option 1: Check Supabase Status
1. Visit https://status.supabase.com/
2. Check if there are ongoing incidents

#### Option 2: Verify Environment Variables
```bash
# Check .env.local has correct values
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

#### Option 3: Increase Timeout Settings
The optimized client in `src/lib/supabase/optimized-client.ts` includes timeout settings.

#### Option 4: Use Local Supabase (Recommended for Development)
```bash
# Install Supabase CLI
npm install supabase --save-dev

# Start local Supabase
npx supabase start

# This gives you a local database without network issues
```

## Performance Monitoring

### Current Issues Observed:
- ❌ Page loads taking 10-19 seconds (should be <2s)
- ❌ Network timeouts with Supabase
- ❌ Multiple compilation cycles (re-compiling same routes)

### Expected After Fixes:
- ✅ Dashboard load: <2 seconds
- ✅ Students page: <1.5 seconds  
- ✅ Certificate generation: <1 second
- ✅ No network timeouts

## Quick Wins to Apply Now

### 1. Run Database Indexes
```sql
-- Run this in your Supabase SQL editor
-- File: supabase/add-performance-indexes.sql
```

### 2. Clear Next.js Cache
```bash
# Delete .next folder and rebuild
Remove-Item -Recurse -Force .next
npm run build
npm run dev
```

### 3. Check Network Connection
- Test internet speed
- Try using a VPN if Supabase is blocked
- Check firewall settings

### 4. Monitor Performance
```bash
# Build and check bundle size
npm run build

# Look for:
# - Large page sizes (>200KB is too big)
# - Long compilation times
```

##  Certificate Template Customization

To update the certificate template, edit:
- `/app/api/certificates/route.ts` - `generateCertificatePdf()` function
- `/app/api/certificates/route.ts` - `generateCardPdf()` function

The template uses pdf-lib for PDF generation. You can:
- Change colors with `rgb(r, g, b)`
- Adjust positions with `x` and `y` coordinates
- Modify text sizes and fonts
- Add images or logos (requires additional setup)

## Monitoring Tools

Add these to package.json scripts:
```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build",
    "lint:perf": "next lint --fix"
  }
}
```

## Additional Optimizations to Consider

1. **Image Optimization**: Use Next.js `<Image />` component for any images
2. **Code Splitting**: Lazy load heavy components
3. **Memoization**: Use React.memo for frequently re-rendered components
4. **Virtual Scrolling**: For large tables with 100+ rows
5. **Service Worker**: For offline support

## Support

If performance issues persist:
1. Check Supabase dashboard for quota limits
2. Review database query performance in Supabase SQL editor
3. Use Chrome DevTools Performance tab to identify bottlenecks
4. Consider upgrading Supabase plan if on free tier with many requests
