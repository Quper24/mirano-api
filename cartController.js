import { randomUUID } from 'crypto';
import {
  readCartData,
  writeCartData,
  updateCartWithProductInfo,
} from './cartUtils.js';

export const setupCartRoutes = app => {
  app.post('/api/cart/register', async (req, res) => {
    const carts = await readCartData();
    const accessKey = req.cookies.accessKey;

    if (accessKey && carts[accessKey]) {
      res.json({ accessKey, message: 'Existing cart key reused.' });
    } else {
      const newAccessKey = randomUUID();
      carts[newAccessKey] = { items: [] };
      await writeCartData(carts);
      res.cookie('accessKey', newAccessKey, {
        httpOnly: true,
        path: '/',
        secure: true,
        sameSite: 'None',
      });
      res.json({ accessKey: newAccessKey });
    }
  });

  app.get('/api/cart', async (req, res) => {
    const accessKey = req.cookies.accessKey;
    if (!accessKey) return res.status(401).json({ error: 'Access denied' });

    const carts = await readCartData();
    const cart = carts[accessKey];
    if (!cart) return res.status(404).json({ error: 'Cart not found' });

    const cartItems = await updateCartWithProductInfo(cart);
    res.json(cartItems);
  });

  app.post('/api/cart/items', async (req, res) => {
    const { productId, quantity } = req.body;
    const accessKey = req.cookies.accessKey;
    if (!accessKey) {
      return res.status(401).json({ error: 'Access denied' });
    }

    const carts = await readCartData();
    const cart = carts[accessKey];
    if (!cart) {
      return res.status(404).json({ error: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId === productId,
    );

    if (quantity <= 0) {
      // Если количество равно 0 или меньше, удаляем товар из корзины
      if (itemIndex !== -1) {
        cart.items.splice(itemIndex, 1);
        await writeCartData(carts);
      } else {
        res.status(404).json({ error: 'Product not found in cart' });
        return; // Выходим, чтобы не выполнить последующий код
      }
    } else {
      // Обновляем или добавляем новый товар в корзину
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
      } else {
        const newItem = { productId, quantity };
        cart.items.push(newItem);
      }
      await writeCartData(carts);
    }

    // Возвращаем обновленный список товаров в корзине с дополнительной информацией
    const updatedCartItems = await updateCartWithProductInfo(cart);
    res.json(updatedCartItems);
  });
};
