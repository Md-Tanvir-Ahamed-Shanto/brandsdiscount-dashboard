import { useState, useRef, useEffect, useCallback } from "react";
import { Plus, Minus, ShoppingCart, CircleMinus, XCircle } from "lucide-react";
import { BASE_URL } from "../config/api/api";
import { toast } from "react-toastify";
import { ImageWithFallback } from "./common";

const BASE_API_URL = `${BASE_URL}/api`;

const useBulkUpdateMutation = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateBulk = async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${BASE_API_URL}/products/update-quantities`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message ||
            `Failed to update products: ${response.statusText}`
        );
      }
      const responseData = await response.json();
      setIsLoading(false);
      return responseData;
    } catch (error) {
      setIsLoading(false);
      setError(error);
      console.error("Bulk update API error:", error);
      toast.error(`Bulk update failed: ${error.message}`);
      throw error;
    }
  };

  return [updateBulk, { isLoading, error }];
};

// --- Custom Hook for Product Search ---
const useProductSearch = (searchTerm, debounceDelay = 500) => {
  const [searchResults, setSearchResults] = useState([]);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [errorSearch, setErrorSearch] = useState(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!searchTerm.trim()) {
        setSearchResults([]);
        return;
      }

      setLoadingSearch(true);
      setErrorSearch(null);
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("searchTerm", searchTerm.trim());
        queryParams.append("page", "1");
        queryParams.append("pageSize", "10");

        const response = await fetch(
          `${BASE_API_URL}/products?${queryParams.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setSearchResults(data.products || []);
      } catch (error) {
        console.error("Error searching products:", error);
        setErrorSearch(error);
        setSearchResults([]);
      } finally {
        setLoadingSearch(false);
      }
    }, debounceDelay);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, debounceDelay]);

  return { searchResults, loadingSearch, errorSearch };
};

