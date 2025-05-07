# Scheduler.ai

An intelligent scheduling application that helps users manage their time effectively using AI-powered features.

## Features

- AI-powered scheduling assistance
- User authentication and authorization
- Interactive calendar interface
- Smart task management
- Real-time updates

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- OpenAI Integration

### Frontend
- React.js
- Modern CSS
- Axios for API calls
- React Icons

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- OpenAI API Key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/Nader-BouHamdan/scheduler.ai.git
cd scheduler.ai
```

2. Install backend dependencies:
```bash
npm install
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

4. Create a `.env` file in the root directory with the following variables:
```
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_api_key
PORT=5000
```

5. Create a `.env` file in the frontend directory:
```
REACT_APP_API_URL=http://localhost:5000
```

## Running the Application

1. Start the backend server:
```bash
npm run dev
```

2. In a new terminal, start the frontend:
```bash
cd frontend
npm start
```

The application will be available at `http://localhost:3000`

## Project Structure

```
scheduler.ai/
├── config/             # Configuration files
├── middlewares/        # Express middlewares
├── models/            # Mongoose models
├── routes/            # API routes
├── services/          # Business logic
├── utils/             # Utility functions
├── tests/             # Backend tests
├── frontend/          # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── context/      # React context providers
│   │   ├── services/     # API services
│   │   ├── utils/        # Utility functions
│   │   └── styles/       # CSS styles
```

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Schedule Endpoints

- `GET /api/schedules` - Get all schedules
- `POST /api/schedules` - Create a new schedule
- `PUT /api/schedules/:id` - Update a schedule
- `DELETE /api/schedules/:id` - Delete a schedule

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Nader Bou Hamdan - [GitHub](https://github.com/Nader-BouHamdan) 