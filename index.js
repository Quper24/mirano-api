import express from 'express';
import cors from 'cors';
import { randomUUID } from 'crypto';
import { readFile, writeFile } from 'node:fs/promises';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/img', express.static('img'));

const loadData = async () => {
  const data = await readFile('db.json');
  return JSON.parse(data);
};

const loadOrders = async () => {
  try {
    const data = await readFile('orders.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read orders file:', err);
    return [];
  }
};

const saveOrders = async orders => {
  try {
    await writeFile('orders.json', JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write to orders file:', err);
    return false;
  }
};

app.get('/api/products', async (req, res) => {
  const data = await loadData();
  let { category, minPrice, maxPrice, name } = req.query;

  minPrice = parseInt(minPrice) || 0;
  maxPrice = parseInt(maxPrice) || Number.MAX_SAFE_INTEGER;
  name = name ? name.toLowerCase() : '';

  const filterItems = items =>
    items
      .filter(item => item.price >= minPrice && item.price <= maxPrice)
      .filter(item => !category || item.categories.includes(category))
      .filter(item => item.name.toLowerCase().includes(name));

  const products = {
    bouquets: filterItems(data.bouquets),
    toys: filterItems(data.toys),
    postcards: filterItems(data.postcards),
  };

  res.json(products);
});

app.get('/api/bouquets', async (req, res) => {
  const data = await loadData();
  res.json(data.bouquets);
});

app.get('/api/toys', async (req, res) => {
  const data = await loadData();
  res.json(data.toys);
});

app.get('/api/postcards', async (req, res) => {
  const data = await loadData();
  res.json(data.postcards);
});

app.post('/api/orders', async (req, res) => {
  const {
    buyer,
    recipient,
    address,
    paymentOnline,
    deliveryDate,
    deliveryTime,
    products,
  } = req.body;

  if (!buyer || !recipient || !address || !products) {
    return res
      .status(400)
      .json({ error: 'Missing required information for the order' });
  }

  if (
    !Array.isArray(products) ||
    products.some(
      p => typeof p.id !== 'number' || typeof p.quantity !== 'number',
    )
  ) {
    return res.status(400).json({ error: 'Invalid products list' });
  }

  const orders = await loadOrders();
  const order = {
    id: randomUUID(),
    buyer,
    recipient,
    address,
    paymentOnline,
    deliveryDate,
    deliveryTime,
    products,
  };

  orders.push(order);

  const saveSuccess = await saveOrders(orders);
  if (!saveSuccess) {
    return res.status(500).json({ error: 'Failed to save the order' });
  }

  res.status(201).json({
    message: 'Order received and saved successfully',
    orderId: order.id,
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
