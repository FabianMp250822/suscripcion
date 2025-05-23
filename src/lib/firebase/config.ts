
import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";

// IMPORTANT: Replace these placeholder values with your new Firebase project's configuration details.
// You can find these in your Firebase project settings in the Firebase console.
const firebaseConfig = {
  apiKey: "YOUR_NEW_API_KEY", // Or your existing API key if the project is the same
  authDomain: "YOUR_NEW_PROJECT_ID.firebaseapp.com", // Or your existing authDomain
  projectId: "YOUR_NEW_PROJECT_ID", // Or your existing projectId
  storageBucket: "YOUR_NEW_PROJECT_ID.appspot.com", // Or your existing storageBucket
  messagingSenderId: "YOUR_NEW_MESSAGING_SENDER_ID", // Or your existing messagingSenderId
  appId: "YOUR_NEW_APP_ID", // Or your existing appId
  measurementId: "YOUR_NEW_MEASUREMENT_ID" // This is optional
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

