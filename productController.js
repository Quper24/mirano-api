import { loadData } from './dataService.js';
import {
  filterBySearch,
  filterByIds,
  filterByCriteria,
} from './filterUtils.js';

const setupProductRoutes = app => {
  app.get('/api/products', async (req, res) => {
    try {
      const data = await loadData();
      const { type, minPrice, maxPrice, search, list, category } = req.query;
      console.log('req.query: ', req.query);
      const allProducts = [].concat(...Object.values(data));

      if ((minPrice || maxPrice || category) && (!type && !search)) {
        return res.status(400).json({
          error:
            "Parameters 'minPrice', 'maxPrice', 'category' require 'type' to be specified",
        });
      }

      if (list) {
        const idList = list.split(',').map(Number);
        const filteredProducts = filterByIds(allProducts, idList);
        return res.json(filteredProducts);
      }

      if (search) {
        console.log('Search query:', search);

        const min = parseInt(minPrice) || 0;
        const max = parseInt(maxPrice) || Number.MAX_SAFE_INTEGER;
        const filteredProducts = filterBySearch(
          allProducts,
          search,
          min,
          max,
          category,
        );
        // console.log('filteredProducts: ', filteredProducts);
        return res.json(filteredProducts);
      }

      if (type) {
        const products = data[type];
        if (!products) {
          return res.status(400).json({ error: 'Invalid type parameter' });
        }
        const min = parseInt(minPrice) || 0;
        const max = parseInt(maxPrice) || Number.MAX_SAFE_INTEGER;
        const filteredProducts = filterByCriteria(products, min, max, category);
        return res.json(filteredProducts);
      }

      res.json(allProducts);
    } catch (err) {
      console.error('Server error:', err);
      res.status(500).json({ error: 'Failed to process request' });
    }
  });
};

export { setupProductRoutes };
