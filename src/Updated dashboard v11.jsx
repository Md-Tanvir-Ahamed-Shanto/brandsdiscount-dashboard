/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronDown, Search, Bell, ShoppingCart, Package, Users, BarChart2, Settings, LogOut, ChevronRight, ExternalLink, AlertCircle, CheckCircle, XCircle, Filter, List, LayoutGrid, Trash2, Edit3, PlusCircle, Eye, Layers, PackageCheck, PackageX, Store, Globe, Link as LinkIcon, ChevronLeft, ChevronsLeft, ChevronsRight, Mail, EyeOff, Archive, DollarSign, Sliders, CheckSquare, Edit, ArrowLeft, Save, UploadCloud, UserPlus, ShieldAlert, Info, Check, CloudLightning, MapPin, Building, Plus, Palette, Ruler, Menu } from 'lucide-react';

// --- Data Structures and Initial Data ---

const CATEGORIES_STRUCTURE = [
  {
    parent: "Women",
    subCategories: [
      { name: "Womens Tops", id: "wtops", types: [ { name: "Blouses and Shirts", id: "8989c733-d203-472f-8ab5-feb1675fe30f" }, { name: "Tees and Tank Tops", id: "887116be-e7fd-4f1b-b6d8-a4211b57f5d0" }, { name: "Sweaters and Cardigans", id: "a5d6ad16-2b71-40b7-98d6-e2ad39315e1e" }, { name: "Hoodies and Sweatshirts", id: "2e4d25a7-895e-4377-9393-ede7d8278450" }] },
      { name: "Womens Swimwear", id: "wswim", types: [ { name: "Bikinis", id: "7a85a281-3470-41fe-99fa-917b90e17c9d" }, { name: "One-Piece Swimsuits", id: "474dd0ec-8745-4f43-859c-d79301948850" }, { name: "Tankinis", id: "b3e1d076-35e9-46d9-be85-12ec78783a6c" }, { name: "Swim Cover-Ups", id: "b356a1a7-ad8d-405a-b42f-c846ec11953f" }] },
      { name: "Womens Shoes", id: "wshoes", types: [ { name: "Heels and Pumps", id: "c88bf84a-0185-4486-b17b-fbfd344a57c3" }, { name: "Boots and Booties", id: "bcd6a486-88b9-4426-827a-e351925770a4" }, { name: "Sneakers and Trainers", id: "002a7c26-b335-4d98-b702-e52cfa2a0496" }, { name: "Sandals and Flats", id: "6f88e3b2-32b0-452b-a207-a1dc1304f228" }] },
      { name: "Womens Outerwear", id: "wouter", types: [ { name: "Jackets and Coats", id: "cf1aa1d5-b47f-4554-a2b2-98ac215f4084" }, { name: "Blazers and Vests", id: "5d09c335-b05d-4e5d-a253-76e0ab541a8a" }, { name: "Leather and Denim Jackets", id: "11fcd79e-cafd-4295-afde-c4d3f729ecac" }, { name: "Trench and Rain Coats", id: "fa82afef-c889-408a-b63b-66e0f1103bfa" }] },
      { name: "Womens Dresses", id: "wdress", types: [ { name: "Cocktail and Party Dresses", id: "334a60c6-1ab6-497f-9f2f-e227d03b4f96" }, { name: "Casual and Day Dresses", id: "4a6b94ea-9ff1-444c-b072-231e1798cb40" }, { name: "Maxi and Midi Dresses", id: "fc961686-ba71-4143-b5d6-ca4ff61b7e55" }, { name: "Evening and Formal Dresses", id: "9c1be2bc-2c45-4393-9ebd-b406a400ebda" }] },
      { name: "Womens Bottoms", id: "wbottoms", types: [ { name: "Pants and Trousers", id: "34fc4531-41a9-42f1-b302-5e757deb6415" }, { name: "Skirts and Mini Skirts", id: "b92e8655-c4c0-46e9-9ac9-af442d4a0aef" }, { name: "Jeans and Denim", id: "9386ef58-9940-4c46-8c17-8e0e8ddbdb2a" }, { name: "Leggings and Shorts", id: "3e6b2127-5fbd-4b97-bc0a-08af23489fd1" }] },
      { name: "Womens Lingerie & Sleepwear", id: "wlingerie", types: [ { name: "Bras and Bralettes", id: "b89d7f2b-e368-4179-a5ff-a4f840a5b329" }, { name: "Panties and Thongs", id: "c4482192-c40a-4889-ba30-a442c5e68edd" }, { name: "Pajamas and Nightgowns", id: "b70fb4bb-e00e-496e-8cbc-9a1a71a835c3" }, { name: "Lingerie Sets", id: "c54447a4-1e73-4b7c-a211-02f11a8695aa" }] },
    ]
  },
  {
    parent: "Men",
    subCategories: [
      { name: "Mens Underwear & Loungewear", id: "munderwear", types: [ { name: "Boxers and Briefs", id: "3b447d4e-98ac-43f9-96aa-2ad17569e972" }, { name: "Loungewear and Pajamas", id: "be8a8da1-af51-492b-9089-cf1daf8d171a" }] },
      { name: "Mens Swimwear", id: "mswim", types: [ { name: "Board Shorts", id: "f52d3546-73fe-4c41-b3e3-72f3a25960a4" }, { name: "Swim Trunks", id: "fb697ef2-9cec-4120-8547-7f525c37154b" }, { name: "Rash Guards", id: "39c0f2eb-2b4a-43b9-9911-66419a47b84b" }] },
      { name: "Mens Suits & Formalwear", id: "msuits", types: [ { name: "Business Suits", id: "7f191d2d-b29d-42a9-96c1-490742bf0d79" }, { name: "Tuxedos", id: "fc4d032e-53e7-460b-809f-ed5ed502073f" }] },
      { name: "Mens Shoes", id: "mshoes", types: [ { name: "Casual Shoes", id: "99d58506-db55-4f70-b473-b2dd03288703" }, { name: "Formal Shoes", id: "e1e491b0-fc20-4a54-94cc-ab27bf47a6e0" }, { name: "Sneakers", id: "497bcb53-a7c3-4b57-be96-b70507d7b3d3" }, { name: "Boots", id: "9c6c0967-db26-4f02-9586-fffcddb8b4b4" }] },
      { name: "Mens Shirts & Tops", id: "mtops", types: [ { name: "Casual Shirts", id: "12fa1417-a38f-42a3-ba6d-8c14b61b72cd" }, { name: "Formal Shirts", id: "949d670a-e609-4f87-9c46-14ddeb9ecf4f" }, { name: "T-Shirts and Polos", id: "0be99aaa-da4e-4f13-be48-4a29b33c1fb2" }, { name: "Sweatshirts and Hoodies", id: "8b728699-1568-4e02-9a86-0dba6fdccead" }] },
      { name: "Mens Pants & Bottoms", id: "mbottoms", types: [ { name: "Jeans", id: "10652ab7-6d7e-4106-a930-d5766c8dbf71" }, { name: "Chinos and Trousers", id: "10df2e89-7541-424a-a565-65af0063408b" }, { name: "Shorts", id: "ac43a772-cd46-4f75-ad43-37e52666d25b" }] },
      { name: "Mens Outerwear", id: "mouter", types: [ { name: "Casual Jackets", id: "e6fe24f1-9bcb-4514-98ac-9ee405cb8cbb" }, { name: "Tailored Blazers", id: "38e3e349-6653-4c64-82de-f35cc72517ba" }, { name: "Rain Protection", id: "b4b32a1d-67ad-4ed8-bbb2-364ecd2a76b4" }] },
      { name: "Mens Activewear", id: "mactive", types: [ { name: "Gym and Sportswear", id: "3c1a6a9b-bb62-4e62-bf11-65a12ca03a27" }, { name: "Running and Track Wear", id: "f3dde62f-276b-4537-ac8c-ae30e52c724c" }] },
    ]
  },
  {
    parent: "Kids",
    subCategories: [
      { name: "Kids Shoes", id: "kshoes", types: [ { name: "Kids Shoes", id: "b8e01650-7259-4869-bd75-16883a4b5d24" }] },
      { name: "Kids Apparel", id: "kapparel", types: [ { name: "Tops", id: "800c2876-f58b-46e0-9cd4-08b4ff3d0c8b" }, { name: "Bottoms", id: "a6d26bc6-d263-4f66-a208-ceec2b0fe038" }, { name: "Outerwear", id: "3c1855a4-3715-4719-97f3-5d9eaa3cb3f4" }] },
    ]
  },
  {
    parent: "General Apparel",
    subCategories: [
      { name: "Accessories", id: "gaccessories", types: [{name: "Hats", id:"genhats"}, {name: "Scarves", id:"genscarves"}] },
    ]
  },
  {
    parent: "Others",
    subCategories: [
      { name: "Miscellaneous", id: "othersmisc", types: [{name: "Uncategorized", id:"otheruncat"}] },
    ]
  }
];


const PLATFORMS = [
    { id: "website", name: "Website", icon: Globe },
    { id: "store", name: "Physical Store", icon: Store },
    { id: "ebay1", name: "eBay1", icon: ExternalLink },
    { id: "ebay2", name: "eBay2", icon: ExternalLink },
    { id: "ebay3", name: "eBay3", icon: ExternalLink }, 
    { id: "shein", name: "SHEIN", icon: ExternalLink },
    { id: "walmart", name: "Walmart", icon: ExternalLink },
    { id: "woocommerce", name: "WooCommerce", icon: ShoppingCart },
];

const ALL_POSSIBLE_PUBLISHING_PLATFORMS = [
    { id: "ebay1", name: "eBay1" }, { id: "ebay2", name: "eBay2" }, { id: "ebay3", name: "eBay3" }, 
    { id: "shein", name: "SHEIN" }, { id: "walmart", name: "Walmart" },
    { id: "woocommerce", name: "WooCommerce"}
];

const PRODUCT_STATUSES = ['Active', 'Hidden', 'Draft'];
const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded", "On Hold"];
const SIZE_TYPES = ['XXS (00)', 'XS (0-2)', 'S (4-6)', 'M (8-10)', 'L (12-14)', 'XL (16-18)', 'XXL+ (20+)', 'O/S', 'Other'];
const USER_ROLES = ['Superadmin', 'Admin', 'Cashier', 'WarehouseUploader', 'ProductLister', 'Customer']; 

