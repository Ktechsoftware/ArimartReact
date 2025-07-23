// src/services/signalr.js
import * as signalR from "@microsoft/signalr";
import API from "../api";
import store from "../Store"; // ✅ Redux store
import { addNotification } from "../Store/notificationSlice"; // ✅ Action to dispatch

let connection = null;

export const startSignalRConnection = (userId) => {
  const API_KEY = API.defaults.headers["X-Api-Key"];
  const url = `https://apiari.kuldeepchaurasia.in/notificationHub?userId=${userId}&apikey=${API_KEY}`;

  connection = new signalR.HubConnectionBuilder()
    .withUrl(url, {
      withCredentials: true,
    })
    .configureLogging(signalR.LogLevel.Information)
    .build();

  connection.on("ReceiveNotification", (message) => {
    console.log("🔔 New notification received:", message);

    // ✅ Dispatch directly to Redux
    store.dispatch(addNotification(message));
  });

  connection
    .start()
    .then(() => console.log("✅ SignalR connected successfully!"))
    .catch((err) => console.error("❌ SignalR connection failed:", err));
};

export const stopSignalRConnection = () => {
  if (connection) {
    connection.stop();
  }
};
