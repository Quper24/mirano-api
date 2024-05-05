// filterUtils.js
const filterBySearch = (products, searchQuery) => {
  return products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );
};

const filterByIds = (products, idList) => {
  return products.filter(product => idList.includes(product.id));
};

const filterByCriteria = (products, min, max, category) => {
  return products.filter(
    product =>
      product.price >= min &&
      product.price <= max &&
      (!category || product.categories.includes(category)),
  );
};

export { filterBySearch, filterByIds, filterByCriteria };
