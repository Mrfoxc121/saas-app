import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyBVCKAcsigQZh4xjvXdoAKJr_1BQD4apfQ",
    authDomain: "chat-with-pdf-challenge-d1eec.firebaseapp.com",
    projectId: "chat-with-pdf-challenge-d1eec",
    storageBucket: "chat-with-pdf-challenge-d1eec.appspot.com",
    messagingSenderId: "814362708272",
    appId: "1:814362708272:web:8d57c090857b43103ae0f5"
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  const db =getFirestore(app);
  const storage = getStorage(app);

  export { db, storage }