import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Search,
  PlusCircle,
  Filter,
  Edit,
  Check,
  EyeOff,
  Archive,
  DollarSign,
  Edit3,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { apiClient, BASE_URL } from "../config/api/api";

// Constants and Data Structures
export const CATEGORIES_STRUCTURE = [
  {
    parent: "Women",
    subCategories: [
      {
        name: "Womens Tops",
        id: "wtops",
        types: [
          {
            name: "Blouses and Shirts",
            id: "8989c733-d203-472f-8ab5-feb1675fe30f",
          },
          {
            name: "Tees and Tank Tops",
            id: "887116be-e7fd-4f1b-b6d8-a4211b57f5d0",
          },
          {
            name: "Sweaters and Cardigans",
            id: "a5d6ad16-2b71-40b7-98d6-e2ad39315e1e",
          },
          {
            name: "Hoodies and Sweatshirts",
            id: "2e4d25a7-895e-4377-9393-ede7d8278450",
          },
        ],
      },
      {
        name: "Womens Swimwear",
        id: "wswim",
        types: [
          { name: "Bikinis", id: "7a85a281-3470-41fe-99fa-917b90e17c9d" },
          {
            name: "One-Piece Swimsuits",
            id: "474dd0ec-8745-4f43-859c-d79301948850",
          },
          { name: "Tankinis", id: "b3e1d076-35e9-46d9-be85-12ec78783a6c" },
          {
            name: "Swim Cover-Ups",
            id: "b356a1a7-ad8d-405a-b42f-c846ec11953f",
          },
        ],
      },
      {
        name: "Womens Shoes",
        id: "wshoes",
        types: [
          {
            name: "Heels and Pumps",
            id: "c88bf84a-0185-4486-b17b-fbfd344a57c3",
          },
          {
            name: "Boots and Booties",
            id: "bcd6a486-88b9-4426-827a-e351925770a4",
          },
          {
            name: "Sneakers and Trainers",
            id: "002a7c26-b335-4d98-b702-e52cfa2a0496",
          },
          {
            name: "Sandals and Flats",
            id: "6f88e3b2-32b0-452b-a207-a1dc1304f228",
          },
        ],
      },
      {
        name: "Womens Outerwear",
        id: "wouter",
        types: [
          {
            name: "Jackets and Coats",
            id: "cf1aa1d5-b47f-4554-a2b2-98ac215f4084",
          },
          {
            name: "Blazers and Vests",
            id: "5d09c335-b05d-4e5d-a253-76e0ab541a8a",
          },
          {
            name: "Leather and Denim Jackets",
            id: "11fcd79e-cafd-4295-afde-c4d3f729ecac",
          },
          {
            name: "Trench and Rain Coats",
            id: "fa82afef-c889-408a-b63b-66e0f1103bfa",
          },
        ],
      },
      {
        name: "Womens Dresses",
        id: "wdress",
        types: [
          {
            name: "Cocktail and Party Dresses",
            id: "334a60c6-1ab6-497f-9f2f-e227d03b4f96",
          },
          {
            name: "Casual and Day Dresses",
            id: "4a6b94ea-9ff1-444c-b072-231e1798cb40",
          },
          {
            name: "Maxi and Midi Dresses",
            id: "fc961686-ba71-4143-b5d6-ca4ff61b7e55",
          },
          {
            name: "Evening and Formal Dresses",
            id: "9c1be2bc-2c45-4393-9ebd-b406a400ebda",
          },
        ],
      },
      {
        name: "Womens Bottoms",
        id: "wbottoms",
        types: [
          {
            name: "Pants and Trousers",
            id: "34fc4531-41a9-42f1-b302-5e757deb6415",
          },
          {
            name: "Skirts and Mini Skirts",
            id: "b92e8655-c4c0-46e9-9ac9-af442d4a0aef",
          },
          {
            name: "Jeans and Denim",
            id: "9386ef58-9940-4c46-8c17-8e0e8ddbdb2a",
          },
          {
            name: "Leggings and Shorts",
            id: "3e6b2127-5fbd-4b97-bc0a-08af23489fd1",
          },
        ],
      },
      {
        name: "Womens Lingerie & Sleepwear",
        id: "wlingerie",
        types: [
          {
            name: "Bras and Bralettes",
            id: "b89d7f2b-e368-4179-a5ff-a4f840a5b329",
          },
          {
            name: "Panties and Thongs",
            id: "c4482192-c40a-4889-ba30-a442c5e68edd",
          },
          {
            name: "Pajamas and Nightgowns",
            id: "b70fb4bb-e00e-496e-8cbc-9a1a71a835c3",
          },
          { name: "Lingerie Sets", id: "c54447a4-1e73-4b7c-a211-02f11a8695aa" },
        ],
      },
    ],
  },
  {
    parent: "Men",
    subCategories: [
      {
        name: "Mens Underwear & Loungewear",
        id: "munderwear",
        types: [
          {
            name: "Boxers and Briefs",
            id: "3b447d4e-98ac-43f9-96aa-2ad17569e972",
          },
          {
            name: "Loungewear and Pajamas",
            id: "be8a8da1-af51-492b-9089-cf1daf8d171a",
          },
        ],
      },
      {
        name: "Mens Swimwear",
        id: "mswim",
        types: [
          { name: "Board Shorts", id: "f52d3546-73fe-4c41-b3e3-72f3a25960a4" },
          { name: "Swim Trunks", id: "fb697ef2-9cec-4120-8547-7f525c37154b" },
          { name: "Rash Guards", id: "39c0f2eb-2b4a-43b9-9911-66419a47b84b" },
        ],
      },
      {
        name: "Mens Suits & Formalwear",
        id: "msuits",
        types: [
          {
            name: "Business Suits",
            id: "7f191d2d-b29d-42a9-96c1-490742bf0d79",
          },
          { name: "Tuxedos", id: "fc4d032e-53e7-460b-809f-ed5ed502073f" },
        ],
      },
      {
        name: "Mens Shoes",
        id: "mshoes",
        types: [
          { name: "Casual Shoes", id: "99d58506-db55-4f70-b473-b2dd03288703" },
          { name: "Formal Shoes", id: "e1e491b0-fc20-4a54-94cc-ab27bf47a6e0" },
          { name: "Sneakers", id: "497bcb53-a7c3-4b57-be96-b70507d7b3d3" },
          { name: "Boots", id: "9c6c0967-db26-4f02-9586-fffcddb8b4b4" },
        ],
      },
      {
        name: "Mens Shirts & Tops",
        id: "mtops",
        types: [
          { name: "Casual Shirts", id: "12fa1417-a38f-42a3-ba6d-8c14b61b72cd" },
          { name: "Formal Shirts", id: "949d670a-e609-4f87-9c46-14ddeb9ecf4f" },
          {
            name: "T-Shirts and Polos",
            id: "0be99aaa-da4e-4f13-be48-4a29b33c1fb2",
          },
          {
            name: "Sweatshirts and Hoodies",
            id: "8b728699-1568-4e02-9a86-0dba6fdccead",
          },
        ],
      },
      {
        name: "Mens Pants & Bottoms",
        id: "mbottoms",
        types: [
          { name: "Jeans", id: "10652ab7-6d7e-4106-a930-d5766c8dbf71" },
          {
            name: "Chinos and Trousers",
            id: "10df2e89-7541-424a-a565-65af0063408b",
          },
          { name: "Shorts", id: "ac43a772-cd46-4f75-ad43-37e52666d25b" },
        ],
      },
      {
        name: "Mens Outerwear",
        id: "mouter",
        types: [
          {
            name: "Casual Jackets",
            id: "e6fe24f1-9bcb-4514-98ac-9ee405cb8cbb",
          },
          {
            name: "Tailored Blazers",
            id: "38e3e349-6653-4c64-82de-f35cc72517ba",
          },
          {
            name: "Rain Protection",
            id: "b4b32a1d-67ad-4ed8-bbb2-364ecd2a76b4",
          },
        ],
      },
      {
        name: "Mens Activewear",
        id: "mactive",
        types: [
          {
            name: "Gym and Sportswear",
            id: "3c1a6a9b-bb62-4e62-bf11-65a12ca03a27",
          },
          {
            name: "Running and Track Wear",
            id: "f3dde62f-276b-4537-ac8c-ae30e52c724c",
          },
        ],
      },
    ],
  },
  {
    parent: "Kids",
    subCategories: [
      {
        name: "Kids Shoes",
        id: "kshoes",
        types: [
          { name: "Kids Shoes", id: "b8e01650-7259-4869-bd75-16883a4b5d24" },
        ],
      },
      {
        name: "Kids Apparel",
        id: "kapparel",
        types: [
          { name: "Tops", id: "800c2876-f58b-46e0-9cd4-08b4ff3d0c8b" },
          { name: "Bottoms", id: "a6d26bc6-d263-4f66-a208-ceec2b0fe038" },
          { name: "Outerwear", id: "3c1855a4-3715-4719-97f3-5d9eaa3cb3f4" },
        ],
      },
    ],
  },
  {
    parent: "General Apparel",
    subCategories: [
      {
        name: "Accessories",
        id: "gaccessories",
        types: [
          { name: "Hats", id: "genhats" },
          { name: "Scarves", id: "genscarves" },
        ],
      },
    ],
  },
  {
    parent: "Others",
    subCategories: [
      {
        name: "Miscellaneous",
        id: "othersmisc",
        types: [{ name: "Uncategorized", id: "otheruncat" }],
      },
    ],
  },
];