const BarCodeProductList = ({ scannedSkusFromScanner = [] }) => {
  const [productsInList, setProductsInList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [manualSkuInput, setManualSkuInput] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const { searchResults, loadingSearch, errorSearch } =
    useProductSearch(searchTerm);

  const audioRef = useRef(null);
  const playCheckSound = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0; // Reset to start
      audioRef.current.play().catch((error) => {
        console.error("Error playing sound:", error);
      });
    }
  }, []);

  const [updateBulk, { isLoading: isBulkUpdating, error: bulkUpdateError }] =
    useBulkUpdateMutation();

  // --- Centralized Function to Add/Update Product in List ---
  // This function is crucial for preventing duplicate keys and handling quantity updates.
  // It's called by both barcode scanner input and manual input.
  const addOrUpdateProductInList = useCallback(
    async (sku, initialQuantity = 1) => {
      const trimmedSku = sku.trim(); // Always trim SKU to prevent issues
      if (!trimmedSku) {
        toast.error("SKU cannot be empty.");
        return;
      }

      // 1. Check if product already exists in the list (by SKU)
      const existingProduct = productsInList.find((p) => p.sku === trimmedSku);

      if (existingProduct) {
        setQuantities((prev) => ({
          ...prev,
          [trimmedSku]: (prev[trimmedSku] || 0) + initialQuantity,
        }));
        toast.info(
          `Quantity for ${trimmedSku} updated to ${
            (quantities[trimmedSku] || 0) + initialQuantity
          }.`
        );
        playCheckSound();
        return;
      }

      // 2. If not in list, fetch product details
      let productDetails;
      try {
        const queryParams = new URLSearchParams();
        queryParams.append("searchTerm", trimmedSku);
        queryParams.append("page", "1"); // Fetch only one product
        queryParams.append("pageSize", "1");

        const response = await fetch(
          `${BASE_API_URL}/products?${queryParams.toString()}`
        );
        if (!response.ok) {
          if (response.status === 404) {
            toast.error(`Product "${trimmedSku}" not found in database.`);
            return;
          }
          throw new Error(
            `Failed to fetch product details: ${response.statusText}`
          );
        }
        const data = await response.json();
        if (data.products && data.products.length > 0) {
          productDetails = data.products[0];
        } else {
          toast.error(`Product "${trimmedSku}" not found.`); // Fallback if API returns empty array but ok status
          return;
        }
      } catch (error) {
        console.error(`Error adding product ${trimmedSku}:`, error);
        toast.error(`Could not add product "${trimmedSku}": ${error.message}`);
        return;
      }

      // 3. Add new product to the list and set its initial quantity
      setProductsInList((prev) => [...prev, productDetails]);
      setQuantities((prev) => ({ ...prev, [trimmedSku]: initialQuantity }));
      playCheckSound();
    },
    [productsInList, quantities, playCheckSound]
  ); // Dependencies for useCallback

  useEffect(() => {
    if (scannedSkusFromScanner.length === 0) return;

    const latestScannedSku =
      scannedSkusFromScanner[scannedSkusFromScanner.length - 1];

    addOrUpdateProductInList(latestScannedSku);
  }, [scannedSkusFromScanner, addOrUpdateProductInList]);

  // Quantity controls for existing items
  const increaseQuantity = useCallback((sku) => {
    setQuantities((prev) => ({
      ...prev,
      [sku]: (prev[sku] || 1) + 1,
    }));
  }, []);

  const decreaseQuantity = useCallback((sku) => {
    setQuantities((prev) => ({
      ...prev,
      [sku]: Math.max(1, (prev[sku] || 1) - 1), // Ensure quantity doesn't go below 1
    }));
  }, []);

  // Remove product from the list
  const handleDelete = useCallback((sku) => {
    setProductsInList((prev) => prev.filter((p) => p.sku !== sku));
    setQuantities((prev) => {
      const newQuantities = { ...prev };
      delete newQuantities[sku]; // Also remove from quantities state
      return newQuantities;
    });
  }, []);

  // Handle direct manual SKU input via dedicated field
  const handleAddManualSkuDirectly = useCallback(() => {
    const skuToAdd = manualSkuInput.trim();
    if (skuToAdd) {
      addOrUpdateProductInList(skuToAdd); // Use the unified function
      setManualSkuInput(""); // Clear input field after adding
    } else {
      toast.error("Please enter a valid SKU.");
    }
  }, [manualSkuInput, addOrUpdateProductInList]);

  // Allow Enter key to trigger manual SKU addition in its dedicated input field
  const handleManualSkuInputKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault(); // Prevent default form submission behavior
        handleAddManualSkuDirectly();
      }
    },
    [handleAddManualSkuDirectly]
  );

  // Handle confirming all products (bulk update API call)
  const confirmAllProducts = async () => {
    if (productsInList.length === 0) {
      toast.error("No products to confirm.");
      return;
    }

    const productsDataForAPI = productsInList.map((product) => ({
      sku: product.sku,
      quantity: quantities[product.sku] || 1, // Use quantity from state, default to 1
    }));

    console.log("Confirming products for bulk update:", {
      data: productsDataForAPI,
    });

    try {
      const response = await updateBulk({
        data: productsDataForAPI,
      });

      if (response?.success) {
        toast.success(
          `${productsDataForAPI.length} product(s) checked out successfully!`
        );
      } else if (!response?.success && response.results?.length > 0) {
        const successfulUpdates = response.results.filter(
          (r) => r.status === "success"
        ).length;
        const failedUpdates = response.results.filter(
          (r) => r.status === "failed"
        ).length;

        if (successfulUpdates > 0 && failedUpdates === 0) {
          toast.success(
            `${successfulUpdates} product(s) updated successfully!`
          );
        } else if (successfulUpdates > 0 && failedUpdates > 0) {
          toast.warn(
            `${successfulUpdates} products updated, but ${failedUpdates} failed. Check console for details.`
          );
          response.results
            .filter((r) => r.status === "failed")
            .forEach((f) => {
              console.error(`Failed to update ${f.sku}: ${f.message}`);
            });
        } else {
          toast.error(`All ${failedUpdates} product updates failed.`);
        }
      } else if (!response?.success) {
        toast.error(
          response.message || "Bulk update failed with an unknown error."
        );
      }

      playCheckSound();
      // Clear the list after successful confirmation
      setProductsInList([]);
      setQuantities({});
      setSearchTerm("");
      setManualSkuInput("");
    } catch (err) {
      console.error("Error during confirmAllProducts:", err);
    }
  };

  const isLoadingOverall = isBulkUpdating || loadingSearch;

  if (isLoadingOverall) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 transition-opacity duration-300">
        <div className="bg-gray-900 bg-opacity-90 p-8 rounded-lg shadow-2xl flex flex-col items-center gap-4 border border-gray-700">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500 border-opacity-75"></div>
          <div className="text-white text-xl font-semibold tracking-wide">
            {isBulkUpdating && "Processing Checkout..."}
            {loadingSearch && "Searching for Products..."}
            {!isBulkUpdating && !loadingSearch && "Loading..."}
          </div>
          <p className="text-gray-400 text-sm mt-2">
            Please wait while we fetch your data.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 bg-gray-800 rounded-lg shadow-lg">
      <audio ref={audioRef} src="/sound/check.mp3" preload="auto" />

      <div className="mb-4 flex justify-between items-center border-b pb-4 border-gray-700">
        <h1 className="text-2xl text-white font-bold">Product Order List</h1>
        <button
          onClick={confirmAllProducts}
          disabled={productsInList.length === 0 || isLoadingOverall}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
        >
          <ShoppingCart className="mr-2 h-4 w-4" />
          Confirm All Products ({productsInList.length})
        </button>
      </div>

      {bulkUpdateError && (
        <p className="text-red-400 text-sm mb-4">
          Bulk update error: {bulkUpdateError.message}
        </p>
      )}

      {/* Manual SKU Direct Add Input Section */}
      <div className="mb-6 bg-gray-700 p-4 rounded-md shadow-inner">
        <h2 className="text-xl font-semibold text-white mb-3">
          Direct SKU Input (e.g., manual type or hardware scanner without active
          field)
        </h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Enter SKU and press Enter or 'Add Direct'"
            value={manualSkuInput}
            onChange={(e) => setManualSkuInput(e.target.value)}
            onKeyDown={handleManualSkuInputKeyDown}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 bg-gray-800 text-white placeholder-gray-400"
          />
          <button
            onClick={handleAddManualSkuDirectly}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Direct
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Use this for manual entry or if your barcode scanner is configured to
          directly type into an active input field.
        </p>
      </div>

      {/* Product Search Section */}
      <div className="bg-gray-700 p-4 rounded-md mb-6 shadow-inner">
        <h2 className="text-xl font-semibold text-white mb-3">
          Search & Add Product from Database
        </h2>
        <div className="flex items-center gap-2 mb-3">
          <input
            type="text"
            placeholder="Search by SKU or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 bg-gray-800 text-white placeholder-gray-400"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="p-2 text-gray-400 hover:text-gray-200 transition-colors"
              title="Clear search"
            >
              <XCircle className="h-5 w-5" />
            </button>
          )}
        </div>

        {errorSearch && (
          <p className="text-red-400 text-sm mb-2">
            Error searching: {errorSearch.message}
          </p>
        )}

        {searchTerm.trim() &&
          !loadingSearch &&
          searchResults.length === 0 &&
          !errorSearch && (
            <p className="text-gray-400 text-sm mb-2">
              No products found for "{searchTerm}".
            </p>
          )}

        {!loadingSearch && searchResults.length > 0 && (
          <div className="max-h-60 overflow-y-auto border border-gray-600 rounded-md p-2 bg-gray-800 scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-700">
            <p className="text-gray-300 mb-2 text-sm">Select to add to list:</p>
            {searchResults.map((product) => (
              <div
                key={product.sku}
                className="flex justify-between items-center p-3 my-1 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors cursor-pointer border border-gray-600"
                onClick={() => {
                  addOrUpdateProductInList(product.sku); // Use unified function
                  setSearchTerm(""); // Clear search results after adding
                }}
              >
                <ImageWithFallback
                  src={product?.imageUrl}
                  fallbackSrc={`https://placehold.co/40x40/777/FFF?text=${
                    product.title ? product.title.substring(0, 1) : "P"
                  }`}
                  alt={product.title}
                  className="w-10 h-10 rounded-md object-cover mr-3"
                />
                <div className="flex-grow">
                  <p className="font-medium text-white">{product.title}</p>
                  <p className="text-sm text-gray-300">
                    SKU: {product.sku} | Price: ${product.salePrice?.toFixed(2)}
                  </p>
                </div>
                <button
                  className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                  title="Add to list"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Main Product List Table */}
      {productsInList.length === 0 ? (
        <div className="text-center p-8 border border-gray-600 rounded-md bg-gray-700 text-gray-300">
          <p className="text-lg">No products in the list.</p>
          <p className="text-sm mt-2">
            Scan a barcode, directly add an SKU, or search for products above.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-gray-700 rounded-md shadow-md">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-600">
                <th className="border border-gray-500 px-4 py-2 text-left text-white text-sm">
                  SKU
                </th>
                <th className="border border-gray-500 px-4 py-2 text-left text-white text-sm">
                  Product Name
                </th>
                <th className="border border-gray-500 px-4 py-2 text-left text-white text-sm">
                  Location
                </th>
                <th className="border border-gray-500 px-4 py-2 text-left text-white text-sm">
                  Brand
                </th>
                <th className="border border-gray-500 px-4 py-2 text-left text-white text-sm">
                  Price
                </th>
                <th className="border border-gray-500 px-4 py-2 text-left text-white text-sm">
                  Stock
                </th>
                <th className="border border-gray-500 px-4 py-2 text-center text-white text-sm">
                  Quantity
                </th>
                <th className="border border-gray-500 px-4 py-2 text-center text-white text-sm">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {productsInList.map((product) => (
                <tr
                  key={product?.sku}
                  className="bg-gray-800 hover:bg-gray-700 transition-colors"
                >
                  <td className="border border-gray-700 px-4 py-2 font-medium text-white text-sm">
                    {product?.sku}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-gray-200 text-sm">
                    {product?.title}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-gray-200 text-sm">
                    {product?.itemLocation}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-gray-200 text-sm">
                    {product?.brandName}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-green-400 font-bold text-sm">
                    ${product?.salePrice?.toFixed(2)}
                  </td>
                  <td className="border border-gray-700 px-4 py-2 text-gray-200 text-sm">
                    {product?.stockQuantity}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => decreaseQuantity(product?.sku)}
                        disabled={(quantities[product?.sku] || 1) <= 1}
                        className="flex items-center justify-center w-8 h-8 border border-gray-600 rounded hover:bg-gray-600 disabled:bg-gray-900 disabled:border-gray-800 disabled:cursor-not-allowed transition-colors text-gray-300 hover:text-white"
                        title="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center font-medium text-white text-sm">
                        {quantities[product?.sku] || 1}
                      </span>
                      <button
                        onClick={() => increaseQuantity(product?.sku)}
                        className="flex items-center justify-center w-8 h-8 border border-gray-600 rounded hover:bg-gray-600 transition-colors text-gray-300 hover:text-white"
                        title="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    <div className="flex items-center justify-center">
                      <button
                        className="p-1 hover:bg-red-800 rounded transition-colors text-gray-300 hover:text-white"
                        onClick={() => handleDelete(product?.sku)}
                        title="Remove product"
                      >
                        <CircleMinus className="h-5 w-5 text-red-500 hover:text-red-400 transition-colors" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default BarCodeProductList;
