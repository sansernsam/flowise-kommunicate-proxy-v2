# Render.com Deployment Configuration

1. On the Render dashboard, click "New Web Service"

2. Service Configuration:
   - Name: flowise-kommunicate-proxy-v2
   - Region: Singapore (Southeast Asia)
   - Branch: main
   - Root Directory: (leave empty)

3. Build & Runtime Settings:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `node index.js`
   - Instance Type: Free

4. Advanced Settings:
   - Auto-Deploy: Yes
   - Branch: main

5. Environment Variables (already in render.yaml):
   ```
   NODE_VERSION=18.17.0
   FLOWISE_ENDPOINT=https://cosdentsmiledesignai.onrender.com/api/v1/prediction/9eafff57-9b80-4bc9-a572-9e00166e758b
   FLOWISE_API_KEY=KJ36Yg2IT8VoHSCTT_rAquKKh5TSX4VE24XI_I_W43E
   PORT=10000
   ```

6. After Deployment:
   - Wait for build to complete (2-3 minutes)
   - Copy your service URL (e.g., https://flowise-kommunicate-proxy-v2.onrender.com)
   - Update Kommunicate webhook URL to: YOUR_SERVICE_URL/webhook

Important Notes:
- Render will automatically detect settings from render.yaml
- First deployment may take longer
- Monitor build logs for any Node.js version issues
- Test webhook endpoint after deployment is complete

To verify deployment:
1. Check build logs for successful Node.js 18 installation
2. Test endpoint with: curl YOUR_SERVICE_URL/webhook
3. Send test message through Kommunicate chat widget
