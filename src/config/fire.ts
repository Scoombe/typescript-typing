import * as firebase from 'firebase/app';
// include services that you want
import 'firebase/auth';
import 'firebase/database';

// import { FirebaseApp } from '@firebase/app-types';
// import { FirebaseAuth } from '@firebase/auth-types';
// import { FirebaseDatabase } from '@firebase/database-types';

const config = {
  apiKey: 'AIzaSyAgBMI0r5KJeOO7sPNNXu2XzmWZf5HNEnQ',
  authDomain: 'connected-todo.firebaseapp.com',
  databaseURL: 'https://connected-todo.firebaseio.com',
  messagingSenderId: '563277454077',
  projectId: 'connected-todo',
  storageBucket: 'connected-todo.appspot.com',
};

const fire: firebase.app.App = firebase.initializeApp(config);
export const firebaseAuth: firebase.auth.Auth = fire.auth();
export const firebaseDB: firebase.database.Database = fire.database();
export default fire;
