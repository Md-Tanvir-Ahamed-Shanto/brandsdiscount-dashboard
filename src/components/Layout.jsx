import React from 'react';
import { 
  BarChart2, Package, ShoppingCart, Layers, List, Bell, 
  Users, Settings, LogOut, Menu, Search, ChevronDown 
} from 'lucide-react';
import { PERMISSIONS } from '../constants';


export const Sidebar = ({ activeView, setActiveView, currentUser, isOpen, setIsOpen, logout }) => {

  
  const navItems = [
    { name: 'Overview', icon: BarChart2, view: 'overview' },
    { name: 'Products', icon: Package, view: 'products' },
    {name: 'Add Product', icon: Layers, view: 'addProduct' },
    { name: 'Orders', icon: ShoppingCart, view: 'orders' },
    { name: 'Categories', icon: Layers, view: 'categories' },
    { name: 'Inventory', icon: List, view: 'inventory' },
    { name: 'Notifications', icon: Bell, view: 'notifications' },
    { name: 'Users', icon: Users, view: 'users' },
    { name: 'Settings', icon: Settings, view: 'settings' },
  ];

  const userPermissions = PERMISSIONS[currentUser.role] || [];
  // const { user: currentUser, logout } = useAuth();
  const visibleNavItems = navItems.filter(item => 
    userPermissions.includes(item.view) || 
    (currentUser.role === 'Customer' && item.view === 'overview')
  );

  const handleLinkClick = (view) => {
    setActiveView(view);
    if(window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }

  return (
    <>
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
        onClick={() => setIsOpen(false)}
      />
      <div className={`fixed lg:relative top-0 left-0 h-full w-64 bg-gray-900 text-gray-300 flex flex-col transition-transform transform z-40 ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6 text-center border-b border-gray-700">
          <h1 className="text-2xl font-bold text-white">POS Dashboard</h1>
          <p className="text-xs text-indigo-400 mt-1">Logged in as: {currentUser.username} ({currentUser.role})</p>
        </div>
        <nav className="flex-grow p-3">
          {visibleNavItems.map((item) => (
            <button 
              key={item.name} 
              onClick={() => handleLinkClick(item.view)}
              className={`flex items-center w-full px-4 py-3 mb-1 rounded-lg transition-colors duration-200 ${activeView === item.view ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-700 hover:text-white'}`}
            >
              <item.icon size={20} className="mr-3" />{item.name}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700">
          <button onClick={logout} className="flex items-center w-full px-4 py-3 rounded-lg hover:bg-gray-700 hover:text-white transition-colors duration-200">
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export const GlobalHeader = ({ title, unreadNotificationsCount, onNotificationsClick, currentUser, isOpen, setIsOpen, onMenuClick, logout }) => {
  const handleMenuClick = () => {
    setIsOpen(!isOpen);
  };
  const handleLogout = () => {
    logout();
  };
  
  return (
    <header className="bg-gray-800 shadow-md p-4 flex justify-between items-center">
      <div className="flex items-center">
        <button onClick={handleMenuClick} className="lg:hidden text-gray-400 hover:text-white mr-4">
          <Menu size={24} />
        </button>
        <h2 className="text-xl md:text-2xl font-semibold text-white">{title}</h2>
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        <div className="relative hidden sm:block">
          <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 focus:outline-none w-40 md:w-64"
          />
        </div>
        <button onClick={onNotificationsClick} className="relative text-gray-400 hover:text-white">
          <Bell size={24} />
          {unreadNotificationsCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadNotificationsCount}
            </span>
          )}
        </button>
        <div className="flex items-center">
          <img 
            src={`https://placehold.co/40x40/7F7F7F/FFFFFF?text=${currentUser?.username?.substring(0,1).toUpperCase() || 'U'}`} 
            alt="User Avatar" 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full" 
          />
          <ChevronDown size={20} className="ml-1 text-gray-400 hidden md:block" />
        </div>
      </div>
    </header>
  );
};