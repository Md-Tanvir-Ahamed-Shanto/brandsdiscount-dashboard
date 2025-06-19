import React, { useState, useMemo } from 'react';
import { Search, PlusCircle, Filter, Edit3, DollarSign, Edit, EyeOff, Archive, Check } from 'lucide-react';
import { ImageWithFallback, Pagination } from './common';
import { PRODUCT_STATUSES, PERMISSIONS, ALL_POSSIBLE_PUBLISHING_PLATFORMS } from '../constants';
import { getStatusColor } from '../utils/helpers';

const ProductsList = ({ 
  products: initialProducts, 
  categoriesStructure, 
  setActiveView, 
  setCurrentEditingProductId, 
  onUpdateProducts, 
  currentUser 
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ category: '', brand: '', status: '', itemLocationFilter: '' });
  const [selectedProducts, setSelectedProducts] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [editingQuantity, setEditingQuantity] = useState({});

  const userPermissions = PERMISSIONS[currentUser.role] || [];
  const canEditProducts = userPermissions.includes('editProduct');
  const canAddProducts = userPermissions.includes('addProduct');

  const uniqueBrands = useMemo(
    () => [...new Set(initialProducts.map(p => p.brand))],
    [initialProducts]
  );

  const filteredAndSortedProducts = useMemo(() => {
    return initialProducts
      .filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (product.sku && product.sku.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesCategory = filters.category ? 
          `${product.category.parent} > ${product.category.sub} > ${product.category.type}` === filters.category : true;
        const matchesBrand = filters.brand ? product.brand === filters.brand : true;
        const matchesStatus = filters.status ? product.status === filters.status : true;
        const matchesItemLocation = filters.itemLocationFilter ? 
          (product.itemLocation || '').toLowerCase().includes(filters.itemLocationFilter.toLowerCase()) : true;
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
    if (newQuantity !== '' && !isNaN(newQuantity) && newQuantity >= 0) {
      const updatedProducts = initialProducts.map(p => {
        if (p.id === productId) {
          return { ...p, quantity: parseInt(newQuantity, 10) };
        }
        return p;
      });
      onUpdateProducts(updatedProducts);
    } else if (newQuantity < 0) {
      console.warn("Quantity cannot be negative.");
    }
    setEditingQuantity(prev => { const copy = { ...prev }; delete copy[productId]; return copy; });
  };

  const handleEditClick = (productId) => {
    if (!canEditProducts && !(currentUser.role === 'WarehouseUploader' && initialProducts.find(p => p.id === productId)?.status === 'Draft')) {
      return;
    }
    setCurrentEditingProductId(productId);
    setActiveView('editProduct');
  };

  const handleQuickAction = (productId, action) => {
    if (!canEditProducts && currentUser.role === 'WarehouseUploader') return;
    let updatedProducts = [...initialProducts];
    if (action === 'toggleOffer') {
      updatedProducts = initialProducts.map(p => 
        p.id === productId ? 
          { ...p, hasTenDollarOffer: !p.hasTenDollarOffer, offerPrice: !p.hasTenDollarOffer ? 10.00 : null } : 
          p
      );
    } else if (PRODUCT_STATUSES.includes(action)) {
      updatedProducts = initialProducts.map(p => 
        p.id === productId ? { ...p, status: action } : p
      );
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
      updatedProducts = initialProducts.map(p => 
        selectedIds.includes(p.id) ? { ...p, status: newStatus } : p
      );
    } else if (action === 'toggleOfferBulk') {
      const firstSelected = initialProducts.find(p => p.id === selectedIds[0]);
      const targetOfferState = firstSelected ? !firstSelected.hasTenDollarOffer : true;
      updatedProducts = initialProducts.map(p => 
        selectedIds.includes(p.id) ? 
          { ...p, hasTenDollarOffer: targetOfferState, offerPrice: targetOfferState ? 10.00 : null } : 
          p
      );
    } else if (action === 'updateInventoryBulk') {
      const newQtyStr = prompt("Enter new quantity for selected products (affects main quantity):");
      if (newQtyStr !== null) {
        const newQty = parseInt(newQtyStr);
        if (!isNaN(newQty) && newQty >= 0) {
          updatedProducts = initialProducts.map(p => 
            selectedIds.includes(p.id) ? { ...p, quantity: newQty } : p
          );
        } else {
          console.warn("Invalid quantity. Please enter a non-negative number.");
          return;
        }
      } else return;
    }
    onUpdateProducts(updatedProducts);
    setSelectedProducts(new Set());
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
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-full sm:w-72"
            />
          </div>
          {canAddProducts && (
            <button
              onClick={() => { setCurrentEditingProductId(null); setActiveView('addProduct'); }}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center whitespace-nowrap"
            >
              <PlusCircle size={20} className="mr-2" /> Add Product
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 p-4 bg-gray-800 rounded-lg shadow">
        <select
          value={filters.category}
          onChange={e => { setFilters({ ...filters, category: e.target.value }); setCurrentPage(1); }}
          className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Categories</option>
          {categoriesStructure.flatMap(pc =>
            pc.subCategories.flatMap(sc =>
              sc.types.map(tc =>
                <option key={tc.id} value={`${pc.parent} > ${sc.name} > ${tc.name}`}>
                  {`${pc.parent} > ${sc.name} > ${tc.name}`}
                </option>
              )
            )
          )}
        </select>

        <select
          value={filters.brand}
          onChange={e => { setFilters({ ...filters, brand: e.target.value }); setCurrentPage(1); }}
          className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Brands</option>
          {uniqueBrands.map(brand =>
            <option key={brand} value={brand}>{brand}</option>
          )}
        </select>

        <select
          value={filters.status}
          onChange={e => { setFilters({ ...filters, status: e.target.value }); setCurrentPage(1); }}
          className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          {PRODUCT_STATUSES.map(status =>
            <option key={status} value={status}>{status}</option>
          )}
        </select>

        <input
          type="text"
          placeholder="Filter by Item Location..."
          value={filters.itemLocationFilter || ''}
          onChange={e => { setFilters({ ...filters, itemLocationFilter: e.target.value }); setCurrentPage(1); }}
          className="bg-gray-700 text-white rounded-lg p-2 focus:ring-indigo-500 focus:border-indigo-500 placeholder-gray-400"
        />

        <button
          onClick={() => { setFilters({ category: '', brand: '', status: '', itemLocationFilter: '' }); setCurrentPage(1); }}
          className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg flex items-center justify-center"
        >
          <Filter size={18} className="mr-2" /> Clear Filters
        </button>
      </div>

      {selectedProducts.size > 0 && canEditProducts && (
        <div className="mb-4 p-3 bg-gray-700 rounded-lg flex flex-wrap items-center gap-3">
          <span className="text-white text-sm font-medium">{selectedProducts.size} selected</span>
          <button
            onClick={() => handleBulkAction('updateInventoryBulk')}
            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded text-xs flex items-center"
          >
            <Edit size={14} className="mr-1" /> Qty
          </button>
          <button
            onClick={() => handleBulkAction('setActive', 'Active')}
            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded text-xs flex items-center"
          >
            <Check size={14} className="mr-1" /> Set Active
          </button>
          <button
            onClick={() => handleBulkAction('setHidden', 'Hidden')}
            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1.5 rounded text-xs flex items-center"
          >
            <EyeOff size={14} className="mr-1" /> Set Hidden
          </button>
          <button
            onClick={() => handleBulkAction('setDraft', 'Draft')}
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1.5 rounded text-xs flex items-center"
          >
            <Archive size={14} className="mr-1" /> Set Draft
          </button>
          <button
            onClick={() => handleBulkAction('toggleOfferBulk')}
            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1.5 rounded text-xs flex items-center"
          >
            <DollarSign size={14} className="mr-1" /> Toggle $10 Offer
          </button>
        </div>
      )}

      <div className="bg-gray-800 shadow-xl rounded-xl overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs text-gray-300 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-4 py-3 w-10">
                <input
                  type="checkbox"
                  onChange={handleSelectAll}
                  checked={selectedProducts.size === paginatedProducts.length && paginatedProducts.length > 0 && paginatedProducts.every(p => selectedProducts.has(p.id))}
                  className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"
                />
              </th>
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
                    src={product.imageUrl}
                    fallbackSrc={`https://placehold.co/40x40/777/FFF?text=${product.brand ? product.brand.substring(0, 1) : 'P'}`}
                    alt={product.name}
                    className="w-10 h-10 rounded-md object-cover mr-3"
                  />
                  <div>
                    <span className="truncate max-w-xs block" title={product.name}>{product.name}</span>
                    <span className="text-xs text-gray-500">
                      {product.category?.type}
                      {product.variants && product.variants.length > 0 && (
                        <span className="text-blue-400">(Has Variants)</span>
                      )}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">{product.sku}</td>
                <td className="px-4 py-3">{product.itemLocation || 'N/A'}</td>
                <td className="px-4 py-3">
                  <div>${product.regularPrice?.toFixed(2)}</div>
                  {product.salePrice && <div className="text-yellow-400">${product.salePrice.toFixed(2)}</div>}
                  {product.hasTenDollarOffer && product.offerPrice && (
                    <div className="text-purple-400">${product.offerPrice.toFixed(2)} (Offer)</div>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {typeof editingQuantity[product.id] !== 'undefined' && canEditProducts && (!product.variants || product.variants.length === 0) ? (
                    <div className="flex items-center justify-center">
                      <input
                        type="number"
                        value={editingQuantity[product.id]}
                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                        className="w-16 bg-gray-600 text-white p-1 rounded text-center"
                      />
                      <button
                        onClick={() => saveQuantityChange(product.id)}
                        className="ml-1 text-green-400 hover:text-green-300"
                      >
                        <Check size={18} />
                      </button>
                    </div>
                  ) : (
                    <span
                      onClick={() => canEditProducts && (!product.variants || product.variants.length === 0) && setEditingQuantity({ ...editingQuantity, [product.id]: product.quantity })}
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
                  {(canEditProducts || (currentUser.role === 'WarehouseUploader' && product.status === 'Draft')) && (
                    <div className="flex space-x-1 items-center">
                      <button
                        onClick={() => handleEditClick(product.id)}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="Edit Product"
                      >
                        <Edit3 size={16} />
                      </button>
                      {currentUser.role !== 'WarehouseUploader' && (
                        <>
                          <select
                            value={product.status}
                            onChange={(e) => handleQuickAction(product.id, e.target.value)}
                            className="bg-gray-700 text-xs text-white p-1 rounded focus:ring-0 border-0 appearance-none"
                            title="Change Status"
                          >
                            {PRODUCT_STATUSES.map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleQuickAction(product.id, 'toggleOffer')}
                            className={`p-1 ${product.hasTenDollarOffer ? 'text-purple-400 hover:text-purple-300' : 'text-gray-500 hover:text-gray-300'}`}
                            title={product.hasTenDollarOffer ? "Disable $10 Offer" : "Enable $10 Offer"}
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
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={filteredAndSortedProducts.length}
        onItemsPerPageChange={setItemsPerPage}
      />
    </div>
  );
};

export default ProductsList;