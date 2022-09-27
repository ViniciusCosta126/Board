import firebase from "firebase/app";
import "firebase/firestore";
let firebaseConfig = {
  apiKey: "AIzaSyDNDgmH5aHJrbKDtsjS1Ncp6-C76WJKxCM",
  authDomain: "boardapp-419a0.firebaseapp.com",
  projectId: "boardapp-419a0",
  storageBucket: "boardapp-419a0.appspot.com",
  messagingSenderId: "253659882400",
  appId: "1:253659882400:web:70e775cb2a0dba072bfac5",
  measurementId: "G-5065WDZVGL",
};

// Initialize Firebase

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

export default firebase;
