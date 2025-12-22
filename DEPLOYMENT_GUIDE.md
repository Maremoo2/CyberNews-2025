# Deployment Guide - GitHub Pages Setup

This guide will help you deploy the CyberNews-2025 website to GitHub Pages so it's accessible online 24/7 at https://maremoo2.github.io/CyberNews-2025/.

## Prerequisites

- You must have **admin access** to the repository
- The repository must be **public** (GitHub Pages is free for public repos)
- The deployment workflow file already exists at `.github/workflows/deploy.yml` ✅

## Current Status

❌ **GitHub Pages is NOT configured** - The workflow has been failing because Pages hasn't been enabled in repository settings.

All 7 deployment attempts have failed at the "Setup Pages" step. This is expected and normal - it simply means we need to enable GitHub Pages first.

## Step-by-Step Setup Instructions

### Step 1: Access Repository Settings

1. Go to your repository on GitHub: https://github.com/Maremoo2/CyberNews-2025
2. Click the **"Settings"** tab (located at the top of the page, last item in the navigation)

   If you don't see "Settings", you may not have admin access to the repository.

### Step 2: Navigate to Pages Settings

1. In the left sidebar under **Settings**, you'll see several sections including:
   - Access
   - **Code and automation** ← Look for this section
   - Security
   - Integrations

2. Under the **"Code and automation"** section, scroll down to find **"Pages"**
3. Click on **"Pages"**

### Step 3: Configure GitHub Pages Source

This is the **most important step**:

1. Once you're on the Pages settings page, you'll see a section called **"Build and deployment"**
2. In this section, look for a dropdown labeled **"Source"**
   - It will show a button/dropdown that currently says either "None" or "Deploy from a branch"
3. Click on the **"Source"** dropdown menu
4. From the dropdown options, select **"GitHub Actions"**

   **⚠️ Important:** 
   - Do NOT select "Deploy from a branch" 
   - You MUST select "GitHub Actions"
   - The dropdown should show "GitHub Actions" after selection

5. The settings will save automatically (you'll see a blue banner confirming the change)

### Step 4: Trigger Deployment

You have two options to trigger the deployment:

**Option A: Push to main branch (Automatic)**
```bash
git commit --allow-empty -m "Trigger GitHub Pages deployment"
git push origin main
```

**Option B: Manual workflow run**
1. Go to the **"Actions"** tab in your repository
2. In the left sidebar, click on **"Deploy to GitHub Pages"**
3. Click the **"Run workflow"** button (top right)
4. Select **"main"** branch
5. Click the green **"Run workflow"** button

### Step 5: Monitor Deployment

1. Go to the **"Actions"** tab
2. You should see a new workflow run called "Deploy to GitHub Pages"
3. Click on the workflow run to see details
4. Wait for all steps to complete (usually takes 30-60 seconds)
5. Look for the deployment URL in the "deploy" job output

### Step 6: Verify Your Site is Live

1. Once the workflow shows a ✅ green checkmark, your site is deployed!
2. Visit: **https://maremoo2.github.io/CyberNews-2025/**
3. If you see a 404 page, wait 1-2 minutes and try again (initial deployment can take a moment)

## Understanding 24/7 Hosting

### Do I need to keep a server running?

**NO!** GitHub Pages handles all hosting automatically. Your site will be:

- ✅ **Always online** - 24 hours a day, 7 days a week
- ✅ **Free hosting** - No cost for public repositories
- ✅ **Automatic SSL** - HTTPS is enabled by default
- ✅ **Global CDN** - Fast loading worldwide
- ✅ **Zero maintenance** - No servers to manage

### Do I need to run any actions for it to stay online?

**NO!** Once deployed, the site stays online permanently. You only need to:

- Push to `main` branch when you want to update content
- The GitHub Actions workflow will automatically rebuild and redeploy
- No manual intervention required for keeping the site running

## Troubleshooting

### Problem: Workflow still fails after enabling Pages

**Solution:**
1. Make sure you selected "GitHub Actions" and not "Deploy from a branch"
2. Try running the workflow again (it might have been running when you changed settings)
3. Check the workflow logs for specific error messages

### Problem: 404 Error on the live URL

**Possible causes:**
1. **GitHub Pages not configured** - Follow Step 3 again
2. **Workflow hasn't completed** - Check Actions tab and wait for green checkmark
3. **Browser cache** - Try opening in incognito/private mode or clear cache
4. **DNS propagation** - Initial deployment can take 1-2 minutes

**How to fix:**
```bash
# Check if workflow succeeded
# Go to: https://github.com/Maremoo2/CyberNews-2025/actions

# If workflow failed, check if Pages is configured
# Go to: https://github.com/Maremoo2/CyberNews-2025/settings/pages

# Manually trigger deployment
# Go to Actions tab → Deploy to GitHub Pages → Run workflow
```

### Problem: Old content showing after update

**Solution:**
1. Verify the workflow ran after your latest push (check Actions tab)
2. Hard refresh the page: `Ctrl + Shift + R` (Windows/Linux) or `Cmd + Shift + R` (Mac)
3. Clear your browser cache
4. Wait 1-2 minutes for CDN cache to update

### Problem: "Setup Pages" step fails in workflow

**Error message:** "GitHub Pages is not configured for this repository"

**Solution:**
This means GitHub Pages is not enabled in Settings. Go back to Step 3 and ensure you've selected "GitHub Actions" as the source.

## Workflow Details

The deployment workflow (`.github/workflows/deploy.yml`) does the following:

1. **Checkout code** - Gets the latest code from the repository
2. **Setup Node.js** - Installs Node.js version 20
3. **Install dependencies** - Runs `npm ci` to install packages
4. **Build** - Runs `npm run build` to create production build
5. **Upload artifact** - Packages the `dist` folder
6. **Deploy** - Publishes to GitHub Pages

The entire process is automatic and takes about 1 minute to complete.

## Next Steps

After successful deployment:

1. ✅ Visit your live site: https://maremoo2.github.io/CyberNews-2025/
2. ✅ Share the link with others
3. ✅ Make updates by editing files and pushing to `main` branch
4. ✅ Site will automatically rebuild and redeploy on every push

## Additional Resources

- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#github-pages)

## Questions?

If you encounter any issues not covered in this guide:

1. Check the workflow logs in the Actions tab for specific error messages
2. Verify GitHub Pages is configured correctly in Settings → Pages
3. Ensure the repository is public
4. Create an issue in the repository for help

---

**Remember:** Once configured correctly, your site will be online 24/7 automatically with no maintenance required!
