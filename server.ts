import express from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import connectDB from './backend/config/db.ts';
import authRoutes from './backend/routes/authRoutes.ts';
import listingRoutes from './backend/routes/listingRoutes.ts';
import bookingRoutes from './backend/routes/bookingRoutes.ts';
import stayRoutes from './backend/routes/stayRoutes.ts';
import favoriteRoutes from './backend/routes/favoriteRoutes.ts';
import { notFound, errorHandler } from './backend/middleware/errorMiddleware.ts';
import { seedStays } from './backend/controllers/stayController.ts';

dotenv.config();

async function startServer() {
  await connectDB();
  await seedStays();

  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/listings', listingRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/stays', stayRoutes);
  app.use('/api/favorites', favoriteRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Error Middleware
  app.use(notFound);
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
