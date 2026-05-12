import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD2HvIjyoL2bsB_gUjnXQ0VIzvNAMGoh7Q",
  authDomain: "europets.firebaseapp.com",
  projectId: "europets",
  storageBucket: "europets.firebasestorage.app",
  messagingSenderId: "684187976944",
  appId: "1:684187976944:web:1edd75fda4540210b46e35",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);