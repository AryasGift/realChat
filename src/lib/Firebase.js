// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD_nsTSzIapyu_nUlaHkiEMZV1gpYp-1jg",
  authDomain: "chatreact-81a87.firebaseapp.com",
  projectId: "chatreact-81a87",
  storageBucket: "chatreact-81a87.appspot.com",
  messagingSenderId: "835977906497",
  appId: "1:835977906497:web:f6cf3448f77aced70539c0",
  measurementId: "G-JFBGSZL81V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth=getAuth(app)
export const db=getFirestore(app)
export const storage=getStorage(app)