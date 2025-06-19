/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Sidebar, GlobalHeader } from './Layout';
import Overview from './Overview';
import ProductsList from './ProductList';
import { generateMockNotifications, generateMockOrders, generateMockProducts } from '../utils/helpers';
import { CATEGORIES_STRUCTURE } from '../constants';

const Dashboard = () => {
  const [activeView, setActiveView] = useState('overview');
  const [currentEditingProductId, setCurrentEditingProductId] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [currentUser, setCurrentUser] = useState({
    name: 'Admin User',
    role: 'Admin',
    avatar: 'https://i.pravatar.cc/150?img=3'
  });

  // Mock data loading
  useEffect(() => {
    // In a real app, these would be API calls
    const mockProducts = generateMockProducts(50);
    const mockOrders = generateMockOrders(30);
    const mockNotifications = generateMockNotifications(5);

    setProducts(mockProducts);
    setOrders(mockOrders);
    setNotifications(mockNotifications);
  }, []);

  const handleUpdateProducts = (updatedProducts) => {
    setProducts(updatedProducts);
  };

  const renderContent = () => {
    switch (activeView) {
      case 'overview':
        return <Overview orders={orders} />;
      case 'products':
      case 'addProduct':
      case 'editProduct':
        return (
          <ProductsList
            products={products}
            categoriesStructure={CATEGORIES_STRUCTURE}
            setActiveView={setActiveView}
            setCurrentEditingProductId={setCurrentEditingProductId}
            onUpdateProducts={handleUpdateProducts}
            currentUser={currentUser}
          />
        );
      default:
        return <div className="p-4 text-white">Content for {activeView}</div>;
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