export const ALL_CATEGORIES_FLAT = CATEGORIES_STRUCTURE.flatMap((pc) =>
  pc.subCategories.flatMap((sc) =>
    sc.types.map((tc) => ({
      id: tc.id, // Unique ID for React key
      name: `${pc.parent} > ${sc.name} > ${tc.name}`, // Full category path for display
      parentCategoryId: pc.id,
      subCategoryId: sc.id,
      categoryId: tc.id, // This maps to the 'categoryId' in the Product model
    }))
  )
);

export const PRODUCT_STATUSES = ["Active", "Hidden", "Draft"];
export const SIZE_TYPES = [
  "XXS (00)",
  "XS (0-2)",
  "S (4-6)",
  "M (8-10)",
  "L (12-14)",
  "XXL+ (20+)",
  "O/S",
  "Other",
];
export const USER_ROLES = [
  "Superadmin",
  "Admin",
  "Cashier",
  "WarehouseUploader",
  "ProductLister",
  "Customer",
];

export const PERMISSIONS = {
  Superadmin: [
    "overview",
    "products",
    "orders",
    "categories",
    "inventory",
    "notifications",
    "users",
    "settings",
    "addProduct",
    "editProduct",
  ],
  Admin: [
    "overview",
    "products",
    "orders",
    "categories",
    "inventory",
    "notifications",
    "users",
    "settings",
    "addProduct",
    "editProduct",
  ],
  Cashier: ["inventory"],
  WarehouseUploader: ["addProduct"],
  ProductLister: ["products", "addProduct", "editProduct", "categories"],
  Customer: [],
};

