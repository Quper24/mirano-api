import { randomUUID } from 'crypto';
import { loadOrders, saveOrders } from './dataService.js';
import { readCartData, writeCartData } from './cartUtils.js';

export const setupOrderRoutes = app => {
  app.post('/api/orders', async (req, res) => {
    const {
      buyer,
      recipient,
      address,
      paymentOnline,
      deliveryDate,
      deliveryTime,
    } = req.body;

    const accessKey = req.cookies.accessKey;
    if (!accessKey) return res.status(401).json({ error: 'Access denied' });

    if (!buyer || !recipient) {
      return res
        .status(400)
        .json({ error: 'Missing required information for the order' });
    }

    const carts = await readCartData();
    const cart = carts[accessKey];

    if (!cart?.items?.length)
      return res.status(404).json({ error: 'Cart not found or empty cart' });

    const orders = await loadOrders();
    const order = {
      id: accessKey,
      buyer,
      recipient,
      address,
      paymentOnline,
      deliveryDate,
      deliveryTime,
      products: cart.items,
    };

    orders.push(order);

    if (!(await saveOrders(orders))) {
      return res.status(500).json({ error: 'Failed to save the order' });
    }

    const newAccessKey = randomUUID();
    res.cookie('accessKey', newAccessKey, {
      httpOnly: true,
      path: '/',
      secure: true,
      sameSite: 'None',
    });
    carts[newAccessKey] = { items: [] };
    await writeCartData(carts);

    res.status(201).json({
      message: 'Order received and saved successfully',
      orderId: order.id,
    });
  });
};
