// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBURadGhB4qsvyGqfMKvAVJt30tt5NqkrE",
  authDomain: "react-chat-app-f5e8a.firebaseapp.com",
  projectId: "react-chat-app-f5e8a",
  storageBucket: "react-chat-app-f5e8a.appspot.com",
  messagingSenderId: "1004736256339",
  appId: "1:1004736256339:web:a16fcdc813bb701792a9a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const pushMessage = getMessaging(app);
export const storage = getStorage(app);

function requestPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }else{
     const confirmation = window.confirm("Allow Notification to Accept Chat Notification");
      if(confirmation){
        requestPermission()
      }
    }
  })
}

requestPermission();

