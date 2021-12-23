import firebase from 'firebase/compat/app';
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyAD06y3O3N1GFxwezNuAk-r6wI17VhufR0",
    authDomain: "course-app-ce77c.firebaseapp.com",
    projectId: "course-app-ce77c",
    storageBucket: "course-app-ce77c.appspot.com",
    messagingSenderId: "791839946421",
    appId: "1:791839946421:web:71b00784df3976fc04b0fc",
    measurementId: "G-1FK0JSSSMF"
  };
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const storage = app.storage()
export default firebase;
export {db,storage}