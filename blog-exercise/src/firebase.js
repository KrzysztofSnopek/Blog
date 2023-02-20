import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyDOJqFkoUIEhNbGWxrPzXtRMd1Glx7kjYc",
  authDomain: "showyourpicturee.firebaseapp.com",
  projectId: "showyourpicturee",
  storageBucket: "showyourpicturee.appspot.com",
  messagingSenderId: "532078998508",
  appId: "1:532078998508:web:6b0f41365f46632992c6c9",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
