# GitHub Pages Setup Instructions

This document contains instructions for setting up GitHub Pages for the 98-components test utility.

## Initial Setup (One-time)

You need to enable GitHub Pages in your repository settings and configure it to use GitHub Actions.

### Using GitHub CLI (`gh`)

Run the following command to enable GitHub Pages with GitHub Actions as the source:

```bash
gh api repos/:owner/:repo/pages \
  --method POST \
  -f source[branch]=gh-pages \
  -f build_type=workflow
```

Or, if you prefer to do it manually:

### Manual Setup via GitHub Web UI

1. Go to your repository on GitHub
2. Click on **Settings** → **Pages** (in the left sidebar)
3. Under **Build and deployment**:
   - **Source**: Select "GitHub Actions"
4. Save the changes

## How It Works

Once set up, the deployment process is automatic:

1. **Push to main branch** → GitHub Actions workflow triggers
2. **Build step** → Runs `pnpm run build:test` to build the test page
3. **Deploy step** → Deploys the built files to GitHub Pages

The test utility will be available at:
```
https://<your-username>.github.io/98-components/
```

## Manual Deployment

You can also manually trigger the deployment:

```bash
gh workflow run deploy-gh-pages.yml
```

Or via the GitHub web UI:
1. Go to **Actions** tab
2. Select **Deploy to GitHub Pages** workflow
3. Click **Run workflow**

## Local Testing

To test the production build locally before deploying:

```bash
# Build the test page
pnpm run build:test

# Preview the built site (optional)
npx serve dist-test
```

## Troubleshooting

### Build fails with "permission denied"

Make sure the workflow has the correct permissions. The workflow file already includes:
```yaml
permissions:
  contents: read
  pages: write
  id-token: write
```

### 404 errors on deployed site

Check that the `base` path in `vite.build-test.config.js` matches your repository name:
```javascript
base: '/98-components/', // Should match your repo name
```

### Assets not loading

Ensure all asset paths are relative and the base path is correctly configured.
