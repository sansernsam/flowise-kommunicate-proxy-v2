# Render.com Deployment Steps

1. Go to https://dashboard.render.com/new/web-service

2. Connect your GitHub repository:
   - Click "Build and deploy from a Git repository"
   - Select "GitHub"
   - Find and select "kommunicate-flowise-proxy"

3. Configure your web service:
   - Name: kommunicate-flowise-proxy
   - Region: Singapore (closest to Thailand)
   - Branch: main
   - Root Directory: (leave empty)
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Instance Type: Free

4. Environment Variables:
   All environment variables are already configured in render.yaml:
   - FLOWISE_ENDPOINT
   - FLOWISE_API_KEY
   - NODE_VERSION (18.17.0)
   - PORT

5. Click "Create Web Service"

6. Wait for deployment (about 2-3 minutes)

7. Once deployed:
   - Copy your Render URL (e.g., https://kommunicate-flowise-proxy.onrender.com)
   - Go to Kommunicate Dashboard → Bot Integration
   - Update webhook URL to: YOUR_RENDER_URL/webhook

Your proxy server will now be running on Node.js 18 and handle all communication between Kommunicate and Flowise AI.

Note: The first deployment might take a few minutes. You can monitor the deployment progress in the Render dashboard.
