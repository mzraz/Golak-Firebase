import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  //   apiKey: process.env.REACT_APP_API_KEY,
  //   authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  //   projectId: process.env.REACT_APP_PROJECT_ID,
  //   storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  //   messagingSenderId: process.env.REACT_APP_MESSAGIN_SENDER_ID,
  //   appId: process.env.REACT_APP_APP_ID,
  //   databaseURL: process.env.REACT_APP_DATABASE_URL,
  //   measurementId: process.env.REACT_APP_MEASUREMENT_ID
  apiKey: "AIzaSyCquLDMx7afbkIUDZXEEghp3ZbzuujOkCc",
  authDomain: "golak-3ad69.firebaseapp.com",
  databaseURL: "https://golak-3ad69.firebaseio.com",
  projectId: "golak-3ad69",
  storageBucket: "golak-3ad69.appspot.com",
  messagingSenderId: "995280426724",
  appId: "1:995280426724:web:9f80c8dfd06cce3a967ef1",
  measurementId: "G-VKXXKNRER5",
};

// Initialize Firebase app
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Database
const database = getDatabase(firebaseApp);

// Initialize Firestore
const fireStore = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const storage = getStorage(firebaseApp);
export { fireStore, firebaseApp, database, auth, storage };
