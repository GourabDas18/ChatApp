/* eslint-disable no-undef */

importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');

const firebaseConfig = {
  // Your Firebase config
  apiKey: "AIzaSyBURadGhB4qsvyGqfMKvAVJt30tt5NqkrE",
  authDomain: "react-chat-app-f5e8a.firebaseapp.com",
  projectId: "react-chat-app-f5e8a",
  storageBucket: "react-chat-app-f5e8a.appspot.com",
  messagingSenderId: "1004736256339",
  appId: "1:1004736256339:web:a16fcdc813bb701792a9a6"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize how you want to handle the background message here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: JSON.stringify(payload),
    icon: window.location.origin+'/chat.png'
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

