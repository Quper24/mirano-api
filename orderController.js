import { randomUUID } from 'crypto';
import { loadOrders, saveOrders } from './dataService.js';

export const setupOrderRoutes = app => {
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

    if (!(await saveOrders(orders))) {
      return res.status(500).json({ error: 'Failed to save the order' });
    }

    res.status(201).json({
      message: 'Order received and saved successfully',
      orderId: order.id,
    });
  });
};
