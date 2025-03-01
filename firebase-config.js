// Import Firebase SDK yang diperlukan
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

// Konfigurasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBZbQ4VdEfQX9u5Zk6CTw7yLH31gC7e7jY",
  authDomain: "healthsdk-7da2c.firebaseapp.com",
  databaseURL: "https://healthsdk-7da2c-default-rtdb.firebaseio.com",
  projectId: "healthsdk-7da2c",
  storageBucket: "healthsdk-7da2c.appspot.com", // ✅ Diperbaiki
  messagingSenderId: "994359700342",
  appId: "1:994359700342:web:277e6c4284b4484cfa2857",
};

// Inisialisasi Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

export { db, auth };
