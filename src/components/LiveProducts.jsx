import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  RefreshCw,
  Package,
  ChevronLeft,
  ChevronRight,
  EyeIcon,
} from "lucide-react";
import { ImageWithFallback } from "./common";
import { apiClient, BASE_URL } from "../config/api/api";
import { Link } from "react-router-dom";

const LiveProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortPrice, setSortPrice] = useState("");
  const [filtering, setFiltering] = useState("");
  const [sizeType, setSizeType] = useState("");
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [pageSize, setPageSize] = useState(30);
  const [totalPages, setTotalPages] = useState(1);
  const ShopUrl = "https://brandsdiscounts.com";
  const BASE_API_URL = `${BASE_URL}/api`;

  // Flatten categories for dropdown
  const ALL_CATEGORIES_FLAT =
    categories.flatMap(
      (parentCategory) =>
        parentCategory.subcategories?.flatMap(
          (subCategory) =>
            subCategory.subcategories?.map((typeCategory) => ({
              id: typeCategory.id,
              name: `${parentCategory.name} > ${subCategory.name} > ${typeCategory.name}`,
              parentCategoryId: parentCategory.id,
              subCategoryId: subCategory.id,
              categoryId: typeCategory.id,
            })) || []
        ) || []
    ) || [];

  const fetchCategories = async () => {
    try {
      const response = await apiClient.get(`${BASE_API_URL}/categories`);
      if (response.status === 200) {
        setCategories(response?.data?.data || []);
      }
    } catch (error) {
      console.log("fetch categories error", error);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        page: currentPage.toString(),
        pageSize: pageSize.toString(),
        sortPrice: sortPrice,
        filtering: filtering,
        sizeType: sizeType,
      });

      // Add search term if provided
      if (searchTerm.trim()) {
        params.append("searchTerm", searchTerm.trim());
      }

      // Add category filter if selected
      if (categoryFilter) {
        params.append("category", categoryFilter);
      }

      const response = await fetch(
        `https://dashboard.brandsdiscounts.com/api/products/all?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle API response with pagination data
      if (data.products && Array.isArray(data.products)) {
        setProducts(data.products);
        setTotalProducts(data.totalItems || 0);
        setTotalPages(
          data.totalPages || Math.ceil((data.totalItems || 0) / pageSize)
        );
        // If API returns currentPage, sync it with our state
        if (data.currentPage && data.currentPage !== currentPage) {
          setCurrentPage(data.currentPage);
        }
      } else if (data.data && Array.isArray(data.data)) {
        setProducts(data.data);
        setTotalProducts(data.totalItems || data.total || 0);
        setTotalPages(
          data.totalPages ||
            Math.ceil((data.totalItems || data.total || 0) / pageSize)
        );
      } else if (Array.isArray(data)) {
        // Fallback for array response
        setProducts(data);
        setTotalProducts(data.length);
        setTotalPages(Math.ceil(data.length / pageSize));
      } else {
        console.warn("Unexpected API response structure:", data);
        setProducts([]);
        setTotalProducts(0);
        setTotalPages(1);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to fetch products. Please try again.");
      setProducts([]);
      setTotalProducts(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, sortPrice, filtering, sizeType, categoryFilter]);

  // Debounced search effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1); // Reset to first page when searching
      fetchProducts();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Products are now filtered server-side, so we use them directly
  const filteredProducts = products;

  const handleRefresh = () => {
    fetchProducts();
  };

  const formatPrice = (price) => {
    return price ? `$${parseFloat(price).toFixed(2)}` : "N/A";
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-800";
      case "publish":
        return "bg-blue-100 text-blue-800";
      case "draft":
        return "bg-yellow-100 text-yellow-800";
      case "hidden":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Custom Pagination Component
  const CustomPagination = () => {
    // Always generate at least one page
    const effectiveTotalPages = Math.max(1, totalPages);

    // Handle page size change
    const handlePageSizeChange = (newSize) => {
      const newPageSize = parseInt(newSize);
      // Update page size state
      setPageSize(newPageSize);
      // Reset to first page
      setCurrentPage(1);
    };

    const getPageNumbers = () => {
      const pages = [];
      const maxVisiblePages = 5;

      if (effectiveTotalPages <= maxVisiblePages) {
        for (let i = 1; i <= effectiveTotalPages; i++) {
          pages.push(i);
        }
      } else {
        if (currentPage <= 3) {
          for (let i = 1; i <= 4; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(effectiveTotalPages);
        } else if (currentPage >= effectiveTotalPages - 2) {
          pages.push(1);
          pages.push("...");
          for (let i = effectiveTotalPages - 3; i <= effectiveTotalPages; i++) {
            pages.push(i);
          }
        } else {
          pages.push(1);
          pages.push("...");
          for (let i = currentPage - 1; i <= currentPage + 1; i++) {
            pages.push(i);
          }
          pages.push("...");
          pages.push(effectiveTotalPages);
        }
      }
      return pages;
    };

    const handlePageChange = (page) => {
      if (page >= 1 && page <= effectiveTotalPages && page !== currentPage) {
        setCurrentPage(page);
      }
    };

    const startItem = totalProducts > 0 ? (currentPage - 1) * pageSize + 1 : 0;
    const endItem = Math.min(currentPage * pageSize, totalProducts);

    return (
      <div className="mt-6 bg-gray-800 p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          {/* Results info */}
          <div className="text-center sm:text-left">
            {totalProducts > 0 ? (
              <>
                Showing{" "}
                <span className="font-medium text-white">{startItem}</span> to{" "}
                <span className="font-medium text-white">{endItem}</span> of{" "}
                <span className="font-medium text-white">{totalProducts}</span>{" "}
                products
              </>
            ) : (
              <span className="text-white">No products found</span>
            )}
          </div>

          {/* Page size selector */}
          <div className="flex items-center mb-4 sm:mb-0">
            <label htmlFor="pageSize" className="mr-2 text-gray-400">
              Show:
            </label>
            <select
              id="pageSize"
              value={pageSize}
              onChange={(e) => handlePageSizeChange(e.target.value)}
              className="bg-gray-700 text-white rounded-md p-1.5 focus:ring-indigo-500 focus:border-indigo-500 text-xs"
            >
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-center mt-4 flex-wrap gap-2">
          {/* Previous button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
              currentPage === 1
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:text-white hover:bg-gray-700"
            }`}
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </button>

          {/* Page numbers */}
          <div className="flex items-center flex-wrap justify-center">
            {getPageNumbers().map((page, index) => (
              <React.Fragment key={index}>
                {page === "..." ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <button
                    onClick={() => handlePageChange(page)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-indigo-600 text-white"
                        : "text-gray-300 hover:text-white hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === effectiveTotalPages}
            className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition-colors ${
              currentPage === effectiveTotalPages
                ? "text-gray-500 cursor-not-allowed"
                : "text-gray-300 hover:text-white hover:bg-gray-700"
            }`}
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        <div className="flex items-center justify-center h-64">
          <RefreshCw className="animate-spin mr-2" size={24} />
          <span>Loading live products...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-white">
        <div className="bg-red-900/50 border border-red-500 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-red-400 mb-2">
            Error Loading Products
          </h3>
          <p className="text-red-300">{error}</p>
          <button
            onClick={handleRefresh}
            className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 text-white">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center mb-4 lg:mb-0">
          <Package className="mr-3 text-indigo-400" size={28} />
          <div>
            <h1 className="text-2xl font-bold">Live Products</h1>
            <p className="text-gray-400">
              Real-time product inventory from API
            </p>
          </div>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          <RefreshCw size={16} className="mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {ALL_CATEGORIES_FLAT.map((cat) => (
              <option key={cat.id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Sort Price */}
          <select
            value={sortPrice}
            onChange={(e) => setSortPrice(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">Sort by Price</option>
            <option value="lowToHigh">Price: Low to High</option>
            <option value="highToLow">Price: High to Low</option>
          </select>

          {/* Size Type */}
          <select
            value={sizeType}
            onChange={(e) => setSizeType(e.target.value)}
            className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Sizes</option>
            <option value="XS (0-2)">XS (0-2)</option>
            <option value="S (4-6)">S (4-6)</option>
            <option value="M (8-10)">M (8-10)</option>
            <option value="L (12-14)">L (12-14)</option>
            <option value="XL (16-18)">XL (16-18)</option>
            <option value="XXL+ (20+)">XXL+ (20+)</option>
          </select>

          {/* Results Count */}
          <div className="flex items-center text-gray-400">
            <span>
              {totalProducts > 0
                ? `Showing ${(currentPage - 1) * pageSize + 1}-${Math.min(
                    currentPage * pageSize,
                    totalProducts
                  )} of ${totalProducts}`
                : "0 products"}
            </span>
          </div>
        </div>
      </div>

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
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-700 hover:bg-gray-700/50 bg-gray-800"
                >
                  <td className="px-4 py-3 font-medium text-white whitespace-nowrap flex items-center">
                    <ImageWithFallback
                      src={product?.imageUrl || product?.images?.[0]}
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
                        {product.title || product.name}
                      </span>
                      <span className="text-xs text-gray-500">
                        {product.brandName}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{product.sku}</td>
                  <td className="px-4 py-3">{product.itemLocation || "N/A"}</td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="text-white font-medium">
                        {formatPrice(product.regularPrice || product.salePrice)}
                      </div>
                      {product.salePrice &&
                        product.regularPrice &&
                        product.salePrice !== product.regularPrice && (
                          <div className="text-green-400 text-sm">
                            Sale: {formatPrice(product.salePrice)}
                          </div>
                        )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span
                      className={`font-medium ${
                        product.stockQuantity > 0
                          ? "text-green-400"
                          : "text-red-400"
                      }`}
                    >
                      {product.stockQuantity || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      target="_blank"
                      to={`${ShopUrl}/shop/product/${product.title}?id=${product.id}`}
                    >
                      <EyeIcon />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Custom Pagination */}
      <CustomPagination />

      {filteredProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-gray-500 mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            No Products Found
          </h3>
          <p className="text-gray-500">
            Try adjusting your search or filter criteria.
          </p>
        </div>
      )}
    </div>
  );
};

export default LiveProducts;