const PERMISSIONS = {
    Superadmin: ['overview', 'products', 'orders', 'categories', 'inventory', 'notifications', 'users', 'settings', 'addProduct', 'editProduct'],
    Admin: ['overview', 'products', 'orders', 'categories', 'inventory', 'notifications', 'users', 'settings', 'addProduct', 'editProduct'],
    Cashier: ['inventory'],
    WarehouseUploader: ['addProduct'], 
    ProductLister: ['products', 'addProduct', 'editProduct', 'categories'],
    Customer: [],
};


const getRandomSubset = (arr, n) => {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * (n + 1)));
};

const generateMockProducts = (count) => {
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

const generateMockOrders = (count, products) => {
  const orders = [];
  const customers = ["John Doe", "Jane Smith", "Alice Brown", "Bob Green", "Charlie Black", "Eva White", "David Lee"];
  let orderIdCounter = 50001;

  for (let i = 0; i < count; i++) {
    const numItems = Math.floor(Math.random() * 3) + 1;
    const orderItems = [];
    let orderTotal = 0;
    let fulfillmentLocation = "N/A";
    for (let j = 0; j < numItems; j++) {
      const productIndex = Math.floor(Math.random() * products.length);
      const product = products[productIndex];
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


const generateMockNotifications = (count, products, orders) => {
    const notifications = [];
    for(let i=0; i<count; i++) {
        // Only generate sale notifications
        if (orders.length > 0 ) { 
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
    if (products.length > 0 && orders.length > 0) {
        const ckDressOrder = orders.find(o => o.items.some(item => item.productId === "prod_ck_dress") && o.source !== 'store');
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


// --- Utility Components ---
const Modal = ({ isOpen, onClose, title, children, size = "lg" }) => {
  if (!isOpen) return null;
  const sizeClasses = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg', xl: 'max-w-xl', '2xl': 'max-w-2xl', '3xl': 'max-w-3xl', '4xl': 'max-w-4xl', '5xl': 'max-w-5xl' };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out">
      <div className={`bg-gray-800 p-6 rounded-lg shadow-xl w-full ${sizeClasses[size]} max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-in-out scale-95 animate-modalPopIn`}>
        <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <XCircle size={24} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes modalPopIn { 0% { transform: scale(0.95); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
  .animate-modalPopIn { animation: modalPopIn 0.2s ease-out forwards; }
  .notification-critical { font-weight: bold; color: #F87171; } 
`;
document.head.appendChild(styleSheet);


const ImageWithFallback = ({ src, fallbackSrc, alt, className }) => {
    const [imgSrc, setImgSrc] = useState(src);
    useEffect(() => { setImgSrc(src); }, [src]);
    return (<img src={imgSrc || fallbackSrc} alt={alt} className={className} onError={() => setImgSrc(fallbackSrc)}/>);
};

const Pagination = ({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems, onItemsPerPageChange }) => {
  if (totalPages <= 1 && totalItems <= itemsPerPage) return null;
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) { pageNumbers.push(i); }

  return (
    <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400">
      <div className="mb-2 sm:mb-0">
        Showing <span className="font-medium text-white">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-white">{Math.min(currentPage * itemsPerPage, totalItems)}</span> of <span className="font-medium text-white">{totalItems}</span> results
      </div>
      <div className="flex items-center">
         <label htmlFor="itemsPerPage" className="mr-2">Show:</label>
        <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
            className="bg-gray-700 text-white rounded-md p-1.5 focus:ring-indigo-500 focus:border-indigo-500 mr-3 text-xs"
        >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
        </select>
        {totalPages > 1 && (
            <nav className="flex items-center space-x-1">
            <button onClick={() => onPageChange(1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"><ChevronsLeft size={16}/></button>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"><ChevronLeft size={16}/></button>
            {pageNumbers.slice(Math.max(0, currentPage-2), Math.min(totalPages, currentPage+1)).map(num => (
                <button key={num} onClick={() => onPageChange(num)} className={`px-3 py-1.5 rounded-md ${currentPage === num ? 'bg-indigo-600 text-white' : 'hover:bg-gray-700'}`}>{num}</button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"><ChevronRight size={16}/></button>
            <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} className="p-2 rounded-md hover:bg-gray-700 disabled:opacity-50"><ChevronsRight size={16}/></button>
            </nav>
        )}
      </div>
    </div>
  );
};

const Sidebar = ({ activeView, setActiveView, currentUser, isOpen, setIsOpen }) => {
  const navItems = [
    { name: 'Overview', icon: BarChart2, view: 'overview' }, { name: 'Products', icon: Package, view: 'products' },
    { name: 'Orders', icon: ShoppingCart, view: 'orders' }, 
    { name: 'Categories', icon: Layers, view: 'categories' },
    { name: 'Inventory', icon: List, view: 'inventory' }, { name: 'Notifications', icon: Bell, view: 'notifications' },
    { name: 'Users', icon: Users, view: 'users' }, { name: 'Settings', icon: Settings, view: 'settings' },
  ];

  const userPermissions = PERMISSIONS[currentUser.role] || [];
  const visibleNavItems = navItems.filter(item => userPermissions.includes(item.view) || (currentUser.role === 'Customer' && item.view === 'overview'));

  const handleLinkClick = (view) => {
    setActiveView(view);
    if(window.innerWidth < 1024) { // Close sidebar on mobile after clicking a link
        setIsOpen(false);
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      ></div>
      <div className={`fixed lg:relative top-0 left-0 h-full w-64 bg-gray-900 text-gray-300 flex flex-col transition-transform transform z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 text-center border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">POS Dashboard</h1>
          <p className="text-xs text-indigo-400 mt-1">Logged in as: {currentUser.username} ({currentUser.role})</p>
        </div>
        <nav className="flex-grow p-3">
          {visibleNavItems.map((item) => (
            <button key={item.name} onClick={() => handleLinkClick(item.view)}
              className={`flex items-center w-full px-4 py-3 mb-1 rounded-lg transition-colors duration-200 ${activeView === item.view ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-700 hover:text-white'}`}>
              <item.icon size={20} className="mr-3" />{item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200">
            <LogOut size={20} className="mr-3" />Logout
          </button>
        </div>
      </div>
    </>
  );
};

const GlobalHeader = ({ title, unreadNotificationsCount, onNotificationsClick, currentUser, onMenuClick }) => {
    return (
      <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
        <div className="flex items-center">
            <button onClick={onMenuClick} className="lg:hidden text-gray-400 hover:text-white mr-4">
                <Menu size={24} />
            </button>
            <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative hidden sm:block">
            <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search..." className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-40 md:w-64"/>
          </div>
          <button onClick={onNotificationsClick} className="relative text-gray-400 hover:text-white">
            <Bell size={24} />
            {unreadNotificationsCount > 0 && (<span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">{unreadNotificationsCount}</span>)}
          </button>
          <div className="flex items-center">
            <img src={`https://placehold.co/40x40/7F7F7F/FFFFFF?text=${currentUser?.username?.substring(0,1).toUpperCase() || 'U'}`} alt="User Avatar" className="w-8 h-8 md:w-10 md:h-10 rounded-full" />
            <ChevronDown size={20} className="ml-1 text-gray-400 hidden md:block" />
          </div>
        </div>
      </header>
    );
  };

const Overview = ({ products, orders }) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0); 
  
  const dayOfWeek = now.getDay(); 
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; 
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
  startOfWeek.setHours(0,0,0,0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23,59,59,999);


  const filterSalesByDate = (orderList, startDate, endDate) => {
    return orderList.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= startDate && orderDate <= endDate && order.status === 'Delivered';
    });
  };

  const calculateTotalSales = (filteredOrders) => {
    return filteredOrders.reduce((sum, order) => sum + order.totalAmount, 0);
  };
  
  const salesThisMonth = useMemo(() => calculateTotalSales(filterSalesByDate(orders, startOfMonth, endOfMonth)), [orders, startOfMonth, endOfMonth]);
  const salesThisWeek = useMemo(() => calculateTotalSales(filterSalesByDate(orders, startOfWeek, endOfWeek)), [orders, startOfWeek, endOfWeek]);

  const totalSalesAllTime = useMemo(() => calculateTotalSales(orders.filter(o => o.status === 'Delivered')), [orders]);
  const totalActiveProducts = products.filter(p => p.status === 'Active').length;

  const recentSales = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10); 
  }, [orders]);

  const physicalStoreSales = useMemo(() => {
    return orders.filter(order => order.source === 'store');
  }, [orders]);
  
  const physicalStoreSalesTotal = useMemo(() => calculateTotalSales(physicalStoreSales.filter(o => o.status === 'Delivered')), [physicalStoreSales]);


  const statsCards = [
    { title: "Total Sales (All Time)", value: `$${totalSalesAllTime.toFixed(2)}`, icon: BarChart2, color: "text-green-400" },
    { title: "Sales This Month", value: `$${salesThisMonth.toFixed(2)}`, icon: DollarSign, color: "text-green-300" },
    { title: "Sales This Week", value: `$${salesThisWeek.toFixed(2)}`, icon: DollarSign, color: "text-green-200" },
    { title: "Active Products", value: totalActiveProducts, icon: Package, color: "text-yellow-400" },
    { title: "Total Orders (All Time)", value: orders.length, icon: ShoppingCart, color: "text-blue-400" },
    { title: "Physical Store Sales (Delivered)", value: `$${physicalStoreSalesTotal.toFixed(2)} (${physicalStoreSales.filter(o=>o.status === 'Delivered').length} orders)`, icon: Store, color: "text-teal-400" },
  ];
  
  const getPlatformIcon = (platformId) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    return platform?.icon ? <platform.icon size={18} className="mr-2 opacity-80" /> : <Globe size={18} className="mr-2 opacity-80" />;
  };


  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6"> 
        {statsCards.map(stat => (
          <div key={stat.title} className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-indigo-500/30 transition-shadow">
            <div className={`p-3 rounded-full bg-gray-700 ${stat.color}`}><stat.icon size={28} /></div>
            <div><p className="text-gray-400 text-sm">{stat.title}</p><p className="text-2xl font-semibold text-white">{stat.value}</p></div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Sales by Platform</h3>
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {recentSales.length > 0 ? recentSales.map(order => (
                <div key={order.id} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white font-medium">{order.id} - {order.customerName}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs ${order.status === 'Delivered' ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>{order.status}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400 flex items-center">
                            {getPlatformIcon(order.source)}
                            {PLATFORMS.find(p => p.id === order.source)?.name || order.source} - {new Date(order.date).toLocaleDateString()}
                        </span>
                        <span className="text-green-400 font-semibold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
            )) : <p className="text-gray-500">No recent sales.</p>}
            </div>
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
            <h3 className="text-xl font-semibold text-white mb-4">Physical Store Sales Highlights</h3>
             <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {physicalStoreSales.length > 0 ? physicalStoreSales.slice(0,10).map(order => ( 
                <div key={order.id} className="bg-gray-700 p-3 rounded-lg">
                    <div className="flex justify-between items-center text-sm">
                        <span className="text-white font-medium">{order.id} - {order.customerName}</span>
                         <span className={`px-2 py-0.5 rounded-full text-xs ${order.status === 'Delivered' ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>{order.status}</span>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                        <span className="text-teal-400 font-semibold">${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Items: {order.items.map(i => `${i.quantity}x ${i.name.substring(0,20)}...`).join(', ')}</p>
                </div>
            )) : <p className="text-gray-500">No sales from physical store yet.</p>}
            </div>
        </div>
      </div>
    </div>
  );
};


const ProductsList = ({ products: initialProducts, categoriesStructure, setActiveView, setCurrentEditingProductId, onUpdateProducts, currentUser }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', brand: '', status: '', itemLocationFilter: '' });
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingQuantity, setEditingQuantity] = useState({});

  const userPermissions = PERMISSIONS[currentUser.role] || [];
  const canEditProducts = userPermissions.includes('editProduct');
  const canAddProducts = userPermissions.includes('addProduct');

  const uniqueBrands = useMemo(() => [...new Set(initialProducts.map(p => p.brand))], [initialProducts]);
  
  const filteredAndSortedProducts = useMemo(() => {
    return initialProducts
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filters.category ? `${product.category.parent} > ${product.category.sub} > ${product.category.type}` === filters.category : true;
        const matchesBrand = filters.brand ? product.brand === filters.brand : true;
        const matchesStatus = filters.status ? product.status === filters.status : true;
        const matchesItemLocation = filters.itemLocationFilter ? (product.itemLocation || '').toLowerCase().includes(filters.itemLocationFilter.toLowerCase()) : true;
        return matchesSearch && matchesCategory && matchesBrand && matchesStatus && matchesItemLocation;
      })
      .sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }, [initialProducts, searchTerm, filters]);

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage);

  const handleSelectProduct = (productId) => {
    setSelectedProducts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) newSet.delete(productId);
      else newSet.add(productId);
      return newSet;
    });
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProducts(new Set(paginatedProducts.map(p => p.id)));
    } else {
      setSelectedProducts(new Set());
    }
  };

  const handleQuantityChange = (productId, value) => {
    const numValue = parseInt(value, 10);
    setEditingQuantity(prev => ({ ...prev, [productId]: isNaN(numValue) ? '' : numValue }));
  };

  const saveQuantityChange = (productId) => {
    const newQuantity = editingQuantity[productId];
    if (newQuantity !== '' && !isNaN(newQuantity) && newQuantity >=0) {
        const updatedProducts = initialProducts.map(p => {
            if (p.id === productId) {
                return {...p, quantity: parseInt(newQuantity, 10)};
            }
            return p;
        });
        onUpdateProducts(updatedProducts);
    } else if (newQuantity < 0) {
        console.warn("Quantity cannot be negative.");
    }
    setEditingQuantity(prev => { const copy = {...prev}; delete copy[productId]; return copy; });
  };

  const handleEditClick = (productId) => {
    if (!canEditProducts && !(currentUser.role === 'WarehouseUploader' && initialProducts.find(p=>p.id === productId)?.status === 'Draft') ) {
      return;
    }
    setCurrentEditingProductId(productId);
    setActiveView('editProduct');
  };

  const handleQuickAction = (productId, action) => {
    if (!canEditProducts && currentUser.role === 'WarehouseUploader') return; // WHU cannot do quick actions other than edit
    let updatedProducts = [...initialProducts];
    if (action === 'toggleOffer') {
        updatedProducts = initialProducts.map(p => p.id === productId ? {...p, hasTenDollarOffer: !p.hasTenDollarOffer, offerPrice: !p.hasTenDollarOffer ? 10.00 : null } : p);
    } else if (PRODUCT_STATUSES.includes(action)) {
        updatedProducts = initialProducts.map(p => p.id === productId ? {...p, status: action } : p);
    }
    onUpdateProducts(updatedProducts);
  };

  const handleBulkAction = (action, newStatus = null) => {
    if (!canEditProducts) return;
    if (selectedProducts.size === 0) {
      console.warn("No products selected for bulk action.");
      return;
    }
    let updatedProducts = [...initialProducts];
    const selectedIds = Array.from(selectedProducts);

    if (action === 'setDraft' || action === 'setHidden' || action === 'setActive') {
      updatedProducts = initialProducts.map(p => selectedIds.includes(p.id) ? { ...p, status: newStatus } : p);
    } else if (action === 'toggleOfferBulk') {
      const firstSelected = initialProducts.find(p => p.id === selectedIds[0]);
      const targetOfferState = firstSelected ? !firstSelected.hasTenDollarOffer : true;
      updatedProducts = initialProducts.map(p => selectedIds.includes(p.id) ? { ...p, hasTenDollarOffer: targetOfferState, offerPrice: targetOfferState ? 10.00 : null } : p);
    } else if (action === 'updateInventoryBulk') {
        const newQtyStr = prompt("Enter new quantity for selected products (affects main quantity):");
        if (newQtyStr !== null) {
            const newQty = parseInt(newQtyStr);
            if (!isNaN(newQty) && newQty >= 0) {
                updatedProducts = initialProducts.map(p => selectedIds.includes(p.id) ? { ...p, quantity: newQty } : p);
            } else {
                console.warn("Invalid quantity. Please enter a non-negative number."); return;
            }
        } else return;
    }
    onUpdateProducts(updatedProducts);
    setSelectedProducts(new Set());
  };
  
  const getStatusColor = (status) => {
    if (status === 'Active') return 'bg-green-500/30 text-green-300';
    if (status === 'Hidden') return 'bg-yellow-500/30 text-yellow-300';
    if (status === 'Draft') return 'bg-gray-500/30 text-gray-300';
    return 'bg-red-500/30 text-red-300';
  };
  
  const getListedPlatformNames = (listedOnIds, status) => {
    const platformNames = (listedOnIds || [])
        .map(id => ALL_POSSIBLE_PUBLISHING_PLATFORMS.find(p => p.id === id)?.name) 
        .filter(Boolean); 
    if (status === 'Active' && !platformNames.includes("Website")) {
        platformNames.push("Website"); 
    }
    return platformNames.length > 0 ? platformNames.join(', ') : (status === 'Active' ? 'Website' : 'None');
  };


  return (
    <div className="p-4 md:p-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
            <h3 className="text-xl font-semibold text-white">Products ({filteredAndSortedProducts.length} total)</h3>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search products..." value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-72"/>
            </div>
            {canAddProducts && (
                <button onClick={() => { setCurrentEditingProductId(null); setActiveView('addProduct'); }} className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center whitespace-nowrap"><PlusCircle size={20} className="mr-2"/> Add Product</button>
            )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-800 rounded-lg shadow">
        <select value={filters.category} onChange={e => {setFilters({...filters, category: e.target.value}); setCurrentPage(1);}} className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">All Categories</option>
          {categoriesStructure.flatMap(pc => pc.subCategories.flatMap(sc => sc.types.map(tc => <option key={tc.id} value={`${pc.parent} > ${sc.name} > ${tc.name}`}>{`${pc.parent} > ${sc.name} > ${tc.name}`}</option>)))}
        </select>
        <select value={filters.brand} onChange={e => {setFilters({...filters, brand: e.target.value}); setCurrentPage(1);}} className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">All Brands</option>
          {uniqueBrands.map(brand => <option key={brand} value={brand}>{brand}</option>)}
        </select>
        <select value={filters.status} onChange={e => {setFilters({...filters, status: e.target.value}); setCurrentPage(1);}} className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500">
          <option value="">All Statuses</option>
          {PRODUCT_STATUSES.map(status => <option key={status} value={status}>{status}</option>)}
        </select>
        <input
            type="text"
            placeholder="Filter by Item Location..."
            value={filters.itemLocationFilter || ''}
            onChange={e => { setFilters({ ...filters, itemLocationFilter: e.target.value }); setCurrentPage(1); }}
            className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
        />
        <button onClick={() => {setFilters({ category: '', brand: '', status: '', itemLocationFilter: '' }); setCurrentPage(1);}} className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center"><Filter size={18} className="mr-2"/> Clear Filters</button>
      </div>

      {selectedProducts.size > 0 && canEditProducts && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg flex flex-wrap items-center gap-3">
            <span className="text-white text-sm font-medium">{selectedProducts.size} selected</span>
            <button onClick={() => handleBulkAction('updateInventoryBulk')} className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs flex items-center"><Edit size={14} className="mr-1"/> Qty</button>
            <button onClick={() => handleBulkAction('setActive', 'Active')} className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs flex items-center"><Check size={14} className="mr-1"/> Set Active</button>
            <button onClick={() => handleBulkAction('setHidden', 'Hidden')} className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-xs flex items-center"><EyeOff size={14} className="mr-1"/> Set Hidden</button>
            <button onClick={() => handleBulkAction('setDraft', 'Draft')} className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded text-xs flex items-center"><Archive size={14} className="mr-1"/> Set Draft</button>
            <button onClick={() => handleBulkAction('toggleOfferBulk')} className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded text-xs flex items-center"><DollarSign size={14} className="mr-1"/> Toggle $10 Offer</button>
        </div>
      )}
      
      <div className="bg-gray-800 shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 w-10"><input type="checkbox" onChange={handleSelectAll} checked={selectedProducts.size === paginatedProducts.length && paginatedProducts.length > 0 && paginatedProducts.every(p => selectedProducts.has(p.id))} className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"/></th>
              <th scope="col" className="px-4 py-3">Product</th>
              <th scope="col" className="px-4 py-3">SKU</th>
              <th scope="col" className="px-4 py-3">Item Location</th>
              <th scope="col" className="px-4 py-3">Prices (Reg/Sale/Offer)</th>
              <th scope="col" className="px-4 py-3 text-center">Qty</th>
              <th scope="col" className="px-4 py-3">Status</th>
              <th scope="col" className="px-4 py-3">Platforms</th> 
              <th scope="col" className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProducts.map(product => (
              <tr key={product.id} className={`border-b border-gray-700 hover:bg-gray-700/50 ${selectedProducts.has(product.id) ? 'bg-gray-700' : 'bg-gray-800'}`}>
                <td className="px-4 py-3"><input type="checkbox" checked={selectedProducts.has(product.id)} onChange={() => handleSelectProduct(product.id)} className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"/></td>
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap flex items-center">
                  <ImageWithFallback src={product.imageUrl} fallbackSrc={`https://placehold.co/40x40/777/FFF?text=${product.brand ? product.brand.substring(0,1) : 'P'}`} alt={product.name} className="w-10 h-10 rounded-md object-cover mr-3"/>
                  <div>
                    <span className="truncate max-w-xs block" title={product.name}>{product.name}</span>
                    <span className="text-xs text-gray-500">{product.category?.type} {product.variants && product.variants.length > 0 && <span className="text-blue-400">(Has Variants)</span>}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{product.sku}</td>
                <td className="px-4 py-3">{product.itemLocation || 'N/A'}</td>
                <td className="px-4 py-3">
                    <div>${product.regularPrice?.toFixed(2)}</div>
                    {product.salePrice && <div className="text-yellow-400">${product.salePrice.toFixed(2)}</div>}
                    {product.hasTenDollarOffer && product.offerPrice && <div className="text-purple-400">${product.offerPrice.toFixed(2)} (Offer)</div>}
                </td>
                <td className="px-4 py-3 text-center">
                    {typeof editingQuantity[product.id] !== 'undefined' && canEditProducts && (!product.variants || product.variants.length === 0) ? ( 
                        <div className="flex items-center justify-center">
                            <input type="number" value={editingQuantity[product.id]} onChange={(e) => handleQuantityChange(product.id, e.target.value)} className="w-16 bg-gray-600 text-white p-1 rounded text-center"/>
                            <button onClick={() => saveQuantityChange(product.id)} className="ml-1 text-green-400 hover:text-green-300"><CheckCircle size={18}/></button>
                        </div>
                    ) : (
                        <span 
                            onClick={() => canEditProducts && (!product.variants || product.variants.length === 0) && setEditingQuantity({...editingQuantity, [product.id]: product.quantity })} 
                            className={`${canEditProducts && (!product.variants || product.variants.length === 0) ? 'cursor-pointer hover:text-white' : ''} ${product.quantity === 0 ? 'text-red-400 font-semibold' : ''}`}
                        >
                            {product.quantity}
                        </span>
                    )}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)} ${product.quantity === 0 && product.status === 'Active' ? 'ring-1 ring-red-400' : ''}`}>
                    {product.quantity === 0 && product.status === 'Active' ? 'Sold Out' : product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs">{getListedPlatformNames(product.listedOn, product.status)}</td> 
                <td className="px-4 py-3">
                  { (canEditProducts || (currentUser.role === 'WarehouseUploader' && product.status === 'Draft') ) && ( 
                    <div className="flex space-x-1 items-center">
                        <button onClick={() => handleEditClick(product.id)} className="text-blue-400 hover:text-blue-300 p-1" title="Edit Product"><Edit3 size={16}/></button>
                        { currentUser.role !== 'WarehouseUploader' && 
                          <>
                            <select
                                value={product.status}
                                onChange={(e) => handleQuickAction(product.id, e.target.value)}
                                className="bg-gray-700 text-xs text-white p-1 rounded focus:ring-0 border-0 appearance-none"
                                title="Change Status"
                            >
                                {PRODUCT_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                            <button onClick={() => handleQuickAction(product.id, 'toggleOffer')} className={`p-1 ${product.hasTenDollarOffer ? 'text-purple-400 hover:text-purple-300' : 'text-gray-500 hover:text-gray-300'}`} title={product.hasTenDollarOffer ? "Disable $10 Offer" : "Enable $10 Offer"}>
                                <DollarSign size={16}/>
                            </button>
                          </>
                        }
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginatedProducts.length === 0 && <p className="text-center text-gray-500 mt-8">No products found matching your criteria.</p>}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} itemsPerPage={itemsPerPage} totalItems={filteredAndSortedProducts.length} onItemsPerPageChange={(val) => {setItemsPerPage(val); setCurrentPage(1);}} />
    </div>
  );
};


const OrdersList = ({ orders: initialOrders, products, onUpdateOrderStatus, currentUser }) => {
  const [orders, setOrders] = useState(initialOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState(new Set());
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });

  const userPermissions = PERMISSIONS[currentUser.role] || [];
  const canUpdateOrderStatus = userPermissions.includes('orders');

  useEffect(() => {
    setOrders(initialOrders.sort((a,b) => new Date(b.date) - new Date(a.date)));
  }, [initialOrders]);

  const handleViewOrder = (order) => { setSelectedOrder(order); setIsOrderModalOpen(true); };

  const handleOpenEmailModal = (order) => {
    setSelectedOrder(order);
    setEmailData({
        to: order.customerEmail,
        subject: `Update for your order ${order.id}`,
        body: `Dear ${order.customerName},\n\nRegarding your order ${order.id} placed on ${new Date(order.date).toLocaleDateString()}:\n\n[Your update here]\n\nThank you,\nStore Team`
    });
    setIsEmailModalOpen(true);
  };
  const handleSendEmail = () => {
    console.log(`Simulating email send to: ${emailData.to}\nSubject: ${emailData.subject}\nBody: ${emailData.body}`);
    setIsEmailModalOpen(false);
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(orderId)) newSet.delete(orderId);
      else newSet.add(orderId);
      return newSet;
    });
  };

  const handleSelectAllOrders = (e) => {
    if (e.target.checked) {
      setSelectedOrders(new Set(orders.map(o => o.id)));
    } else {
      setSelectedOrders(new Set());
    }
  };
  
  const getOrderStatusColorClasses = (status) => {
    switch (status) {
        case 'Delivered': return 'bg-green-500/30 text-green-300';
        case 'Shipped': return 'bg-blue-500/30 text-blue-300';
        case 'Processing': return 'bg-yellow-500/30 text-yellow-300';
        case 'Pending':
        case 'On Hold': return 'bg-orange-500/30 text-orange-300';
        case 'Cancelled':
        case 'Refunded': return 'bg-red-500/30 text-red-300';
        default: return 'bg-gray-500/30 text-gray-300';
    }
  };


  return (
    <div className="p-4 md:p-6">
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
            <h3 className="text-xl font-semibold text-white">All Orders ({orders.length})</h3>
            {selectedOrders.size > 0 && (
                <div className="text-sm text-indigo-300">{selectedOrders.size} order(s) selected</div>
            )}
        </div>
        <div className="bg-gray-800 shadow-xl rounded-xl overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                    <tr>
                        <th scope="col" className="px-4 py-3 w-10"><input type="checkbox" onChange={handleSelectAllOrders} checked={selectedOrders.size === orders.length && orders.length > 0} className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"/></th>
                        <th scope="col" className="px-6 py-3">Order ID</th>
                        <th scope="col" className="px-6 py-3">Customer</th>
                        <th scope="col" className="px-6 py-3">Date & Time</th>
                        <th scope="col" className="px-6 py-3">Source</th>
                        <th scope="col" className="px-6 py-3">Fulfill Loc.</th>
                        <th scope="col" className="px-6 py-3">Total</th>
                        <th scope="col" className="px-6 py-3">Status</th>
                        <th scope="col" className="px-6 py-3">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} className={`border-b border-gray-700 hover:bg-gray-700/50 ${selectedOrders.has(order.id) ? 'bg-gray-700' : 'bg-gray-800'}`}>
                            <td className="px-4 py-3"><input type="checkbox" checked={selectedOrders.has(order.id)} onChange={() => handleSelectOrder(order.id)} className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"/></td>
                            <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                            <td className="px-6 py-4">{order.customerName}</td>
                            <td className="px-6 py-4">{new Date(order.date).toLocaleString()}</td>
                            <td className="px-6 py-4">{PLATFORMS.find(p=>p.id === order.source)?.name || order.source}</td>
                            <td className="px-6 py-4">{order.fulfillmentLocation}</td>
                            <td className="px-6 py-4 text-green-400 font-semibold">${order.totalAmount.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                {canUpdateOrderStatus ? (
                                    <select
                                        value={order.status}
                                        onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                                        className={`text-xs p-1 rounded focus:ring-0 border-0 appearance-none !bg-transparent ${getOrderStatusColorClasses(order.status).split(' ')[1]}`}
                                    >
                                        {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-gray-700 text-white">{s}</option>)}
                                    </select>
                                ) : (
                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColorClasses(order.status)}`}>
                                        {order.status}
                                    </span>
                                )}
                            </td>
                            <td className="px-6 py-4 flex space-x-2">
                                <button onClick={() => handleViewOrder(order)} className="text-blue-400 hover:text-blue-300" title="View Order"><Eye size={18}/></button>
                                {canUpdateOrderStatus && <button onClick={() => handleOpenEmailModal(order)} className="text-indigo-400 hover:text-indigo-300" title="Email Customer"><Mail size={18}/></button>}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title={`Order Details: ${selectedOrder?.id}`} size="xl">
            {selectedOrder && (
                <div className="text-gray-300 space-y-3">
                    <p><strong className="text-gray-100">Order ID:</strong> {selectedOrder.id}</p>
                    <p><strong className="text-gray-100">Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})</p>
                    <p><strong className="text-gray-100">Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                    <p><strong className="text-gray-100">Source:</strong> {PLATFORMS.find(p=>p.id === selectedOrder.source)?.name || selectedOrder.source}</p>
                    <p><strong className="text-gray-100">Fulfillment Location:</strong> {selectedOrder.fulfillmentLocation}</p>
                    <p><strong className="text-gray-100">Status:</strong> {selectedOrder.status}</p>
                    <p><strong className="text-gray-100">Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                    <p><strong className="text-gray-100">Transaction ID:</strong> {selectedOrder.transactionId}</p>
                    <p><strong className="text-gray-100">Total Amount:</strong> <span className="text-green-400 font-bold">${selectedOrder.totalAmount.toFixed(2)}</span></p>
                    <div>
                        <strong className="text-gray-100">Items:</strong>
                        <ul className="list-disc list-inside mt-1 space-y-1">
                            {selectedOrder.items.map((item, index) => (
                                <li key={index}>{item.quantity}x {item.name} (@ ${item.price.toFixed(2)} each) - From: {item.itemLocation}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </Modal>
        <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title={`Email Customer for Order ${selectedOrder?.id}`} size="xl">
            <div className="space-y-4 text-gray-300">
                <div><label className="block text-sm">To:</label><input type="email" value={emailData.to} onChange={e => setEmailData({...emailData, to: e.target.value})} className="mt-1 w-full bg-gray-700 p-2 rounded border-gray-600"/></div>
                <div><label className="block text-sm">Subject:</label><input type="text" value={emailData.subject} onChange={e => setEmailData({...emailData, subject: e.target.value})} className="mt-1 w-full bg-gray-700 p-2 rounded border-gray-600"/></div>
                <div><label className="block text-sm">Body:</label><textarea value={emailData.body} onChange={e => setEmailData({...emailData, body: e.target.value})} rows="6" className="mt-1 w-full bg-gray-700 p-2 rounded border-gray-600"></textarea></div>
                <div className="flex justify-end"><button onClick={handleSendEmail} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Send Email</button></div>
            </div>
        </Modal>
    </div>
  );
};


const CategoriesView = ({ categoriesStructure }) => {
  const [expandedParent, setExpandedParent] = useState(null); const [expandedSub, setExpandedSub] = useState(null);
  return (
    <div className="p-4 md:p-6">
      <h3 className="text-2xl font-semibold text-white mb-6">Product Categories</h3>
      <div className="space-y-4">
        {categoriesStructure.map(parentCat => (
          <div key={parentCat.parent} className="bg-gray-800 rounded-xl shadow-lg">
            <button onClick={() => setExpandedParent(expandedParent === parentCat.parent ? null : parentCat.parent)} className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700/50 rounded-t-xl">
              <span className="text-xl font-medium text-white">{parentCat.parent}</span>
              <ChevronDown size={24} className={`text-gray-400 transition-transform ${expandedParent === parentCat.parent ? 'rotate-180' : ''}`} />
            </button>
            {expandedParent === parentCat.parent && (
              <div className="p-4 border-t border-gray-700 space-y-3">
                {parentCat.subCategories.map(subCat => (
                  <div key={subCat.id} className="bg-gray-750 rounded-lg">
                     <button onClick={() => setExpandedSub(expandedSub === subCat.id ? null : subCat.id)} className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-600/50 rounded-t-lg">
                        <span className="text-lg text-gray-200">{subCat.name}</span>
                        <ChevronRight size={20} className={`text-gray-500 transition-transform ${expandedSub === subCat.id ? 'rotate-90' : ''}`} />
                    </button>
                    {expandedSub === subCat.id && (
                        <div className="p-3 border-t border-gray-600">
                            <ul className="list-disc list-inside ml-4 text-gray-300 space-y-1">{subCat.types.map(type => (<li key={type.id}>{type.name} <span className="text-xs text-gray-500">(ID: {type.id.substring(0,8)}...)</span></li>))}</ul>
                             <button className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 flex items-center"><PlusCircle size={16} className="mr-1"/> Add New Type</button>
                        </div>
                    )}
                  </div>
                ))} <button className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 flex items-center"><PlusCircle size={16} className="mr-1"/> Add New Sub-Category</button>
              </div>
            )}
          </div>
        ))}
      </div> <button className="mt-6 bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center"><PlusCircle size={20} className="mr-2"/> Add Parent Category</button>
    </div>
  );
};

const NotificationsView = ({ notifications, onMarkAsRead, onMarkAllAsRead, onDeleteNotification }) => {
    const getIconForNotification = (type, severity) => {
        if (type === 'sale_notification' || type === 'order_update' || type === 'physical_store_sale') return <PackageCheck className={`w-6 h-6 ${severity === 'critical' ? 'text-red-400' : (severity === 'warning' ? 'text-yellow-400' : 'text-blue-400')}`} />;
        return <Bell className="w-6 h-6 text-gray-400" />;
    };
    const getSeverityBorder = (severity, read) => {
        if (read) return '';
        if (severity === 'critical') return 'border-l-4 border-red-500';
        if (severity === 'warning') return 'border-l-4 border-yellow-500';
        return 'border-l-4 border-indigo-700';
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Notifications ({notifications.filter(n => !n.read).length} unread)</h3>
                {notifications.some(n => !n.read) && (<button onClick={onMarkAllAsRead} className="text-sm text-indigo-400 hover:text-indigo-300">Mark All as Read</button>)}
            </div>
            {notifications.length === 0 ? (<p className="text-gray-500 text-center py-10">No notifications yet.</p>) : (
                <div className="space-y-4">
                    {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 rounded-lg shadow-md flex items-start space-x-4 ${notif.read ? 'bg-gray-800' : 'bg-indigo-900/30'} ${getSeverityBorder(notif.severity, notif.read)}`}>
                            <div className="flex-shrink-0 pt-1">{getIconForNotification(notif.type, notif.severity)}</div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-semibold ${notif.read ? 'text-gray-300' : 'text-white'} ${notif.type === 'physical_store_sale' ? 'notification-critical' : ''}`}>{notif.title}</h4>
                                    <span className="text-xs text-gray-500">{new Date(notif.date).toLocaleString()}</span>
                                </div>
                                <p className={`text-sm mt-1 ${notif.read ? 'text-gray-400' : 'text-gray-200'} ${notif.type === 'physical_store_sale' ? 'notification-critical' : ''}`}>{notif.message}</p>
                                {notif.itemLocation && <p className="text-xs text-gray-500 mt-1">Location: {notif.itemLocation}</p>}
                                <div className="mt-3 flex space-x-3">
                                    {!notif.read && (<button onClick={() => onMarkAsRead(notif.id)} className="text-xs text-indigo-400 hover:text-indigo-300">Mark as Read</button>)}
                                    <button onClick={() => onDeleteNotification(notif.id)} className="text-xs text-red-400 hover:text-red-300 ml-auto">Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const InventoryView = ({ currentUser }) => {
    return (
        <div className="p-4 md:p-6 text-gray-300">
            <h2 className="text-2xl font-semibold text-white mb-6">Inventory Management (Physical Store Sales)</h2>
            <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Store size={24} className="mr-3 text-indigo-400"/> Point of Sale - Item Scan (Future Functionality)
                </h3>
                <p className="text-gray-400 mb-3">
                    This section is designated for processing sales from the physical store.
                    When an item is sold, the cashier will scan its barcode using a POS scanner.
                </p>
                <div className="border border-dashed border-gray-600 rounded-lg p-8 text-center my-6">
                    <UploadCloud size={48} className="mx-auto text-gray-500 mb-4"/>
                    <p className="text-gray-500">Item scanning interface will be here.</p>
                    <p className="text-xs text-gray-600 mt-2">(Simulated: Barcode scanner input)</p>
                </div>
                <h4 className="text-lg font-semibold text-white mt-6 mb-2">Process Flow:</h4>
                <ul className="list-disc list-inside space-y-2 text-gray-400">
                    <li>Cashier scans the item's barcode.</li>
                    <li>The system identifies the product and its current inventory count.</li>
                    <li>Upon completion of the sale:
                        <ul className="list-circle list-inside ml-6 mt-1 space-y-1 text-gray-500">
                            <li>The product will be marked as **sold from the Physical Store**.</li>
                            <li>Inventory for this item will be **deducted by one (or scanned quantity)**.</li>
                            <li>An order will be generated in the "Orders" section, marked with "Physical Store" as the source.</li>
                            <li>A **notification will be triggered** (e.g., "Item XYZ sold from Physical Store, inventory updated").</li>
                            <li>The system will then (conceptually) **update the inventory levels on connected platforms**: eBay1, eBay2, eBay3, Walmart, SHEIN, and WooCommerce to ensure synchronization.</li>
                        </ul>
                    </li>
                </ul>
                {currentUser.role === 'Cashier' && (
                     <div className="mt-6 p-4 bg-green-800/30 border border-green-700 rounded-lg">
                        <p className="text-green-300 font-medium">
                            <CheckCircle size={20} className="inline mr-2"/> As a Cashier, you will primarily use this section to record in-store sales.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};


const ProductFormPage = ({ initialProductData, categoriesStructure, onSave, onCancel, currentUser }) => {
    const [formData, setFormData] = useState(null);
    const isWarehouseUploaderCreating = currentUser.role === 'WarehouseUploader' && !initialProductData;

    useEffect(() => {
        let defaultStatus = 'Active';
        if (currentUser.role === 'WarehouseUploader') { 
            defaultStatus = 'Draft';
        }

        const initialVariants = initialProductData?.variants?.map(v => ({...v, id: v.id || `var_${Date.now()}_${Math.random()}`})) || [];

        if (initialProductData) { // Editing existing product
            setFormData({
                ...initialProductData,
                status: currentUser.role === 'WarehouseUploader' ? 'Draft' : initialProductData.status || defaultStatus,
                listedOn: (initialProductData.listedOn || []).filter(pId => ALL_POSSIBLE_PUBLISHING_PLATFORMS.some(fp => fp.id === pId)),
                variants: initialVariants,
                quantity: initialVariants.length > 0 ? initialVariants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0) : (initialProductData.quantity || 0),
            });
        } else { // Creating new product
            const baseData = {
                name: '', sku: '', brand: '',
                category: { parent: '', sub: '', type: '', typeId: '' },
                regularPrice: 0, salePrice: null, hasTenDollarOffer: true, offerPrice: 10.00,
                quantity: 0, imageUrl: '', listedOn: [],
                description: '', color: '', size: '', sizeType: '', itemLocation: '', condition: 'New',
                status: defaultStatus, dateAdded: new Date(),
                variants: [],
            };
            if (isWarehouseUploaderCreating) {
                setFormData({
                    name: '',
                    sku: '',
                    itemLocation: '',
                    quantity: 1, 
                    description: '',
                    imageUrl: '', 
                    brand: '', 
                    category: { parent: '', sub: '', type: '', typeId: '' },
                    regularPrice: null, salePrice: null, hasTenDollarOffer: false, offerPrice: null,
                    listedOn: [], 
                    color: '', size: '', sizeType: '', condition: 'New', 
                    status: 'Draft', 
                    dateAdded: new Date(),
                    variants: [],
                });
            } else {
                setFormData(baseData);
            }
        }
    }, [initialProductData, currentUser.role, isWarehouseUploaderCreating]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let newFormData = { ...formData };

        if (name === "listedOn") {
            const currentListedOn = newFormData.listedOn || [];
            newFormData.listedOn = checked ? [...currentListedOn, value] : currentListedOn.filter(platform => platform !== value);
        } else if (name === "hasTenDollarOffer") {
            newFormData.hasTenDollarOffer = checked;
            newFormData.offerPrice = checked ? (newFormData.offerPrice && newFormData.offerPrice > 0 ? newFormData.offerPrice : 10.00) : null;
        } else if (["salePrice", "offerPrice", "regularPrice", "quantity"].includes(name)) {
            newFormData[name] = value === '' ? null : parseFloat(value);
        } else {
            newFormData[name] = type === 'checkbox' ? checked : value;
        }
        setFormData(newFormData);
    };
    
    const handleCategoryChange = (level, value) => {
        let newCategoryData = { ...formData.category };
        if (level === 'parent') { newCategoryData = { parent: value, sub: '', type: '', typeId: '' }; }
        else if (level === 'sub') { newCategoryData = { ...newCategoryData, sub: value, type: '', typeId: '' }; }
        else if (level === 'type') {
            const parentCat = categoriesStructure.find(p => p.parent === newCategoryData.parent);
            const subCat = parentCat?.subCategories.find(s => s.name === newCategoryData.sub);
            const typeDetails = subCat?.types.find(t => t.name === value);
            newCategoryData = { ...newCategoryData, type: value, typeId: typeDetails?.id || '' };
        }
        setFormData({ ...formData, category: newCategoryData });
    };

    const handleVariantChange = (index, field, value) => {
        const updatedVariants = formData.variants.map((variant, i) => {
            if (i === index) {
                return { ...variant, [field]: value };
            }
            return variant;
        });
        setFormData({ ...formData, variants: updatedVariants });
    };

    const addVariant = () => {
        const newVariant = {
            id: `var_${Date.now()}_${formData.variants.length}`, 
            color: '', sizeType: '', size: '', quantity: 0, skuSuffix: '', price: null
        };
        setFormData({ ...formData, variants: [...formData.variants, newVariant] });
    };

    const removeVariant = (index) => {
        const updatedVariants = formData.variants.filter((_, i) => i !== index);
        setFormData({ ...formData, variants: updatedVariants });
    };
    
    const handleSubmit = (e) => { 
        e.preventDefault(); 
        let finalData = { ...formData };

        if (currentUser.role === 'WarehouseUploader') { 
            finalData.status = 'Draft'; 
            const allowedFieldsForSave = {
                name: finalData.name,
                sku: finalData.sku,
                itemLocation: finalData.itemLocation,
                quantity: Number(finalData.quantity) || 1, 
                description: finalData.description,
                imageUrl: finalData.imageUrl, 
                status: 'Draft', 
                brand: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.brand : '', 
                category: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.category : { parent: '', sub: '', type: '', typeId: '' },
                regularPrice: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.regularPrice : null,
                salePrice: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.salePrice : null,
                hasTenDollarOffer: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.hasTenDollarOffer : false,
                offerPrice: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.offerPrice : null,
                listedOn: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.listedOn : [], 
                color: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.color : '',
                size: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.size : '',
                sizeType: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.sizeType : '',
                condition: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.condition : 'New', 
                dateAdded: initialProductData?.dateAdded || new Date(), 
                variants: initialProductData && currentUser.role === 'WarehouseUploader' ? initialProductData.variants : [], 
            };
            finalData = allowedFieldsForSave;
        }
        
        if (finalData.variants && finalData.variants.length > 0 && currentUser.role !== 'WarehouseUploader') { 
            finalData.quantity = finalData.variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
        }
        finalData.listedOn = (finalData.listedOn || []).filter(pId => ALL_POSSIBLE_PUBLISHING_PLATFORMS.some(fp => fp.id === pId));
        onSave(finalData); 
    };

    if (!formData) return <div className="p-6 text-white">Loading product data...</div>;

    let platformsToDisplayInForm;
    if (!initialProductData) { // Creating a new product
        platformsToDisplayInForm = ALL_POSSIBLE_PUBLISHING_PLATFORMS.filter(p => p.id === 'ebay1' || p.id === 'ebay2' || p.id === 'ebay3');
    } else { // Editing an existing product
        platformsToDisplayInForm = ALL_POSSIBLE_PUBLISHING_PLATFORMS;
    }

    const parentCategoryOptions = categoriesStructure.map(p => p.parent);
    const subCategoryOptions = formData.category?.parent ? categoriesStructure.find(p => p.parent === formData.category.parent)?.subCategories.map(s => s.name) || [] : [];
    const typeCategoryOptions = formData.category?.sub ? categoriesStructure.find(p => p.parent === formData.category.parent)?.subCategories.find(s => s.name === formData.category.sub)?.types.map(t => t.name) || [] : [];
    
    const canChangeStatus = currentUser.role !== 'WarehouseUploader'; 
    const hasVariants = formData.variants && formData.variants.length > 0;


    return (
        <div className="p-4 md:p-6 text-gray-300">
            <button onClick={onCancel} className="mb-6 flex items-center text-indigo-400 hover:text-indigo-300">
                <ArrowLeft size={20} className="mr-2"/> Back to Products
            </button>
            <h2 className="text-2xl font-semibold text-white mb-6">{initialProductData ? "Edit Product" : "Create New Product"}</h2>
            <form onSubmit={handleSubmit} className="space-y-6 bg-gray-800 p-6 rounded-xl shadow-lg">
                {/* Product Name */}
                <div><label className="block text-sm font-medium">Product Name*</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                
                {/* SKU & Item Location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div><label className="block text-sm font-medium">SKU*</label><input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                    <div><label className="block text-sm font-medium">Item Location</label><input type="text" name="itemLocation" value={formData.itemLocation} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                </div>

                {/* Quantity */}
                 <div>
                    <label className="block text-sm font-medium">Total Quantity*</label>
                    <input 
                        type="number" 
                        name="quantity" 
                        value={isWarehouseUploaderCreating ? formData.quantity : (hasVariants ? formData.variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0) : formData.quantity)} 
                        onChange={handleChange} 
                        min="0" 
                        required 
                        className="mt-1 block w-full bg-gray-700 p-2 rounded" 
                        disabled={!isWarehouseUploaderCreating && hasVariants} 
                        title={!isWarehouseUploaderCreating && hasVariants ? "Total quantity is sum of variants" : "Enter quantity"} 
                    />
                    {!isWarehouseUploaderCreating && hasVariants && <p className="text-xs text-gray-400 mt-1">Total quantity is sum of variants.</p>}
                </div>
                
                {/* Description */}
                <div><label className="block text-sm font-medium">Description {isWarehouseUploaderCreating && '(Optional)'}</label><textarea name="description" value={formData.description} onChange={handleChange} rows="4" className="mt-1 block w-full bg-gray-700 p-2 rounded"></textarea></div>
                
                {/* Image URL (Visible for WarehouseUploader on create) */}
                 {(isWarehouseUploaderCreating || !initialProductData || currentUser.role !== 'WarehouseUploader') && ( 
                    <fieldset className="border border-gray-700 p-4 rounded-md">
                        <legend className="text-sm font-medium px-2 text-gray-400">Image</legend>
                        <div><label className="block text-sm font-medium">Primary Image URL</label><input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="https://example.com/image.jpg" className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                    </fieldset>
                )}


                {/* Fields hidden for WarehouseUploader when creating new product */}
                {!isWarehouseUploaderCreating && (
                    <>
                        {/* Brand */}
                        <div><label className="block text-sm font-medium">Brand</label><input type="text" name="brand" value={formData.brand} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                        
                        {/* Categorization */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400">Categorization</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium">Parent Category*</label><select name="category.parent" value={formData.category?.parent || ''} onChange={(e) => handleCategoryChange('parent', e.target.value)} required className="mt-1 block w-full bg-gray-700 p-2 rounded"><option value="">Select Parent</option>{parentCategoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                <div><label className="block text-sm font-medium">Sub Category*</label><select name="category.sub" value={formData.category?.sub || ''} onChange={(e) => handleCategoryChange('sub', e.target.value)} required disabled={!formData.category?.parent} className="mt-1 block w-full bg-gray-700 p-2 rounded disabled:opacity-50"><option value="">Select Sub</option>{subCategoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                                <div><label className="block text-sm font-medium">Type*</label><select name="category.type" value={formData.category?.type || ''} onChange={(e) => handleCategoryChange('type', e.target.value)} required disabled={!formData.category?.sub} className="mt-1 block w-full bg-gray-700 p-2 rounded disabled:opacity-50"><option value="">Select Type</option>{typeCategoryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}</select></div>
                            </div>
                        </fieldset>
                        
                        {/* Default/Base Sizing & Color */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400">Default/Base Details</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div><label className="block text-sm font-medium">Default Color</label><input type="text" name="color" value={formData.color} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded"/></div>
                                <div>
                                    <label className="block text-sm font-medium">Default Size Type</label>
                                    <select name="sizeType" value={formData.sizeType} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded">
                                        <option value="">Select Size Type</option>
                                        {SIZE_TYPES.map(st => <option key={st} value={st}>{st}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium">Default Custom Size</label>
                                    <input type="text" name="size" value={formData.size} onChange={handleChange} placeholder="e.g., 28W, 10.5, Tall" className="mt-1 block w-full bg-gray-700 p-2 rounded"/>
                                </div>
                            </div>
                        </fieldset>

                        {/* Pricing */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400">Pricing</legend>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div><label className="block text-sm font-medium">Regular Price*</label><input type="number" name="regularPrice" value={formData.regularPrice || ''} onChange={handleChange} step="0.01" min="0" required className="mt-1 block w-full bg-gray-700 p-2 rounded" /></div>
                                <div><label className="block text-sm font-medium">Sale Price</label><input type="number" name="salePrice" value={formData.salePrice === null ? '' : formData.salePrice} onChange={handleChange} step="0.01" min="0" className="mt-1 block w-full bg-gray-700 p-2 rounded" /></div>
                                <div className="flex flex-col">
                                    <label htmlFor="hasTenDollarOffer" className="flex items-center text-sm font-medium mb-1">
                                        <input type="checkbox" id="hasTenDollarOffer" name="hasTenDollarOffer" checked={formData.hasTenDollarOffer} onChange={handleChange} className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-800 border-gray-500 rounded mr-2"/>
                                        Enable $10 Offer
                                    </label>
                                    <input type="number" name="offerPrice" value={formData.offerPrice === null ? '' : formData.offerPrice} onChange={handleChange} step="0.01" min="0" disabled={!formData.hasTenDollarOffer} placeholder="Offer Price (e.g., 10.00)" className="block w-full bg-gray-700 p-2 rounded disabled:opacity-50" />
                                </div>
                            </div>
                        </fieldset>
                        
                        {/* Condition & Status */}
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-sm font-medium">Condition</label><select name="condition" value={formData.condition} onChange={handleChange} className="mt-1 block w-full bg-gray-700 p-2 rounded"><option>New</option><option>Used - Like New</option></select></div>
                            <div>
                                <label className="block text-sm font-medium">Product Status</label>
                                <select name="status" value={formData.status} onChange={handleChange} disabled={!canChangeStatus} className={`mt-1 block w-full bg-gray-700 p-2 rounded ${!canChangeStatus ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                    {PRODUCT_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                                </select>
                            </div>
                        </div>
                        
                        {/* Variations Section */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400 flex items-center"><Layers size={16} className="mr-1"/> Product Variations</legend>
                            {formData.variants && formData.variants.map((variant, index) => (
                                <div key={variant.id || index} className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-3 p-3 border border-gray-600 rounded-md relative">
                                    <button type="button" onClick={() => removeVariant(index)} className="absolute top-2 right-2 text-red-400 hover:text-red-300" title="Remove Variant"><XCircle size={18}/></button>
                                    <div><label className="block text-xs">Color*</label><input type="text" value={variant.color} onChange={e => handleVariantChange(index, 'color', e.target.value)} required className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                    <div><label className="block text-xs">Size Type*</label><select value={variant.sizeType} onChange={e => handleVariantChange(index, 'sizeType', e.target.value)} required className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm"><option value="">Select</option>{SIZE_TYPES.map(st => <option key={st} value={st}>{st}</option>)}</select></div>
                                    <div><label className="block text-xs">Custom Size</label><input type="text" value={variant.size} onChange={e => handleVariantChange(index, 'size', e.target.value)} className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                    <div><label className="block text-xs">Quantity*</label><input type="number" value={variant.quantity} onChange={e => handleVariantChange(index, 'quantity', parseInt(e.target.value) || 0)} required min="0" className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                    <div><label className="block text-xs">SKU Suffix</label><input type="text" value={variant.skuSuffix} onChange={e => handleVariantChange(index, 'skuSuffix', e.target.value)} placeholder={`${variant.color.substring(0,2).toUpperCase()}-${variant.sizeType.substring(0,1)}`} className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                    <div><label className="block text-xs">Variant Price</label><input type="number" step="0.01" value={variant.price === null ? '' : variant.price} onChange={e => handleVariantChange(index, 'price', e.target.value === '' ? null : parseFloat(e.target.value))} placeholder="Main Price" className="mt-1 w-full bg-gray-600 p-1.5 rounded text-sm" /></div>
                                </div>
                            ))}
                            <button type="button" onClick={addVariant} className="mt-2 text-indigo-400 hover:text-indigo-300 flex items-center text-sm"><Plus size={18} className="mr-1"/> Add Variant</button>
                        </fieldset>

                        {/* Publish On */}
                        <fieldset className="border border-gray-700 p-4 rounded-md">
                            <legend className="text-sm font-medium px-2 text-gray-400">Publish On</legend>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {platformsToDisplayInForm.map(platform => (<label key={platform.id} className="flex items-center space-x-2 bg-gray-700 p-3 rounded-md hover:bg-gray-600 cursor-pointer"><input type="checkbox" name="listedOn" value={platform.id} checked={(formData.listedOn || []).includes(platform.id)} onChange={handleChange} className="form-checkbox h-5 w-5 text-indigo-600 bg-gray-800 border-gray-500 rounded focus:ring-indigo-500"/><span>{platform.name}</span></label>))}
                            </div>
                            <p className="text-xs text-gray-500 mt-2">Product is also published on your main "Website" if Status is 'Active'.</p>
                        </fieldset>
                    </>
                )}
                
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-700">
                    <button type="button" onClick={onCancel} className="px-6 py-2 text-sm font-medium text-gray-300 bg-gray-600 hover:bg-gray-500 rounded-md shadow-sm">Cancel</button>
                    <button type="submit" className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm flex items-center"><Save size={18} className="mr-2"/> {initialProductData ? "Save Changes" : "Create Product"}</button>
                </div>
            </form>
        </div>
    );
};

const UsersView = ({ users, onAddUser, currentUser }) => {
    const [newUserName, setNewUserName] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState(USER_ROLES.includes('Customer') ? 'Customer' : USER_ROLES[1]);

    const handleAddUserSubmit = (e) => {
        e.preventDefault();
        if (!newUserName.trim() || !newUserPassword.trim()) {
            alert("Username and password are required.");
            return;
        }
        onAddUser({
            id: `user_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
            username: newUserName,
            password: newUserPassword, 
            role: newUserRole
        });
        setNewUserName(''); setNewUserPassword(''); setNewUserRole(USER_ROLES.includes('Customer') ? 'Customer' : USER_ROLES[1]);
    };

    const roleDescriptions = {
        Superadmin: "Full access to all system features, including user management and settings. Cannot be deleted.",
        Admin: "Full access to most system features, including user management (cannot delete Superadmin) and settings.",
        Cashier: "Access restricted to the Inventory page. (Future: POS functions, limited order viewing).",
        WarehouseUploader: "Can submit new products (name, SKU, item location, quantity, description, image URL only) which are saved as 'Draft'.", 
        ProductLister: "Full access to Products (add, edit, publish, manage categories). Cannot access Users or Settings.",
        Customer: "Represents a website customer. Typically does not log into this admin panel. For record-keeping."
    };
    
    const adminUsers = users.filter(u => u.role !== 'Customer');
    const customerUsers = users.filter(u => u.role === 'Customer');


    return (
        <div className="p-4 md:p-6 text-gray-300">
            <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentUser.role === 'Superadmin' || currentUser.role === 'Admin' ? (
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Add New User</h3>
                        <form onSubmit={handleAddUserSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="newUserName" className="block text-sm font-medium">Username</label>
                                <input type="text" id="newUserName" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor="newUserPassword" className="block text-sm font-medium">Password</label>
                                <input type="password" id="newUserPassword" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor="newUserRole" className="block text-sm font-medium">Role</label>
                                <select id="newUserRole" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500">
                                    {USER_ROLES
                                        .filter(role => role !== 'Superadmin' || currentUser.role === 'Superadmin') 
                                        .map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                                <UserPlus size={20} className="mr-2"/> Add User
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <p className="text-yellow-400 flex items-center"><ShieldAlert size={20} className="mr-2"/> You do not have permission to add new users.</p>
                    </div>
                )}


                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                     <h3 className="text-xl font-semibold text-white mb-4">Existing Users ({users.length})</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {users.map(user => (
                            <div key={user.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-white font-medium">{user.username}</p>
                                    <p className={`text-xs ${user.role === 'Customer' ? 'text-teal-400' : 'text-indigo-400'}`}>{user.role}</p>
                                </div>
                                {(currentUser.role === 'Superadmin' && user.role !== 'Superadmin') || (currentUser.role === 'Admin' && !['Superadmin', 'Admin'].includes(user.role)) ? (
                                    <button className="text-red-400 hover:text-red-300" title="Delete user (mock action)">
                                        <Trash2 size={18}/>
                                    </button>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><Info size={22} className="mr-2 text-blue-400"/> Role Permissions Guide</h3>
                <div className="space-y-3">
                    {USER_ROLES.map(role => (
                        <div key={role} className="p-3 bg-gray-700 rounded-md">
                            <h4 className="font-semibold text-indigo-300">{role}</h4>
                            <p className="text-sm text-gray-400">{roleDescriptions[role] || "No description available."}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const App = () => {
  const [activeView, setActiveView] = useState('overview');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentEditingProductId, setCurrentEditingProductId] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [appUsers, setAppUsers] = useState([
    { id: 'user_super', username: 'Super Admin User', role: 'Superadmin', password: 'password' },
    { id: 'user_admin', username: 'Admin User', role: 'Admin', password: 'password' },
    { id: 'user_lister', username: 'Product Lister User', role: 'ProductLister', password: 'password' },
    { id: 'user_warehouse', username: 'WarehouseUploader', role: 'WarehouseUploader', password: 'password' }, 
    { id: 'user_cashier', username: 'Cashier User', role: 'Cashier', password: 'password' },
    { id: 'user_cust1', username: 'Alice Wonderland', role: 'Customer', password: 'password' },
    { id: 'user_cust2', username: 'Bob The Builder', role: 'Customer', password: 'password' },
  ]);
  const [currentUser, setCurrentUser] = useState(appUsers[0]); 

  useEffect(() => {
    const mockProducts = generateMockProducts(150);
    const mockOrders = generateMockOrders(70, mockProducts);
    const mockNotifications = generateMockNotifications(25, mockProducts, mockOrders);
    setProducts(mockProducts); setOrders(mockOrders); setNotifications(mockNotifications);
  }, []);

  useEffect(() => {
    const userPermissions = PERMISSIONS[currentUser.role] || [];
    let targetView = activeView;

    if (!userPermissions.includes(activeView)) {
        targetView = userPermissions[0] || 'overview'; 
    }
    
    if (currentUser.role === 'WarehouseUploader' && targetView !== 'addProduct') {
        targetView = 'addProduct'; 
    } else if (currentUser.role === 'Cashier' && targetView !== 'inventory') {
        targetView = 'inventory';
    } else if (currentUser.role === 'Customer') { 
        targetView = 'overview'; 
    }
    
    if (activeView !== targetView) {
        setActiveView(targetView);
    }

  }, [currentUser, activeView]);

  const unreadNotificationsCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const handleMarkNotificationAsRead = (id) => setNotifications(prev => prev.map(n => n.id === id ? {...n, read: true} : n));
  const handleMarkAllAsRead = () => setNotifications(prev => prev.map(n => ({...n, read: true}))); 
  const handleDeleteNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));
  
  const handleUpdateProductsState = (updatedProducts) => {
    setProducts(updatedProducts);
    const newNotifications = generateMockNotifications(5, updatedProducts, orders);
    setNotifications(prev => [...newNotifications.filter(nn => !prev.find(pn => pn.id === nn.id || (pn.productId === nn.productId && pn.type === nn.type))), ...prev].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,50));
  };
  
  const handleSaveProduct = (productData) => {
    let updatedProducts;
    let finalProductData = {...productData};

    if (currentUser.role === 'WarehouseUploader' && !currentEditingProductId) { 
        finalProductData.status = 'Draft'; 
        const allowedFieldsForSave = {
            name: finalProductData.name,
            sku: finalProductData.sku,
            itemLocation: finalProductData.itemLocation,
            quantity: Number(finalProductData.quantity) || 1, 
            description: finalProductData.description,
            imageUrl: finalProductData.imageUrl, 
            status: 'Draft', 
            brand: '', 
            category: { parent: '', sub: '', type: '', typeId: '' },
            regularPrice: null, salePrice: null, hasTenDollarOffer: false, offerPrice: null,
            listedOn: [], 
            color: '', size: '', sizeType: '', condition: 'New', 
            dateAdded: new Date(),
            variants: [], 
        };
        finalProductData = allowedFieldsForSave;
    } else if (currentUser.role === 'WarehouseUploader' && currentEditingProductId) {
        finalProductData.status = 'Draft'; 
    }
    
    finalProductData.listedOn = (finalProductData.listedOn || []).filter(pId => ALL_POSSIBLE_PUBLISHING_PLATFORMS.some(fp => fp.id === pId));
    
    if (finalProductData.variants && finalProductData.variants.length > 0 && currentUser.role !== 'WarehouseUploader') { 
        finalProductData.quantity = finalProductData.variants.reduce((sum, v) => sum + (Number(v.quantity) || 0), 0);
    }


    if (currentEditingProductId) { 
        updatedProducts = products.map(p => {
            if (p.id === currentEditingProductId) {
                if(currentUser.role === 'WarehouseUploader'){
                    const whuEditableFields = {
                        name: finalProductData.name,
                        sku: finalProductData.sku,
                        itemLocation: finalProductData.itemLocation,
                        quantity: Number(finalProductData.quantity) || 1,
                        description: finalProductData.description,
                        imageUrl: finalProductData.imageUrl,
                        status: 'Draft'
                    };
                    return {...p, ...whuEditableFields }; 
                }
                return {...p, ...finalProductData};
            }
            return p;
        });
    } else { 
        const newProduct = { 
            ...finalProductData, 
            id: `prod_${Date.now()}_${Math.random().toString(36).substring(2,7)}`, 
            dateAdded: new Date() 
        };
        if (!newProduct.sku) newProduct.sku = `SKU-${Math.floor(Math.random()*90000) + 10000}`;
        updatedProducts = [newProduct, ...products];
    }
    handleUpdateProductsState(updatedProducts);
    setActiveView('products');
    setCurrentEditingProductId(null);
  };

  const handleCancelProductForm = () => {
    setActiveView('products');
    setCurrentEditingProductId(null);
  };

  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders(prevOrders =>
      prevOrders.map(o => o.id === orderId ? { ...o, status: newStatus } : o)
    );
    const order = orders.find(o => o.id === orderId);
    if (order) {
        const notification = {
            id: `notif_order_status_${Date.now()}`, type: 'order_update', title: `Order ${orderId} Status Updated`,
            message: `Order ${orderId} for ${order.customerName} is now "${newStatus}".`, date: new Date(),
            read: false, orderId: orderId, severity: 'info'
        };
        setNotifications(prev => [notification, ...prev].sort((a,b) => new Date(b.date) - new Date(a.date)).slice(0,50));
    }
  };

  const handleAddUser = (newUser) => {
    setAppUsers(prev => [...prev, newUser]);
    console.log("New user added (mock):", newUser);
  };

  const renderView = () => {
    const userPermissions = PERMISSIONS[currentUser.role] || [];
    let canAccessCurrentView = userPermissions.includes(activeView);

    if (activeView === 'addProduct' && !userPermissions.includes('addProduct')) canAccessCurrentView = false;
    else if (activeView === 'editProduct') {
        if (!userPermissions.includes('editProduct')) {
            canAccessCurrentView = false;
        }
    }
    
    if (currentUser.role === 'Customer' && activeView !== 'overview' ) {
        canAccessCurrentView = false; 
    }

    if (!canAccessCurrentView) {
        return <div className="p-6 text-white text-center">
            <ShieldAlert size={48} className="mx-auto text-red-500 mb-4"/>
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p>You ({currentUser.role}) do not have permission to view the '{activeView}' page.</p>
            <button onClick={() => setActiveView(PERMISSIONS[currentUser.role]?.[0] || 'overview')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Go to Your Dashboard</button>
        </div>;
    }
    
    if (activeView === 'addProduct') {
        return <ProductFormPage categoriesStructure={CATEGORIES_STRUCTURE} onSave={handleSaveProduct} onCancel={handleCancelProductForm} currentUser={currentUser} />;
    }
    if (activeView === 'editProduct' && currentEditingProductId) {
        const productToEdit = products.find(p => p.id === currentEditingProductId);
        if (currentUser.role === 'WarehouseUploader' && productToEdit?.status !== 'Draft') {
             return <div className="p-6 text-white text-center">
                <ShieldAlert size={48} className="mx-auto text-red-500 mb-4"/>
                <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
                <p>Warehouse Uploaders can typically only edit products they created that are in 'Draft' status.</p>
                <button onClick={() => setActiveView('products')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Back to Products</button>
            </div>;
        }
        return <ProductFormPage initialProductData={productToEdit} categoriesStructure={CATEGORIES_STRUCTURE} onSave={handleSaveProduct} onCancel={handleCancelProductForm} currentUser={currentUser} />;
    }

    switch (activeView) {
      case 'overview': return <Overview products={products} orders={orders} />;
      case 'products': return <ProductsList products={products} categoriesStructure={CATEGORIES_STRUCTURE} setActiveView={setActiveView} setCurrentEditingProductId={setCurrentEditingProductId} onUpdateProducts={handleUpdateProductsState} currentUser={currentUser} />;
      case 'orders': return <OrdersList orders={orders} products={products} onUpdateOrderStatus={handleUpdateOrderStatus} currentUser={currentUser} />;
      case 'categories': return <CategoriesView categoriesStructure={CATEGORIES_STRUCTURE} />;
      case 'notifications': return <NotificationsView notifications={notifications} onMarkAsRead={handleMarkNotificationAsRead} onMarkAllAsRead={handleMarkAllAsRead} onDeleteNotification={handleDeleteNotification} />;
      case 'users': return <UsersView users={appUsers} onAddUser={handleAddUser} currentUser={currentUser} />;
      case 'inventory': return <InventoryView currentUser={currentUser} />; 
      case 'settings': return <div className="p-6 text-white">Settings Page (Visible to {currentUser.role})</div>;
      default:
        return <div className="p-6 text-white text-center">
            <ShieldAlert size={48} className="mx-auto text-red-500 mb-4"/>
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p>The requested page ({activeView}) could not be found.</p>
             <button onClick={() => setActiveView(PERMISSIONS[currentUser.role]?.[0] || 'overview')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Go to Your Dashboard</button>
        </div>;
    }
  };
  
  const viewTitles = {
    overview: "Dashboard Overview", products: "Manage Products", orders: "Order Management", categories: "Product Categories",
    inventory: "Inventory Control", notifications: "Notifications Center", users: "User Management", settings: "Application Settings",
    emails: "Email Marketing", addProduct: "Add New Product", editProduct: "Edit Product"
  };

  const handleUserSwitch = (userId) => {
    const user = appUsers.find(u => u.id === userId);
    if (user) setCurrentUser(user);
  };
  
  return (
    <div className="flex min-h-screen bg-gray-900 lg:bg-gray-850">
      <Sidebar activeView={activeView} setActiveView={setActiveView} currentUser={currentUser} isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen}/>
      <div className="flex-1 flex flex-col min-w-0">
        <GlobalHeader 
            title={viewTitles[activeView] || "Dashboard"} 
            unreadNotificationsCount={unreadNotificationsCount} 
            onNotificationsClick={() => setActiveView('notifications')} 
            currentUser={currentUser}
            onMenuClick={() => setIsSidebarOpen(true)}
        />
        <div className="bg-gray-700 p-2 text-xs text-center text-white">
            Switch User (Demo): {appUsers.map(u => (
                <button key={u.id} onClick={() => handleUserSwitch(u.id)} className={`mx-1 px-2 py-0.5 rounded ${currentUser.id === u.id ? 'bg-indigo-500' : 'bg-gray-600 hover:bg-gray-500'}`}>{u.username} ({u.role})</button>
            ))}
        </div>
        <main className="flex-1 overflow-y-auto bg-gray-850"> 
          {renderView()}
        </main>
      </div>
    </div>
  );
};

export default App;
