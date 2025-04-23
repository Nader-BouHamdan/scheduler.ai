const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("MongoDB connection error:", err));

// Simple test route
app.get('/', (req, res) => {
  res.send('Hello, Scheduler AI!');
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const taskRoutes = require('./routes/taskRoutes');
app.use('/api', taskRoutes);

const { Configuration, OpenAIApi } = require('openai');
const openai = new OpenAIApi(
  new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  })
);

app.post('/api/suggest-tasks', async (req, res) => {
  const { userPreferences } = req.body;

  const prompt = `Suggest tasks for a user who prefers ${userPreferences}`;
  
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt,
      max_tokens: 100,
    });
    res.json({ suggestion: response.data.choices[0].text });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to get task suggestions' });
  }
});
