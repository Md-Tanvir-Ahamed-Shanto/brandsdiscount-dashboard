import { PackageCheck, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { apiClient } from "../config/api/api";


const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchNotifications = async () => {
        try {
            const response = await apiClient.get('/api/notifications');
            setNotifications(response.data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkNotificationAsRead = async (id) => {
        try {
            await apiClient.patch(`/api/notifications/${id}/read`);
            setNotifications(prev =>
                prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
            );
        } catch (err) {
            console.error('Error marking notification as read:', err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await apiClient.patch('/api/notifications/allread');
            setNotifications(prev =>
                prev.map(n => ({ ...n, read: true }))
            );
        } catch (err) {
            console.error('Error marking all notifications as read:', err);
        }
    };

    const handleDeleteNotification = async (id) => {
        try {
            await apiClient.delete(`/api/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n.id !== id));
        } catch (err) {
            console.error('Error deleting notification:', err);
        }
    };

    const getIconForNotification = (type, severity) => {
        if (type === 'sale_notification' || type === 'order_update' || type === 'physical_store_sale') return <PackageCheck className={`w-6 h-6 ${severity === 'critical' ? 'text-red-400' : (severity === 'warning' ? 'text-yellow-400' : 'text-blue-400')}`} />;
        return <Bell className="w-6 h-6 text-gray-400" />;
    };

    const getSeverityBorder = (severity, isRead) => {
        if (isRead) return '';
        if (severity === 'critical') return 'border-l-4 border-red-500';
        if (severity === 'warning') return 'border-l-4 border-yellow-500';
        return 'border-l-4 border-indigo-700';
    };

    if (loading) return <div className="p-4 text-center text-gray-500">Loading notifications...</div>;
    if (error) return <div className="p-4 text-center text-red-500">{error}</div>;

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Notifications ({notifications?.filter(n => !n.isRead).length} unread)</h3>
                {notifications?.some(n => !n.isRead) && (
                    <button 
                        onClick={handleMarkAllAsRead} 
                        className="text-sm text-indigo-400 hover:text-indigo-300"
                    >
                        Mark All as Read
                    </button>
                )}
            </div>
            {notifications.length === 0 ? (
                <p className="text-gray-500 text-center py-10">No notifications yet.</p>
            ) : (
                <div className="space-y-4">
                    {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 rounded-lg shadow-md flex items-start space-x-4 ${notif.isRead ? 'bg-gray-800' : 'bg-indigo-900/30'} ${getSeverityBorder(notif.selledBy, notif.isRead)}`}>
                            <div className="flex-shrink-0 pt-1">{getIconForNotification(notif.selledBy, notif.severity)}</div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-semibold ${notif.isRead ? 'text-gray-300' : 'text-white'} ${notif.selledBy === 'PHYSICAL' ? 'notification-critical' : ''}`}>{notif.title} from {notif.selledBy}</h4>
                                    <span className="text-xs text-gray-500">{new Date(notif.createdAt).toLocaleString()}</span>

                                </div>
                                <p className={`text-sm mt-1 ${notif.isRead ? 'text-gray-400' : 'text-gray-200'} ${notif.selledBy === 'PHYSICAL' ? 'notification-critical' : ''}`}>{notif.message}</p>
                                {notif.location && <p className="text-xs text-gray-500 mt-1">Location: {notif.location}</p>}
                                <div className="mt-3 flex space-x-3">
                                    {!notif.isRead && (
                                        <button 
                                            onClick={() => handleMarkNotificationAsRead(notif.id)} 
                                            className="text-xs text-indigo-400 hover:text-indigo-300"
                                        >
                                            Mark as Read
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => handleDeleteNotification(notif.id)} 
                                        className="text-xs text-red-400 hover:text-red-300"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;