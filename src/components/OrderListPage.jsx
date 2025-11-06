import React, { useEffect, useState, useContext, useCallback } from "react";
import { AuthContext } from "../contexts/AuthContext"; // Adjust path as per your project
import { apiClient } from "../config/api/api"; // Your configured Axios instance
import { Eye, Mail, Trash2 } from "lucide-react"; // Example icons from 'lucide-react'

// Assume these are defined in your constants file or similar
const ORDER_STATUSES = [
  "Pending",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
  "On Hold",
];
const PLATFORMS = [
  { id: "web", name: "Website" },
  { id: "app", name: "Mobile App" },
  { id: "pos", name: "Point of Sale" },
];

// Placeholder for your Modal component (as provided in the previous answer)
const Modal = ({ isOpen, onClose, title, children, size = "md" }) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
    xl: "max-w-xl",
    "2xl": "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className={`bg-gray-800 rounded-lg shadow-xl p-6 ${sizeClasses[size]} w-full mx-4`}
      >
        <div className="flex justify-between items-center border-b border-gray-700 pb-3 mb-4">
          <h4 className="text-lg font-semibold text-white">{title}</h4>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

const OrderListPage = () => {
  const {
    isAuthenticated,
    loading: authLoading,
    hasPermission,
    user: currentUser,
  } = useContext(AuthContext); // Destructure currentUser

  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Selected orders for bulk actions
  const [selectedOrders, setSelectedOrders] = useState(new Set());

  // Modals states
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  // Initial emailData now includes 'from'
  const [emailData, setEmailData] = useState({ to: "", subject: "", body: "" });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Permissions for actions
  const canUpdateOrderStatus = hasPermission("update_order_status");
  const canDeleteOrder = hasPermission("delete_order");
  const canSendEmail = hasPermission("send_customer_email"); // New permission for sending email

  // --- API Calls ---

  const fetchOrders = useCallback(async () => {
    if (!isAuthenticated) {
      setLoadingOrders(false);
      return;
    }

    setLoadingOrders(true);
    setError(null);
    try {
      const response = await apiClient.get("/api/orders", {
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
      });
      setOrders(response.data.data);
      setTotalItems(response.data.pagination.totalItems);
      setTotalPages(response.data.pagination.totalPages);
      setSelectedOrders(new Set()); // Clear selection on new fetch
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err.response?.data?.error || "Failed to fetch orders.");
    } finally {
      setLoadingOrders(false);
    }
  }, [isAuthenticated, currentPage, itemsPerPage, searchTerm]);

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!canUpdateOrderStatus) {
      alert("You do not have permission to update order status.");
      return;
    }

    try {
      // Optimistic update
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      await apiClient.put(`/api/orders/${orderId}`, { status: newStatus });
      alert(`Order ${orderId} status updated to ${newStatus}.`);
    } catch (err) {
      console.error("Error updating order status:", err);
      setError(
        err.response?.data?.error ||
          `Failed to update status for order ${orderId}.`
      );
      // Revert optimistic update if API call fails
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status:
                  orders.find((o) => o.id === orderId)?.status || "Pending",
              }
            : order
        )
      );
      alert(`Failed to update status for order ${orderId}.`);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!canDeleteOrder) {
      alert("You do not have permission to delete orders.");
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete order ${orderId}? This action cannot be undone.`
      )
    ) {
      return;
    }

    setLoadingOrders(true);
    try {
      await apiClient.delete(`/api/orders/${orderId}`);
      alert(`Order ${orderId} deleted successfully.`);
      fetchOrders(); // Re-fetch orders to update the list
    } catch (err) {
      console.error("Error deleting order:", err);
      setError(
        err.response?.data?.error || `Failed to delete order ${orderId}.`
      );
      setLoadingOrders(false);
    }
  };

  const sendEmailToCustomer = async () => {
    if (!selectedOrder) return;
    if (
      !emailData.from ||
      !emailData.to ||
      !emailData.subject ||
      !emailData.body
    ) {
      alert("Please fill in all email fields (From, To, Subject, Body).");
      return;
    }
    if (!canSendEmail) {
      alert("You do not have permission to send emails.");
      return;
    }

    try {
      // Assuming your backend has an endpoint like this for sending emails
      // Make sure your backend can parse 'from' and 'to' fields correctly for email sending.
      await apiClient.post(
        `/api/orders/${selectedOrder.id}/send-email`,
        emailData
      );
      alert("Email sent successfully!");
      setIsEmailModalOpen(false);
      setEmailData({ to: "", subject: "", body: "" }); // Clear form
    } catch (err) {
      console.error("Error sending email:", err);
      alert(
        "Failed to send email: " + (err.response?.data?.message || err.message)
      );
    }
  };

  // --- Event Handlers ---

  const handleSelectAllOrders = (event) => {
    if (event.target.checked) {
      const newSelectedOrders = new Set(orders.map((order) => order.id));
      setSelectedOrders(newSelectedOrders);
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(orderId)) {
        newSelected.delete(orderId);
      } else {
        newSelected.add(orderId);
      }
      return newSelected;
    });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsOrderModalOpen(true);
  };

  const handleOpenEmailModal = (order) => {
    setSelectedOrder(order);
    // Pre-populate 'from' with the current user's email, if available
    // Pre-populate 'to' with the order's customer email
    setEmailData({
      to: order.user?.email || "", // Assuming order.user.email is available
      subject: `Regarding your order #${order.id}`,
      body: `Dear ${order.user?.name || "Customer"},\n\n`,
    });
    setIsEmailModalOpen(true);
  };

  const onUpdateOrderStatus = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchOrders();
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1);
  };

  // --- Effects ---

  useEffect(() => {
    if (!authLoading) {
      fetchOrders();
    }
  }, [fetchOrders, authLoading]);

  // --- Render ---

  const getOrderStatusColorClasses = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-green-500/30 text-green-300";
      case "Shipped":
        return "bg-blue-500/30 text-blue-300";
      case "Processing":
        return "bg-yellow-500/30 text-yellow-300";
      case "Pending":
      case "On Hold":
        return "bg-orange-500/30 text-orange-300";
      case "Cancelled":
      case "Refunded":
        return "bg-red-500/30 text-red-300";
      default:
        return "bg-gray-500/30 text-gray-300";
    }
  };

  if (authLoading) {
    return (
      <div className="p-4 text-white text-center">
        Loading authentication...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-4 text-red-400 text-center">
        You must be logged in to view orders.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 bg-gray-900 h-full text-white">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center">
        <h3 className="text-xl font-semibold text-white">
          All Orders ({totalItems})
        </h3>
        {selectedOrders.size > 0 && (
          <div className="text-sm text-indigo-300">
            {selectedOrders.size} order(s) selected
          </div>
        )}
      </div>

      {/* Search and Pagination Controls */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-center h-fit">
        <form
          onSubmit={handleSearchSubmit}
          className="flex flex-grow w-full md:w-auto"
        >
          <input
            type="text"
            placeholder="Search by ID, status, product name..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="flex-grow bg-gray-700 border border-gray-600 rounded-l-md px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-r-md"
          >
            Search
          </button>
        </form>

        <div className="flex items-center space-x-4">
          <label htmlFor="itemsPerPage" className="text-gray-300">
            Show:
          </label>
          <select
            id="itemsPerPage"
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
            <option value="50">50</option>
          </select>
        </div>
      </div>

      <div className="bg-gray-800 shadow-xl h-screen rounded-xl overflow-x-auto">
        {loadingOrders ? (
          <div className="p-6 text-center text-gray-400">Loading orders...</div>
        ) : error ? (
          <div className="p-6 text-center text-red-400">Error: {error}</div>
        ) : orders.length === 0 ? (
          <div className="p-6 text-center text-gray-400">No orders found.</div>
        ) : (
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs text-gray-300 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-4 py-3 w-10">
                  <input
                    type="checkbox"
                    onChange={handleSelectAllOrders}
                    checked={
                      selectedOrders.size === orders.length && orders.length > 0
                    }
                    className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"
                  />
                </th>
                <th scope="col" className="px-6 py-3">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3">
                  SKU
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer
                </th>
                <th scope="col" className="px-6 py-3">
                  Date & Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Source
                </th>
                <th scope="col" className="px-6 py-3">
                  Payment
                </th>
                <th scope="col" className="px-6 py-3">
                  Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>

                <th scope="col" className="px-6 py-3">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className={`border-b border-gray-700 hover:bg-gray-700/50 ${
                    selectedOrders.has(order.id) ? "bg-gray-700" : "bg-gray-800"
                  }`}
                >
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedOrders.has(order.id)}
                      onChange={() => handleSelectOrder(order.id)}
                      className="form-checkbox h-4 w-4 text-indigo-600 bg-gray-600 border-gray-500 rounded focus:ring-indigo-500"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 font-medium text-white">
                    {order?.orderDetails
                      ?.map((detail) => detail.sku)
                      .join(", ") || "N/A"}
                  </td>
                  <td className="px-6 py-4">{order.user?.username || "N/A"}</td>
                  <td className="px-6 py-4">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4">
                    {PLATFORMS.find((p) => p.id === order.source)?.name ||
                      "N/A"}
                  </td>
                  <td className="px-6 py-4">
                    {order?.transaction?.status || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-green-400 font-semibold">
                    ${order?.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 dropdown-container">
                    {canUpdateOrderStatus ? (
                      <div className="relative">
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            setOpenDropdown(openDropdown === order.id ? null : order.id);
                          }}
                          className={`px-2 py-1 rounded-full text-xs font-medium text-center cursor-pointer hover:opacity-80 transition-opacity border-0 bg-transparent ${getOrderStatusColorClasses(order.status)}`}
                        >
                          <div className="flex items-center justify-center gap-1">
                            {order.status}
                            <svg className={`w-3 h-3 ml-1 transition-transform duration-200 ${openDropdown === order.id ? 'rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </button>
                        <div className={`absolute top-full left-0 mt-1 bg-gray-800 border border-gray-600 rounded-lg shadow-lg z-10 min-w-max ${openDropdown === order.id ? 'block' : 'hidden'}`}>
                          <div className="p-2 space-y-1">
                            {ORDER_STATUSES.filter(status => status !== order.status).map(status => (
                              <button
                                key={status}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onUpdateOrderStatus(order.id, status);
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-3 py-2 text-xs rounded font-medium transition-all duration-150 hover:scale-105 ${
                                  status === 'Processing' ? 'bg-blue-600 hover:bg-blue-700 text-white' :
                                  status === 'Shipped' ? 'bg-purple-600 hover:bg-purple-700 text-white' :
                                  status === 'Delivered' ? 'bg-green-600 hover:bg-green-700 text-white' :
                                  status === 'Cancelled' ? 'bg-red-600 hover:bg-red-700 text-white' :
                                  status === 'Refunded' ? 'bg-orange-600 hover:bg-orange-700 text-white' :
                                  status === 'On Hold' ? 'bg-yellow-600 hover:bg-yellow-700 text-white' :
                                  'bg-gray-600 hover:bg-gray-700 text-white'
                                }`}
                              >
                                → {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getOrderStatusColorClasses(order.status)}`}>
                        {order.status}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 flex space-x-2">
                    <button
                      onClick={() => handleViewOrder(order)}
                      className="text-blue-400 hover:text-blue-300"
                      title="View Order"
                    >
                      <Eye size={18} />
                    </button>
                    {canSendEmail && ( // Render email button only if user has permission
                      <button
                        onClick={() => handleOpenEmailModal(order)}
                        className="text-indigo-400 hover:text-indigo-300"
                        title="Email Customer"
                      >
                        <Mail size={18} />
                      </button>
                    )}
                    {canDeleteOrder && (
                      <button
                        onClick={() => deleteOrder(order.id)}
                        className="text-red-400 hover:text-red-300"
                        title="Delete Order"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex pb-3 justify-between items-center mt-6">
        <span className="text-gray-300 text-sm">
          Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
          {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
          orders
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || loadingOrders}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-4 py-2 rounded-md ${
                currentPage === page
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
              disabled={loadingOrders}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages || loadingOrders}
            className="px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      </div>

      {/* Order Details Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        title={`Order Details: ${selectedOrder?.id}`}
        size="xl"
      >
        {selectedOrder && (
          <div className="text-gray-300 space-y-3">
            <p>
              <strong className="text-gray-100">Order ID:</strong>{" "}
              {selectedOrder.id}
            </p>
            <p>
              <strong className="text-gray-100">Customer:</strong>{" "}
              {selectedOrder.user?.username || "N/A"} (
              {selectedOrder.user?.email || "N/A"})
            </p>
            <p>
              <strong className="text-gray-100">Date:</strong>{" "}
              {new Date(selectedOrder.createdAt).toLocaleString()}
            </p>
            <p>
              <strong className="text-gray-100">Fulfillment Location:</strong>{" "}
              {selectedOrder.fulfillmentLocation || "N/A"}
            </p>
            <p>
              <strong className="text-gray-100">Status:</strong>{" "}
              {selectedOrder.status}
            </p>
            <p>
              <strong className="text-gray-100">Payment Status:</strong>{" "}
              {selectedOrder.transaction?.status || "N/A"}
            </p>
            <p>
              <strong className="text-gray-100">Transaction ID:</strong>{" "}
              {selectedOrder.transaction?.transactionId || "N/A"}
            </p>
            <p>
              <strong className="text-gray-100">Total Amount:</strong>{" "}
              <span className="text-green-400 font-bold">
                ${selectedOrder.totalAmount.toFixed(2)}
              </span>
            </p>
            <div>
              <strong className="text-gray-100">Items:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {selectedOrder.orderDetails?.map((item) => (
                  <li key={item.id}>
                    {item.quantity}x {item.productName} (@ $
                    {item.price.toFixed(2)} each) - SKU: {item.sku}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Modal>

      {/* Email Modal */}
      <Modal
        isOpen={isEmailModalOpen}
        onClose={() => setIsEmailModalOpen(false)}
        title={`Email Customer for Order ${selectedOrder?.id}`}
        size="xl"
      >
        <div className="space-y-4 text-gray-300">
          {/* Editable From field */}
          <div>
            <label className="block text-sm">To:</label>
            <input
              type="email"
              value={emailData.to}
              onChange={(e) =>
                setEmailData({ ...emailData, to: e.target.value })
              }
              className="mt-1 w-full bg-gray-700 p-2 rounded border-gray-600 focus:outline-none focus:border-indigo-500"
              placeholder="Recipient email address"
            />
          </div>
          <div>
            <label className="block text-sm">Subject:</label>
            <input
              type="text"
              value={emailData.subject}
              onChange={(e) =>
                setEmailData({ ...emailData, subject: e.target.value })
              }
              className="mt-1 w-full bg-gray-700 p-2 rounded border-gray-600 focus:outline-none focus:border-indigo-500"
              placeholder="Email subject"
            />
          </div>
          <div>
            <label className="block text-sm">Body:</label>
            <textarea
              value={emailData.body}
              onChange={(e) =>
                setEmailData({ ...emailData, body: e.target.value })
              }
              rows="6"
              className="mt-1 w-full bg-gray-700 p-2 rounded border-gray-600 focus:outline-none focus:border-indigo-500"
              placeholder="Email body content"
            ></textarea>
          </div>
          <div className="flex justify-end">
            <button
              onClick={sendEmailToCustomer}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
            >
              Send Email
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default OrderListPage;
