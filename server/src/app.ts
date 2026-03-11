import express from 'express';
import cors from 'cors';
import path from 'path';
import { env } from './config/env';
import { errorMiddleware } from './middleware/error.middleware';

// Routes
import webhookRoutes from './routes/webhook.routes';
import authRoutes from './routes/auth.routes';
import messageRoutes from './routes/message.routes';
import conversationRoutes from './routes/conversation.routes';
import contactRoutes from './routes/contact.routes';
import templateRoutes from './routes/template.routes';
import mediaRoutes from './routes/media.routes';
import userRoutes from './routes/user.routes';

const app = express();

// Middleware
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());

// Routes
app.use('/api/webhook', webhookRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/conversations', conversationRoutes);
app.use('/api/contacts', contactRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/media', mediaRoutes);
app.use('/api/users', userRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Serve client build in production
if (env.NODE_ENV === 'production') {
  const clientDist = path.resolve(__dirname, '../../client/dist');
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

// Error handler
app.use(errorMiddleware);

export default app;
