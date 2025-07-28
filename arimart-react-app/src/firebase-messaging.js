// firebase-messaging.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyAyiUzIIxTJv35Q9xWqd66BhWiIh2xFk3Q",
  authDomain: "arimartretailapp.firebaseapp.com",
  projectId: "arimartretailapp",
  storageBucket: "arimartretailapp.firebasestorage.app",
  messagingSenderId: "180223243655",
  appId: "1:180223243655:web:4364714ddfa7da5baacf22",
  measurementId: "G-TBTY4MGNDY",
  vapidKey: "BOaU5jZhkiSVPabjOl0mRIvshkblbxWvoUe6lXPLcmfxW4JRN2oM3b5w-t3hkej19MwT9NiyF43wtd33XDVYlGA"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
