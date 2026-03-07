import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';

import { authRouter } from './routes/auth';
import { documentsRouter } from './routes/documents';
import { petitionsRouter } from './routes/petitions';
import { searchRouter } from './routes/search';
import { deadlinesRouter } from './routes/deadlines';
import { chatRouter } from './routes/chat';
import { errorHandler } from './middlewares/errorHandler';
import { logger } from './utils/logger';

const app = express();
const PORT = process.env.PORT || 3000;

// Security
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRouter);
app.use('/api/documents', documentsRouter);
app.use('/api/petitions', petitionsRouter);
app.use('/api/search', searchRouter);
app.use('/api/deadlines', deadlinesRouter);
app.use('/api/chat', chatRouter);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

export default app;
