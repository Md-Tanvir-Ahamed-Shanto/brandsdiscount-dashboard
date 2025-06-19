/* eslint-disable no-unused-vars */
import { Info, ShieldAlert, Trash2, UserPlus } from "lucide-react";
import { USER_ROLES } from "../constants";
import { useState } from "react";

const UsersList = ({ users, onAddUser, currentUser }) => {
    const [newUserName, setNewUserName] = useState('');
    const [newUserPassword, setNewUserPassword] = useState('');
    const [newUserRole, setNewUserRole] = useState(USER_ROLES.includes('Customer') ? 'Customer' : USER_ROLES[1]);

    const handleAddUserSubmit = (e) => {
        e.preventDefault();
        if (!newUserName.trim() || !newUserPassword.trim()) {
            alert("Username and password are required.");
            return;
        }
        onAddUser({
            id: `user_${Date.now()}_${Math.random().toString(36).substring(2,7)}`,
            username: newUserName,
            password: newUserPassword, 
            role: newUserRole
        });
        setNewUserName(''); setNewUserPassword(''); setNewUserRole(USER_ROLES.includes('Customer') ? 'Customer' : USER_ROLES[1]);
    };

    const roleDescriptions = {
        Superadmin: "Full access to all system features, including user management and settings. Cannot be deleted.",
        Admin: "Full access to most system features, including user management (cannot delete Superadmin) and settings.",
        Cashier: "Access restricted to the Inventory page. (Future: POS functions, limited order viewing).",
        WarehouseUploader: "Can submit new products (name, SKU, item location, quantity, description, image URL only) which are saved as 'Draft'.", 
        ProductLister: "Full access to Products (add, edit, publish, manage categories). Cannot access Users or Settings.",
        Customer: "Represents a website customer. Typically does not log into this admin panel. For record-keeping."
    };
    
    const adminUsers = users.filter(u => u.role !== 'Customer');
    const customerUsers = users.filter(u => u.role === 'Customer');


    return (
        <div className="p-4 md:p-6 text-gray-300">
            <h2 className="text-2xl font-semibold text-white mb-6">User Management</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {currentUser.role === 'Superadmin' || currentUser.role === 'Admin' ? (
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <h3 className="text-xl font-semibold text-white mb-4">Add New User</h3>
                        <form onSubmit={handleAddUserSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="newUserName" className="block text-sm font-medium">Username</label>
                                <input type="text" id="newUserName" value={newUserName} onChange={(e) => setNewUserName(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor="newUserPassword" className="block text-sm font-medium">Password</label>
                                <input type="password" id="newUserPassword" value={newUserPassword} onChange={(e) => setNewUserPassword(e.target.value)} required className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500"/>
                            </div>
                            <div>
                                <label htmlFor="newUserRole" className="block text-sm font-medium">Role</label>
                                <select id="newUserRole" value={newUserRole} onChange={(e) => setNewUserRole(e.target.value)} className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md p-2 focus:ring-indigo-500 focus:border-indigo-500">
                                    {USER_ROLES
                                        .filter(role => role !== 'Superadmin' || currentUser.role === 'Superadmin') 
                                        .map(role => (
                                        <option key={role} value={role}>{role}</option>
                                    ))}
                                </select>
                            </div>
                            <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center">
                                <UserPlus size={20} className="mr-2"/> Add User
                            </button>
                        </form>
                    </div>
                ) : (
                    <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                        <p className="text-yellow-400 flex items-center"><ShieldAlert size={20} className="mr-2"/> You do not have permission to add new users.</p>
                    </div>
                )}


                <div className="bg-gray-800 p-6 rounded-xl shadow-lg">
                     <h3 className="text-xl font-semibold text-white mb-4">Existing Users ({users.length})</h3>
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                        {users.map(user => (
                            <div key={user.id} className="bg-gray-700 p-3 rounded-lg flex justify-between items-center">
                                <div>
                                    <p className="text-white font-medium">{user.username}</p>
                                    <p className={`text-xs ${user.role === 'Customer' ? 'text-teal-400' : 'text-indigo-400'}`}>{user.role}</p>
                                </div>
                                {(currentUser.role === 'Superadmin' && user.role !== 'Superadmin') || (currentUser.role === 'Admin' && !['Superadmin', 'Admin'].includes(user.role)) ? (
                                    <button className="text-red-400 hover:text-red-300" title="Delete user (mock action)">
                                        <Trash2 size={18}/>
                                    </button>
                                ) : null}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-10 bg-gray-800 p-6 rounded-xl shadow-lg">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center"><Info size={22} className="mr-2 text-blue-400"/> Role Permissions Guide</h3>
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