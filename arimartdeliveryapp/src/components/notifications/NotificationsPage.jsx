import { Bell, CheckCircle, XCircle, Info } from "lucide-react";

const notifications = [
  {
    id: 1,
    title: "New Order Assigned",
    message: "Order #11253 is ready for pickup at Andheri Hub.",
    type: "info",
    time: "10:12 AM",
    date: "Today",
  },
  {
    id: 2,
    title: "Leave Approved",
    message: "Your leave for Aug 1-2 is approved.",
    type: "success",
    time: "9:00 AM",
    date: "Today",
  },
  {
    id: 3,
    title: "Delivery Cancelled",
    message: "Order #11244 cancelled by user.",
    type: "error",
    time: "7:00 PM",
    date: "Yesterday",
  },
];

const iconMap = {
  success: <CheckCircle className="text-emerald-500 w-5 h-5" />,
  error: <XCircle className="text-red-500 w-5 h-5" />,
  info: <Info className="text-blue-500 w-5 h-5" />,
};

const bgColorMap = {
  success: "bg-emerald-50 border-emerald-200",
  error: "bg-red-50 border-red-200", 
  info: "bg-blue-50 border-blue-200",
};

export default function NotificationsPage() {
  const grouped = notifications.reduce((acc, notif) => {
    acc[notif.date] = acc[notif.date] || [];
    acc[notif.date].push(notif);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Bell className="w-6 h-6 text-slate-600" />
          <h1 className="text-2xl font-semibold text-slate-800">Notifications</h1>
        </div>

        <div className="space-y-8">
          {Object.keys(grouped).map((date) => (
            <div key={date} className="space-y-3">
              <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wide px-1">
                {date}
              </h2>
              
              <div className="space-y-2">
                {grouped[date].map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`${bgColorMap[notif.type]} border rounded-xl p-4 hover:shadow-sm transition-shadow duration-200`}
                  >
                    <div className="flex gap-3 items-start">
                      <div className="flex-shrink-0 mt-0.5">
                        {iconMap[notif.type]}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-medium text-slate-800 leading-snug">
                            {notif.title}
                          </h3>
                          <span className="text-xs text-slate-400 font-medium flex-shrink-0">
                            {notif.time}
                          </span>
                        </div>
                        
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        {notifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500">No notifications yet</p>
          </div>
        )}
      </div>
    </div>
  );
}