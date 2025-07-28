importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.5.2/firebase-messaging-compat.js');
const firebaseConfig = {
  apiKey: "AIzaSyAyiUzIIxTJv35Q9xWqd66BhWiIh2xFk3Q",
  authDomain: "arimartretailapp.firebaseapp.com",
  projectId: "arimartretailapp",
  storageBucket: "arimartretailapp.firebasestorage.app",
  messagingSenderId: "180223243655",
  appId: "1:180223243655:web:4364714ddfa7da5baacf22",
  measurementId: "G-TBTY4MGNDY"
};

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Background message received: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
