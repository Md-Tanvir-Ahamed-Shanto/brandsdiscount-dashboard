import { useEffect, useState } from "react";
import { ORDER_STATUSES, PERMISSIONS, PLATFORMS } from "../constants";
import { Eye, Mail, MailCheck } from "lucide-react";
import { Modal } from "./common";
import { toast } from "react-toastify";

const OrdersList = ({ orders: initialOrders, onUpdateOrderStatus, currentUser }) => {
    const [orders, setOrders] = useState(initialOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [selectedOrders, setSelectedOrders] = useState(new Set());
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailData, setEmailData] = useState({ to: '', subject: '', body: '' });
  console.log("order data", orders, currentUser)
    const userPermissions = PERMISSIONS[currentUser?.role] || [];
    const canUpdateOrderStatus = userPermissions.includes('orders');
  
    useEffect(() => {
      setOrders(initialOrders.sort((a,b) => new Date(b.date) - new Date(a.date)));
    }, [initialOrders]);
  
    const handleViewOrder = (order) => { setSelectedOrder(order); setIsOrderModalOpen(true); };
  
    const handleOpenEmailModal = (order) => {
      setSelectedOrder(order);
      setEmailData({
          to: order.customerEmail,
          subject: `Update for your order ${order.id}`,
          body: `Dear ${order.customerName},\n\nRegarding your order ${order.id} placed on ${new Date(order.date).toLocaleDateString()}:\n\n[Your update here]\n\nThank you,\nStore Team`
      });
      setIsEmailModalOpen(true);
    };
    const handleSendEmail = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'https://dashboard.brandsdiscounts.com'}/api/email/order-update`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            toEmail: emailData.to,
            subject: emailData.subject,
            customerName: selectedOrder.customerName,
            orderNumber: selectedOrder.id,
            message: emailData.body
          }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          toast.success('Email sent successfully');
        } else {
          toast.error(`Failed to send email: ${data.message}`);
          console.error('Email sending failed:', data);
        }
      } catch (error) {
        toast.error('Error sending email');
        console.error('Email sending error:', error);
      } finally {
        setIsEmailModalOpen(false);
      }
    };
  
    const handleSelectOrder = (orderId) => {
      setSelectedOrders(prev => {
        const newSet = new Set(prev);
        if (newSet.has(orderId)) newSet.delete(orderId);
        else newSet.add(orderId);
        return newSet;
      });
    };
  
    const handleSelectAllOrders = (e) => {
      if (e.target.checked) {
        setSelectedOrders(new Set(orders.map(o => o.id)));
      } else {
        setSelectedOrders(new Set());
      }
    };
    
    const getOrderStatusColorClasses = (status) => {
      switch (status) {
          case 'Delivered': return 'bg-green-500/30 text-green-300';
          case 'Shipped': return 'bg-blue-500/30 text-blue-300';
          case 'Processing': return 'bg-yellow-500/30 text-yellow-300';
          case 'Pending':
          case 'On Hold': return 'bg-orange-500/30 text-orange-300';
          case 'Cancelled':
          case 'Refunded': return 'bg-red-500/30 text-red-300';
          default: return 'bg-gray-500/30 text-gray-300';
      }
    };
  
  
    return (
      <div className="p-4 md:p-6">
          <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
              <h3 className="text-xl font-semibold text-white">All Orders ({orders.length})</h3>
              {selectedOrders.size > 0 && (
                  <div className="text-sm text-indigo-300">{selectedOrders.size} order(s) selected</div>
              )}
          </div>
          <div className="bg-gray-800 shadow-xl rounded-xl overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-400">
                  <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                      <tr>
                          <th scope="col" className="px-4 py-3 w-10"><input type="checkbox" onChange={handleSelectAllOrders} checked={selectedOrders.size === orders.length && orders.length > 0} className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"/></th>
                          <th scope="col" className="px-6 py-3">Order ID</th>
                          <th scope="col" className="px-6 py-3">Customer</th>
                          <th scope="col" className="px-6 py-3">Date & Time</th>
                          <th scope="col" className="px-6 py-3">Source</th>
                          <th scope="col" className="px-6 py-3">Fulfill Loc.</th>
                          <th scope="col" className="px-6 py-3">Total</th>
                          <th scope="col" className="px-6 py-3">Status</th>
                          <th scope="col" className="px-6 py-3">Actions</th>
                      </tr>
                  </thead>
                  <tbody>
                      {orders.map(order => (
                          <tr key={order.id} className={`border-b border-gray-700 hover:bg-gray-700/50 ${selectedOrders.has(order.id) ? 'bg-gray-700' : 'bg-gray-800'}`}>
                              <td className="px-4 py-3"><input type="checkbox" checked={selectedOrders.has(order.id)} onChange={() => handleSelectOrder(order.id)} className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"/></td>
                              <td className="px-6 py-4 font-medium text-white">{order.id}</td>
                              <td className="px-6 py-4">{order.customerName}</td>
                              <td className="px-6 py-4">{new Date(order.date).toLocaleString()}</td>
                              <td className="px-6 py-4">{PLATFORMS.find(p=>p.id === order.source)?.name || order.source}</td>
                              <td className="px-6 py-4">{order.fulfillmentLocation}</td>
                              <td className="px-6 py-4 text-green-400 font-semibold">${order.totalAmount.toFixed(2)}</td>
                              <td className="px-6 py-4">
                                  {canUpdateOrderStatus ? (
                                      <select
                                          value={order.status}
                                          onChange={(e) => onUpdateOrderStatus(order.id, e.target.value)}
                                          className={`text-xs p-1 rounded focus:ring-0 border-0 appearance-none !bg-transparent ${getOrderStatusColorClasses(order.status).split(' ')[1]}`}
                                      >
                                          {ORDER_STATUSES.map(s => <option key={s} value={s} className="bg-gray-700 text-white">{s}</option>)}
                                      </select>
                                  ) : (
                                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColorClasses(order.status)}`}>
                                          {order.status}
                                      </span>
                                  )}
                              </td>
                              <td className="px-6 py-4 flex space-x-2">
                                  <button onClick={() => handleViewOrder(order)} className="text-blue-400 hover:text-blue-300" title="View Order"><Eye size={18}/></button>
                                  {canUpdateOrderStatus && <button onClick={() => handleOpenEmailModal(order)} className="text-indigo-400 hover:text-indigo-300" title="Email Customer"><MailCheck size={18}/></button>}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          <Modal isOpen={isOrderModalOpen} onClose={() => setIsOrderModalOpen(false)} title={`Order Details: ${selectedOrder?.id}`} size="xl">
              {selectedOrder && (
                  <div className="text-gray-300 space-y-3">
                      <p><strong className="text-gray-100">Order ID:</strong> {selectedOrder.id}</p>
                      <p><strong className="text-gray-100">Customer:</strong> {selectedOrder.customerName} ({selectedOrder.customerEmail})</p>
                      <p><strong className="text-gray-100">Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                      <p><strong className="text-gray-100">Source:</strong> {PLATFORMS.find(p=>p.id === selectedOrder.source)?.name || selectedOrder.source}</p>
                      <p><strong className="text-gray-100">Fulfillment Location:</strong> {selectedOrder.fulfillmentLocation}</p>
                      <p><strong className="text-gray-100">Status:</strong> {selectedOrder.status}</p>
                      <p><strong className="text-gray-100">Payment Status:</strong> {selectedOrder.paymentStatus}</p>
                      <p><strong className="text-gray-100">Transaction ID:</strong> {selectedOrder.transactionId}</p>
                      <p><strong className="text-gray-100">Total Amount:</strong> <span className="text-green-400 font-bold">${selectedOrder.totalAmount.toFixed(2)}</span></p>
                      <div>
                          <strong className="text-gray-100">Items:</strong>
                          <ul className="list-disc list-inside mt-1 space-y-1">
                              {selectedOrder.items.map((item, index) => (
                                  <li key={index}>{item.quantity}x {item.name} (@ ${item.price.toFixed(2)} each) - From: {item.itemLocation}</li>
                              ))}
                          </ul>
                      </div>
                  </div>
              )}
          </Modal>
          <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title={`Email Customer for Order ${selectedOrder?.id}`} size="xl">
              <div className="space-y-4 text-gray-300">
                  <div><label className="block text-sm">To:</label><input type="email" value={emailData.to} onChange={e => setEmailData({...emailData, to: e.target.value})} className="mt-1 w-full bg-gray-700 p-2 rounded border-gray-600"/></div>
                  <div><label className="block text-sm">Subject:</label><input type="text" value={emailData.subject} onChange={e => setEmailData({...emailData, subject: e.target.value})} className="mt-1 w-full bg-gray-700 p-2 rounded border-gray-600"/></div>
                  <div><label className="block text-sm">Body:</label><textarea value={emailData.body} onChange={e => setEmailData({...emailData, body: e.target.value})} rows="6" className="mt-1 w-full bg-gray-700 p-2 rounded border-gray-600"></textarea></div>
                  <div className="flex justify-end"><button onClick={handleSendEmail} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded">Send Email</button></div>
              </div>
          </Modal>
      </div>
    );
  };

  export default OrdersList;