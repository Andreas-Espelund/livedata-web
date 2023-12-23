// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCpL2YKUHcz2vlYAcauLuS4rkPr0HYC9Zs",
    authDomain: "livedata-603ef.firebaseapp.com",
    projectId: "livedata-603ef",
    storageBucket: "livedata-603ef.appspot.com",
    messagingSenderId: "1093495568498",
    appId: "1:1093495568498:web:0c6de63874a67a24a1aaeb",
    measurementId: "G-KH9XC1728P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

const db = getFirestore(app)
export {app, analytics, auth, db}
