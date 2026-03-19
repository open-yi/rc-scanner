# GitHub Pages Deployment Guide

This project is configured to automatically deploy to GitHub Pages when you push to the `main` or `master` branch.

## How It Works

The deployment is automated using GitHub Actions. When you push code to `main` or `master`:
1. The workflow builds the demo application
2. Deploys the built files to GitHub Pages

## Manual Setup Required

Before the first deployment works, you need to enable GitHub Pages in your repository settings:

### Steps:

1. **Navigate to Repository Settings**
   - Go to your GitHub repository
   - Click on **Settings** tab

2. **Enable GitHub Pages**
   - In the left sidebar, click on **Pages**
   - Under **Build and deployment**, select **Source** → **GitHub Actions**

3. **Grant Permissions**
   - The workflow already has the necessary permissions configured in `.github/workflows/deploy.yml`
   - No additional setup needed on the repository settings page

4. **Push to Trigger Deployment**
   - Push your changes to the `main` or `master` branch
   - The workflow will automatically start building and deploying

## Access Your Deployed Site

Once the workflow completes successfully:
- Your site will be available at: `https://<your-username>.github.io/<repository-name>/`
- You can find the URL in the GitHub Actions workflow run details

## Build Details

- **Build Command**: `pnpm run build:demo`
- **Output Directory**: `dist`
- **Framework**: Vite + React
- **Total Build Size**: ~263 KB (gzipped: ~85 KB)

## Troubleshooting

### Build Fails
- Check the GitHub Actions logs for errors
- Ensure `pnpm` is installed on your machine
- Verify all dependencies are up to date

### Deployment Doesn't Appear
- Make sure GitHub Pages source is set to "GitHub Actions" in repository settings
- Wait for the workflow to complete (check the Actions tab)
- Sometimes it takes a few minutes for the site to become available

### Access Denied Errors
- Ensure the workflow has the correct permissions (already configured in deploy.yml)
- If issues persist, check the "Actions" tab for error details

## Customization

To change the deployment branch:
1. Edit `.github/workflows/deploy.yml`
2. Change `branches:` to your preferred branch
3. Update the workflow and push

To change the output directory:
1. Edit `.github/workflows/deploy.yml`
2. Change `path: 'dist'` to your desired directory
3. Update `vite.config.ts` root setting accordingly