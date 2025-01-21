// Import necessary packages
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import dotenv from 'dotenv';

//added
import { handleIncomingMessage } from './src/botLogic.js';
import { sendMessage } from './src/whatsappAPI.js';

dotenv.config();

// Initialize Express
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Initialize OpenAI with the API key
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

//added
// Verification for Webhook
app.get('/webhook', (req, res) => {
  const verifyToken = process.env.VERIFY_TOKEN;
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === verifyToken) {
      res.status(200).send(challenge);
  } else {
      res.sendStatus(403);
  }
});


// Handling Incoming Messages
app.post('/webhook', async (req, res) => {
  const messageData = req.body.entry[0].changes[0].value;
  await handleIncomingMessage(messageData);
  res.sendStatus(200);
});

//added till here ...............

// Route to handle chat requests
app.post('/api/chat', async (req, res) => {
    const userMessage = req.body.message;

    try {
        // Request a response from the OpenAI API
        const chatCompletion = await openai.createChatCompletion({
            model: "gpt-4o-mini", // Ensure this model is supported for your API key
            messages: [{ role: "user", content: userMessage }],
        });

        const botResponse = chatCompletion.data.choices[0].message.content;
        res.json({ reply: botResponse });
    } catch (error) {
        console.error('Error communicating with OpenAI API:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: 'Failed to communicate with OpenAI API' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
