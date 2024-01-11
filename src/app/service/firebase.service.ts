// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCMBjtCu8e-nc9WXO-w6WfGFwZkC3_o3AU",
  authDomain: "ecommerce-a66c3.firebaseapp.com",
  databaseURL: "https://ecommerce-a66c3-default-rtdb.firebaseio.com",
  projectId: "ecommerce-a66c3",
  storageBucket: "ecommerce-a66c3.appspot.com",
  messagingSenderId: "504863584693",
  appId: "1:504863584693:web:bc48f3e4b4fc952127e9fc",
  measurementId: "G-30R4EPPZZ3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);