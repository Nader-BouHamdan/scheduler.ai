const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Import CORS
const authRoutes = require('./routes/authRoutes');
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

const taskRoutes = require('./routes/taskRoutes');
app.use('/api', taskRoutes);

const { OpenAI } = require('openai'); // Import OpenAI class
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Example route for AI task suggestions
app.post('/suggest-tasks', async (req, res) => {
  const { userPreferences } = req.body;

  const prompt = `Suggest tasks for a user who prefers ${userPreferences}`;
  
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or 'gpt-4' depending on what you want to use
      messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: prompt }],
    });
    
    res.json({ suggestion: response.choices[0].message.content });
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    res.status(500).json({ error: 'Failed to get task suggestions' });
  }
});

// Enable CORS for the frontend on localhost:3000
app.use(cors({
  origin: 'http://localhost:5000', // Allow requests only from your frontend (localhost:3000)
  methods: 'GET,POST,PUT,DELETE', // Allow specific methods
  credentials: true, // Allow cookies to be sent in requests (if needed)
}));

app.use('/api', authRoutes); // Example route

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});