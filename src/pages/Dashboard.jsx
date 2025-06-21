/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Sidebar, GlobalHeader } from "../components/Layout";
import Overview from "../components/Overview";
import {
  generateMockNotifications,
} from "../utils/helpers";
import {
  ALL_POSSIBLE_PUBLISHING_PLATFORMS,
  CATEGORIES_STRUCTURE,
  PERMISSIONS,
} from "../constants";
import Notifications from "../components/Notifications";
import UsersList from "../components/UserList";
import ProductForm from "../components/ProductForm";
import BarcodeScanner from "../components/BarcodeScanner";
import { apiClient } from "../config/api/api";
import ProductManagementPage from "../components/ProductManagementPage";
import OrderListPage from "../components/OrderListPage";
import ProductCategories from "../components/Categories";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("overview");
  const [currentEditingProductId, setCurrentEditingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    name: "Admin User",
    role: "Admin",
    avatar: "https://i.pravatar.cc/150?img=3",
  });
  const [appUsers, setAppUsers] = useState([
    {
      id: "user_super",
      username: "Super Admin User",
      role: "Superadmin",
      password: "password",
    },
    {
      id: "user_admin",
      username: "Admin User",
      role: "Admin",
      password: "password",
    },
    {
      id: "user_lister",
      username: "Product Lister User",
      role: "ProductLister",
      password: "password",
    },
    {
      id: "user_warehouse",
      username: "WarehouseUploader",
      role: "WarehouseUploader",
      password: "password",
    },
    {
      id: "user_cashier",
      username: "Cashier User",
      role: "Cashier",
      password: "password",
    },
    {
      id: "user_cust1",
      username: "Alice Wonderland",
      role: "Customer",
      password: "password",
    },
    {
      id: "user_cust2",
      username: "Bob The Builder",
      role: "Customer",
      password: "password",
    },
  ]);
  // Mock data loading
  const handleAddUser = (newUser) => {
    setAppUsers((prev) => [...prev, newUser]);
    console.log("New user added (mock):", newUser);
  };

  const handleMarkNotificationAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  const handleMarkAllAsRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const handleDeleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const renderContent = () => {
    const userPermissions = PERMISSIONS[currentUser?.role] || [];
    console.log("userpermissions", userPermissions)
    let canAccessCurrentView = userPermissions.includes(activeView);

    if (activeView === 'addProduct' && !userPermissions.includes('addProduct')) canAccessCurrentView = false;
    else if (activeView === 'editProduct') {
        if (!userPermissions.includes('editProduct')) {
            canAccessCurrentView = false;
        }
    }
    
    if (currentUser.role === 'Customer' && activeView !== 'overview' ) {
        canAccessCurrentView = false; 
    }

    if (!canAccessCurrentView) {
        return <div className="p-6 text-white text-center">
            <ShieldAlert size={48} className="mx-auto text-red-500 mb-4"/>
            <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
            <p>You ({currentUser.role}) do not have permission to view the '{activeView}' page.</p>
            <button onClick={() => setActiveView(PERMISSIONS[currentUser.role]?.[0] || 'overview')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Go to Your Dashboard</button>
        </div>;
    }
    


    switch (activeView) {
      case "overview":
        return (
          <Overview/>
        );
      case "orders":
        return (
          <OrderListPage/> 
        );
      case "categories":
        return <ProductCategories />;
      case "inventory":
        return <BarcodeScanner />;
      case "notifications":
        return (
          <Notifications
            notifications={notifications}
            onMarkAsRead={handleMarkNotificationAsRead}
            onMarkAllAsRead={handleMarkAllAsRead}
            onDeleteNotification={handleDeleteNotification}
          />
        );
      case "users":
        return (
          <UsersList
            users={appUsers}
            onAddUser={handleAddUser}
            currentUser={currentUser}
          />
        );
      case "products":
        return (
          <ProductManagementPage />
        );
      case "settings":
        return (
          <div className="p-6 text-white">
            Settings Page (Visible to{" "}
            {currentUser.role !== "Superadmin" && "Super Admin Only"})
          </div>
        );
      default:
        return (
          <div className="p-6 text-white text-center">
            <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
            <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
            <p>The requested page ({activeView}) could not be found.</p>
            <button
              onClick={() =>
                setActiveView(PERMISSIONS[currentUser.role]?.[0] || "overview")
              }
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Go to Your Dashboard
            </button>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        currentUser={currentUser}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <GlobalHeader
          title={activeView.charAt(0).toUpperCase() + activeView.slice(1)}
          notifications={notifications}
          currentUser={currentUser}
        />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
