import firebase from 'firebase/app'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyA6wD3DwWeJefdUIZvqmmz7yNIWuh8RVY8",
    authDomain: "subastas-2f2a6.firebaseapp.com",
    projectId: "subastas-2f2a6",
    storageBucket: "subastas-2f2a6.appspot.com",
    messagingSenderId: "6624894928",
    appId: "1:6624894928:web:45b94a82fb11dc2580a3d5"
}

export const firebaseApp = firebase.initializeApp(firebaseConfig)