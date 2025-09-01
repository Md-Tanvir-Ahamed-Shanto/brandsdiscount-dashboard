import React, { useState, useEffect } from 'react';
import { ChevronDown, ChevronRight, PlusCircle, Trash2, Edit } from 'lucide-react';
import { apiClient } from '../config/api/api';

const API_BASE_URL = 'https://crm.brandsdiscounts.com/api';

const AUTH_TOKEN = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg1OGNhZTE2LWM1N2ItNGRhYi1iYTllLTY4YjFiODMwOWRlMCIsImlhdCI6MTc1MDUxNTk3MCwiZXhwIjoxNzUwNTE5NTcwfQ.IAwGVtT8BjZj4Od5Ipz_oND_ddGk00Ik92aQYbZCQ3k';

const api = {
  // Fetches all categories
  fetchCategories: async () => {
    try {
      const response = await apiClient.get(`/api/categories`);
       
      const data = response.data;
      // The API response structure is { page, limit, totalPages, totalRecords, data: [...] }
      // We need to return the 'data' array which contains the nested categories.
      return data.data;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error; // Re-throw to be handled by the component
    }
  },

  // Deletes a category by ID
  deleteCategory: async (categoryId) => {
    try {
      // NOTE: Ensure your backend DELETE route matches this.
      // The previous backend example used `/categories/:id` for DELETE.
      // Adjust this URL if your backend route is different (e.g., `/delete/${categoryId}`).
      const response = await apiClient.delete(`/api/categories/${categoryId}`)
      if (response.status === 200) {
        return true; // Indicate success
      }
      return false
    } catch (error) {
      console.error("Error deleting category:", error);
      throw error; // Re-throw to be handled by the component
    }
  },

  // Creates a new category
  createCategory: async (name, parentCategoryId = null) => {
    try {
      const response = await apiClient.post(`/api/categories`, {
        name,
        parentCategoryId,
      })
      if (response.status === 201) {
        const data =  response.data
        return data.category; // Return the newly created category
      }
      return false
    } catch (error) {
      console.error("Error creating category:", error);
      throw error;
    }
  },

  // Updates an existing category
  updateCategory: async (id, name, parentCategoryId = null) => {
    try {
      const response = await apiClient.put(`/api/categories/${id}`, {
        name,
        parentCategoryId,
      })
      if (response.status === 200) {
        const data = await response.data
        return data.category; // Return the updated category
      }
      return false
    } catch (error) {
      console.error("Error updating category:", error);
      throw error;
    }
  },
};

// --- Custom Message Box Component (replaces window.alert/confirm) ---
const MessageBox = ({ message, type, onClose, onConfirm }) => {
  if (!message) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full border border-gray-700">
        <p className={`text-lg mb-4 ${type === 'error' ? 'text-red-400' : 'text-white'}`}>{message}</p>
        <div className="flex justify-end space-x-3">
          {type === 'confirm' && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={type === 'confirm' ? handleConfirm : onClose}
            className={`px-4 py-2 rounded-md transition-colors ${
              type === 'error' ? 'bg-red-500 hover:bg-red-600' : 'bg-indigo-500 hover:bg-indigo-600'
            } text-white font-semibold`}
          >
            {type === 'confirm' ? 'Confirm' : 'OK'}
          </button>
        </div>
      </div>
    </div>
  );
};


