import { readFile, writeFile } from 'node:fs/promises';

export const loadData = async () => {
  try {
    const data = await readFile('db.json');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read data file:', err);
    throw err;
  }
};

export const loadOrders = async () => {
  try {
    const data = await readFile('orders.json', 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Failed to read orders file:', err);
    return [];
  }
};

export const saveOrders = async orders => {
  try {
    await writeFile('orders.json', JSON.stringify(orders, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write to orders file:', err);
    return false;
  }
};
