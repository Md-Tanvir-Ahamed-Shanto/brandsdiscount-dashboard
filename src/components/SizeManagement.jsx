import { useState, useEffect } from "react";
import axios from "axios";
import { PlusCircle, Pencil, Trash2, ShieldAlert, Info } from "lucide-react"; // Import necessary icons
import { BASE_URL } from "../config/api/api";
import { useAuth } from "../hooks/useAuth";

const SizeManagement = () => {
    // Access current user and token from authentication context
    const { user: currentUser, token } = useAuth();

    // State for managing sizes list
    const [sizes, setSizes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for adding a new size
    const [newSizeName, setNewSizeName] = useState('');

    // State for editing an existing size
    const [editingSize, setEditingSize] = useState(null); // Holds the size object being edited
    const [editSizeName, setEditSizeName] = useState('');

    // --- API Calls ---

    // Function to fetch all sizes from the backend
    const fetchSizes = async () => {
        // Only attempt to fetch if the token is available
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true); // Set loading to true before fetching
            
            const response = await axios.get(`${BASE_URL}/sizeroute/all-sizes`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include Bearer token for authentication
                }
            });
            setSizes(response.data); // Assuming the API returns an array of size objects directly
        } catch (err) {
            console.error("Error fetching sizes:", err);
            setError("Failed to fetch sizes. Please try again.");
        } finally {
            setLoading(false); // Set loading to false after fetching (success or failure)
        }
    };

    // useEffect hook to fetch sizes when the component mounts or token changes
    useEffect(() => {
        if (token) { // Only fetch if token is available
            fetchSizes();
        }
    }, [token]); // Dependency array: re-run when 'token' changes

    // Function to handle adding a new size
    const handleAddSizeSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Basic client-side validation
        if (!newSizeName.trim()) {
            alert("Size name cannot be empty.");
            return;
        }

        try {
            // Make a POST request to add a new size
            const response = await axios.post(`${BASE_URL}/sizeroute/new`,
                { name: newSizeName }, // Request body with the new size name
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include Bearer token for authentication
                    }
                }
            );

            if (response.data.success) {
                alert("Size added successfully!");
                setNewSizeName(''); // Clear the input field

                // Re-fetch the updated list of sizes to ensure consistency
                fetchSizes();
            } else {
                // Display error message from backend if available
                alert(`Failed to add size: ${response.data.message || "Unknown error"}`);
            }
        } catch (err) {
            console.error("Error adding size:", err);
            // Display a more user-friendly error message
            alert(`Error adding size: ${err.response?.data?.error || err.message}`);
        }
    };

    // Function to initiate editing mode for a size
    const handleEditClick = (size) => {
        setEditingSize(size); // Set the size object to be edited
        setEditSizeName(size.name); // Pre-fill the edit input field
    };

    // Function to handle updating an existing size
    const handleUpdateSizeSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        // Ensure there's a size being edited
        if (!editingSize) return;

        // Basic client-side validation
        if (!editSizeName.trim()) {
            alert("Size name cannot be empty.");
            return;
        }

        try {
            // Make a PUT request to update the size
            const response = await axios.put(`${BASE_URL}/sizeroute/update/${editingSize.id}`,
                { name: editSizeName }, // Request body with the updated size name
                {
                    headers: {
                        'Authorization': `Bearer ${token}` // Include Bearer token for authentication
                    }
                }
            );

            if (response.data.success) {
                alert("Size updated successfully!");
                setEditingSize(null); // Exit editing mode (close the modal/form)

                // Update the size in the local state optimistically
                setSizes(sizes.map(size =>
                    size.id === editingSize.id ? { ...size, name: editSizeName } : size
                ));
            } else {
                alert(`Failed to update size: ${response.data.message || "Unknown error"}`);
            }
        } catch (err) {
            console.error("Error updating size:", err);
            alert(`Error updating size: ${err.response?.data?.error || err.message}`);
        }
    };

    // Function to handle deleting a size
    const handleDeleteSize = async (sizeId, sizeName) => {
        // Confirmation prompt before deletion
        if (!window.confirm(`Are you sure you want to delete size "${sizeName}"? This action cannot be undone.`)) {
            return; // If user cancels, do nothing
        }

        try {
            // Make a DELETE request to delete the size
            await axios.delete(`${BASE_URL}/sizeroute/delete/${sizeId}`, {
                headers: {
                    'Authorization': `Bearer ${token}` // Include Bearer token for authentication
                }
            });

            alert("Size deleted successfully!");
            // Optimistically update the UI by filtering out the deleted size
            setSizes(sizes.filter(size => size.id !== sizeId));
        } catch (err) {
            console.error("Error deleting size:", err);
            alert(`Error deleting size: ${err.response?.data?.error || err.message}`);
        }
    };

    // Display loading state
    // Only show loading if token is present and data is being fetched
    if (loading && token) {
        return <div className="p-4 md:p-6 text-gray-300">Loading sizes...</div>;
    }

    // Display error state
    if (error) {
        return <div className="p-4 md:p-6 text-red-400">Error: {error}</div>;
    }

    // --- Component JSX (UI) ---
    return (
        <div className="p-4 md:p-6 text-gray-300">
            <h2 className="text-2xl font-semibold text-white mb-6">Size Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add New Size Section (Admin-only) */}

                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                            <PlusCircle size={20} className="mr-2 text-green-400" /> Add New Size
                        </h3>
                        <form onSubmit={handleAddSizeSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="newSizeName" className="block text-sm font-medium">Size Name</label>
                                <input
                                    type="text"
                                    id="newSizeName"
                                    value={newSizeName}
                                    onChange={(e) => setNewSizeName(e.target.value)}
                                    required
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center"
                            >
                                <PlusCircle size={20} className="mr-2" /> Add Size
                            </button>
                        </form>
                    </div>
               

                {/* Existing Sizes List */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">
                        Existing Sizes ({sizes.length})
                    </h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {sizes.length > 0 ? (
                            sizes.map(size => (
                                <div key={size.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                    <p className="text-white font-medium">{size.name}</p>
                                    {/* Action buttons (Admin-only) */}
                                    
                                        <div className="flex items-center space-x-2">
                                            <button
                                                className="text-blue-400 hover:text-blue-300"
                                                title="Edit size"
                                                onClick={() => handleEditClick(size)}
                                            >
                                                <Pencil size={18} />
                                            </button>
                                            <button
                                                className="text-red-400 hover:text-red-300"
                                                title="Delete size"
                                                onClick={() => handleDeleteSize(size.id, size.name)}
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-400">No sizes found.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Size Modal/Form */}
            {editingSize && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold text-white mb-4">Edit Size: {editingSize.name}</h3>
                        <form onSubmit={handleUpdateSizeSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="editSizeName" className="block text-sm font-medium">Size Name</label>
                                <input
                                    type="text"
                                    id="editSizeName"
                                    value={editSizeName}
                                    onChange={(e) => setEditSizeName(e.target.value)}
                                    required
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingSize(null)} // Close modal
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                                >
                                    Update Size
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Role Permissions Guide */}
            <div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                    <Info size={22} className="mr-2 text-blue-400" /> Information
                </h3>
                <div className="space-y-3">
                    <div className="p-3 bg-gray-700 rounded-md">
                        <h4 className="font-semibold text-indigo-300">Admin Privileges</h4>
                        <p className="text-sm text-gray-400">
                            Only users with the Admin,SuperAdmin & OfficeEmpolyee role can add, edit, or delete sizes. All other roles have read-only access to the list of sizes.


                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SizeManagement;
