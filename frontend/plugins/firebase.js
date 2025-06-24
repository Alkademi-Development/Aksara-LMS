import firebase from "firebase/app";
import 'firebase/messaging'

var firebaseConfig = {
    apiKey: "AIzaSyBc-g8QJCsPgkrgselCtYCKFG4YZI1osR8",
    authDomain: "alkademi-8f6ef.firebaseapp.com",
    projectId: "alkademi-8f6ef",
    storageBucket: "alkademi-8f6ef.appspot.com",
    messagingSenderId: "149445901109",
    appId: "1:149445901109:web:080e605101f85b8ea4ea7c",
    measurementId: "G-NQ3S9XFE2C"
};

firebase.initializeApp(firebaseConfig)

// navigator.serviceWorker.register('firebase-messaging-sw.js').then(function (registration) {
navigator.serviceWorker.register('../firebase-messaging-sw.js', { scope: '../' }).then(function (registration) {
    console.log('Service Worker Registered!', registration)
}).catch(function (err) {
    console.error('Service Worker registration failed', err)
})

// messaging.getToken({ vapidKey: "BNSfOjZ98ExwHFMVvW3ZG9RbrUjE7LOHtoLT4-AfzwhftnmBwWjYa7SU4mTZQwiqw19Js-V7PU2RyukfRg5pQaQ" })