/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo } from 'react';
import { BarChart2, DollarSign, Package, ShoppingCart, Store, Globe, ExternalLink } from 'lucide-react';
import { PLATFORMS } from '../constants';
import { calculateTotalSales, filterSalesByDate } from '../utils/helpers';

const Overview = ({ products, orders }) => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const dayOfWeek = now.getDay();
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  endOfWeek.setHours(23, 59, 59, 999);

  const salesThisMonth = useMemo(
    () => calculateTotalSales(filterSalesByDate(orders, startOfMonth, endOfMonth)),
    [orders, startOfMonth, endOfMonth]
  );

  const salesThisWeek = useMemo(
    () => calculateTotalSales(filterSalesByDate(orders, startOfWeek, endOfWeek)),
    [orders, startOfWeek, endOfWeek]
  );

  const totalSalesAllTime = useMemo(
    () => calculateTotalSales(orders.filter(o => o.status === 'Delivered')),
    [orders]
  );

  const totalActiveProducts = products?.filter(p => p.status === 'Active').length;

  const recentSales = useMemo(() => {
    return [...orders]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);
  }, [orders]);

  const physicalStoreSales = useMemo(() => {
    return orders.filter(order => order.source === 'store');
  }, [orders]);

  const physicalStoreSalesTotal = useMemo(
    () => calculateTotalSales(physicalStoreSales.filter(o => o.status === 'Delivered')),
    [physicalStoreSales]
  );

  const statsCards = [
    { title: "Total Sales (All Time)", value: `$${totalSalesAllTime.toFixed(2)}`, icon: BarChart2, color: "text-green-400" },
    { title: "Sales This Month", value: `$${salesThisMonth.toFixed(2)}`, icon: DollarSign, color: "text-green-300" },
    { title: "Sales This Week", value: `$${salesThisWeek.toFixed(2)}`, icon: DollarSign, color: "text-green-200" },
    { title: "Active Products", value: totalActiveProducts, icon: Package, color: "text-yellow-400" },
    { title: "Total Orders (All Time)", value: orders.length, icon: ShoppingCart, color: "text-blue-400" },
    {
      title: "Physical Store Sales (Delivered)",
      value: `$${physicalStoreSalesTotal.toFixed(2)} (${physicalStoreSales.filter(o => o.status === 'Delivered').length} orders)`,
      icon: Store,
      color: "text-teal-400"
    },
  ];

  const getPlatformIcon = (platformId) => {
    const platform = PLATFORMS.find(p => p.id === platformId);
    return platform?.icon ? <platform.icon size={18} className="mr-2 opacity-80" /> : <Globe size={18} className="mr-2 opacity-80" />;
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {statsCards.map(stat => (
          <div key={stat.title} className="bg-gray-800 p-6 rounded-xl shadow-lg flex items-center space-x-4 hover:shadow-indigo-500/30 transition-shadow">
            <div className={`p-3 rounded-full bg-gray-700 ${stat.color}`}>
              <stat.icon size={28} />
            </div>
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <p className="text-2xl font-semibold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Recent Sales by Platform</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {recentSales.length > 0 ? recentSales.map(order => (
              <div key={order.id} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">{order.id} - {order.customerName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${order.status === 'Delivered' ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400 flex items-center">
                    {getPlatformIcon(order.source)}
                    {PLATFORMS.find(p => p.id === order.source)?.name || order.source} - {new Date(order.date).toLocaleDateString()}
                  </span>
                  <span className="text-green-400 font-semibold">${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            )) : <p className="text-gray-500">No recent sales.</p>}
          </div>
        </div>

        <div className="bg-gray-800 p-4 md:p-6 rounded-xl shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-4">Physical Store Sales Highlights</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {physicalStoreSales.length > 0 ? physicalStoreSales.slice(0, 10).map(order => (
              <div key={order.id} className="bg-gray-700 p-3 rounded-lg">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-white font-medium">{order.id} - {order.customerName}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${order.status === 'Delivered' ? 'bg-green-500/30 text-green-300' : 'bg-yellow-500/30 text-yellow-300'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-gray-400">{new Date(order.date).toLocaleDateString()}</span>
                  <span className="text-teal-400 font-semibold">${order.totalAmount.toFixed(2)}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Items: {order.items.map(i => `${i.quantity}x ${i.name.substring(0, 20)}...`).join(', ')}
                </p>
              </div>
            )) : <p className="text-gray-500">No sales from physical store yet.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;