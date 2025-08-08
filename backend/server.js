import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import db from './models/index.js'; // Sequelize models

import authRoutes from './routes/authRoutes.js';
//import { authenticateToken, authorizeRoles } from './middleware/authMiddleware.js';

import orderRoutes from './routes/orderRoutes.js';
import tableRoutes from './routes/tableRoutes.js';
import menuRoutes from './routes/menuRoutes.js';
import inventoryRoutes from './routes/inventoryRoutes.js';
import reservationRoutes from './routes/reservationRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Global Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan('dev'));
app.use(express.json()); // Handle JSON bodies
app.use(express.urlencoded({ extended: true })); // Handle form-encoded bodies


// Auth routes
app.use('/api/auth', authRoutes);

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/reservations', reservationRoutes);

// Root Health Route
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Restaurant Management API is running.' });
});

// Sequelize Sync + Start Server
const startServer = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connected...');

    // Optional: sync if not using migrations
    // await db.sequelize.sync({ alter: true });

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error.message);
    process.exit(1);
  }
};

startServer();
