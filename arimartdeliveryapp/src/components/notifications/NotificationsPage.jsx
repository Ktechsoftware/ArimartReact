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
  success: <CheckCircle className="text-green-500 w-5 h-5" />,
  error: <XCircle className="text-red-500 w-5 h-5" />,
  info: <Info className="text-blue-500 w-5 h-5" />,
};

export default function NotificationsPage() {
  const grouped = notifications.reduce((acc, notif) => {
    acc[notif.date] = acc[notif.date] || [];
    acc[notif.date].push(notif);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-xl font-bold mb-4 text-gray-800">Notifications</header>

      <div className="space-y-6">
        {Object.keys(grouped).map((date) => (
          <div key={date}>
            <h3 className="text-sm text-gray-500 font-semibold mb-2">{date}</h3>
            <div className="bg-white rounded-lg shadow divide-y overflow-hidden">
              {grouped[date].map((notif) => (
                <div key={notif.id} className="flex gap-3 p-4 items-start">
                  {iconMap[notif.type]}
                  <div>
                    <p className="font-medium text-gray-800">{notif.title}</p>
                    <p className="text-sm text-gray-600">{notif.message}</p>
                    <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
