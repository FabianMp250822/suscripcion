
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// User-provided Firebase project configuration details.
const firebaseConfig = {
  apiKey: "AIzaSyDj7ubGImyA3J06VZvAVrdfpDPddLQVwN0",
  authDomain: "antoniogalan-15ae4.firebaseapp.com",
  projectId: "antoniogalan-15ae4",
  storageBucket: "antoniogalan-15ae4.appspot.com",
  messagingSenderId: "134290457414",
  appId: "1:134290457414:web:244892df5bf6f72f399b47",
  measurementId: "G-4326BGS36V" 
};

let app: FirebaseApp;
let auth: Auth;
let db: Firestore;

const DATABASE_ID = "americano"; // Specify the database ID here

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
// Pass the database ID to getFirestore
db = getFirestore(app, DATABASE_ID);

export { app, auth, db };
