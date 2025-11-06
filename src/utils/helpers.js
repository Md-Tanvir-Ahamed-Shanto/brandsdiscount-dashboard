/* eslint-disable no-unused-vars */
// Helper functions for the dashboard

import { ALL_POSSIBLE_PUBLISHING_PLATFORMS, CATEGORIES_STRUCTURE, ORDER_STATUSES, PLATFORMS, PRODUCT_STATUSES, SIZE_TYPES } from "../constants";

export const getRandomSubset = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * (n + 1)));
};

export const generateMockProducts = (count) => {
    const products = [];
    const brands = ["Calvin Klein", "DKNY", "Nike", "Adidas", "Levi's", "Zara", "H&M", "Gap", "Puma", "Ralph Lauren"];
    const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow", "Purple", "Orange", "Pink", "Brown", "Gray"];
    let productSkuCounter = 10001;
  
    for (let i = 0; i < count; i++) {
      const parentCat = CATEGORIES_STRUCTURE[Math.floor(Math.random() * CATEGORIES_STRUCTURE.length)];
      const subCat = parentCat.subCategories[Math.floor(Math.random() * parentCat.subCategories.length)];
      const typeCat = subCat.types[Math.floor(Math.random() * subCat.types.length)];
      const brand = brands[Math.floor(Math.random() * brands.length)];
      const regularPrice = parseFloat((Math.random() * 100 + 20).toFixed(2));
      const hasSale = Math.random() > 0.5;
      const salePrice = hasSale ? parseFloat((regularPrice * (Math.random() * 0.3 + 0.6)).toFixed(2)) : null;
      const hasTenDollarOffer = Math.random() > 0.3;
      const sizeType = SIZE_TYPES[Math.floor(Math.random() * SIZE_TYPES.length)];
      
      const product = {
        id: `prod_${Date.now()}_${i}`, 
        name: `${brand} ${typeCat.name} - ${colors[Math.floor(Math.random() * colors.length)]}`,
        sku: `SKU-${productSkuCounter++}`,
        brand: brand,
        category: { parent: parentCat.parent, sub: subCat.name, type: typeCat.name, typeId: typeCat.id },
        regularPrice: regularPrice,
        salePrice: salePrice,
        hasTenDollarOffer: hasTenDollarOffer,
        offerPrice: hasTenDollarOffer ? 10.00 : null,
        quantity: Math.floor(Math.random() * 100),
        imageUrl: "https://placehold.co/100x100/E0E0E0/555555?text=Prod", // Generic placeholder
        listedOn: getRandomSubset(ALL_POSSIBLE_PUBLISHING_PLATFORMS.map(p => p.id), ALL_POSSIBLE_PUBLISHING_PLATFORMS.length),
        description: `A high-quality ${typeCat.name} from ${brand}. Perfect for various occasions. Made with comfortable materials.`,
        color: colors[Math.floor(Math.random() * colors.length)], 
        size: sizeType === 'Other' ? `${Math.floor(Math.random()*10)+28}W` : '', 
        sizeType: sizeType, 
        itemLocation: `Warehouse ${String.fromCharCode(65 + Math.floor(Math.random()*5))}-${Math.floor(Math.random()*10)}`,
        condition: Math.random() > 0.2 ? "New" : "Used - Like New",
        status: PRODUCT_STATUSES[Math.floor(Math.random() * PRODUCT_STATUSES.length)],
        dateAdded: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        variants: [], 
      };
  
      if (Math.random() > 0.6) { 
          const numVariants = Math.floor(Math.random() * 3) + 2; 
          let totalVariantQuantity = 0;
          for (let v = 0; v < numVariants; v++) {
              const variantColor = colors[Math.floor(Math.random() * colors.length)];
              const variantSizeType = SIZE_TYPES[Math.floor(Math.random() * SIZE_TYPES.length)];
              const variantQuantity = Math.floor(Math.random() * 20) + 5;
              totalVariantQuantity += variantQuantity;
              product.variants.push({
                  id: `var_${Date.now()}_${i}_${v}`,
                  color: variantColor,
                  sizeType: variantSizeType,
                  size: variantSizeType === 'Other' ? `${Math.floor(Math.random()*8)+30}W` : '',
                  quantity: variantQuantity,
                  skuSuffix: `${variantColor.substring(0,2).toUpperCase()}-${variantSizeType.substring(0,1)}`,
                  price: Math.random() > 0.8 ? parseFloat((regularPrice * (Math.random() * 0.2 + 0.9)).toFixed(2)) : null, 
              });
          }
          product.quantity = totalVariantQuantity; 
      }
      products.push(product);
    }
  
    products.unshift({
      id: "prod_ck_dress", name: "Calvin Klein Sheath Dress", sku: "CK-DRS-001", brand: "Calvin Klein",
      category: { parent: "Women", sub: "Womens Dresses", type: "Cocktail and Party Dresses", typeId: "334a60c6-1ab6-497f-9f2f-e227d03b4f96" },
      regularPrice: 129.99, salePrice: 109.99, hasTenDollarOffer: true, offerPrice: 10.00, quantity: 15,
      imageUrl: "https://placehold.co/100x100/E0E0E0/555555?text=CK", 
      description: "Elegant Calvin Klein sheath dress, perfect for cocktails or parties.", color: "Black", size: "", sizeType: "M (8-10)", itemLocation: "A-1", condition: "New", status: "Active", dateAdded: new Date(), variants: []
    });
    products.unshift({
      id: "prod_dkny_top", name: "DKNY Silk Blouse", sku: "DKNY-TOP-005", brand: "DKNY",
      category: { parent: "Women", sub: "Womens Tops", type: "Blouses and Shirts", typeId: "8989c733-d203-472f-8ab5-feb1675fe30f" },
      regularPrice: 89.50, salePrice: null, hasTenDollarOffer: false, offerPrice: null, quantity: 0,
      imageUrl: "https://placehold.co/100x100/E0E0E0/555555?text=DKNY",
      description: "Luxurious DKNY silk blouse, versatile for work or casual wear.", color: "Ivory", size: "S", sizeType: "S (4-6)", itemLocation: "B-3", condition: "New", status: "Active", dateAdded: new Date(), variants: []
    });
    return products;
  };

