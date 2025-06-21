import { PlusCircle } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { PRODUCT_STATUSES } from "../../constants";

const AddEditProductModal = ({
  isOpen,
  onClose,
  productData,
  onSave,
  categories,
  brands,
  sizeTypes,
  loading,
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
          status: productData.status || "Active",
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
          status: "Active",
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
    if (
      isNaN(parseFloat(formData.regularPrice)) ||
      parseFloat(formData.regularPrice) <= 0
    ) {
      errors.regularPrice = "Regular Price must be a positive number.";
    }
    if (
      formData.stockQuantity === "" ||
      isNaN(parseInt(formData.stockQuantity)) ||
      parseInt(formData.stockQuantity) < 0
    ) {
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
          dataToSave.append(key, formData[key] ? "true" : "false");
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
      console.log(
        pair[0] + ": " + (pair[1] instanceof File ? pair[1].name : pair[1])
      );
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
                <div
                  key={`existing-${index}`}
                  className="relative w-20 h-20 group"
                >
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
            {loading ? (
              <button
                type="submit"
                disabled
                className={`bg-gray-600 hover:bg-gray-500 text-white font-semibold px-5 py-2 rounded-lg ${
                  loading && "cursor-not-allowed"
                }`}
              >
                Submiting...
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
        </form>
      </div>
    </div>
  );
};

export default AddEditProductModal;
