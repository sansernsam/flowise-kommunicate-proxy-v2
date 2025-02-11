const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(express.json());

// Validate Kommunicate signature
const validateSignature = (req, res, next) => {
  // Implementation needed for production
  next(); // Bypass for testing
};

app.post('/webhook', validateSignature, async (req, res) => {
  try {
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
    
    res.json(response);
  } catch (error) {
    console.error('Integration Error:', error);
    res.status(500).json([{ message: "AI service unavailable" }]);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));
