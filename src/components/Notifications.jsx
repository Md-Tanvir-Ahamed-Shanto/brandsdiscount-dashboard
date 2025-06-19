import { PackageCheck } from "lucide-react";

const Notifications = ({ notifications, onMarkAsRead, onMarkAllAsRead, onDeleteNotification }) => {
    const getIconForNotification = (type, severity) => {
        if (type === 'sale_notification' || type === 'order_update' || type === 'physical_store_sale') return <PackageCheck className={`w-6 h-6 ${severity === 'critical' ? 'text-red-400' : (severity === 'warning' ? 'text-yellow-400' : 'text-blue-400')}`} />;
        return <Bell className="w-6 h-6 text-gray-400" />;
    };
    const getSeverityBorder = (severity, read) => {
        if (read) return '';
        if (severity === 'critical') return 'border-l-4 border-red-500';
        if (severity === 'warning') return 'border-l-4 border-yellow-500';
        return 'border-l-4 border-indigo-700';
    }

    return (
        <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-white">Notifications ({notifications.filter(n => !n.read).length} unread)</h3>
                {notifications.some(n => !n.read) && (<button onClick={onMarkAllAsRead} className="text-sm text-indigo-400 hover:text-indigo-300">Mark All as Read</button>)}
            </div>
            {notifications.length === 0 ? (<p className="text-gray-500 text-center py-10">No notifications yet.</p>) : (
                <div className="space-y-4">
                    {notifications.map(notif => (
                        <div key={notif.id} className={`p-4 rounded-lg shadow-md flex items-start space-x-4 ${notif.read ? 'bg-gray-800' : 'bg-indigo-900/30'} ${getSeverityBorder(notif.severity, notif.read)}`}>
                            <div className="flex-shrink-0 pt-1">{getIconForNotification(notif.type, notif.severity)}</div>
                            <div className="flex-grow">
                                <div className="flex justify-between items-start">
                                    <h4 className={`font-semibold ${notif.read ? 'text-gray-300' : 'text-white'} ${notif.type === 'physical_store_sale' ? 'notification-critical' : ''}`}>{notif.title}</h4>
                                    <span className="text-xs text-gray-500">{new Date(notif.date).toLocaleString()}</span>
                                </div>
                                <p className={`text-sm mt-1 ${notif.read ? 'text-gray-400' : 'text-gray-200'} ${notif.type === 'physical_store_sale' ? 'notification-critical' : ''}`}>{notif.message}</p>
                                {notif.itemLocation && <p className="text-xs text-gray-500 mt-1">Location: {notif.itemLocation}</p>}
                                <div className="mt-3 flex space-x-3">
                                    {!notif.read && (<button onClick={() => onMarkAsRead(notif.id)} className="text-xs text-indigo-400 hover:text-indigo-300">Mark as Read</button>)}
                                    <button onClick={() => onDeleteNotification(notif.id)} className="text-xs text-red-400 hover:text-red-300 ml-auto">Delete</button>
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