import express from 'express';
import cors from 'cors';
import { setupProductRoutes } from './productController.js';
import { setupOrderRoutes } from './orderController.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/img', express.static('img'));

app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

setupProductRoutes(app);
setupOrderRoutes(app);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