const MOCK_BRANDS = ["Apple", "Samsung", "Dell", "Levis", "Nike", "Zara"]; // Keeping existing as no new list provided

// Mock current user for role-based access
const MOCK_CURRENT_USER = {
  id: "user123",
  role: "Admin", // 'Admin', 'Editor', 'WarehouseUploader'
};

const BASE_API_URL = `${BASE_URL}/api`; // Ensure this matches your backend URL

// Helper function for Image with Fallback
const ImageWithFallback = ({ src, fallbackSrc, alt, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [error, setError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setError(false);
  }, [src]);

  const handleError = () => {
    if (!error) {
      setImgSrc(fallbackSrc);
      setError(true);
    }
  };

  return (
    <img
      src={imgSrc || fallbackSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
};

// Helper for status colors
const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-600 text-white";
    case "Hidden":
      return "bg-orange-600 text-white";
    case "Draft":
      return "bg-yellow-600 text-black";
    case "Archived":
      return "bg-red-600 text-white"; // 'Archived' is not in new PRODUCT_STATUSES but kept for robustness
    default:
      return "bg-gray-600 text-white";
  }
};

// Helper for listed platform names
const getListedPlatformNames = (listedOn, status) => {
  if (status === "Draft") return "N/A";
  return listedOn && listedOn.length > 0 ? listedOn.join(", ") : "None";
};

// Pagination Component
const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
  onItemsPerPageChange,
}) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center mt-6 p-4 bg-gray-800 rounded-lg">
      <div className="text-gray-400 mb-2 sm:mb-0">
        Showing {Math.min((currentPage - 1) * itemsPerPage + 1, totalItems)} -{" "}
        {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
      </div>
      <div className="flex items-center gap-2">
        <select
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="bg-gray-700 text-white rounded-lg p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value={5}>5 per page</option>
          <option value={10}>10 per page</option>
          <option value={20}>20 per page</option>
          <option value={50}>50 per page</option>
        </select>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-white text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages || totalPages === 0}
          className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
};

