/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useMemo } from "react";
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
import OrdersList from "../components/OrdersList";
import Categories from "../components/Categories";
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
console.log("main product list", products)
  // Mock data loading
  useEffect(() => {
    // In a real app, these would be API calls
    const fetchedProducts = async ()=>{
      const response = await apiClient.get("/productroute/products");
      console.log("response", response)

      setProducts(response?.data?.data);
    }
    const fetchedOrders= async ()=>{
      const response = await apiClient.get("/order");
      setOrders(response?.data?.data);
    }
    // console.log("order", mockOrders)
    const mockNotifications = generateMockNotifications(5);

    // setProducts(mockProducts);
    fetchedProducts();
    fetchedOrders();
    setNotifications(mockNotifications);
  }, []);

  const handleUpdateProducts = (updatedProducts) => {
    setProducts(updatedProducts);
  };
  const handleUpdateOrderStatus = (orderId, newStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((o) =>
        o.id === orderId ? { ...o, status: newStatus } : o
      )
    );

    const order = orders.find((o) => o.id === orderId);
    if (order) {
      const notification = {
        id: `notif_order_status_${Date.now()}`,
        type: "order_update",
        title: `Order ${orderId} Status Updated`,
        message: `Order ${orderId} for ${order.customerName} is now "${newStatus}".`,
        date: new Date(),
        read: false,
        orderId: orderId,
        severity: "info",
      };
      setNotifications((prev) =>
        [notification, ...prev]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 50)
      );
    }
  };
  const handleAddUser = (newUser) => {
    setAppUsers((prev) => [...prev, newUser]);
    console.log("New user added (mock):", newUser);
  };
  const handleUpdateProductsState = (updatedProducts) => {
    setProducts(updatedProducts);
    const newNotifications = generateMockNotifications(
      5,
      updatedProducts,
      orders
    );
    setNotifications((prev) =>
      [
        ...newNotifications.filter(
          (nn) =>
            !prev.find(
              (pn) =>
                pn.id === nn.id ||
                (pn.productId === nn.productId && pn.type === nn.type)
            )
        ),
        ...prev,
      ]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 50)
    );
  };

  const handleSaveProduct = (productData) => {
    let updatedProducts;
    let finalProductData = { ...productData };

    if (currentUser.role === "WarehouseUploader" && !currentEditingProductId) {
      finalProductData.status = "Draft";
      const allowedFieldsForSave = {
        name: finalProductData.name,
        sku: finalProductData.sku,
        itemLocation: finalProductData.itemLocation,
        quantity: Number(finalProductData.quantity) || 1,
        description: finalProductData.description,
        imageUrl: finalProductData.imageUrl,
        status: "Draft",
        brand: "",
        category: { parent: "", sub: "", type: "", typeId: "" },
        regularPrice: null,
        salePrice: null,
        hasTenDollarOffer: false,
        offerPrice: null,
        listedOn: [],
        color: "",
        size: "",
        sizeType: "",
        condition: "New",
        dateAdded: new Date(),
        variants: [],
      };
      finalProductData = allowedFieldsForSave;
    } else if (
      currentUser.role === "WarehouseUploader" &&
      currentEditingProductId
    ) {
      finalProductData.status = "Draft";
    }

    finalProductData.listedOn = (finalProductData.listedOn || []).filter(
      (pId) => ALL_POSSIBLE_PUBLISHING_PLATFORMS.some((fp) => fp.id === pId)
    );

    if (
      finalProductData.variants &&
      finalProductData.variants.length > 0 &&
      currentUser.role !== "WarehouseUploader"
    ) {
      finalProductData.quantity = finalProductData.variants.reduce(
        (sum, v) => sum + (Number(v.quantity) || 0),
        0
      );
    }

    if (currentEditingProductId) {
      updatedProducts = products.map((p) => {
        if (p.id === currentEditingProductId) {
          if (currentUser.role === "WarehouseUploader") {
            const whuEditableFields = {
              name: finalProductData.name,
              sku: finalProductData.sku,
              itemLocation: finalProductData.itemLocation,
              quantity: Number(finalProductData.quantity) || 1,
              description: finalProductData.description,
              imageUrl: finalProductData.imageUrl,
              status: "Draft",
            };
            return { ...p, ...whuEditableFields };
          }
          return { ...p, ...finalProductData };
        }
        return p;
      });
    } else {
      const newProduct = {
        ...finalProductData,
        id: `prod_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        dateAdded: new Date(),
      };
      if (!newProduct.sku)
        newProduct.sku = `SKU-${Math.floor(Math.random() * 90000) + 10000}`;
      updatedProducts = [newProduct, ...products];
    }
    handleUpdateProductsState(updatedProducts);
    setActiveView("products");
    setCurrentEditingProductId(null);
  };

  const handleCancelProductForm = () => {
    setActiveView("products");
    setCurrentEditingProductId(null);
  };

  const unreadNotificationsCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );
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
    
    if (activeView === 'addProduct') {
        return <ProductForm
        categoriesStructure={CATEGORIES_STRUCTURE}
        onSave={handleSaveProduct}
        onCancel={handleCancelProductForm}
        currentUser={currentUser}
      />;
    }
    if (activeView === 'editProduct' && currentEditingProductId) {
      const productToEdit = products.find(p => p.id === currentEditingProductId);
      if (currentUser.role === 'WarehouseUploader' && productToEdit?.status !== 'Draft') {
           return <div className="p-6 text-white text-center">
              <ShieldAlert size={48} className="mx-auto text-red-500 mb-4"/>
              <h2 className="text-2xl font-semibold mb-2">Access Denied</h2>
              <p>Warehouse Uploaders can typically only edit products they created that are in 'Draft' status.</p>
              <button onClick={() => setActiveView('products')} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Back to Products</button>
          </div>;
      }
      return <ProductForm initialProductData={productToEdit} categoriesStructure={CATEGORIES_STRUCTURE} onSave={handleSaveProduct} onCancel={handleCancelProductForm} currentUser={currentUser} />;
  }
    switch (activeView) {
      case "overview":
        return (
          <Overview
            products={products}
            orders={orders}
            currentUser={currentUser}
          />
        );
      case "orders":
        return (
          <
            OrderListPage
          />
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
      // case "addProduct":
      //   return (
      //     <ProductForm
      //       categoriesStructure={CATEGORIES_STRUCTURE}
      //       onSave={handleSaveProduct}
      //       onCancel={handleCancelProductForm}
      //       currentUser={currentUser}
      //     />
      //   );
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