export  const generateMockOrders = (count, products) => {
    const orders = [];
    const customers = ["John Doe", "Jane Smith", "Alice Brown", "Bob Green", "Charlie Black", "Eva White", "David Lee"];
    let orderIdCounter = 50001;
  
    for (let i = 0; i < count; i++) {
      const numItems = Math.floor(Math.random() * 3) + 1;
      const orderItems = [];
      let orderTotal = 0;
      let fulfillmentLocation = "N/A";
      for (let j = 0; j < numItems; j++) {
        const productIndex = Math.floor(Math.random() * products?.length || 0);
        const product = products[20 + productIndex];
        // const product = null
        if (!product) continue; 
        const quantity = Math.floor(Math.random() * 2) + 1;
        
        let priceUsed = product.regularPrice;
        let itemName = product.name;
        if (product.variants && product.variants.length > 0 && Math.random() > 0.5) { 
            const variant = product.variants[Math.floor(Math.random() * product.variants.length)];
            priceUsed = variant.price || product.salePrice || product.regularPrice;
            itemName = `${product.name} (${variant.color}, ${variant.sizeType} ${variant.size})`;
        } else {
            priceUsed = product.salePrice || product.regularPrice;
        }
        priceUsed = priceUsed || 20; 
  
        orderItems.push({ productId: product.id, name: itemName, quantity, price: priceUsed, itemLocation: product.itemLocation });
        orderTotal += priceUsed * quantity;
        if (j === 0) fulfillmentLocation = product.itemLocation;
      }
      const availablePlatforms = PLATFORMS.map(p => p.id);
      const orderSourcePlatformId = availablePlatforms[Math.floor(Math.random() * availablePlatforms.length)];
      
      orders.push({
        id: `ORD-${orderIdCounter++}`,
        customerName: customers[Math.floor(Math.random() * customers.length)],
        customerEmail: `${customers[Math.floor(Math.random() * customers.length)].toLowerCase().replace(' ', '.')}@example.com`,
        date: new Date(Date.now() - Math.floor(Math.random() * 90) * 24 * 60 * 60 * 1000),
        status: ORDER_STATUSES[Math.floor(Math.random() * ORDER_STATUSES.length)],
        items: orderItems,
        totalAmount: parseFloat(orderTotal.toFixed(2)),
        source: orderSourcePlatformId,
        transactionId: `TRANS-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
        paymentStatus: Math.random() > 0.1 ? "Paid" : "Pending Payment",
        fulfillmentLocation: fulfillmentLocation,
      });
    }
    if (orders.length > 5) {
      orders[0].source = 'store';
      orders[1].source = 'woocommerce';
      orders[2].source = 'store';
    }
    return orders;
  };

export  const generateMockNotifications = (count, products, orders) => {
    const notifications = [];
    for(let i=0; i<count; i++) {
        // Only generate sale notifications
        if (orders?.length > 0 ) { 
            const order = orders[Math.floor(Math.random() * orders.length)];
            const platform = PLATFORMS.find(p => p.id === order.source);
            let title = `New Sale on ${platform?.name || order.source}!`;
            let message = `Order ${order.id} for ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')} sold on ${platform?.name || order.source}. Fulfillment from ${order.fulfillmentLocation}.`;
            let severity = 'info';

            if (order.source === 'store') {
                title = `ITEM SOLD FROM PHYSICAL STORE!`;
                message = `Order ${order.id} (Physical Store Sale): ${order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}. Inventory has been deducted.`;
                severity = 'critical'; 
            } else if (platform && (['ebay1', 'ebay2', 'ebay3', 'shein', 'walmart', 'woocommerce'].includes(platform.id) )) { 
                 message += ` Please ensure stock is removed from physical store if applicable.`;
            }
            notifications.push({
                id: `notif_sale_${Date.now()}_${i}`, type: order.source === 'store' ? 'physical_store_sale' : 'sale_notification', title,
                message, date: order.date, read: Math.random() > 0.5, orderId: order.id, severity, itemLocation: order.fulfillmentLocation
            });
        }
    }
    if (products?.length > 0 && orders?.length > 0) {
        const ckDressOrder = orders?.find(o => o.items.some(item => item.productId === "prod_ck_dress") && o.source !== 'store');
        if (ckDressOrder) {
            const platform = PLATFORMS.find(p => p.id === ckDressOrder.source);
            if (platform) {
                notifications.unshift({
                    id: `notif_ck_sale_online`, type: 'sale_notification', title: `Calvin Klein Dress Sold on ${platform.name}!`,
                    message: `Calvin Klein Sheath Dress from order ${ckDressOrder.id} sold on ${platform.name}. Remove from physical store inventory. Fulfillment from ${ckDressOrder.fulfillmentLocation}.`,
                    date: ckDressOrder.date, read: false, orderId: ckDressOrder.id, severity: 'critical', itemLocation: ckDressOrder.fulfillmentLocation
                });
            }
        }
    }
    return notifications.sort((a,b) => new Date(b.date) - new Date(a.date));
}

export const getStatusColor = (status) => {
  if (status === 'Active') return 'bg-green-500/30 text-green-300';
  if (status === 'Hidden') return 'bg-yellow-500/30 text-yellow-300';
  if (status === 'Draft' || status === 'draft') return 'bg-gray-500/30 text-gray-300';
  return 'bg-red-500/30 text-red-300';
};

export const getListedPlatformNames = (listedOnIds, status) => {
  const platformNames = (listedOnIds || [])
    .map(id => ALL_POSSIBLE_PUBLISHING_PLATFORMS.find(p => p.id === id)?.name)
    .filter(Boolean);
  if (status === 'Active' && !platformNames.includes("Website")) {
    platformNames.push("Website");
  }
  return platformNames.length > 0 ? platformNames.join(', ') : (status === 'Active' ? 'Website' : 'None');
};

export const calculateTotalSales = (filteredOrders) => {
  return filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
};

export const filterSalesByDate = (orderList, startDate, endDate) => {
  console.log("order list", orderList)
  if(orderList){
    return orderList?.filter(order => {
      // Use createdAt field from the actual API response, fallback to date field for compatibility
      const orderDate = new Date(order.createdAt || order.date);
      return orderDate >= startDate && orderDate <= endDate;
    });
  }
 
};

// Import category mapping data
import categoryMapping from '../../categoryMaping.json';

/**
 * Maps a category ID to its full category path using the categoryMapping.json file
 * @param {string} categoryId - The category ID to map
 * @returns {object|null} - Returns an object with category information or null if not found
 */
export const mapCategoryById = (categoryId) => {
  if (!categoryId) return null;

  // Search through all category sections
  const allCategories = [
    ...Object.values(categoryMapping.womens_categories).flat(),
    ...Object.values(categoryMapping.mens_categories).flat(),
    ...Object.values(categoryMapping.kids_categories).flat(),
    ...categoryMapping.general_categories
  ];

  // Find the category by ID
  const foundCategory = allCategories.find(cat => 
    cat.website_category_id === categoryId
  );

  if (foundCategory) {
    return {
      id: foundCategory.website_category_id,
      name: foundCategory.website_category_name,
      ebayCategory: foundCategory.ebay_category,
      // Determine the department/parent category
      department: foundCategory.ebay_category?.department || 'General'
    };
  }

  return null;
};

/**
 * Gets the full category hierarchy for a product based on available category information
 * @param {object} productData - The product data from the database
 * @returns {object} - Returns category information with fallback mapping
 */
export const getProductCategoryInfo = (productData) => {
  const result = {
    categoryId: '',
    subCategoryId: '',
    parentCategoryId: '',
    categoryName: '',
    fullPath: ''
  };

  // If we have complete category information from the database
  if (productData.category?.id && productData.subCategory?.id && productData.parentCategory?.id) {
    result.categoryId = productData.category.id;
    result.subCategoryId = productData.subCategory.id;
    result.parentCategoryId = productData.parentCategory.id;
    result.categoryName = `${productData.parentCategory.name} > ${productData.subCategory.name} > ${productData.category.name}`;
    result.fullPath = result.categoryName;
    return result;
  }

  // If we only have category ID, try to map it using categoryMapping.json
  if (productData.category?.id || productData.categoryId) {
    const categoryId = productData.category?.id || productData.categoryId;
    const mappedCategory = mapCategoryById(categoryId);
    
    if (mappedCategory) {
      result.categoryId = categoryId;
      result.categoryName = mappedCategory.name;
      result.fullPath = `${mappedCategory.department} > ${mappedCategory.name}`;
      
      // Try to extract parent and sub category info if available
      if (productData.subCategory?.id) {
        result.subCategoryId = productData.subCategory.id;
      }
      if (productData.parentCategory?.id) {
        result.parentCategoryId = productData.parentCategory.id;
      }
      
      return result;
    }
  }

  // Fallback: use whatever category information is available
  if (productData.category?.name) {
    result.categoryName = productData.category.name;
    result.fullPath = productData.category.name;
    if (productData.category.id) {
      result.categoryId = productData.category.id;
    }
  }

  return result;
};
