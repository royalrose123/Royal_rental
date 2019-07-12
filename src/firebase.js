// <!-- The core Firebase JS SDK is always required and must be listed first -->
// <script src="https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js"></script>

/*
    <!-- TODO: Add SDKs for Firebase products that you want to use
     https://firebase.google.com/docs/web/setup#config-web-app -->
*/

// Your web app's Firebase configuration
const config = {
  apiKey: 'AIzaSyAt_9PExFW45Q5xqOoTas3nBbrvBmQEyUU',
  authDomain: 'royal-rental.firebaseapp.com',
  databaseURL: 'https://royal-rental.firebaseio.com',
  projectId: 'royal-rental',
  storageBucket: 'royal-rental.appspot.com',
  messagingSenderId: '926705130661',
  appId: '1:926705130661:web:d71403c01b158fc6',
};
  // Initialize Firebase
firebase.initializeApp(config);

let database = firebase.database();
let storage = firebase.storage();
let storageRef = firebase.storage().ref();