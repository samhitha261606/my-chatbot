const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Gemini setup
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Default GET route
app.get('/', (req, res) => {
  res.send('🤖 Gemini chatbot server is up and running!');
});

// Chat route
// Chat route
app.post('/chat', async (req, res) => {
  const { message } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(message);
    const response = result.response; // ❌ Remove await here

    // Extract text from response
    const text = response?.candidates?.[0]?.content?.parts?.[0]?.text ?? 'No reply from Gemini.';
    res.json({ reply: text });
  } catch (error) {
    console.error('Error from Gemini:', error.message);
    res.status(500).json({ error: 'Something went wrong' });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
