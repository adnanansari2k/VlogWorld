// Import the functions you need from the SDKs you need
import {initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJfw6Tf1xgBrtpRAiL6duMYWGsZAFGF2Q",
  authDomain: "mapworld-7c17a.firebaseapp.com",
  projectId: "mapworld-7c17a",
  storageBucket: "mapworld-7c17a.firebasestorage.app",
  messagingSenderId: "534491878672",
  appId: "1:534491878672:web:5e7b4a6ecd102c4cbd4195",
  measurementId: "G-PJ0VCR99NK"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
