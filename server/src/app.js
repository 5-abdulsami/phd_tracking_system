require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');

// Connect to Database
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet({
  crossOriginResourcePolicy: false,
}));

// Routes
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/applications', require('./routes/applicationRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/upload', require('./routes/uploadRoutes'));

app.get('/', (req, res) => {
  res.send('PhD Tracking System API is running...');
});

// Middleware for Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;

app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
