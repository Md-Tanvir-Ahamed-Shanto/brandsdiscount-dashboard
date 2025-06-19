// Constants and Data Structures

export const CATEGORIES_STRUCTURE = [
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

export const PLATFORMS = [
  { id: "website", name: "Website", icon: "Globe" },
  { id: "store", name: "Physical Store", icon: "Store" },
  { id: "ebay1", name: "eBay1", icon: "ExternalLink" },
  { id: "ebay2", name: "eBay2", icon: "ExternalLink" },
  { id: "ebay3", name: "eBay3", icon: "ExternalLink" },
  { id: "shein", name: "SHEIN", icon: "ExternalLink" },
  { id: "walmart", name: "Walmart", icon: "ExternalLink" },
  { id: "woocommerce", name: "WooCommerce", icon: "ShoppingCart" },
];

export const ALL_POSSIBLE_PUBLISHING_PLATFORMS = [
  { id: "ebay1", name: "eBay1" },
  { id: "ebay2", name: "eBay2" },
  { id: "ebay3", name: "eBay3" },
  { id: "shein", name: "SHEIN" },
  { id: "walmart", name: "Walmart" },
  { id: "woocommerce", name: "WooCommerce" }
];

export const PRODUCT_STATUSES = ['Active', 'Hidden', 'Draft'];
export const ORDER_STATUSES = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled", "Refunded", "On Hold"];
export const SIZE_TYPES = ['XXS (00)', 'XS (0-2)', 'S (4-6)', 'M (8-10)', 'L (12-14)', 'XL (16-18)', 'XXL+ (20+)', 'O/S', 'Other'];
export const USER_ROLES = ['Superadmin', 'Admin', 'Cashier', 'WarehouseUploader', 'ProductLister', 'Customer'];

export const PERMISSIONS = {
  Superadmin: ['overview', 'products', 'orders', 'categories', 'inventory', 'notifications', 'users', 'settings', 'addProduct', 'editProduct'],
  Admin: ['overview', 'products', 'orders', 'categories', 'inventory', 'notifications', 'users', 'settings', 'addProduct', 'editProduct'],
  Cashier: ['inventory'],
  WarehouseUploader: ['addProduct'],
  ProductLister: ['products', 'addProduct', 'editProduct', 'categories'],
  Customer: [],
};