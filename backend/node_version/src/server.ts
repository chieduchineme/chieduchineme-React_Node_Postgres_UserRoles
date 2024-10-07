import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import roleRoutes from './routes/roleRoutes';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';
import { syncSequelize } from './config/syncSequelize';
import dotenv from 'dotenv';

dotenv.config();
// syncSequelize();
const app = express();

app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET_KEY!,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // Prevents client-side access to the cookie
      secure: process.env.NODE_ENV === 'production', // Use only over HTTPS in production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1-week expiry
    },
  })
);

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.FRONTEND_URL!, // Allow frontend to communicate with the backend
  credentials: true,
}));
app.use(helmet());

// Set security headers
app.use(helmet.crossOriginOpenerPolicy({ policy: 'same-origin' }));
app.use(helmet.crossOriginEmbedderPolicy({ policy: 'require-corp' }));

// Routes
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/roles', roleRoutes);


// Server setup
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


