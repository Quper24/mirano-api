import { readFile, writeFile } from 'node:fs/promises';
import { loadData } from './dataService.js';

const CART_FILE = 'cart.json';

export async function readCartData() {
  try {
    const data = await readFile(CART_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading the cart file:', error);
    return {};
  }
}

export async function writeCartData(data) {
  try {
    await writeFile(CART_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing the cart file:', error);
  }
}

export async function updateCartWithProductInfo(cart) {
  const data = await loadData();
  const allProducts = [].concat(...Object.values(data));
  return cart.items
    .map(item => {
      const product = allProducts.find(
        product => product.id === item.productId,
      );
      if (product) {
        return { ...product, quantity: item.quantity };
      }
      return null;
    })
    .filter(item => item !== null);
}
