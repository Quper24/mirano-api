import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { setupProductRoutes } from './productController.js';
import { setupOrderRoutes } from './orderController.js';
import { setupCartRoutes } from './cartController.js';

const app = express();
const PORT = process.env.PORT || 3000;

const MY_SITE = 'http://localhost:5173';

app.use(
  cors({
    origin: MY_SITE, // Замените это на ваш домен фронтенда
    credentials: true,
  }),
);

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', MY_SITE); // Аналогично origin в CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS',
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(cookieParser());

app.use(express.json());
app.use('/img', express.static('img'));

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
