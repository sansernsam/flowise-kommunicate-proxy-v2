import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static('.')); // Serve static files from current directory

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

    // Transform Kommunicate payload to Flowise format
    const flowiseResponse = await axios.post(
      process.env.FLOWISE_ENDPOINT,
      {
        question: req.body.message,
        chatId: req.body.groupId,
        overrideConfig: {
          returnSourceDocuments: true
        }
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.FLOWISE_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Flowise response received:', flowiseResponse.data);

    // Check if we need to handoff to human agent
    if (flowiseResponse.data.text.toLowerCase().includes("i can't help with that") || 
        flowiseResponse.data.text.toLowerCase().includes("i don't understand")) {
      return res.json([{
        message: "Let me connect you with a human agent who can better assist you.",
        metadata: {
          KM_ASSIGN_TO: "" // Empty string will use conversation rules
        }
      }]);
    }

    // Format response for Kommunicate
    const response = [{
      message: flowiseResponse.data.text
    }];

    // Add suggested replies if available
    if (flowiseResponse.data.sourceDocuments && flowiseResponse.data.sourceDocuments.length > 0) {
      response[0].metadata = {
        contentType: "300",
        templateId: "6",
        payload: flowiseResponse.data.sourceDocuments.map(doc => ({
          title: "Learn More",
          message: doc.pageContent.substring(0, 100) + "..."
        }))
      };
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
