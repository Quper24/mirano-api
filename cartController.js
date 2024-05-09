import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'node:fs/promises';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const setupCartRoutes = app => {
  app.get('/api/users/accessKey', async (req, res) => {
    const accessKey =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
    const userCart = {
      accessKey,
      products: [],
    };

    const filepath = path.join(__dirname, 'userCart.json');

    try {
      const data = await fs.readFile(filepath, 'utf-8');
      const carts = JSON.parse(data || '[]');
      carts.push(userCart);

      await fs.writeFile(filepath, JSON.stringify(carts, null, 2), 'utf-8');

      res.cookie('accessKey', accessKey, {
        maxAge: 604800000,
        httpOnly: true,
        path: '/',
        secure: false,
        sameSite: 'None',
      });

      res.json({ accessKey });
    } catch (err) {
      console.error('Failed to generate access key:', err);
      res.status(500).json({ message: 'Error processing request' });
    }
  });

  app.get('/api/cart', async (req, res) => {
    const accessKey = req.cookies.accessKey;
    if (!accessKey) {
      return res.status(401).json({ message: 'No access key provided' });
    }

    const filepath = path.join(__dirname, 'userCart.json');
    try {
      const data = await fs.readFile(filepath, 'utf-8');
      const carts = JSON.parse(data || '[]');
      const userCart = carts.find(cart => cart.accessKey === accessKey);

      if (!userCart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      res.json(userCart);
    } catch (err) {
      console.error('Error reading cart:', err);
      res.status(500).json({ message: 'Failed to get cart' });
    }
  });

  app.post('/api/cart/products', async (req, res) => {
    const accessKey = req.cookies.accessKey;
    if (!accessKey) {
      return res.status(401).json({ message: 'No access key provided' });
    }

    const { productId, quantity } = req.body;
    if (!productId || quantity <= 0) {
      return res.status(400).json({ message: 'Invalid product data' });
    }

    const filepath = path.join(__dirname, 'userCart.json');
    try {
      const data = await fs.readFile(filepath, 'utf-8');
      const carts = JSON.parse(data || '[]');
      const userCart = carts.find(cart => cart.accessKey === accessKey);

      if (!userCart) {
        return res.status(404).json({ message: 'Cart not found' });
      }

      const productIndex = userCart.products.findIndex(
        product => product.id === productId,
      );
      if (productIndex >= 0) {
        userCart.products[productIndex].quantity += quantity;
      } else {
        userCart.products.push({ id: productId, quantity });
      }

      await fs.writeFile(filepath, JSON.stringify(carts, null, 2), 'utf-8');
      res.json({ message: 'Product added to cart', cart: userCart });
    } catch (err) {
      console.error('Error updating cart:', err);
      res.status(500).json({ message: 'Failed to update cart' });
    }
  });
};
