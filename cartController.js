import { readFile, writeFile } from 'node:fs/promises';
import { randomUUID } from 'crypto';

const CART_FILE = 'cart.json';

async function readCartData() {
  try {
    const data = await readFile(CART_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading the cart file:', error);
    return {};
  }
}

async function writeCartData(data) {
  console.log('data: ', data);
  try {
    await writeFile(CART_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing the cart file:', error);
  }
}

export const setupCartRoutes = app => {
  app.post('/api/cart/register', async (req, res) => {
    const carts = await readCartData();
    const accessKey = randomUUID();
    carts[accessKey] = { items: [] };

    await writeCartData(carts);
    res.cookie('accessKey', accessKey, { httpOnly: true });
    res.json({ accessKey });
  });

  app.get('/api/cart', async (req, res) => {
    const accessKey = req.cookies.accessKey;
    console.log('accessKey: ', accessKey);
    if (!accessKey) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const carts = await readCartData();
    const cart = carts[accessKey];
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    res.json(cart);
  });

  app.post('/api/cart/items', async (req, res) => {
    const accessKey = req.cookies.accessKey;
    if (!accessKey) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const carts = await readCartData();
    const cart = carts[accessKey];
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const { productId, quantity } = req.body;
    const item = { productId, quantity };
    cart.items.push(item);

    await writeCartData(carts);
    res.json({ message: 'Item added to cart', cart });
  });
};
