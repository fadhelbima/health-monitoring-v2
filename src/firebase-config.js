// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCVLth-sHF4FllH9alIE1vkxFYs8c3TDhM",
  authDomain: "health-monitoring-e88da.firebaseapp.com",
  databaseURL: "https://health-monitoring-e88da-default-rtdb.firebaseio.com",
  projectId: "health-monitoring-e88da",
  storageBucket: "health-monitoring-e88da.firebasestorage.app",
  messagingSenderId: "191027923184",
  appId: "1:191027923184:web:69946d47592047fe0f1a35",
  measurementId: "G-HMKLZ65RJW",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