// Add/Edit Product Modal Component
const AddEditProductModal = ({
  isOpen,
  onClose,
  productData,
  onSave,
  categories,
  brands,
  sizeTypes,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    brandName: "",
    color: "",
    sku: "",
    images: [], // This will hold existing image objects {id, url}
    itemLocation: "",
    sizeId: "",
    sizeType: "",
    postName: "",
    categoryId: "",
    subCategoryId: "",
    parentCategoryId: "",
    ebayId: "",
    wallmartId: "",
    sheinId: "",
    woocommerceId: "",
    regularPrice: "",
    salePrice: "",
    platFormPrice: "",
    discountPercent: "",
    stockQuantity: "",
    condition: "New", // Default condition
    description: "",
    status: "Draft", // Default status
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]); // This will hold new File objects
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (productData) {
        // Populate form for editing
        setFormData({
          title: productData.title || "",
          brandName: productData.brandName || "",
          color: productData.color || "",
          sku: productData.sku || "",
          images: productData.images || [], // Load existing images
          itemLocation: productData.itemLocation || "",
          sizeId: productData.sizeId || "",
          sizeType: productData.sizeType || "",
          postName: productData.postName || "",
          categoryId: productData.category?.id || "",
          subCategoryId: productData.subCategory?.id || "",
          parentCategoryId: productData.parentCategory?.id || "",
          ebayId: productData.ebayId || "",
          wallmartId: productData.wallmartId || "",
          sheinId: productData.sheinId || "",
          woocommerceId: productData.woocommerceId || "",
          regularPrice: productData.regularPrice?.toString() || "",
          salePrice: productData.salePrice?.toString() || "",
          platFormPrice: productData.platFormPrice?.toString() || "",
          discountPercent: productData.discountPercent?.toString() || "",
          stockQuantity: productData.stockQuantity?.toString() || "",
          condition: productData.condition || "New",
          description: productData.description || "",
          status: productData.status || "Draft",
        });
      } else {
        // Reset form for adding
        setFormData({
          title: "",
          brandName: "",
          color: "",
          sku: "",
          images: [], // Reset existing images
          itemLocation: "",
          sizeId: "",
          sizeType: "",
          postName: "",
          categoryId: "",
          subCategoryId: "",
          parentCategoryId: "",
          ebayId: "",
          wallmartId: "",
          sheinId: "",
          woocommerceId: "",
          regularPrice: "",
          salePrice: "",
          platFormPrice: "",
          toggleFirstDeal: true,
          discountPercent: "",
          stockQuantity: "",
          condition: "New",
          description: "",
          status: "Draft",
        });
      }
      setImageFiles([]); // Clear new image files
      setValidationErrors({});
    }
  }, [isOpen, productData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      console.log("Newly selected files:", newFiles);
      setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveExistingImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handleCategoryChange = (e) => {
    const selectedCategoryName = e.target.value;
    const selectedCategory = categories.find(
      (cat) => cat.name === selectedCategoryName
    );
    if (selectedCategory) {
      setFormData((prev) => ({
        ...prev,
        categoryId: selectedCategory.categoryId || "",
        subCategoryId: selectedCategory.subCategoryId || "",
        parentCategoryId: selectedCategory.parentCategoryId || "",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        categoryId: "",
        subCategoryId: "",
        parentCategoryId: "",
      }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Title is required.";
    if (!formData.sku) errors.sku = "SKU is required.";
    // Basic price validation (add more robust validation if needed)
    if (isNaN(parseFloat(formData.regularPrice)) || parseFloat(formData.regularPrice) <= 0) {
      errors.regularPrice = "Regular Price must be a positive number.";
    }
    if (formData.stockQuantity === "" || isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
        errors.stockQuantity = "Stock Quantity must be a non-negative number.";
    }


    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Validation failed", validationErrors);
      return;
    }

    const dataToSave = new FormData();

    // Append all form data fields except 'images'
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        // Handle boolean conversion for 'toggleFirstDeal' if it comes as a string
        if (key === "toggleFirstDeal") {
            dataToSave.append(key, formData[key] ? 'true' : 'false');
        } else {
            dataToSave.append(key, formData[key]);
        }
      }
    });

    // --- IMPORTANT CHANGE HERE ---
    // Append existing images under a new field 'existingImages' as a JSON string
    // This array contains objects { id: "cf_id", url: "cf_url" }
    dataToSave.append("existingImages", JSON.stringify(formData.images));

    // Append new image files under the 'images' field (for Multer)
    console.log("imageFiles before appending:", imageFiles);
    imageFiles.forEach((file) => {
      dataToSave.append("images", file); // Multer will pick these up
    });

    // For debugging FormData content (uncomment to use)
    console.log("Inspecting FormData content:");
    for (let pair of dataToSave.entries()) {
      // For File objects, pair[1] will be the File object itself
      console.log(pair[0] + ': ' + (pair[1] instanceof File ? pair[1].name : pair[1]));
    }

    onSave(dataToSave);
    console.log("FormData prepared:", dataToSave);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
          <h2 className="text-2xl font-bold text-white">
            {productData ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <PlusCircle size={24} className="rotate-45" />{" "}
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {/* General Information */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mb-2">
            General Information
          </div>
          <div className="flex flex-col">
            <label htmlFor="title" className="text-gray-300 text-sm mb-1">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.title ? "border-red-500" : ""
              }`}
            />
            {validationErrors.title && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.title}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="sku" className="text-gray-300 text-sm mb-1">
              SKU <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="sku"
              name="sku"
              value={formData.sku}
              onChange={handleChange}
              className={`bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.sku ? "border-red-500" : ""
              }`}
            />
            {validationErrors.sku && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.sku}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="brandName" className="text-gray-300 text-sm mb-1">
              Brand Name
            </label>
            <select
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Brand</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="color" className="text-gray-300 text-sm mb-1">
              Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="itemLocation"
              className="text-gray-300 text-sm mb-1"
            >
              Item Location
            </label>
            <input
              type="text"
              id="itemLocation"
              name="itemLocation"
              value={formData.itemLocation}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="condition" className="text-gray-300 text-sm mb-1">
              Condition
            </label>
            <select
              id="condition"
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="New">New</option>
              <option value="Used">Used</option>
              <option value="Refurbished">Refurbished</option>
            </select>
          </div>

          {/* Category & Size Information */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Category & Size
          </div>
          <div className="flex flex-col">
            <label htmlFor="category" className="text-gray-300 text-sm mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={
                categories.find(
                  (cat) =>
                    cat.categoryId === formData.categoryId &&
                    cat.subCategoryId === formData.subCategoryId &&
                    cat.parentCategoryId === formData.parentCategoryId
                )?.name || ""
              }
              onChange={handleCategoryChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="sizeId" className="text-gray-300 text-sm mb-1">
              Size ID (Placeholder)
            </label>
            <input
              type="text"
              id="sizeId"
              name="sizeId"
              value={formData.sizeId}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="sizeType" className="text-gray-300 text-sm mb-1">
              Size Type
            </label>
            <select
              id="sizeType"
              name="sizeType"
              value={formData.sizeType}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Size Type</option>
              {sizeTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="postName" className="text-gray-300 text-sm mb-1">
              Post Name
            </label>
            <input
              type="text"
              id="postName"
              name="postName"
              value={formData.postName}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Pricing & Inventory */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Pricing & Inventory
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="regularPrice"
              className="text-gray-300 text-sm mb-1"
            >
              Regular Price ($) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              step="0.01"
              id="regularPrice"
              name="regularPrice"
              value={formData.regularPrice}
              onChange={handleChange}
              className={`bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.regularPrice ? "border-red-500" : ""
              }`}
            />
            {validationErrors.regularPrice && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.regularPrice}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="salePrice" className="text-gray-300 text-sm mb-1">
              Sale Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              id="salePrice"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              className={`bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.salePrice ? "border-red-500" : ""
              }`}
            />
            {validationErrors.salePrice && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.salePrice}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="platFormPrice"
              className="text-gray-300 text-sm mb-1"
            >
              Platform Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              id="platFormPrice"
              name="platFormPrice"
              value={formData.platFormPrice}
              onChange={handleChange}
              className={`bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.platFormPrice ? "border-red-500" : ""
              }`}
            />
            {validationErrors.platFormPrice && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.platFormPrice}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="discountPercent"
              className="text-gray-300 text-sm mb-1"
            >
              Discount Percent (%)
            </label>
            <input
              type="number"
              step="0.01"
              id="discountPercent"
              name="discountPercent"
              value={formData.discountPercent}
              onChange={handleChange}
              className={`bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.discountPercent ? "border-red-500" : ""
              }`}
            />
            {validationErrors.discountPercent && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.discountPercent}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="stockQuantity"
              className="text-gray-300 text-sm mb-1"
            >
              Stock Quantity <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              value={formData.stockQuantity}
              onChange={handleChange}
              className={`bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 ${
                validationErrors.stockQuantity ? "border-red-500" : ""
              }`}
            />
            {validationErrors.stockQuantity && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.stockQuantity}
              </span>
            )}
          </div>
          

          {/* Platforms & Status */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Platforms & Status
          </div>
          <div className="flex flex-col">
            <label htmlFor="ebayId" className="text-gray-300 text-sm mb-1">
              eBay ID
            </label>
            <input
              type="text"
              id="ebayId"
              name="ebayId"
              value={formData.ebayId}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="wallmartId" className="text-gray-300 text-sm mb-1">
              Walmart ID
            </label>
            <input
              type="text"
              id="wallmartId"
              name="wallmartId"
              value={formData.wallmartId}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="sheinId" className="text-gray-300 text-sm mb-1">
              Shein ID
            </label>
            <input
              type="text"
              id="sheinId"
              name="sheinId"
              value={formData.sheinId}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label
              htmlFor="woocommerceId"
              className="text-gray-300 text-sm mb-1"
            >
              WooCommerce ID
            </label>
            <input
              type="text"
              id="woocommerceId"
              name="woocommerceId"
              value={formData.woocommerceId}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="status" className="text-gray-300 text-sm mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              {PRODUCT_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Images */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Images
          </div>
          <div className="col-span-1 md:col-span-2 flex flex-col gap-2">
            <div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden"
                accept="image/*"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Add Images
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {/* Display existing images (from productData) */}
              {formData.images.map((img, index) => (
                <div key={`existing-${index}`} className="relative w-20 h-20 group">
                  <img
                    // Ensure you're accessing the correct URL property, assuming img is {id, url}
                    src={img.url || img}
                    alt={`Product image ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveExistingImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    X
                  </button>
                </div>
              ))}
              {/* Display new images (File objects) */}
              {imageFiles.map((file, index) => (
                <div key={`new-${index}`} className="relative w-20 h-20 group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`New image ${index}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveNewImage(index)}
                    className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Description
          </div>
          <div className="col-span-1 md:col-span-2">
            <label htmlFor="description" className="sr-only">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            ></textarea>
          </div>

          <div className="col-span-1 md:col-span-2 flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg"
            >
              {productData ? "Save Changes" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Product Management Page Component
const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    category: "",
    brand: "",
    status: "",
    itemLocationFilter: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [editingQuantity, setEditingQuantity] = useState({}); // {productId: newQuantity}
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [currentEditingProductId, setCurrentEditingProductId] = useState(null); // null for add, product ID for edit

  const currentUser = MOCK_CURRENT_USER; // From context/auth
  // Determine permissions based on the provided PERMISSIONS constant
  const canAddProducts = PERMISSIONS[currentUser.role]?.includes("addProduct");
  const canEditProducts =
    PERMISSIONS[currentUser.role]?.includes("editProduct");

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        pageSize: itemsPerPage,
        sortBy: "createdAt", // Hardcoded for now, can be dynamic
        sortOrder: "desc", // Hardcoded for now
      });

      if (searchTerm) queryParams.append("searchTerm", searchTerm);
      if (filters.category) queryParams.append("category", filters.category);
      if (filters.brand) queryParams.append("brand", filters.brand);
      if (filters.status) queryParams.append("status", filters.status);
      if (filters.itemLocationFilter)
        queryParams.append("itemLocationFilter", filters.itemLocationFilter);

      const response = await fetch(
        `${BASE_API_URL}/products?${queryParams.toString()}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProducts(data.products);
      setTotalPages(data.totalPages);
      setTotalItems(data.totalItems);
      setSelectedProducts(new Set()); // Clear selection on new fetch
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, itemsPerPage, searchTerm, filters]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Derived state for the UI, based on fetched products
  // In a real app, `filteredAndSortedProducts` would be the `products` state directly from API.
  // The pagination logic would also be fully backend-driven.
  const filteredAndSortedProducts = products; // Directly use the products from API, as backend handles filtering/sorting

  const paginatedProducts = products; // Backend already paginates, so this is just the current page's products

  // Handle Select All Checkbox
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allProductIds = new Set(paginatedProducts.map((p) => p.id));
      setSelectedProducts(allProductIds);
    } else {
      setSelectedProducts(new Set());
    }
  };

  // Handle Individual Product Selection
  const handleSelectProduct = (productId) => {
    setSelectedProducts((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(productId)) {
        newSelected.delete(productId);
      } else {
        newSelected.add(productId);
      }
      return newSelected;
    });
  };

  const handleQuantityChange = (productId, value) => {
    setEditingQuantity((prev) => ({
      ...prev,
      [productId]: value,
    }));
  };

  const saveQuantityChange = async (productId) => {
    const newQuantity = parseInt(editingQuantity[productId], 10);
    if (isNaN(newQuantity) || newQuantity < 0) {
      alert("Please enter a valid quantity."); // Using alert for simplicity, replace with custom modal
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(
        `${BASE_API_URL}/products/${productId}/stock-quantity`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stockQuantity: newQuantity }),
        }
      );
      if (!response.ok) throw new Error("Failed to update quantity");
      await fetchProducts(); // Re-fetch products to reflect changes
      setEditingQuantity((prev) => {
        const newState = { ...prev };
        delete newState[productId];
        return newState;
      });
    } catch (err) {
      console.error("Error updating quantity:", err);
      setError("Failed to update quantity.");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickAction = async (productId, actionType) => {
    setLoading(true);
    try {
      if (actionType === "toggleOffer") {
        const response = await fetch(
          `${BASE_API_URL}/products/${productId}/toggle-offer`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!response.ok) throw new Error("Failed to toggle offer");
      } else if (PRODUCT_STATUSES.includes(actionType)) {
        // Assume actionType is the new status
        const response = await fetch(
          `${BASE_API_URL}/products/${productId}/status`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: actionType }),
          }
        );
        if (!response.ok) throw new Error("Failed to update status");
      }
      await fetchProducts(); // Re-fetch products to reflect changes
    } catch (err) {
      console.error(`Error performing quick action ${actionType}:`, err);
      setError(`Failed to perform action: ${actionType}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (actionType, value = null) => {
    if (selectedProducts.size === 0) {
      alert("Please select at least one product for bulk action."); // Replace with custom modal
      return;
    }
    setLoading(true);
    try {
      const productIdsArray = Array.from(selectedProducts);
      let payload = { productIds: productIdsArray, action: actionType };

      // Special handling for updateInventoryBulk, which needs quantities per ID
      if (actionType === "updateInventoryBulk") {
        // For simplicity, this currently logs. In a real scenario, you'd need
        // a UI to collect new quantities for each selected product before calling this.
        console.warn(
          "Bulk inventory update requires specific quantity input for each selected product. This is a placeholder."
        );
        alert(
          "Bulk inventory update selected. In a real app, you'd input quantities here."
        );
        setLoading(false);
        return;
      } else if (value !== null) {
        payload.value = value;
      }

      const response = await fetch(`${BASE_API_URL}/products/bulk-actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to perform bulk action");
      }
      await fetchProducts(); // Re-fetch products to reflect changes
      setSelectedProducts(new Set()); // Clear selection after bulk action
    } catch (err) {
      console.error(`Error performing bulk action ${actionType}:`, err);
      setError(`Failed to perform bulk action: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (productId) => {
    setCurrentEditingProductId(productId);
    setIsAddEditModalOpen(true);
  };

  const handleAddProductClick = () => {
    setCurrentEditingProductId(null); // Ensure no product is being edited
    setIsAddEditModalOpen(true);
  };

  const handleCloseAddEditModal = () => {
    setIsAddEditModalOpen(false);
    setCurrentEditingProductId(null);
  };

  const handleSaveProduct = async (productFormData) => {
    setLoading(true);
    try {
      const url = currentEditingProductId
        ? `${BASE_API_URL}/products/${currentEditingProductId}`
        : `${BASE_API_URL}/products`;
      // const data = JSON.stringify(productFormData);
      if (currentEditingProductId) {
        const response = await apiClient.put(url, productFormData);
        if (!response.data.success === true) {
          const errorData = response.data.message;
          throw new Error(
            errorData.message ||
              `Failed to ${currentEditingProductId ? "update" : "add"} product`
          );
        }
      } else {
        const response = await apiClient.post(url, productFormData);
        if (!response.data.success === true) {
          const errorData = response.data.message;
          throw new Error(
            errorData.message ||
              `Failed to ${currentEditingProductId ? "update" : "add"} product`
          );
        }
      }
      await fetchProducts(); // Re-fetch products to update list
      handleCloseAddEditModal();
    } catch (err) {
      console.error(`Error saving product:`, err);
      setError(`Failed to save product: ${err.message}.`);
    } finally {
      setLoading(false);
    }
  };

  const productToEdit = currentEditingProductId
    ? products.find((p) => p.id === currentEditingProductId)
    : null;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans antialiased">
      <div className="p-4 md:p-6">
        {/* Header and Search/Add Product */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <h3 className="text-xl font-semibold text-white">
              Products ({totalItems} total)
            </h3>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-auto">
              <Search
                size={20}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-72"
              />
            </div>
            {canAddProducts && (
              <button
                onClick={handleAddProductClick}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center whitespace-nowrap"
              >
                <PlusCircle size={20} className="mr-2" /> Add Product
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-800 rounded-lg shadow">
          <select
            value={filters.category}
            onChange={(e) => {
              setFilters({ ...filters, category: e.target.value });
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {ALL_CATEGORIES_FLAT.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={filters.brand}
            onChange={(e) => {
              setFilters({ ...filters, brand: e.target.value });
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Brands</option>
            {MOCK_BRANDS.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
          <select
            value={filters.status}
            onChange={(e) => {
              setFilters({ ...filters, status: e.target.value });
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            {PRODUCT_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Filter by Item Location..."
            value={filters.itemLocationFilter || ""}
            onChange={(e) => {
              setFilters({ ...filters, itemLocationFilter: e.target.value });
              setCurrentPage(1);
            }}
            className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
          />
          <button
            onClick={() => {
              setFilters({
                category: "",
                brand: "",
                status: "",
                itemLocationFilter: "",
              });
              setCurrentPage(1);
            }}
            className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center"
          >
            <Filter size={18} className="mr-2" /> Clear Filters
          </button>
        </div>

        {/* Bulk Actions */}
        {selectedProducts.size > 0 && canEditProducts && (
          <div className="mb-4 p-3 bg-gray-700 rounded-lg flex flex-wrap items-center gap-3">
            <span className="text-white text-sm font-medium">
              {selectedProducts.size} selected
            </span>
            <button
              onClick={() => handleBulkAction("updateInventoryBulk")}
              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs flex items-center"
            >
              <Edit size={14} className="mr-1" /> Qty
            </button>
            <button
              onClick={() => handleBulkAction("setActive", "Active")}
              className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs flex items-center"
            >
              <Check size={14} className="mr-1" /> Set Active
            </button>
            <button
              onClick={() => handleBulkAction("setHidden", "Hidden")}
              className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-xs flex items-center"
            >
              <EyeOff size={14} className="mr-1" /> Set Hidden
            </button>
            <button
              onClick={() => handleBulkAction("setDraft", "Draft")}
              className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded text-xs flex items-center"
            >
              <Archive size={14} className="mr-1" /> Set Draft
            </button>
            <button
              onClick={() => handleBulkAction("toggleOfferBulk")}
              className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded text-xs flex items-center"
            >
              <DollarSign size={14} className="mr-1" /> Toggle $10 Offer
            </button>
          </div>
        )}

        {/* Product Table */}
        <div className="bg-gray-800 shadow-xl rounded-xl overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400">
              Loading products...
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-400">{error}</div>
          ) : (
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                <tr>
                  <th scope="col" className="px-4 py-3 w-10">
                    <input
                      type="checkbox"
                      onChange={handleSelectAll}
                      checked={
                        selectedProducts.size === paginatedProducts.length &&
                        paginatedProducts.length > 0 &&
                        paginatedProducts.every((p) =>
                          selectedProducts.has(p.id)
                        )
                      }
                      className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"
                    />
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Product
                  </th>
                  <th scope="col" className="px-4 py-3">
                    SKU
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Item Location
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Prices (Reg/Sale/Offer)
                  </th>
                  <th scope="col" className="px-4 py-3 text-center">
                    Qty
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Platforms
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => (
                  <tr
                    key={product.id}
                    className={`border-b border-gray-700 hover:bg-gray-700/50 ${
                      selectedProducts.has(product.id)
                        ? "bg-gray-700"
                        : "bg-gray-800"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedProducts.has(product.id)}
                        onChange={() => handleSelectProduct(product.id)}
                        className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 font-medium text-white whitespace-nowrap flex items-center">
                      <ImageWithFallback
                        src={product.imageUrl?.url}
                        fallbackSrc={`https://placehold.co/40x40/777/FFF?text=${
                          product.title
                            ? product.title.substring(0, 1)
                            : "P"
                        }`}
                        alt={product.title}
                        className="w-10 h-10 rounded-md object-cover mr-3"
                      />
                      <div>
                        <span
                          className="truncate max-w-xs block"
                          title={product.title}
                        >
                          {product.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {product.category?.name}{" "}
                          {/* Display category name if available */}
                          {product.variants && product.variants.length > 0 && (
                            <span className="text-blue-400">
                              (Has Variants)
                            </span>
                          )}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{product.sku}</td>
                    <td className="px-4 py-3">
                      {product.itemLocation || "N/A"}
                    </td>
                    <td className="px-4 py-3">
                      <div>${product.regularPrice?.toFixed(2)}</div>
                      {product.salePrice && (
                        <div className="text-yellow-400">
                          ${product.salePrice.toFixed(2)}
                        </div>
                      )}
                      {product.hasTenDollarOffer && product.offerPrice && (
                        <div className="text-purple-400">
                          ${product.offerPrice.toFixed(2)} (Offer)
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {typeof editingQuantity[product.id] !== "undefined" &&
                      canEditProducts &&
                      !product.variants ? (
                        <div className="flex items-center justify-center">
                          <input
                            type="number"
                            value={editingQuantity[product.id]}
                            onChange={(e) =>
                              handleQuantityChange(product.id, e.target.value)
                            }
                            className="w-16 bg-gray-600 text-white p-1 rounded text-center"
                          />
                          <button
                            onClick={() => saveQuantityChange(product.id)}
                            className="ml-1 text-green-400 hover:text-green-300"
                          >
                            <CheckCircle size={18} />
                          </button>
                        </div>
                      ) : (
                        <span
                          onClick={() =>
                            canEditProducts &&
                            !product.variants &&
                            setEditingQuantity({
                              ...editingQuantity,
                              [product.id]: product.quantity,
                            })
                          }
                          className={`${
                            canEditProducts && !product.variants
                              ? "cursor-pointer hover:text-white"
                              : ""
                          } ${
                            product.quantity === 0
                              ? "text-red-400 font-semibold"
                              : ""
                          }`}
                        >
                          {product.quantity}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          product.status
                        )} ${
                          product.quantity === 0 && product.status === "Active"
                            ? "ring-1 ring-red-400"
                            : ""
                        }`}
                      >
                        {product.quantity === 0 && product.status === "Active"
                          ? "Sold Out"
                          : product.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs">
                      {getListedPlatformNames(product.listedOn, product.status)}
                    </td>
                    <td className="px-4 py-3">
                      {(canEditProducts ||
                        (currentUser.role === "WarehouseUploader" &&
                          product.status === "Draft")) && (
                        <div className="flex space-x-1 items-center">
                          <button
                            onClick={() => handleEditClick(product.id)}
                            className="text-blue-400 hover:text-blue-300 p-1"
                            title="Edit Product"
                          >
                            <Edit3 size={16} />
                          </button>
                          {currentUser.role !== "WarehouseUploader" && (
                            <>
                              <select
                                value={product.status}
                                onChange={(e) =>
                                  handleQuickAction(product.id, e.target.value)
                                }
                                className="bg-gray-700 text-xs text-white p-1 rounded focus:ring-0 border-0 appearance-none"
                                title="Change Status"
                              >
                                {PRODUCT_STATUSES.map((s) => (
                                  <option key={s} value={s}>
                                    {s}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() =>
                                  handleQuickAction(product.id, "toggleOffer")
                                }
                                className={`p-1 ${
                                  product.hasTenDollarOffer
                                    ? "text-purple-400 hover:text-purple-300"
                                    : "text-gray-500 hover:text-gray-300"
                                }`}
                                title={
                                  product.hasTenDollarOffer
                                    ? "Disable $10 Offer"
                                    : "Enable $10 Offer"
                                }
                              >
                                <DollarSign size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {paginatedProducts.length === 0 && !loading && !error && (
          <p className="text-center text-gray-500 mt-8">
            No products found matching your criteria.
          </p>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
          onItemsPerPageChange={(val) => {
            setItemsPerPage(val);
            setCurrentPage(1);
          }}
        />
      </div>

      <AddEditProductModal
        isOpen={isAddEditModalOpen}
        onClose={handleCloseAddEditModal}
        productData={productToEdit}
        onSave={handleSaveProduct}
        categories={ALL_CATEGORIES_FLAT}
        brands={MOCK_BRANDS}
        sizeTypes={SIZE_TYPES}
      />
    </div>
  );
};

export default ProductManagementPage;
