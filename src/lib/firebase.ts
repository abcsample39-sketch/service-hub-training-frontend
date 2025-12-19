import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyDwkaVLYE0thZBZbTT2UWpvncAJOSukPfo",
    authDomain: "training-proj-a872a.firebaseapp.com",
    projectId: "training-proj-a872a",
    storageBucket: "training-proj-a872a.firebasestorage.app",
    messagingSenderId: "1055279129324",
    appId: "1:1055279129324:web:7816456c151e45ffbf7bc9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
