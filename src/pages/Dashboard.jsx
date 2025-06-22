/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Sidebar, GlobalHeader } from "../components/Layout";
import Overview from "../components/Overview";
import {
  PERMISSIONS,
} from "../constants";
import Notifications from "../components/Notifications";
import UsersList from "../components/UserList";
import BarcodeScanner from "../components/BarcodeScanner";
import ProductManagementPage from "../components/ProductManagementPage";
import OrderListPage from "../components/OrderListPage";
import ProductCategories from "../components/Categories";
import { useAuth } from "../hooks/useAuth";
import { ShieldAlert } from "lucide-react";
import ProductsPage from "../components/WareProductUpload";
import SizeManagement from "../components/SizeManagement";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("overview");
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { user: currentUser, logout } = useAuth();

  const handleMarkNotificationAsRead = (id) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    useEffect(()=>{
      setActiveView(PERMISSIONS[currentUser.role]?.[0] || 'overview')
    },[currentUser.role])
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
        case "addProduct":
          return <ProductsPage />
      case "orders":
        return (
          <OrderListPage/> 
        );
      case "categories":
        return <ProductCategories />;
      case "inventory":
        return <BarcodeScanner />;
      case "sizes":
        return <SizeManagement />
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
          <UsersList/>
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
        isOpen={isOpen}
        logout={logout}
        setIsOpen={setIsOpen}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <GlobalHeader
          title={activeView.charAt(0).toUpperCase() + activeView.slice(1)}
          notifications={notifications}
          currentUser={currentUser}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />
        <main  className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
