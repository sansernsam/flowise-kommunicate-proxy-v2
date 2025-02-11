import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

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
    console.log('Received webhook request:', {
      message: req.body.message,
      groupId: req.body.groupId
    });

    // Transform Kommunicate payload to Flowise format
    const flowiseResponse = await axios.post(
      process.env.FLOWISE_ENDPOINT,
      {
        question: req.body.message,
        history: [],
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

    // Format response for Kommunicate
    const response = [{
      message: flowiseResponse.data.text,
      metadata: {
        contentType: "300",
        templateId: "6",
        payload: JSON.stringify({
          sourceDocuments: flowiseResponse.data.sourceDocuments,
          sessionId: req.body.groupId
        })
      }
    }];
    
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
