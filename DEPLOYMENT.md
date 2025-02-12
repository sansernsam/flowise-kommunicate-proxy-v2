# Deployment Instructions for Render.com

## 1. Create GitHub Repository
1. Go to https://github.com/new
2. Name your repository (e.g., "kommunicate-flowise-proxy")
3. Make it Public
4. Click "Create repository"
5. Follow GitHub's instructions to push your local code:
```bash
git remote add origin YOUR_GITHUB_REPO_URL
git branch -M main
git push -u origin main
```

## 2. Deploy to Render.com
1. Go to https://dashboard.render.com
2. Sign up/Sign in with your GitHub account
3. Once logged in, click the "New +" button in the top right
4. Select "Web Service" from the dropdown
5. Find and select your GitHub repository "kommunicate-flowise-proxy"
6. On the configuration page:
   - Name: "kommunicate-flowise-proxy"
   - Region: Choose closest to your location
   - Branch: main
   - Root Directory: Leave empty
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Plan: Free

7. Click "Create Web Service"

## 3. Update Kommunicate
1. Wait for deployment to complete (watch the logs)
2. Copy your new Render URL (e.g., https://kommunicate-flowise-proxy.onrender.com)
3. Go to Kommunicate Dashboard
4. Navigate to Bot Integration section
5. Update webhook URL to: YOUR_RENDER_URL/webhook
   (e.g., https://kommunicate-flowise-proxy.onrender.com/webhook)

Your proxy server will now be permanently hosted on Render.com with automatic HTTPS and continuous deployment from your GitHub repository.
