import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import fs from 'fs';
import 'express-async-errors';
import { setupProductRoutes } from './productController.js';
import { setupOrderRoutes } from './orderController.js';
import { setupCartRoutes } from './cartController.js';

const app = express();
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: 'http://localhost:5173', // Замените на URL вашего фронтенда
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use('/img', express.static('img'));

// Read the Swagger JSON file
const swaggerDocument = JSON.parse(
  fs.readFileSync('./docs/swagger.json', 'utf8'),
);

// Middleware для документации API
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

setupProductRoutes(app);
setupOrderRoutes(app);
setupCartRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running http://localhost:${PORT}`);
});