// --- Category Form Modal Component ---
const CategoryFormModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialName = '',
  initialParentId = null,
  title,
  categories = [], // All categories for parent selection
  excludeId = null // ID to exclude from parent selection (for edit)
}) => {
  const [name, setName] = useState(initialName);
  const [parentId, setParentId] = useState(initialParentId);

  // Update form fields when initial values change (e.g., when editing different categories)
  useEffect(() => {
    setName(initialName);
    setParentId(initialParentId);
  }, [initialName, initialParentId, isOpen]); // Include isOpen to reset on open

  if (!isOpen) return null;

  // Filter categories to only show valid parents (i.e., not self, not descendants)
  // For simplicity, we just avoid self-selection in this example.
  const availableParents = categories.filter(cat => cat.id !== excludeId);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(name, parentId === '' ? null : parentId); // Convert empty string to null for parentId
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">{title}</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="categoryName" className="block text-gray-300 text-sm font-bold mb-2">
              Category Name:
            </label>
            <input
              type="text"
              id="categoryName"
              className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          {(title.includes("Sub-Category") || title.includes("Type") || title.includes("Edit Category")) && (
            <div className="mb-4">
              <label htmlFor="parentCategory" className="block text-gray-300 text-sm font-bold mb-2">
                Parent Category:
              </label>
              <select
                id="parentCategory"
                className="shadow border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                value={parentId || ''}
                onChange={(e) => setParentId(e.target.value)}
              >
                <option value="">-- No Parent (Top Level) --</option>
                {availableParents.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors font-semibold"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};


// --- Main Product Categories Component ---
const ProductCategories = () => {
  const [categoriesStructure, setCategoriesStructure] = useState([]);
  const [flatCategories, setFlatCategories] = useState([]); // Store flat list for modals
  const [expandedParent, setExpandedParent] = useState(null);
  const [expandedSub, setExpandedSub] = useState(null);

  // State for modals
  const [showAddParentModal, setShowAddParentModal] = useState(false);
  const [showAddSubModal, setShowAddSubModal] = useState(false);
  const [currentParentIdForSub, setCurrentParentIdForSub] = useState(null); // Parent for new sub
  const [showAddTypeModal, setShowAddTypeModal] = useState(false);
  const [currentSubIdForType, setCurrentSubIdForType] = useState(null); // Sub for new type
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // Category object for edit

  // State for messages
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success', 'error', 'confirm'
  const [confirmAction, setConfirmAction] = useState(() => {}); // Function to execute on confirm

  const processCategories = (fetchedData) => {
    // This function now assumes fetchedData already has the nested structure
    // from your API response:
    // data: [ {parent, subcategories: [{sub, subcategories: [types...]}]} ]

    const allCategoriesFlat = [];
    const structuredDataForUI = fetchedData.map(parentCat => {
      // Add parent to flat list
      allCategoriesFlat.push(parentCat);

      // Process subcategories
      const subCatsForUI = parentCat.subcategories.map(subCat => {
        allCategoriesFlat.push(subCat); // Add subcategory to flat list

        // Process types (which are subcategories of subcategories)
        const typesForUI = subCat.subcategories.map(typeCat => {
          allCategoriesFlat.push(typeCat); // Add type to flat list
          return { ...typeCat }; // Return type data directly
        });
        return { ...subCat, types: typesForUI }; // Rename 'subcategories' to 'types' for rendering
      });
      return { ...parentCat, subCategories: subCatsForUI }; // Rename 'subcategories' to 'subCategories' for rendering
    });

    setCategoriesStructure(structuredDataForUI);
    setFlatCategories(allCategoriesFlat); // This is crucial for parent selections in modals
  };

  const getCategories = async () => {
    try {
      const fetchedData = await api.fetchCategories();
      processCategories(fetchedData);
    } catch (error) {
      showMessageBox(error.message, 'error');
    }
  };

  useEffect(() => {
    getCategories();
  }, []); // Empty dependency array means this runs once on mount

  const showMessageBox = (msg, type, onConfirm = () => {}) => {
    setMessage(msg);
    setMessageType(type);
    setConfirmAction(() => onConfirm); // Use a functional update for state
  };

  const closeMessageBox = () => {
    setMessage('');
    setMessageType('');
    setConfirmAction(() => {});
  };

  const handleDeleteCategory = (id) => {
    showMessageBox(
      "Are you sure you want to delete this category? This action cannot be undone.",
      "confirm",
      async () => {
        try {
          await api.deleteCategory(id);
          showMessageBox("Category deleted successfully!", "success");
          getCategories(); // Refetch categories to update the UI
        } catch (error) {
          showMessageBox(`Failed to delete category: ${error.message}`, 'error');
        }
      }
    );
  };

  const handleCreateCategory = async (name, parentId) => {
    try {
      await api.createCategory(name, parentId);
      showMessageBox("Category created successfully!", "success");
      getCategories(); // Refetch categories to update the UI
    } catch (error) {
      showMessageBox(`Failed to create category: ${error.message}`, 'error');
    }
  };

  const handleUpdateCategory = async (id, name, parentId) => {
    try {
      await api.updateCategory(id, name, parentId);
      showMessageBox("Category updated successfully!", "success");
      getCategories(); // Refetch categories to update the UI
    } catch (error) {
      showMessageBox(`Failed to update category: ${error.message}`, 'error');
    }
  };

  const openAddParentModal = () => {
    setShowAddParentModal(true);
  };

  const openAddSubModal = (parentId) => {
    setCurrentParentIdForSub(parentId);
    setShowAddSubModal(true);
  };

  const openAddTypeModal = (subId) => {
    setCurrentSubIdForType(subId);
    setShowAddTypeModal(true);
  };

  const openEditModal = (category) => {
    setEditingCategory(category);
    setShowEditModal(true);
  };

  const closeModals = () => {
    setShowAddParentModal(false);
    setShowAddSubModal(false);
    setShowAddTypeModal(false);
    setShowEditModal(false);
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-4 md:p-6 font-sans">
      <h3 className="text-3xl font-bold text-white mb-8 text-center">Product Categories Management</h3>

      <div className="max-w-4xl mx-auto space-y-5">
        {/* Add Parent Category Button */}
        <button
          onClick={openAddParentModal}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-3 px-6 rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105"
        >
          <PlusCircle size={24} />
          <span>Add New Parent Category</span>
        </button>

        {/* Categories List */}
        {categoriesStructure.length === 0 && (
          <p className="text-gray-400 text-center py-8">No categories found. Start by adding a parent category!</p>
        )}

        {categoriesStructure.map(parentCat => (
          // Use parentCat.id for the key here, as it's the unique ID for the top-level category
          <div key={parentCat.id} className="bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-700">
            {/* Parent Category Header */}
            <button
              onClick={() => setExpandedParent(expandedParent === parentCat.id ? null : parentCat.id)}
              className="w-full flex justify-between items-center p-4 text-left hover:bg-gray-700 transition-colors duration-200 rounded-t-xl"
            >
              <span className="text-xl font-bold text-white flex items-center">
                {parentCat.name}
              </span>
              <div className="flex items-center space-x-3">
                <Edit
                  size={20}
                  className="text-blue-400 hover:text-blue-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent button from toggling
                    openEditModal(parentCat);
                  }}
                />
                <Trash2
                  size={20}
                  className="text-red-400 hover:text-red-600 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent parent button from toggling
                    handleDeleteCategory(parentCat.id);
                  }}
                />
                <ChevronDown size={24} className={`text-gray-400 transition-transform ${expandedParent === parentCat.id ? 'rotate-180' : ''}`} />
              </div>
            </button>

            {/* Subcategories Container */}
            {expandedParent === parentCat.id && (
              <div className="p-4 border-t border-gray-700 bg-gray-850 space-y-3">
                {parentCat.subCategories.length === 0 && (
                  <p className="text-gray-400 text-sm px-2">No subcategories yet. Add one!</p>
                )}
                {/* Iterate over subCategories (now correctly populated from API response) */}
                {parentCat.subCategories.map(subCat => (
                  <div key={subCat.id} className="bg-gray-750 rounded-lg overflow-hidden border border-gray-700">
                    {/* Subcategory Header */}
                    <button
                      onClick={() => setExpandedSub(expandedSub === subCat.id ? null : subCat.id)}
                      className="w-full flex justify-between items-center p-3 text-left hover:bg-gray-700 transition-colors duration-200 rounded-t-lg"
                    >
                      <span className="text-lg text-gray-200 font-medium">
                        {subCat.name}
                      </span>
                      <div className="flex items-center space-x-2">
                        <Edit
                          size={18}
                          className="text-blue-400 hover:text-blue-600 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditModal(subCat);
                          }}
                        />
                        <Trash2
                          size={18}
                          className="text-red-400 hover:text-red-600 cursor-pointer"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteCategory(subCat.id);
                          }}
                        />
                        <ChevronRight size={20} className={`text-gray-500 transition-transform ${expandedSub === subCat.id ? 'rotate-90' : ''}`} />
                      </div>
                    </button>

                    {/* Types (Grandchildren) Container */}
                    {expandedSub === subCat.id && (
                      <div className="p-3 border-t border-gray-700 bg-gray-800">
                        {subCat.types.length === 0 && (
                          <p className="text-gray-400 text-xs px-2">No types yet. Add one!</p>
                        )}
                        <ul className="list-disc list-inside ml-4 text-gray-300 space-y-2">
                          {/* Iterate over types */}
                          {subCat.types.map(type => (
                            <li key={type.id} className="flex justify-between items-center py-1">
                              <span>
                                {type.name}
                              </span>
                              <div className="flex items-center space-x-2">
                                <Edit
                                  size={16}
                                  className="text-blue-400 hover:text-blue-600 cursor-pointer"
                                  onClick={() => openEditModal(type)}
                                />
                                <Trash2
                                  size={16}
                                  className="text-red-400 hover:text-red-600 cursor-pointer"
                                  onClick={() => handleDeleteCategory(type.id)}
                                />
                              </div>
                            </li>
                          ))}
                        </ul>
                        {/* Add New Type Button */}
                        <button
                          onClick={() => openAddTypeModal(subCat.id)}
                          className="mt-3 text-sm text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 transition-colors duration-200"
                        >
                          <PlusCircle size={16} />
                          <span>Add New Type to "{subCat.name}"</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
                {/* Add New Sub-Category Button */}
                <button
                  onClick={() => openAddSubModal(parentCat.id)}
                  className="mt-4 text-base text-indigo-400 hover:text-indigo-300 flex items-center space-x-1 font-medium transition-colors duration-200 px-2"
                >
                  <PlusCircle size={18} />
                  <span>Add New Sub-Category to "{parentCat.name}"</span>
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modals */}
      <CategoryFormModal
        isOpen={showAddParentModal}
        onClose={closeModals}
        onSubmit={(name) => handleCreateCategory(name, null)} // ParentId is null for top-level
        title="Add New Parent Category"
        categories={flatCategories} // Pass all categories for parent selection dropdown
      />

      <CategoryFormModal
        isOpen={showAddSubModal}
        onClose={closeModals}
        onSubmit={(name, parentId) => handleCreateCategory(name, parentId)}
        initialParentId={currentParentIdForSub}
        title="Add New Sub-Category"
        categories={flatCategories}
      />

      <CategoryFormModal
        isOpen={showAddTypeModal}
        onClose={closeModals}
        onSubmit={(name, parentId) => handleCreateCategory(name, parentId)}
        initialParentId={currentSubIdForType}
        title="Add New Type"
        categories={flatCategories}
      />

      {editingCategory && (
        <CategoryFormModal
          isOpen={showEditModal}
          onClose={closeModals}
          onSubmit={(name, parentId) => handleUpdateCategory(editingCategory.id, name, parentId)}
          initialName={editingCategory.name}
          initialParentId={editingCategory.parentCategoryId}
          title={`Edit Category: ${editingCategory.name}`}
          categories={flatCategories}
          excludeId={editingCategory.id} // Prevent selecting self as parent
        />
      )}

      {/* Message Box */}
      <MessageBox
        message={message}
        type={messageType}
        onClose={closeMessageBox}
        onConfirm={confirmAction}
      />
    </div>
  );
};

export default ProductCategories;
