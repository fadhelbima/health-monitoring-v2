// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth"; // 🔥 Tambahkan ini
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZbQ4VdEfQX9u5Zk6CTw7yLH31gC7e7jY",
  authDomain: "healthsdk-7da2c.firebaseapp.com",
  databaseURL: "https://healthsdk-7da2c-default-rtdb.firebaseio.com",
  projectId: "healthsdk-7da2c",
  storageBucket: "healthsdk-7da2c.firebasestorage.app",
  messagingSenderId: "994359700342",
  appId: "1:994359700342:web:277e6c4284b4484cfa2857",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
