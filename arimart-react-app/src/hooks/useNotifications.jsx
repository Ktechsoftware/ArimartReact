import { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function useNotifications(userId, onReceive) {
  useEffect(() => {
    if (!userId) return;

    const connection = new HubConnectionBuilder()
      .withUrl("http://localhost:5015/hub/notifications") // Adjust port
      .withAutomaticReconnect()
      .build();

    connection.start().catch(err => console.error('SignalR Connection Error:', err));

    connection.on("ReceiveNotification", (notification) => {
      toast(notification.Title + ": " + notification.Body);
      if (onReceive) onReceive(notification);
    });

    return () => {
      connection.stop();
    };
  }, [userId, onReceive]);
}
