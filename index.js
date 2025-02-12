import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('.'));

// Basic health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'healthy', version: '1.0.0' });
});

// Validate Kommunicate signature
const validateSignature = (req, res, next) => {
  // Implementation needed for production
  next(); // Bypass for testing
};

app.post('/webhook', validateSignature, async (req, res) => {
  try {
    console.log('Received webhook request:', req.body);

    // Handle welcome event
    if (req.body.eventName === 'WELCOME') {
      return res.json([{
        message: "Hello! I'm your AI assistant. How can I help you today?"
      }]);
    }

    // Handle media events
    if (req.body.eventName === 'KOMMUNICATE_MEDIA_EVENT') {
      const attachments = req.body.metadata?.KM_CHAT_CONTEXT?.attachments;
      if (attachments && attachments.length > 0) {
        return res.json([{
          message: "I've received your attachment, but I can only process text messages at the moment."
        }]);
      }
    }

    try {
      // Prepare simple request payload
      const payload = {
        question: req.body.message
      };

      console.log('Sending request to Flowise:', {
        endpoint: process.env.FLOWISE_ENDPOINT,
        payload,
        proxy: process.env.HTTPS_PROXY
      });

      // Create an https agent with proxy settings if HTTPS_PROXY is set
      const httpsAgent = process.env.HTTPS_PROXY ? new HttpsProxyAgent(process.env.HTTPS_PROXY) : undefined;

      // Send request to Flowise API with correct API key
      const flowiseResponse = await axios.post(
        `${process.env.FLOWISE_ENDPOINT}?apiKey=KJ36Yg2lT8VoHSCTT_rAquKKh5TSx4vE24xI_l_W43E`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          httpsAgent: httpsAgent
        }
      );

      console.log('Flowise response:', flowiseResponse.data);

      // Format response for Kommunicate
      const response = [{
        message: flowiseResponse.data.text || "I understand your message, but I'm having trouble generating a response."
      }];

      // Add source documents as suggested actions if available
      if (flowiseResponse.data.sourceDocuments?.length > 0) {
        response[0].metadata = {
          contentType: "300",
          templateId: "6",
          payload: flowiseResponse.data.sourceDocuments.map(doc => ({
            title: "Learn More",
            message: doc.pageContent.substring(0, 100) + "..."
          }))
        };
      }

      return res.json(response);

      return res.json(response);
    } catch (error) {
      console.error('Flowise API Error:', error);
      
      // Handle different error scenarios
      if (error.response?.status === 401 || error.response?.status === 403) {
        return res.json([{
          message: "I'm currently experiencing authentication issues. Let me connect you with a human agent.",
          metadata: {
            KM_ASSIGN_TO: ""
          }
        }]);
      }
      
      if (error.response?.status === 500) {
        return res.json([{
          message: "I'm having trouble processing your request. Would you like to try rephrasing your question?",
          metadata: {
            contentType: "300",
            templateId: "6",
            payload: [{
              title: "Connect with Agent",
              message: "Please connect me with a human agent"
            }, {
              title: "Try Again",
              message: "Let me try asking differently"
            }]
          }
        }]);
      }

      // Default error response with suggested actions
      return res.json([{
        message: "I'm having technical difficulties at the moment. How would you like to proceed?",
        metadata: {
          contentType: "300",
          templateId: "6",
          payload: [{
            title: "Talk to Agent",
            message: "Connect me with an agent please"
          }, {
            title: "Try Later",
            message: "I'll try again later"
          }]
        }
      }]);
    }
    
    console.log('Sending response to Kommunicate:', response);
    res.json(response);
  } catch (error) {
    console.error('Integration Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    
    res.status(500).json([{ 
      message: "AI service unavailable. Please try again later.",
      metadata: {
        error: error.message
      }
    }]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Node.js version: ${process.version}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
});
