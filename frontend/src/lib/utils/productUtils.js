// utils/productUtils.js
export const formatProduct = (product) => {
  if (!product) return null;

  const baseProduct = {
    id: product.id || '',
    title: product.name || '',
    categoryLabel: product.category || '',
    image: product.mainImage || product.image || '',
    price: parseFloat(product.price) || 0,
    originalPrice: parseFloat(product.originalPrice) || 0,
    discount: product.discountPercent || 0,
    rating: parseFloat(product.rating) || 0,
    color: product.colors?.[0] || '',
    sizes: product.sizes || [],
    isFeatured: product.isFeatured || false
  };

  // Thêm tag nếu có discount
  if (baseProduct.discount > 0) {
    baseProduct.tagLabels = [`Giảm ${baseProduct.discount}%`];
  } else {
    baseProduct.tagLabels = [];
  }

  return baseProduct;
};

// Validate product data
export const validateProduct = (product) => {
  const errors = [];

  if (!product.id) errors.push('Thiếu ID sản phẩm');
  if (!product.name) errors.push('Thiếu tên sản phẩm');
  if (!product.mainImage) errors.push('Thiếu hình ảnh chính');
  if (!product.price) errors.push('Thiếu giá sản phẩm');
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Filter products by category
export const filterByCategory = (products, category) => {
  if (!category) return products;
  return products.filter(product => product.category === category);
};

// Sort products
export const sortProducts = (products, sortBy = 'createdAt', order = 'desc') => {
  const sorted = [...products];
  
  switch (sortBy) {
    case 'price':
      sorted.sort((a, b) => {
        const priceA = parseFloat(a.price) || 0;
        const priceB = parseFloat(b.price) || 0;
        return order === 'asc' ? priceA - priceB : priceB - priceA;
      });
      break;
      
    case 'rating':
      sorted.sort((a, b) => {
        const ratingA = parseFloat(a.rating) || 0;
        const ratingB = parseFloat(b.rating) || 0;
        return order === 'asc' ? ratingA - ratingB : ratingB - ratingA;
      });
      break;
      
    case 'discount':
      sorted.sort((a, b) => {
        const discountA = a.discountPercent || 0;
        const discountB = b.discountPercent || 0;
        return order === 'asc' ? discountA - discountB : discountB - discountA;
      });
      break;
      
    default:
      // Default sort by name
      sorted.sort((a, b) => a.name.localeCompare(b.name));
  }
  
  return sorted;
};