import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyB9wZkkjsjYHPbJwskVVLYyME7YzG6kDYk",
  authDomain: "buzzer-app-3ad35.firebaseapp.com",
  databaseURL: "https://buzzer-app-3ad35-default-rtdb.firebaseio.com",
  projectId: "buzzer-app-3ad35",
  storageBucket: "buzzer-app-3ad35.appspot.com",
  messagingSenderId: "904277482150",
  appId: "1:904277482150:web:3d9f48756e2d040c283267"
  };

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;