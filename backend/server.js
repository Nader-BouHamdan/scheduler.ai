const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OpenAI } = require('openai');
const morgan = require('morgan');
const { limiter, securityHeaders } = require('./middlewares/security');
const { AppError, handleError } = require('./utils/errorHandler');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Security middleware
app.use(securityHeaders);
app.use(limiter);

// Logging middleware
app.use(morgan('dev'));

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const User = require('./models/User');
const Task = require('./models/Task');

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.log("MongoDB connection error:", err));


// Routes
app.get('/', (req, res) => {
  res.send('Hello, Scheduler AI!');
});

// API routes
app.use('/api', authRoutes);
app.use('/api', taskRoutes);

// AI task suggestions route
app.post('/api/suggest-tasks', async (req, res, next) => {
  try {
    const { userPreferences } = req.body;
    
    if (!userPreferences) {
      throw new AppError('User preferences are required', 400);
    }

    const prompt = `Suggest tasks for a user who prefers ${userPreferences}`;
    
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: prompt }
      ],
    });
    
    res.json({ suggestion: response.choices[0].message.content });
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return handleError(err, res);
  }
  
  console.error('Error:', err);
  res.status(500).json({
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});