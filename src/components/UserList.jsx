/* eslint-disable no-unused-vars */
import { Info, ShieldAlert, Trash2, UserPlus, Pencil } from "lucide-react"; // Import Pencil icon
import { USER_ROLES } from "../constants";
import { useState, useEffect } from "react";
import { apiClient, BASE_URL } from "../config/api/api";
import { useAuth } from "../hooks/useAuth";

const UsersList = () => {
    const { user: currentUser, token } = useAuth();
    const [users, setUsers] = useState([]);
    const [newUserName, setNewUserName] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [email, setEmail] = useState('');
    const [newUserRole, setNewUserRole] = useState(USER_ROLES.includes('Customer') ? 'Customer' : USER_ROLES[1]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // State for editing a user
    const [editingUser, setEditingUser] = useState(null); // Stores the user object being edited
    const [editUserName, setEditUserName] = useState('');
    const [editUserEmail, setEditUserEmail] = useState('');
    const [editUserRole, setEditUserRole] = useState('');
    const [editUserPassword, setEditUserPassword] = useState(''); // New state for editing password

    // Fetch users on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                console.log("Fetching users with token:", token ? "Present" : "Missing");
                
                const response = await apiClient.get('/userroute/users/without-platform-user');
                
                console.log("Users response:", response.data);
                setUsers(response?.data?.users || []);
            } catch (err) {
                console.error("Error fetching users:", err);
                if (err.response?.status === 401) {
                    setError("Authentication failed. Please log in again.");
                } else {
                    setError("Failed to fetch users.");
                }
            } finally {
                setLoading(false);
            }
        };
        
        if (token) {
            fetchUsers();
        } else {
            setLoading(false);
            setError("No authentication token available. Please log in.");
        }
    }, [token]); // Depend on token to refetch if it changes

    const handleAddUserSubmit = async (e) => {
        e.preventDefault();
        if (!newUserName.trim() || !newUserPassword.trim()) {
            alert("Username and password are required.");
            return;
        }

        try {
            const response = await apiClient.post('/userroute/new', {
                username: newUserName,
                password: newUserPassword,
                role: newUserRole,
                email: email
            });

            if (response.data.success) {
                // Refetch all users to ensure consistency
                const updatedUsersResponse = await apiClient.get('/userroute/users/without-platform-user');
                setUsers(updatedUsersResponse.data.data);

                setNewUserName('');
                setNewUserPassword('');
                setEmail('');
                setNewUserRole(USER_ROLES.includes('Customer') ? 'Customer' : USER_ROLES[1]);
            } else {
                alert("Failed to add user: " + (response.data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Error adding user:", err);
            alert("Error adding user: " + (err.response?.data?.error || err.message));
        }
    };

    const handleDeleteUser = async (userId, username) => {
        if (!window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            return;
        }
        try {
            await apiClient.delete(`/userroute/delete/${userId}`);
            setUsers(users.filter(user => user.id !== userId)); // Optimistically update UI
        } catch (err) {
            console.error("Error deleting user:", err);
            alert("Error deleting user: " + (err.response?.data?.error || err.message));
        }
    };

    // Function to start editing a user
    const handleEditClick = (user) => {
        setEditingUser(user);
        setEditUserName(user.username);
        setEditUserEmail(user.email || ''); // Ensure email is not undefined
        setEditUserRole(user.role);
        setEditUserPassword(''); // Clear password when starting edit, user can choose to change it
    };

    // Function to handle updating a user
    const handleUpdateUserSubmit = async (e) => {
        e.preventDefault();
        if (!editingUser) return; // Should not happen if edit button is correctly managed

        const updatedUserData = {
            username: editUserName,
            email: editUserEmail,
            role: editUserRole,
        };

        // Only include password if it's not empty (i.e., user intends to change it)
        if (editUserPassword) {
            updatedUserData.password = editUserPassword;
        }

        try {
            const response = await apiClient.put(`/userroute/update/${editingUser.id}`, updatedUserData);

            if (response.data.success) {
                // Update the user in the local state
                setUsers(users.map(user =>
                    user.id === editingUser.id ? { ...user, ...updatedUserData } : user
                ));
                setEditingUser(null); // Exit editing mode
                alert("User updated successfully!");
            } else {
                alert("Failed to update user: " + (response.data.message || "Unknown error"));
            }
        } catch (err) {
            console.error("Error updating user:", err);
            alert("Error updating user: " + (err.response?.data?.error || err.message));
        }
    };

    const roleDescriptions = {
        Admin: "Full access to all system features, including user management and settings. Cannot be deleted.",
        Cashier: "Access restricted to the Inventory page. (Future: POS functions, limited order viewing).",
        WarehouseUploader: "Can submit new products (name, SKU, item location, quantity, description, image URL only) which are saved as 'Draft'.",
        ProductLister: "Full access to Products (add, edit, publish, manage categories). Cannot access Users or Settings.",
        Customer: "Represents a website customer. Typically does not log into this admin panel. For record-keeping."
    };

    if (loading) {
        return <div className="p-4 md:p-6 text-gray-300">Loading users...</div>;
    }

    if (error) {
        return <div className="p-4 md:p-6 text-red-400">Error: {error}</div>;
    }

    return (
        <div className="p-4 md:p-6 text-gray-300">
            <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add New User Section */}
                {currentUser?.role === 'SuperAdmin' ? ( // Only 'Admin' can add new users
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Add New User</h3>
                        <form onSubmit={handleAddUserSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="newUserName" className="block text-sm font-medium">Username</label>
                                <input type="text" id="newUserName" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium">Email</label>
                                <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="newUserPassword" className="block text-sm font-medium">Password</label>
                                <input type="" id="newUserPassword" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500" />
                            </div>
                            <div>
                                <label htmlFor="newUserRole" className="block text-sm font-medium">Role</label>
                                <select id="newUserRole" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500">
                                    {USER_ROLES
                                        .filter(role => role !== 'Admin' || currentUser?.role === 'SuperAdmin')
                                        .map(role => (
                                            <option key={role} value={role}>{role}</option>
                                        ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                                <UserPlus size={20} className="mr-2" /> Add User
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <p className="text-yellow-400 flex items-center"><ShieldAlert size={20} className="mr-2" /> You do not have permission to add new users.</p>
                    </div>
                )}

                {/* Existing Users List */}
                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                    <h3 className="text-xl font-semibold text-white mb-4">Existing Users ({users?.length || 0})</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {users?.map(user => (
                            <div key={user.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-white font-medium">{user.username}</p>
                                    <p className="text-sm text-gray-400">{user.email}</p> {/* Display email */}
                                    <p className={`text-xs ${user.role === 'Customer' ? 'text-teal-400' : 'text-indigo-400'}`}>{user.role}</p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    {/* Edit button - only for Super admin, and own admin only  */}
                                    {currentUser?.role === 'SuperAdmin' || currentUser.id === user.id && user.role === 'Admin' ? (
                                        <button
                                            className="text-blue-400 hover:text-blue-300"
                                            title="Edit user"
                                            onClick={() => handleEditClick(user)}
                                        >
                                            <Pencil size={18} />
                                        </button>
                                    ) : null}

                                    {/* Deletion logic: Admin can delete any user except themselves and other Admins */}
                                    {currentUser?.role === 'SuperAdmin'  && currentUser.id !== user.id ? (
                                        <button
                                            className="text-red-400 hover:text-red-300"
                                            title="Delete user"
                                            onClick={() => handleDeleteUser(user.id, user.username)}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Edit User Modal/Form */}
            {editingUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold text-white mb-4">Edit User: {editingUser.username}</h3>
                        <form onSubmit={handleUpdateUserSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="editUserName" className="block text-sm font-medium">Username</label>
                                <input
                                    type="text"
                                    id="editUserName"
                                    value={editUserName}
                                    onChange={(e) => setEditUserName(e.target.value)}
                                    required
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="editUserEmail" className="block text-sm font-medium">Email</label>
                                <input
                                    type="email"
                                    id="editUserEmail"
                                    value={editUserEmail}
                                    onChange={(e) => setEditUserEmail(e.target.value)}
                                    required
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="editUserPassword" className="block text-sm font-medium">New Password (leave blank to keep current)</label>
                                <input
                                    type="password"
                                    id="editUserPassword"
                                    value={editUserPassword}
                                    onChange={(e) => setEditUserPassword(e.target.value)}
                                    className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                />
                            </div>
                            {
                                currentUser?.role === 'SuperAdmin' && (
                                    <div>
                                    <label htmlFor="editUserRole" className="block text-sm font-medium">Role</label>
                                    <select
                                        id="editUserRole"
                                        value={editUserRole}
                                        onChange={(e) => setEditUserRole(e.target.value)}
                                        className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        
                                        {USER_ROLES
                                            .filter(role => role !== 'Admin' || currentUser?.role === 'Admin')
                                            .map(role => (
                                                <option key={role} value={role}>{role}</option>
                                            ))}
                                    </select>
                                </div>
                                )
                            }
                            
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setEditingUser(null)}
                                    className="bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                                >
                                    Update User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


            <div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><Info size={22} className="mr-2 text-blue-400" /> Role Permissions Guide</h3>
                <div className="space-y-3">
                    {USER_ROLES.map(role => (
                        <div key={role} className="p-3 bg-gray-700 rounded-md">
                            <h4 className="font-semibold text-indigo-300">{role}</h4>
                            <p className="text-sm text-gray-400">{roleDescriptions[role] || "No description available."}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersList;