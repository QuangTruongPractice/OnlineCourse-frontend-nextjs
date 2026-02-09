import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAk1ETb_8HstlTH7V2bxtJ22XDxrwKTkec",
  authDomain: "learnproject-4308b.firebaseapp.com",
  projectId: "learnproject-4308b",
  storageBucket: "learnproject-4308b.firebasestorage.app",
  messagingSenderId: "1070975297824",
  appId: "1:1070975297824:web:9c4a8842a2033b46b98f45",
  measurementId: "G-XHS5SZX7QS"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;