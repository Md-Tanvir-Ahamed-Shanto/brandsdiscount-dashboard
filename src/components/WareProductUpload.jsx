import { useState } from "react";
import { apiClient } from "../config/api/api";

const ProductsPage = () => {
  const [formData, setFormData] = useState({
    title: "", // Product Name
    sku: "",
    stockQuantity: "", // Total Quantity
    itemLocation: "",
    description: "",
  });
  const [imageFiles, setImageFiles] = useState([]); // This will hold new File objects
  const [validationErrors, setValidationErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useState(null); // Ref for file input if needed for manual click

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setValidationErrors((prev) => ({ ...prev, [name]: "" })); // Clear error on change
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setImageFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveNewImage = (index) => {
    setImageFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = "Product Name is required.";
    if (!formData.sku.trim()) errors.sku = "SKU is required.";
    if (
      formData.stockQuantity === "" ||
      isNaN(parseInt(formData.stockQuantity)) ||
      parseInt(formData.stockQuantity) < 0
    ) {
      errors.stockQuantity = "Total Quantity must be a non-negative number.";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      console.error("Validation failed", validationErrors);
      return;
    }

    setLoading(true);
    setError(null); // Clear previous errors

    const dataToSave = new FormData();

    // Append mandatory fields
    dataToSave.append("title", formData.title);
    dataToSave.append("sku", formData.sku);
    dataToSave.append("stockQuantity", formData.stockQuantity);

    // Append optional fields if they have values
    if (formData.itemLocation.trim()) {
      dataToSave.append("itemLocation", formData.itemLocation);
    }
    if (formData.description.trim()) {
      dataToSave.append("description", formData.description);
    }

    // Append new image files
    imageFiles.forEach((file) => {
      dataToSave.append("images", file);
    });

    try {
      const url = `api/products`; // Make sure this URL is correct for your backend API
      const response = await apiClient.post(url, dataToSave);

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to add product");
      }

      console.log("Product added successfully:", response.data);
      // Reset form after successful submission
      setFormData({
        title: "",
        sku: "",
        stockQuantity: "",
        itemLocation: "",
        description: "",
      });
      setImageFiles([]); // Clear image files
      setValidationErrors({}); // Clear validation errors
      // You might want to re-fetch your product list here if you have one
      // await fetchProducts();
    } catch (err) {
      console.error("Error adding product:", err);
      setError(`Failed to add product: try again`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-800 min-h-screen text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Add New Product</h1>

      <div className="bg-gray-900 rounded-xl shadow-lg w-full max-w-7xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          {/* Mandatory Fields */}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-gray-300 text-sm mb-1">
              Product Name <span className="text-red-500">*</span>
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
            <label htmlFor="stockQuantity" className="text-gray-300 text-sm mb-1">
              Total Quantity <span className="text-red-500">*</span>
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

          {/* Optional Fields */}
          <div className="flex flex-col">
            <label htmlFor="itemLocation" className="text-gray-300 text-sm mb-1">
              Item Location (Optional)
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

          {/* Description */}
          <div className="flex flex-col">
            <label htmlFor="description" className="text-gray-300 text-sm mb-1">
              Description (Optional)
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 w-full"
            ></textarea>
          </div>

          {/* Images */}
          <div className="flex flex-col gap-2">
            <label className="text-gray-300 text-sm mb-1">Images (Optional)</label>
            <div>
              <input
                type="file"
                multiple
                ref={fileInputRef}
                onChange={handleImageChange}
                className="hidden" // Keep hidden as we'll use a button to trigger it
                accept="image/*"
              />
              <button
                type="button" // Important: type="button" to prevent form submission
                onClick={() => fileInputRef.current.click()}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                Choose Images
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
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

          {/* Error Message */}
          {error && <div className="text-red-500 text-sm col-span-full">{error}</div>}

          <div className="flex justify-end gap-3 mt-6">
            {loading ? (
              <button
                type="submit"
                disabled
                className={`bg-gray-600 text-white font-semibold px-5 py-2 rounded-lg cursor-not-allowed`}
              >
                Adding Product...
              </button>
            ) : (
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2 rounded-lg"
              >
                Add Product
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductsPage;