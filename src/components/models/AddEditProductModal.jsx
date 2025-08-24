import { PlusCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { PRODUCT_STATUSES } from "../../constants"; // Assuming this path is correct

const AddEditProductModal = ({
  isOpen,
  onClose,
  productData,
  onSave,
  categories,
  sizeTypes,
  loading,
}) => {
  const [variants, setVariants] = useState([]);
  const [variantImages, setVariantImages] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    brandName: "",
    color: "", // Re-added to main product formData
    sku: "",
    images: [], // This will hold existing image objects {id, url}
    itemLocation: "",
    notes: "", // Add notes field
    sizeId: "",
    sizeType: "",
    sizes: "",
    categoryId: "",
    subCategoryId: "",
    parentCategoryId: "",
    regularPrice: "", // Re-added to main product formData
    salePrice: "", // Re-added to main product formData
    stockQuantity: "", // Re-added to main product formData
    toggleFirstDeal: true,
    condition: "New", // Default condition
    description: "",
    status: "Draft", // Default status
    // New eBay boolean flags
    ebayOne: false,
    ebayTwo: false,
    ebayThree: false,
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [imageFiles, setImageFiles] = useState([]); // This will hold new File objects
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (productData) {
        // Set variants if they exist
        if (productData.variants && Array.isArray(productData.variants)) {
          const newVariantImages = {};
          setVariants(
            productData.variants.map((variant) => {
              if (variant.images) {
                newVariantImages[variant.id] = variant.images;
              }
              return {
                id: variant.id,
                color: variant.color || "",
                sizeType: variant.sizeType || "",
                sizes: variant.sizes || variant.customSize || "",
                stockQuantity: variant.stockQuantity?.toString() || "0",
                skuSuffix: variant.skuSuffix || "",
                regularPrice: variant.regularPrice?.toString() || "0",
                salePrice: variant.salePrice?.toString() || ""
              };
            })
          );
          setVariantImages(newVariantImages);
        } else {
          setVariants([]);
        }

        // Populate form for editing
        setFormData({
          title: productData.title || "",
          brandName: productData.brandName || "",
          color: productData.color || "",
          sku: productData.sku || "",
          images: productData.images || [],
          itemLocation: productData.itemLocation || "",
          notes: productData.notes || "",
          sizeId: productData.sizeId || "",
          sizeType: productData.sizeType || "",
          sizes: productData.sizes || productData.customSize || "",
          categoryId: productData.category?.id || "",
          subCategoryId: productData.subCategory?.id || "",
          parentCategoryId: productData.parentCategory?.id || "",
          regularPrice: productData.regularPrice?.toString() || "",
          salePrice: productData.salePrice?.toString() || "",
          stockQuantity: productData.stockQuantity?.toString() || "",
          toggleFirstDeal: productData.toggleFirstDeal ?? true,
          condition: productData.condition || "New",
          description: productData.description || "",
          status: productData.status || "Active",
          ebayOne: productData.ebayOne ?? false,
          ebayTwo: productData.ebayTwo ?? false,
          ebayThree: productData.ebayThree ?? false,
          changeHistory: productData.changeHistory || [], // Add changeHistory
        });
      } else {
        // Reset variants and variant images
        setVariants([]);
        setVariantImages({});

        // Reset form for adding
        setFormData({
          title: "",
          brandName: "",
          color: "",
          sku: "",
          images: [],
          itemLocation: "",
          notes: "",
          sizeId: "",
          sizeType: "",
          sizes: "",
          stockQuantity: "0",
          categoryId: "",
          subCategoryId: "",
          parentCategoryId: "",
          regularPrice: "",
          salePrice: "",
          toggleFirstDeal: true,
          condition: "New",
          description: "",
          status: "Draft",
          ebayOne: false,
          ebayTwo: false,
          ebayThree: false,
          changeHistory: [], // Add empty changeHistory for new products
        });
      }
      setImageFiles([]);
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
    setValidationErrors((prev) => ({ ...prev, category: "" })); // Clear category error
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title) errors.title = "Title is required.";
    if (!formData.sku) errors.sku = "SKU is required.";

    // Validation for main product price/quantity if no variants are added
    if (variants.length === 0) {
      if (!formData.regularPrice || isNaN(parseFloat(formData.regularPrice)) || parseFloat(formData.regularPrice) <= 0) {
        errors.regularPrice = "Regular Price is required for main product if no variants.";
      }
      if (formData.stockQuantity === "" || isNaN(parseInt(formData.stockQuantity)) || parseInt(formData.stockQuantity) < 0) {
        errors.stockQuantity = "Stock Quantity is required for main product if no variants.";
      }
    }

    // Validate variants
    const variantErrors = [];
    variants.forEach((variant, index) => {
      const variantError = {};
      if (!variant.color) variantError.color = "Color is required";
      if (!variant.sizeType) variantError.sizeType = "Size Type is required";
      if (
        variant.stockQuantity === "" ||
        isNaN(parseInt(variant.stockQuantity)) ||
        parseInt(variant.stockQuantity) < 0
      ) {
        variantError.stockQuantity = "Stock Quantity must be a non-negative number";
      }
      if (
        isNaN(parseFloat(variant.regularPrice)) ||
        parseFloat(variant.regularPrice) <= 0
      ) {
        variantError.regularPrice = "Regular Price is required.";
      }
      if (Object.keys(variantError).length > 0) {
        variantErrors[index] = variantError;
      }
    });

    if (variantErrors.length > 0) {
      errors.variants = variantErrors;
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddVariant = () => {
    setVariants([
      ...variants,
      {
        color: "",
        sizeType: "",
        sizes: "",
        stockQuantity: "0", // Initialize as string to match input value type
        skuSuffix: "",
        regularPrice: "", // Always include regular price for new variants
        salePrice: "", // Always include sale price for new variants
      },
    ]);
  };

  const handleRemoveVariant = (index) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const handleVariantImageChange = (variantId, e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setVariantImages(prev => ({
        ...prev,
        [variantId]: [...(prev[variantId] || []), ...newFiles]
      }));
    }
  };

  const handleRemoveVariantImage = (variantId, index) => {
    setVariantImages(prev => {
      const newImages = [...(prev[variantId] || [])];
      newImages.splice(index, 1);
      return {
        ...prev,
        [variantId]: newImages
      };
    });
  };

  const handleVariantChange = (index, field, value) => {
    const newVariants = [...variants];
    if (field === 'customSize') {
      // Store sizes in the sizes field for consistency with the backend
      newVariants[index]['sizes'] = value;
    } else if (field === 'quantity') {
      // Store quantity in stockQuantity field for consistency with the backend
      newVariants[index]['stockQuantity'] = value;
    } else {
      newVariants[index][field] = value;
    }
    setVariants(newVariants);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Validation failed", validationErrors);
      return;
    }

    // Create FormData object
    const formDataToSubmit = new FormData();

    // Prepare core product data
    const productCoreData = {};
    Object.keys(formData).forEach((key) => {
      if (key !== "images") {
        if (key === "toggleFirstDeal" || key === "ebayOne" || key === "ebayTwo" || key === "ebayThree") {
          productCoreData[key] = formData[key] ? true : false;
        } else if ((key === "regularPrice" || key === "salePrice") && formData[key] !== "") {
          productCoreData[key] = parseFloat(formData[key]);
        } else if (key === "stockQuantity" && formData[key] !== "") {
          productCoreData[key] = parseInt(formData[key]);
        } else {
          productCoreData[key] = formData[key];
        }
      }
    });

    // Handle optional numeric fields
    if (productCoreData.regularPrice === "") productCoreData.regularPrice = null;
    if (productCoreData.salePrice === "") productCoreData.salePrice = null;
    if (productCoreData.stockQuantity === "") productCoreData.stockQuantity = null;

    // Add core product data
    formDataToSubmit.append("productData", JSON.stringify(productCoreData));

    // Add existing images
    formDataToSubmit.append("existingImages", JSON.stringify(formData.images));

    // Add new images
    imageFiles.forEach((file) => {
      formDataToSubmit.append("productImages", file);
    });

    // Add variants data and their images
    if (variants.length > 0) {
      const variantsData = variants.map((variant, idx) => {
        const variantId = variant.id || `new-${idx}`;
        const existingUrls = (variantImages[variantId] || []).filter(img => typeof img === "string");
        return {
          ...(variant.id && { id: variant.id }),
          color: variant.color,
          sizeType: variant.sizeType,
          sizes: variant.sizes || variant.customSize || null,
          stockQuantity: parseInt(variant.stockQuantity || variant.quantity) || 0,
          skuSuffix: variant.skuSuffix || null,
          regularPrice: parseFloat(variant.regularPrice),
          salePrice: variant.salePrice ? parseFloat(variant.salePrice) : null,
          images: existingUrls.length > 0 ? existingUrls : null
        };
      });
      formDataToSubmit.append("variants", JSON.stringify(variantsData));

      // Add variant images files (new uploads)
      variants.forEach((variant, idx) => {
        const variantId = variant.id || `new-${idx}`;
        if (variantImages[variantId]) {
          variantImages[variantId].forEach(image => {
            if (image instanceof File) {
              formDataToSubmit.append(`variantImages`, image);
            }
          });
        }
      });
    }

    try {
      await onSave(formDataToSubmit);
    } catch (error) {
      console.error("Error saving product:", error);
      setValidationErrors({ submit: "Failed to save product. Please try again." });
    }
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
            <input
              type="text"
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              className={`bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500`}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="color" className="text-gray-300 text-sm mb-1">
              Main Product Color
            </label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., Red (default color)"
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

          {/* Main Product Pricing & Stock */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Main Product Pricing & Stock (Defaults if no variants)
          </div>
          <div className="flex flex-col">
            <label htmlFor="regularPrice" className="text-gray-300 text-sm mb-1">
              Regular Price
              {variants.length === 0 && <span className="text-red-500">*</span>}
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
              placeholder="Enter regular price"
            />
            {validationErrors.regularPrice && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.regularPrice}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <label htmlFor="salePrice" className="text-gray-300 text-sm mb-1">
              Sale Price
            </label>
            <input
              type="number"
              step="0.01"
              id="salePrice"
              name="salePrice"
              value={formData.salePrice}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Enter sale price (optional)"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="stockQuantity" className="text-gray-300 text-sm mb-1">
              Stock Quantity
              {variants.length === 0 && <span className="text-red-500">*</span>}
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
              min="0"
            />
            {validationErrors.stockQuantity && (
              <span className="text-red-500 text-xs mt-1">
                {validationErrors.stockQuantity}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              id="toggleFirstDeal"
              name="toggleFirstDeal"
              checked={formData.toggleFirstDeal}
              onChange={handleChange}
              className="w-4 h-4"
            />
            <label htmlFor="toggleFirstDeal" className="text-gray-300 text-sm">
              Apply 10% Discount for First Deal
            </label>
          </div>

          {/* Category & Size Information (Main Product Info) */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Category & Size (Main Product Info)
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
            <label htmlFor="sizes" className="text-gray-300 text-sm mb-1">
              Sizes (General)
            </label>
            <input
              type="text"
              id="sizes"
              name="sizes"
              value={formData.sizes}
              onChange={handleChange}
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., S, M, L (general product sizes)"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="sizeType" className="text-gray-300 text-sm mb-1">
              Size Type (General)
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
                <option key={type?.id} value={type.name}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* New Platform Availability Section */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Platform Availability
          </div>
          <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ebayOne"
                name="ebayOne"
                checked={formData.ebayOne}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label htmlFor="ebayOne" className="text-gray-300 text-sm">
                eBay (Platform 1)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ebayTwo"
                name="ebayTwo"
                checked={formData.ebayTwo}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label htmlFor="ebayTwo" className="text-gray-300 text-sm">
                eBay (Platform 2)
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="ebayThree"
                name="ebayThree"
                checked={formData.ebayThree}
                onChange={handleChange}
                className="w-4 h-4"
              />
              <label htmlFor="ebayThree" className="text-gray-300 text-sm">
                eBay (Platform 3)
              </label>
            </div>
          </div>
          {/* End New Platform Availability Section */}

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
                <div
                  key={`existing-${index}`}
                  className="relative w-20 h-20 group"
                >
                  <img
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

          {/* Product Variations */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Product Variations (Overrides main product details)
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="mb-4">
              <button
                type="button"
                onClick={handleAddVariant}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
              >
                <PlusCircle size={20} /> Add Variant
              </button>
            </div>
            {variants.map((variant, index) => (
              <div
                key={index}
                className="bg-gray-800 p-4 rounded-lg mb-4 relative"
              >
                <button
                  type="button"
                  onClick={() => handleRemoveVariant(index)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-white"
                >
                  <PlusCircle size={20} className="rotate-45" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col space-y-4">
                    <div>
                      <label className="text-gray-300 text-sm mb-1">
                        Color<span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={variant.color}
                        onChange={(e) =>
                          handleVariantChange(index, "color", e.target.value)
                        }
                        className={`bg-gray-700 text-white rounded-lg p-2 ${
                          validationErrors.variants?.[index]?.color
                            ? "border-red-500"
                            : ""
                        }`}
                        placeholder="Enter color"
                      />
                      {validationErrors.variants?.[index]?.color && (
                        <span className="text-red-500 text-xs mt-1">
                          {validationErrors.variants[index].color}
                        </span>
                      )}
                    </div>
                    <div>
                      <label className="text-gray-300 text-sm mb-1">Variant Images</label>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => handleVariantImageChange(variant.id || `new-${index}`, e)}
                        className="bg-gray-700 text-white rounded-lg p-2 w-full"
                      />
                      {variantImages[variant.id || `new-${index}`] && (
                        <div className="mt-2 grid grid-cols-4 gap-2">
                          {variantImages[variant.id || `new-${index}`].map((image, imgIndex) => (
                            <div key={imgIndex} className="relative w-20 h-20 group">
                              <img
                                src={image instanceof File ? URL.createObjectURL(image) : image}
                                alt={`Variant ${index + 1} Image ${imgIndex + 1}`}
                                className="w-full h-full object-cover rounded-md"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveVariantImage(variant.id || `new-${index}`, imgIndex)}
                                className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                X
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-300 text-sm mb-1">
                      Size Type<span className="text-red-500">*</span>
                    </label>
                    <select
                      value={variant.sizeType}
                      onChange={(e) =>
                        handleVariantChange(index, "sizeType", e.target.value)
                      }
                      className={`bg-gray-700 text-white rounded-lg p-2 ${
                        validationErrors.variants?.[index]?.sizeType
                          ? "border-red-500"
                          : ""
                      }`}
                    >
                      <option value="">Select</option>
                      {sizeTypes.map((type) => (
                        <option key={type?.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                    {validationErrors.variants?.[index]?.sizeType && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors.variants[index].sizeType}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-300 text-sm mb-1">
                      Sizes
                    </label>
                    <input
                      type="text"
                      value={variant.sizes || ''}
                      onChange={(e) =>
                        handleVariantChange(index, "sizes", e.target.value)
                      }
                      className="bg-gray-700 text-white rounded-lg p-2"
                      placeholder="Custom size (optional)"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-300 text-sm mb-1">
                      Stock Quantity<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={variant.stockQuantity || ''}
                      onChange={(e) =>
                        handleVariantChange(index, "stockQuantity", e.target.value)
                      }
                      className={`bg-gray-700 text-white rounded-lg p-2 ${
                        validationErrors.variants?.[index]?.stockQuantity
                          ? "border-red-500"
                          : ""
                      }`}
                      min="0"
                    />
                    {validationErrors.variants?.[index]?.stockQuantity && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors.variants[index].stockQuantity}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-300 text-sm mb-1">
                      SKU Suffix
                    </label>
                    <input
                      type="text"
                      value={variant.skuSuffix || ""}
                      onChange={(e) =>
                        handleVariantChange(index, "skuSuffix", e.target.value)
                      }
                      className="bg-gray-700 text-white rounded-lg p-2"
                      placeholder="SKU suffix"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-300 text-sm mb-1">
                      Regular Price<span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.regularPrice}
                      onChange={(e) =>
                        handleVariantChange(index, "regularPrice", e.target.value)
                      }
                      className={`bg-gray-700 text-white rounded-lg p-2 ${
                        validationErrors.variants?.[index]?.regularPrice
                          ? "border-red-500"
                          : ""
                      }`}
                      placeholder="Enter regular price"
                    />
                    {validationErrors.variants?.[index]?.regularPrice && (
                      <span className="text-red-500 text-xs mt-1">
                        {validationErrors.variants[index].regularPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <label className="text-gray-300 text-sm mb-1">
                      Sale Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={variant.salePrice}
                      onChange={(e) =>
                        handleVariantChange(index, "salePrice", e.target.value)
                      }
                      className="bg-gray-700 text-white rounded-lg p-2"
                      placeholder="Enter sale price (optional)"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Product Location */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Product Location
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col mb-4">
              <label htmlFor="itemLocation" className="text-gray-300 text-sm mb-1">
                Item Location
              </label>
              <input
                type="text"
                id="itemLocation"
                name="itemLocation"
                value={formData.itemLocation}
                onChange={handleChange}
                className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                placeholder="Enter the current location of this item"
              />
            </div>
          </div>

          {/* Notes & Location History */}
          <div className="col-span-1 md:col-span-2 text-white font-semibold mt-4 mb-2">
            Notes & Location History
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="flex flex-col mb-4">
              <label htmlFor="notes" className="text-gray-300 text-sm mb-1">
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
                placeholder="Add notes about this product"
              ></textarea>
            </div>

            {productData?.changeHistory && productData.changeHistory.length > 0 && (
              <div className="mt-4">
                <h4 className="text-gray-300 text-sm font-medium mb-2">Location & Notes History</h4>
                <div className="bg-gray-800 rounded-lg p-4 max-h-40 overflow-y-auto">
                  {productData.changeHistory.map((change, index) => (
                    <div key={index} className="mb-3 last:mb-0 text-sm">
                      <div className="text-gray-400">
                        {new Date(change.changedAt).toLocaleDateString()} {new Date(change.changedAt).toLocaleTimeString()}
                      </div>
                      {change.oldItemLocation !== change.newItemLocation && (
                        <div className="text-gray-300">
                          Location: <span className="line-through text-gray-500">{change.oldItemLocation}</span> → 
                          <span className="text-white">{change.newItemLocation}</span>
                        </div>
                      )}
                      {change.oldNotes !== change.newNotes && (
                        <div className="text-gray-300">
                          Notes: <span className="line-through text-gray-500">{change.oldNotes}</span> → 
                          <span className="text-white">{change.newNotes}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          <div>

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
            {loading ? (
              <button
                type="submit"
                disabled
                className={`bg-gray-600 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg ${
                  loading && "cursor-not-allowed"
                }`}
              >
                Submitting...
              </button>
            ) : (
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg"
              >
                {productData ? "Save Changes" : "Add Product"}
              </button>
            )}
          </div>
                      
          </div>
          </form>
        </div>
      </div>
  );
};

export default AddEditProductModal;
