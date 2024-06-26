// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, isSupported } from "firebase/messaging";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FCM_apiKey,
  authDomain: import.meta.env.VITE_FCM_authDomain,
  projectId: import.meta.env.VITE_FCM_projectId,
  storageBucket: import.meta.env.VITE_FCM_storageBucket,
  messagingSenderId: import.meta.env.VITE_FCM_messagingSenderId,
  appId: import.meta.env.VITE_FCM_appId
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const getPushMessage = async () => {
  const isSupportedResult = await isSupported();
  if (isSupportedResult) {
    return getMessaging(app);
  } else {
    return false;
  }
}
export const db = getFirestore(app); 

export const storage = getStorage(app);

export function requestPermission() {
  Notification.requestPermission().then((permission) => {
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }else{
      alert('Your Notification is off. Allow Notification to Accept Chat Notification')
    }
  })
}



