import express from 'express';
import cors from 'cors';
import { readFile } from 'node:fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/img', express.static('img'));

const loadData = async () => {
  const data = await readFile('db.json');
  return JSON.parse(data);
};

// Получение всех товаров с фильтрацией по категории и цене
app.get('/api/products', async (req, res) => {
  const data = await loadData();
  let { category, minPrice, maxPrice, name } = req.query;

  minPrice = parseInt(minPrice) || 0;
  maxPrice = parseInt(maxPrice) || Number.MAX_SAFE_INTEGER;
  name = name ? name.toLowerCase() : '';

  const filterItems = (items) => items
    .filter(item => (item.price >= minPrice && item.price <= maxPrice))
    .filter(item => !category || item.categories.includes(category))
    .filter(item => item.name.toLowerCase().includes(name));

  const products = {
    bouquets: filterItems(data.bouquets),
    toys: filterItems(data.toys),
    postcards: filterItems(data.postcards)
  };

  res.json(products);
});

// Получение букетов
app.get('/api/bouquets', async (req, res) => {
  const data = await loadData();
  res.json(data.bouquets);
});

// Получение игрушек
app.get('/api/toys', async (req, res) => {
  const data = await loadData();
  res.json(data.toys);
});

// Получение открыток
app.get('/api/postcards', async (req, res) => {
  const data = await loadData();
  res.json(data.postcards);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
