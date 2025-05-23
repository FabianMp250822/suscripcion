import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

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

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

auth = getAuth(app);
db = getFirestore(app);

export { app, auth, db };
