import React, { useState, useEffect, useCallback } from "react";
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
import { ImageWithFallback, Pagination } from "./common";
import AddEditProductModal from "./models/AddEditProductModal";
import { getListedPlatformNames, getStatusColor } from "../utils/helpers";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";
import { PERMISSIONS, PRODUCT_STATUSES } from "../constants";

const BASE_API_URL = `${BASE_URL}/api`; // Ensure this matches your backend URL

// Main Product Management Page Component
// Main Product Management Page Component
const ProductManagementPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
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
  const [categories, setCategories] = useState([]);
  const [sizes, setSizes] = useState([]);
  const { user: currentUser } = useAuth();
  // Determine permissions based on the provided PERMISSIONS constant
  const canAddProducts = PERMISSIONS[currentUser.role]?.includes("products");
  const canEditProducts =
    PERMISSIONS[currentUser.role]?.includes("products");

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

  const ALL_CATEGORIES_FLAT = categories.flatMap((parentCategory) =>
    parentCategory.subcategories.flatMap((subCategory) =>
      subCategory.subcategories.map((typeCategory) => ({
        id: typeCategory.id, // Unique ID for React key
        // Full category path for display: Parent > Subcategory > Type
        name: `${parentCategory.name} > ${subCategory.name} > ${typeCategory.name}`,
        parentCategoryId: parentCategory.id, // ID of the top-level parent
        subCategoryId: subCategory.id, // ID of the direct subcategory (middle level)
        categoryId: typeCategory.id, // This maps to the actual 'type' category ID
      }))
    )
  );

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get(`${BASE_API_URL}/categories`);
      if (response.status === 200) {
        setCategories(response?.data?.data);
      }
    } catch (error) {
      console.log("fetch error", error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/sizeroute/all-sizes`);
      setSizes(response.data);
    } catch (error) {
      console.log("fetch error", error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchSizes();
  }, []);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filteredAndSortedProducts = products;

  const paginatedProducts = products;

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
        const response = await apiClient.patch(
          `${BASE_API_URL}/products/${productId}/toggle-offer`
        ); // AWAIT HERE
        if (response.status === 200) {
          await fetchProducts(); // Re-fetch products to reflect changes
        } else {
          alert("Failed to toggle offer. Please try again.");
        }
      } else if (actionType === "deleteProduct") {
        const response = await apiClient.delete(
          `${BASE_API_URL}/products/${productId}`
        ); // AWAIT HERE
        if (response.status === 200) {
          await fetchProducts(); // Re-fetch products to reflect changes
        } else {
          alert("Failed to delete product. Please try again.");
        }
      } else if (PRODUCT_STATUSES.includes(actionType)) {
        // Assume actionType is the new status
        const response = await apiClient.patch(
          `${BASE_API_URL}/products/${productId}/status`,
          { status: actionType }
        ); // AWAIT HERE
        if (response.status === 200) {
          await fetchProducts(); // Re-fetch products to reflect changes
        } else {
          alert("Failed to update status. Please try again.");
        }
      } else if (actionType === "updateInventoryBulk") {
        // Assume actionType is the new status
        const response = await apiClient.post(
          `${BASE_API_URL}/products/bulk-actions`,
          { status: actionType }
        ); // AWAIT HERE
        if (response.status === 200) {
          await fetchProducts(); // Re-fetch products to reflect changes
        } else {
          alert("Failed to update status. Please try again.");
        }
      }
    } catch (err) {
      setError(`Failed to perform bulk action: ${actionType}.`);
      setError(`Failed to perform action: ${actionType}.`);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkAction = async (actionType, value = null) => {
    if (selectedProducts.size === 0) {
      alert("Please select at least one product for bulk action.");
      return;
    }
    setLoading(true);
    try {
      const productIdsArray = Array.from(selectedProducts);
      let payload = { productIds: productIdsArray, action: actionType };

      if (actionType === "updateInventoryBulk") {
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

      const response = await apiClient.post(
        `${BASE_API_URL}/products/bulk-actions`,
        payload
      ); // AWAIT HERE
      console.log("response", response);
      if (response.status === 200) {
        await fetchProducts(); // Re-fetch products to reflect changes
        setSelectedProducts(new Set()); // Clear selection after bulk action
      } else {
        alert("Failed to perform bulk action. Please try again.");
      }
      setSelectedProducts(new Set()); // Clear selection after bulk action
      setCurrentEditingProductId(null);
    } catch (err) {
      console.error(`Error performing bulk action ${actionType}:`, err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (productId) => {
    setCurrentEditingProductId(productId);
    setIsAddEditModalOpen(true);
  };

  const handleDeleteClick = async (productId) => {
    setLoading(true);
    try {
      const response = await apiClient.delete(
        `${BASE_API_URL}/products/${productId}`
      );
      if (response.data.status === 200) {
        await fetchProducts(); // Re-fetch products to reflect changes
        setSelectedProducts(new Set()); // Clear selection after bulk action
      } else {
        alert("Failed to delete product. Please try again.");
      }
      setCurrentEditingProductId(null);
    } catch (err) {
      console.error(`Error deleting product ${productId}:`, err);
    } finally {
      setLoading(false);
    }
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
      setIsLoading(true);
      const url = currentEditingProductId
        ? `${BASE_API_URL}/products/${currentEditingProductId}`
        : `${BASE_API_URL}/products`;
      // const data = JSON.stringify(productFormData);
      if (currentEditingProductId) {
        const response = await apiClient.put(url, productFormData);
        if (!response.data.success === true) {
          const errorData = response.data.message;
          setIsLoading(false);
          alert(`Error updating product: ${errorData.message}`);
          throw new Error(
            errorData.message ||
              `Failed to ${currentEditingProductId ? "update" : "add"} product`
          );
        }
        setIsLoading(false);
      } else {
        const response = await apiClient.post(url, productFormData);
        if (!response.data.success === true) {
          alert(`Error adding product: ${response.data.message}`);
          const errorData = response.data.message;
          setIsLoading(false);
          throw new Error(
            errorData.message ||
              `Failed to ${currentEditingProductId ? "update" : "add"} product`
          );
        }
        setIsLoading(false);
      }
      setIsLoading(false);
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
                          product.title ? product.title.substring(0, 1) : "P"
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
                            product.quantity === 0 &&
                            product.status === "Active"
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
        loading={isLoading}
        categories={ALL_CATEGORIES_FLAT}
        sizeTypes={sizes}
      />
    </div>
  );
};

export default ProductManagementPage;
