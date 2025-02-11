# Kommunicate Integration Setup Guide

## Prerequisites
- Render.com deployment is live at: https://flowise-kommunicate-proxy-v2.onrender.com
- Kommunicate account access
- App ID: 204f13aa870671f3816284e7930d62a65

## Manual Configuration Steps

1. Log into Kommunicate Dashboard:
   - Go to https://dashboard.kommunicate.io
   - Use your credentials to log in

2. Navigate to Bot Integration:
   - Click on "Bot Integrations" in the left sidebar
   - Select "Custom Bot" or "Other Bot Platforms"

3. Configure Webhook:
   - Webhook URL: https://flowise-kommunicate-proxy-v2.onrender.com/webhook
   - Request Headers:
     ```json
     {
       "Content-Type": "application/json"
     }
     ```
   - Message Format:
     ```json
     {
       "message": "@{message}"
     }
     ```

   Note: The proxy server automatically uses Kommunicate's groupId as Flowise's chatId to maintain conversation threads. This ensures:
   - Each conversation maintains its own context
   - Message history is preserved per conversation
   - Multiple users can have separate conversations
   - All messages in a group share the same thread

4. Test Integration:
   - Send a test message through your website's chat widget
   - Expected response format:
     ```json
     [{
       "message": "AI response text",
       "metadata": {
         "contentType": "300",
         "templateId": "6",
         "payload": "..."
       }
     }]
     ```

## Troubleshooting

1. Check Render.com Logs:
   - Visit your Render dashboard
   - Click on "Logs" tab
   - Look for any error messages

2. Verify Webhook Endpoint:
   ```bash
   curl -X POST https://flowise-kommunicate-proxy-v2.onrender.com/webhook \
   -H "Content-Type: application/json" \
   -d '{"message": "test message", "groupId": "test-123"}'
   ```

3. Common Issues:
   - 404: Webhook URL is incorrect
   - 500: Flowise AI connection issue
   - Timeout: Response taking too long

## Monitoring

1. Health Check:
   - GET https://flowise-kommunicate-proxy-v2.onrender.com/
   - Should return: `{"status": "healthy", "version": "1.0.0"}`

2. Logs:
   - All requests are logged with request/response details
   - Check Render.com logs for debugging
   - Error messages include full stack traces

## Support
- Kommunicate Documentation: https://docs.kommunicate.io/docs/bot-custom-integration
- Render.com Documentation: https://render.com/docs
