import stemmer from 'snowball-stemmers';

const ruStemmer = stemmer.newStemmer('russian');

const removePunctuation = text =>
  text.replace(/[\.,-\/#!$%\^&\*;:{}=\-_`~()]/g, '');

const normalizeAndStem = text => {
  return removePunctuation(text)
    .toLowerCase()
    .split(' ')
    .map(word => word.trim())
    .filter(word => word.length > 0)
    .map(word => ruStemmer.stem(word));
};

const filterBySearch = (products, searchQuery, min, max, category) => {
  const searchWords = normalizeAndStem(searchQuery);

  const filteredProducts = products.filter(product => {
    const productWords = normalizeAndStem(product.name);

    return searchWords.every(searchWord =>
      productWords.some(productWord => productWord.includes(searchWord)),
    );
  });

  return filteredProducts.filter(
    product =>
      product.price >= min &&
      product.price <= max &&
      (!category || product.categories.includes(category)),
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
