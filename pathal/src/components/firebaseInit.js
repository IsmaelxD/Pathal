    //import
//firebase
import firebase from 'firebase'; //object
import 'firebase/firestore'; //store object
import firebaseConfig from './firebaseConfig'; //config data

    //init firebaseApp
const firebaseApp = firebase.initializeApp(firebaseConfig);
    //export firebase app to firestore
export default firebaseApp.firestore();