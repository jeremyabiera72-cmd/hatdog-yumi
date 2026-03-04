import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCQGYWLU_r9pYNxQSiKsHEGCXMORximtGg",
  authDomain: "yumi-mlang-founded.firebaseapp.com",
  projectId: "yumi-mlang-founded",
  storageBucket: "yumi-mlang-founded.firebasestorage.app",
  messagingSenderId: "320905742840",
  appId: "1:320905742840:web:c9a7cb5dd1ff1e92082e0d"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);